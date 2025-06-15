
import { useState, useEffect, useCallback } from 'react';
import { nutritionService } from '../services/apis/nutritionAPIs';
import { FoodItem } from '../types';

export interface UseNutritionAPIReturn {
  searchFoods: (query: string) => Promise<void>;
  foods: FoodItem[];
  loading: boolean;
  error: string | null;
  clearResults: () => void;
}

export const useNutritionAPI = (): UseNutritionAPIReturn => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFoods = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFoods([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await nutritionService.searchFoods(query, 20);
      setFoods(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setFoods([]);
    setError(null);
  }, []);

  return {
    searchFoods,
    foods,
    loading,
    error,
    clearResults
  };
};

// Hook pour calculs nutritionnels
export const useNutritionCalculations = () => {
  const [calculations, setCalculations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateBMR = useCallback(async (demographics: any, method?: string) => {
    setLoading(true);
    
    // Simulation calcul (remplacer par vraie logique)
    setTimeout(() => {
      const mockResult = {
        bmr: 1800,
        tdee: 2200,
        method: method || 'mifflin_st_jeor'
      };
      setCalculations(mockResult);
      setLoading(false);
    }, 500);
  }, []);

  return {
    calculations,
    loading,
    calculateBMR
  };
};
