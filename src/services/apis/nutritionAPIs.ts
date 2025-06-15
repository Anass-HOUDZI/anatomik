
import { APIResponse, NutritionAPIFood, FoodItem } from '../../types';

// Configuration des APIs nutritionnelles
export const API_CONFIG = {
  usda: {
    baseUrl: 'https://api.nal.usda.gov/fdc/v1',
    // Note: Clé API publique USDA (limitée mais gratuite)
    apiKey: 'DEMO_KEY', // À remplacer par une vraie clé
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
    appId: 'demo_app_id', // À remplacer
    appKey: 'demo_key', // À remplacer
    endpoints: {
      search: '/search/instant',
      nutrients: '/natural/nutrients'
    }
  }
};

// Cache management
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl: number = 3600000): void { // 1h par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
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
  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<APIResponse<any>> {
    const cacheKey = `usda_${endpoint}_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached, cached: true, timestamp: new Date() };
    }
    
    try {
      const url = new URL(`${API_CONFIG.usda.baseUrl}${endpoint}`);
      url.searchParams.append('api_key', API_CONFIG.usda.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`USDA API error: ${response.status}`);
      }
      
      const data = await response.json();
      cache.set(cacheKey, data);
      
      return { success: true, data, cached: false, timestamp: new Date() };
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
    
    const foods: NutritionAPIFood[] = response.data.foods?.map((food: any) => ({
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
    
    const food: NutritionAPIFood = {
      fdcId: response.data.fdcId,
      name: response.data.description,
      nutrients: this.parseUSDANutrients(response.data.foodNutrients || []),
      servingSize: 100,
      servingUnit: 'g'
    };
    
    return { ...response, data: food };
  }
  
  private parseUSDANutrients(nutrients: any[]): { [key: string]: number } {
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
      const key = nutrientMap[nutrient.nutrient?.id];
      if (key && nutrient.amount) {
        parsed[key] = nutrient.amount;
      }
    });
    
    return parsed;
  }
}

// Service Open Food Facts
export class OpenFoodFactsService {
  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<APIResponse<any>> {
    const cacheKey = `off_${endpoint}_${JSON.stringify(params)}`;
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return { success: true, data: cached, cached: true, timestamp: new Date() };
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
      
      return { success: true, data, cached: false, timestamp: new Date() };
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
    
    const foods: NutritionAPIFood[] = response.data.products?.map((product: any) => ({
      code: product.code,
      name: product.product_name || 'Produit sans nom',
      nutrients: this.parseOFFNutrients(product.nutriments || {}),
      servingSize: product.serving_size ? parseFloat(product.serving_size) : 100,
      servingUnit: 'g'
    })) || [];
    
    return { ...response, data: foods };
  }
  
  private parseOFFNutrients(nutriments: any): { [key: string]: number } {
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
