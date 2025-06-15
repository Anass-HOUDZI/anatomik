
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

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={`category-card ${category.color} slide-up`}
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={() => onCategorySelect(category)}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
              <i className={`fas ${category.icon} text-4xl text-white`}></i>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-white text-opacity-90 text-lg mb-4">
                {category.description}
              </p>
              <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <span className="text-white font-semibold">{category.toolCount} outils</span>
                <i className="fas fa-arrow-right text-white"></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;
