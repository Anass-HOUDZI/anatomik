
import React, { useState } from 'react';
import { Search, Calculator, Dumbbell, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '../App';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: '15 outils pour optimiser votre nutrition : BMR, macros, hydratation, timing…',
    icon: 'calculator',
    color: 'green',
    toolCount: 15
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: '15 outils pour vos séances : 1RM, charges, volume, progression, récupération…',
    icon: 'dumbbell',
    color: 'blue',
    toolCount: 15
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: '15 trackers pour monitorer vos progrès : poids, mensurations, performance…',
    icon: 'trending-up',
    color: 'orange',
    toolCount: 15
  },
  {
    id: 'generators',
    name: 'Planificateurs',
    description: '15 générateurs pour organiser : programmes, repas, routines, défis…',
    icon: 'calendar',
    color: 'purple',
    toolCount: 15
  }
];

const iconMap = {
  calculator: Calculator,
  dumbbell: Dumbbell,
  'trending-up': TrendingUp,
  calendar: Calendar
};

const colorMap = {
  green: 'from-green-500 to-green-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600'
};

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const [search, setSearch] = useState('');

  const filtered = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Search Section */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-md">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un outil..."
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setSearch('')}
            >
              ×
            </Button>
          )}
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((category, index) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap];
          const gradientClass = colorMap[category.color as keyof typeof colorMap];
          
          return (
            <Card
              key={category.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg",
                "bg-gradient-to-br text-white border-0",
                gradientClass
              )}
              onClick={() => onCategorySelect(category)}
            >
              <CardContent className="p-6 h-full flex flex-col justify-between min-h-[200px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {category.toolCount} outils
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-white">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4">
                  <span className="text-white/80 text-sm">Découvrir</span>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {filtered.length === 0 && search && (
        <div className="text-center py-12">
          <Search size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
          <p className="text-muted-foreground">
            Essayez avec d'autres mots-clés ou explorez nos catégories.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
