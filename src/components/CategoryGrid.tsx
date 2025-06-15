
import React from 'react';
import type { Category } from '../App';

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: '15 outils pour optimiser votre nutrition : BMR, macros, hydratation, timing...',
    icon: 'fa-apple-alt',
    color: 'nutritional',
    toolCount: 15
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: '15 outils pour vos séances : 1RM, charges, volume, progression, récupération...',
    icon: 'fa-dumbbell',
    color: 'training',
    toolCount: 15
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: '15 trackers pour monitorer vos progrès : poids, mensurations, performance...',
    icon: 'fa-chart-line',
    color: 'tracking',
    toolCount: 15
  },
  {
    id: 'generators',
    name: 'Planificateurs',
    description: '15 générateurs pour organiser : programmes, repas, routines, défis...',
    icon: 'fa-calendar-alt',
    color: 'generators',
    toolCount: 15
  }
];

const colorBackgrounds: Record<string, string> = {
  nutritional: "bg-gradient-to-b from-green-500 to-green-600",
  training: "bg-gradient-to-b from-blue-500 to-blue-600",
  tracking: "bg-gradient-to-b from-orange-400 to-orange-500",
  generators: "bg-gradient-to-b from-purple-500 to-purple-600"
};

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={`category-card shadow-xl relative slide-up cursor-pointer ${colorBackgrounds[category.id]} transition-transform duration-300`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onCategorySelect(category)}
        >
          {/* Cercle icône */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg z-10">
            <i className={`fas ${category.icon} text-4xl text-gray-500`} aria-hidden="true"></i>
          </div>
          {/* Contenu */}
          <div className="flex flex-col items-center justify-center min-h-[220px] pt-14 pb-8">
            <h3 className="font-display font-bold text-white text-2xl md:text-3xl mb-3 text-center tracking-tight drop-shadow-lg">
              {category.name}
            </h3>
            <p className="text-white/90 text-base md:text-lg mb-4 text-center font-medium">{category.description}</p>
          </div>
          {/* Pill décoratif bas */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-28 h-10 bg-white rounded-full shadow-md opacity-100"></div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
