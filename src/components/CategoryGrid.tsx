
import React, { useState } from 'react';
import {
  Apple,
  Dumbbell,
  BarChart2,
  CalendarDays
} from 'lucide-react';

import type { Category } from '../App';

const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: '15 outils pour optimiser votre nutrition : BMR, macros, hydratation, timing…',
    icon: 'Apple',
    color: 'nutritional',
    toolCount: 15
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: '15 outils pour vos séances : 1RM, charges, volume, progression, récupération…',
    icon: 'Dumbbell',
    color: 'training',
    toolCount: 15
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: '15 trackers pour monitorer vos progrès : poids, mensurations, performance…',
    icon: 'BarChart2',
    color: 'tracking',
    toolCount: 15
  },
  {
    id: 'generators',
    name: 'Planificateurs',
    description: '15 générateurs pour organiser : programmes, repas, routines, défis…',
    icon: 'CalendarDays',
    color: 'generators',
    toolCount: 15
  }
];

const iconGradients: Record<string, string> = {
  nutritional: 'linear-gradient(135deg, #13ff99 0%, #289b71 60%, #7fdccc 100%)',
  training: 'linear-gradient(120deg, #3066f6 0%, #2550b0 60%, #4386f9 100%)',
  tracking: 'linear-gradient(120deg, #ff9800 0%, #f59e42 70%, #ffe6a9 100%)',
  generators: 'linear-gradient(120deg, #a66ffd 0%, #7253e7 70%, #b4a1fa 100%)'
};

const iconMap = {
  nutritional: Apple,
  training: Dumbbell,
  tracking: BarChart2,
  generators: CalendarDays
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
    <div className="w-full px-4">
      {/* Barre de recherche */}
      <div className="flex justify-center mb-6 animate-fade-in">
        <input
          type="text"
          placeholder="Rechercher un outil, calculateur ou tracker..."
          className="w-full max-w-xl px-4 py-3 rounded-full bg-white/70 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition placeholder:text-gray-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {/* Grille full width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {filtered.map((category, idx) => {
          const Icon = iconMap[category.id];
          return (
            <button
              key={category.id}
              className={`
                group relative overflow-hidden rounded-3xl shadow-3d 
                category-card-modern ${category.color}
                flex flex-col items-center hover:scale-[1.02]
                hover:shadow-2xl focus:outline-none transition-all duration-300 ease-in-out
                animate-slide-up p-6 w-full
              `}
              style={{ animationDelay: `${idx * 0.09}s` }}
              onClick={() => onCategorySelect(category)}
            >
              {/* Icône */}
              <div
                className="icon-gradient-circle flex items-center justify-center mb-4"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  boxShadow: '0 6px 20px 0 rgba(67,134,249,0.08)',
                  background: iconGradients[category.id],
                }}
              >
                <Icon size={40} color="#fff" strokeWidth={2.3} />
              </div>
              
              {/* Contenu */}
              <div className="flex-1 flex flex-col justify-center w-full items-center text-center">
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base text-white/90 font-medium mb-4">
                  {category.description}
                </p>
                
                {/* Badge outils */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                  bg-white/10 border-2 border-white/10 backdrop-blur-lg shadow
                  group-hover:bg-white/20 transition-all duration-200
                  font-semibold text-white text-sm">
                  <span>{category.toolCount} outils</span>
                  <svg width="16" height="16" fill="none">
                    <path d="M6 8h4m0 0-2-2m2 2-2 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
