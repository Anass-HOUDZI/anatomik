
import React, { useState } from 'react';
import { Search, Calculator, Dumbbell, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '../App';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: '15 outils pour optimiser votre nutrition : BMR, macros, hydratation, timing nutritionnel et plus encore.',
    icon: 'calculator',
    color: 'green',
    toolCount: 15
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: '15 outils pour vos séances : 1RM, charges, volume, progression, récupération et périodisation.',
    icon: 'dumbbell',
    color: 'blue',
    toolCount: 15
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: '7 trackers pour monitorer vos progrès : poids, mensurations, performance et composition corporelle.',
    icon: 'trending-up',
    color: 'orange',
    toolCount: 7
  },
  {
    id: 'generators',
    name: 'Planificateurs et Générateurs',
    description: '15 générateurs pour organiser : programmes, repas, routines, défis et planification complète.',
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

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto mobile-container mobile-spacing space-y-8">
      {/* Search Section */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-lg">
          <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher un outil ou une catégorie..."
            className="pl-12 pr-12 mobile-input-field h-12 sm:h-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent touch-target"
              onClick={() => setSearch('')}
            >
              ×
            </Button>
          )}
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredCategories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap];
          
          return (
            <Card
              key={category.id}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group",
                "bg-gradient-to-br text-white border-0 overflow-hidden relative",
                `gradient-card-${category.color}`
              )}
              onClick={() => onCategorySelect(category)}
            >
              <CardContent className="p-6 sm:p-8 h-full flex flex-col justify-between min-h-[240px] sm:min-h-[280px] relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <IconComponent size={120} className="absolute -top-6 -right-6 text-white" />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <IconComponent size={28} className="text-white" />
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {category.toolCount} outils
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20 relative z-10">
                  <span className="text-white/90 font-medium">Découvrir les outils</span>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <ArrowRight size={18} className="text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Results State */}
      {filteredCategories.length === 0 && search && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Search size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">Aucun résultat trouvé</h3>
          <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
            Essayez avec d'autres mots-clés ou explorez nos catégories d'outils.
          </p>
          <Button onClick={() => setSearch('')}>
            Effacer la recherche
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
