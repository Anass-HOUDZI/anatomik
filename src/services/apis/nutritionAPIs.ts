
import { APIResponse, NutritionAPIFood, FoodItem } from '../../types';
import { USDASearchResponse, USDAFoodResponse, OpenFoodFactsResponse, OpenFoodFactsProduct } from '../../types/api';
import { RateLimiter, SecurityMonitor } from '../../utils/SecurityManager';

// Gestionnaire sécurisé des clés API
class APIKeyManager {
  private static readonly API_KEYS_STORAGE_KEY = 'anatomik_api_keys';
  
  static getAPIKey(service: 'usda' | 'nutritionix'): string | null {
    try {
      const keys = localStorage.getItem(this.API_KEYS_STORAGE_KEY);
      if (!keys) return null;
      const parsedKeys = JSON.parse(keys);
      return parsedKeys[service] || null;
    } catch {
      return null;
    }
  }
  
  static setAPIKey(service: 'usda' | 'nutritionix', key: string): void {
    try {
      const existingKeys = localStorage.getItem(this.API_KEYS_STORAGE_KEY);
      const keys = existingKeys ? JSON.parse(existingKeys) : {};
      keys[service] = key;
      localStorage.setItem(this.API_KEYS_STORAGE_KEY, JSON.stringify(keys));
    } catch (error) {
      console.error('Erreur sauvegarde clé API:', error);
    }
  }
  
  static hasValidKeys(): boolean {
    return this.getAPIKey('usda') !== null;
  }
}

// Configuration sécurisée des APIs nutritionnelles
export const API_CONFIG = {
  usda: {
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
    getApiKey: () => APIKeyManager.getAPIKey('usda') || 'DEMO_KEY',
    endpoints: {
      search: '/foods/search',
      food: '/food',
      nutrients: '/foods/list'
    }
  },
  openFoodFacts: {
    baseUrl: 'https://world.openfoodfacts.org/api/v2',
    endpoints: {
      search: '/search',
      product: '/product'
    }
  },
  nutritionix: {
    baseUrl: 'https://trackapi.nutritionix.com/v2',
    getAppId: () => APIKeyManager.getAPIKey('nutritionix')?.split(':')[0] || 'demo_app_id',
    getAppKey: () => APIKeyManager.getAPIKey('nutritionix')?.split(':')[1] || 'demo_key',
    endpoints: {
      search: '/search/instant',
      nutrients: '/natural/nutrients'
    }
  }
};

export { APIKeyManager };

// Cache management
class APICache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();
  
  set(key: string, data: unknown, ttl: number = 3600000): void { // 1h par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const cache = new APICache();

// Service USDA Food Data Central
export class USDAService {
  private async makeRequest(endpoint: string, params: Record<string, unknown>): Promise<APIResponse<unknown>> {
    const rateLimiter = RateLimiter.getInstance('usda_api', 10, 60000);
    
    if (!rateLimiter.canMakeRequest()) {
      SecurityMonitor.logSecurityEvent('rate_limit_exceeded', { service: 'usda', endpoint });
      return { 
        success: false, 
        error: 'Rate limit exceeded. Please wait before making more requests.',
        timestamp: new Date()
      };
    }
    
    const cacheKey = `usda_${endpoint}_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached as USDASearchResponse | USDAFoodResponse, cached: true, timestamp: new Date() };
    }
    
    try {
      const url = new URL(`${API_CONFIG.usda.baseUrl}${endpoint}`);
      url.searchParams.append('api_key', API_CONFIG.usda.getApiKey());
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }
      
      const data = await response.json();
      cache.set(cacheKey, data);
      
      return { success: true, data: data as USDASearchResponse | USDAFoodResponse, cached: false, timestamp: new Date() };
    } catch (error) {
      console.error('USDA API error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }
  
  async searchFoods(query: string, limit: number = 20): Promise<APIResponse<NutritionAPIFood[]>> {
    const response = await this.makeRequest(API_CONFIG.usda.endpoints.search, {
      query,
      pageSize: limit,
      dataType: ['Foundation', 'SR Legacy']
    });
    
    if (!response.success || !response.data) {
      return response as APIResponse<NutritionAPIFood[]>;
    }
    
    const searchData = response.data as USDASearchResponse;
    const foods: NutritionAPIFood[] = searchData.foods?.map((food: USDAFoodResponse) => ({
      fdcId: food.fdcId,
      name: food.description,
      nutrients: this.parseUSDANutrients(food.foodNutrients || []),
      servingSize: 100,
      servingUnit: 'g'
    })) || [];
    
    return { ...response, data: foods };
  }
  
  async getFoodDetails(fdcId: number): Promise<APIResponse<NutritionAPIFood>> {
    const response = await this.makeRequest(`${API_CONFIG.usda.endpoints.food}/${fdcId}`, {});
    
    if (!response.success || !response.data) {
      return response as APIResponse<NutritionAPIFood>;
    }
    
    const foodData = response.data as USDAFoodResponse;
    const food: NutritionAPIFood = {
      fdcId: foodData.fdcId,
      name: foodData.description,
      nutrients: this.parseUSDANutrients(foodData.foodNutrients || []),
      servingSize: 100,
      servingUnit: 'g'
    };
    
    return { ...response, data: food };
  }
  
  private parseUSDANutrients(nutrients: Array<{ nutrient: { id: number; name: string }; amount: number }>): { [key: string]: number } {
    const parsed: { [key: string]: number } = {};
    
    const nutrientMap: { [id: number]: string } = {
      1008: 'calories',
      1003: 'protein',
      1005: 'carbs',
      1004: 'fat',
      1079: 'fiber',
      2000: 'sugar',
      1093: 'sodium',
      1087: 'calcium',
      1089: 'iron',
      1162: 'vitaminC',
      1114: 'vitaminD'
    };
    
    nutrients.forEach(nutrient => {
      if (nutrient.nutrient?.id && nutrient.amount !== undefined) {
        const key = nutrientMap[nutrient.nutrient.id];
        if (key) {
          parsed[key] = nutrient.amount;
        }
      }
    });
    
    return parsed;
  }
}

// Service Open Food Facts
export class OpenFoodFactsService {
  private async makeRequest(endpoint: string, params: Record<string, unknown>): Promise<APIResponse<unknown>> {
    const cacheKey = `off_${endpoint}_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached as OpenFoodFactsResponse, cached: true, timestamp: new Date() };
    }
    
    try {
      const url = new URL(`${API_CONFIG.openFoodFacts.baseUrl}${endpoint}`);
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Open Food Facts API error: ${response.status}`);
      }
      
      const data = await response.json();
      cache.set(cacheKey, data);
      
      return { success: true, data: data as OpenFoodFactsResponse, cached: false, timestamp: new Date() };
    } catch (error) {
      console.error('Open Food Facts API error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }
  
  async searchProducts(query: string, limit: number = 20): Promise<APIResponse<NutritionAPIFood[]>> {
    const response = await this.makeRequest(API_CONFIG.openFoodFacts.endpoints.search, {
      search_terms: query,
      search_simple: 1,
      action: 'process',
      json: 1,
      page_size: limit,
      fields: 'code,product_name,nutriments,serving_size'
    });
    
    if (!response.success || !response.data) {
      return response as APIResponse<NutritionAPIFood[]>;
    }
    
    const responseData = response.data as OpenFoodFactsResponse;
    const foods: NutritionAPIFood[] = responseData.products?.map((product: OpenFoodFactsProduct) => ({
      code: product.code,
      name: product.product_name || 'Produit sans nom',
      nutrients: this.parseOFFNutrients(product.nutriments || {}),
      servingSize: product.serving_size ? parseFloat(product.serving_size) : 100,
      servingUnit: 'g'
    })) || [];
    
    return { ...response, data: foods };
  }
  
  private parseOFFNutrients(nutriments: Record<string, number>): { [key: string]: number } {
    return {
      calories: nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0,
      protein: nutriments.proteins_100g || 0,
      carbs: nutriments.carbohydrates_100g || 0,
      fat: nutriments.fat_100g || 0,
      fiber: nutriments.fiber_100g || 0,
      sugar: nutriments.sugars_100g || 0,
      sodium: nutriments.sodium_100g || 0,
      calcium: nutriments.calcium_100g || 0,
      iron: nutriments.iron_100g || 0,
      vitaminC: nutriments['vitamin-c_100g'] || 0
    };
  }
}

// Service principal nutrition avec fallbacks
export class NutritionService {
  private usdaService = new USDAService();
  private offService = new OpenFoodFactsService();
  
  async searchFoods(query: string, limit: number = 20): Promise<FoodItem[]> {
    const results: FoodItem[] = [];
    
    try {
      // Recherche USDA en premier (plus fiable)
      const usdaResponse = await this.usdaService.searchFoods(query, Math.ceil(limit / 2));
      if (usdaResponse.success && usdaResponse.data) {
        results.push(...usdaResponse.data.map(food => this.convertToFoodItem(food, 'usda')));
      }
      
      // Complément avec Open Food Facts
      if (results.length < limit) {
        const offResponse = await this.offService.searchProducts(query, limit - results.length);
        if (offResponse.success && offResponse.data) {
          results.push(...offResponse.data.map(food => this.convertToFoodItem(food, 'openfoodfacts')));
        }
      }
    } catch (error) {
      console.error('Nutrition search error:', error);
    }
    
    return results.slice(0, limit);
  }
  
  private convertToFoodItem(apiFood: NutritionAPIFood, source: FoodItem['source']): FoodItem {
    return {
      id: `${source}_${apiFood.fdcId || apiFood.code || Date.now()}`,
      name: apiFood.name,
      servingSize: apiFood.servingSize,
      servingUnit: apiFood.servingUnit,
      calories: apiFood.nutrients.calories || 0,
      macros: {
        protein: apiFood.nutrients.protein || 0,
        carbs: apiFood.nutrients.carbs || 0,
        fat: apiFood.nutrients.fat || 0,
        fiber: apiFood.nutrients.fiber || 0,
        sugar: apiFood.nutrients.sugar || 0
      },
      micros: {
        sodium: apiFood.nutrients.sodium || 0,
        potassium: apiFood.nutrients.potassium || 0,
        calcium: apiFood.nutrients.calcium || 0,
        iron: apiFood.nutrients.iron || 0,
        vitaminC: apiFood.nutrients.vitaminC || 0,
        vitaminD: apiFood.nutrients.vitaminD || 0
      },
      source
    };
  }
}

// Instance singleton
export const nutritionService = new NutritionService();
