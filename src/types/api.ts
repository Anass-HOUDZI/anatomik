// Types stricts pour les APIs nutritionnelles

export interface NutrientInfo {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

export interface USDAFoodResponse {
  fdcId: number;
  description: string;
  foodNutrients: Array<{
    nutrient: {
      id: number;
      name: string;
      unitName: string;
    };
    amount: number;
  }>;
  dataType: string;
  publicationDate: string;
}

export interface USDASearchResponse {
  foods: USDAFoodResponse[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  brands?: string;
  serving_size?: string;
  nutriments: {
    energy_kcal_100g?: number;
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
    calcium_100g?: number;
    iron_100g?: number;
    'vitamin-c_100g'?: number;
  };
}

export interface OpenFoodFactsResponse {
  products: OpenFoodFactsProduct[];
  count: number;
  page: number;
  page_count: number;
  page_size: number;
}

export interface APIErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface APISuccessResponse<T> {
  success: true;
  data: T;
  cached?: boolean;
  timestamp: Date;
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
}

export interface APIKeyValidationResult {
  valid: boolean;
  service: string;
  error?: string;
  rateLimitInfo?: RateLimitInfo;
}