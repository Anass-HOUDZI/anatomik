
import React, { useState } from 'react';
import { Search, Calculator, Dumbbell, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '../App';
import { EnhancedCard } from './ui/enhanced-card';
import { IconButton } from './ui/icon-button';

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

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 animate-fade-in-up">
      {/* Search Section */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className={cn(
            'relative transition-all duration-300',
            searchFocused && 'scale-[1.02]'
          )}>
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors duration-200" 
            />
            <input
              type="text"
              placeholder="Rechercher un outil, calculateur ou tracker..."
              className={cn(
                'w-full pl-12 pr-4 py-4 rounded-2xl bg-card shadow-lg border-2 transition-all duration-300',
                'text-lg placeholder:text-muted-foreground text-foreground',
                'focus:outline-none focus:border-primary focus:shadow-xl focus:shadow-primary/10',
                searchFocused && 'border-primary shadow-xl shadow-primary/10'
              )}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search && (
              <IconButton
                icon={<span className="text-lg">×</span>}
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearch('')}
                tooltip="Effacer la recherche"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {filtered.map((category, index) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap];
          
          return (
            <EnhancedCard
              key={category.id}
              variant="gradient"
              gradientType={category.color as any}
              clickable
              onClick={() => onCategorySelect(category)}
              className="min-h-[320px] p-8 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              badge={
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-white">
                  {category.toolCount} outils
                </div>
              }
            >
              <div className="flex flex-col h-full justify-between relative z-10">
                {/* Icon Circle */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent size={28} className="text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-base leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span>Découvrir les outils</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          );
        })}
      </div>

      {/* No Results */}
      {filtered.length === 0 && search && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-muted-foreground">
            Essayez avec d'autres mots-clés ou explorez nos catégories.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
