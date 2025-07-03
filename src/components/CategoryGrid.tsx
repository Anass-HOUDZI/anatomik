
import React, { useState } from 'react';
import type { Category } from '../App';

const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: '15 outils pour optimiser votre nutrition : BMR, macros, hydratation, timing…',
    icon: 'fa-apple-alt',
    color: 'from-green-500 to-emerald-400',
    toolCount: 15
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: '15 outils pour vos séances : 1RM, charges, volume, progression, récupération…',
    icon: 'fa-dumbbell',
    color: 'from-blue-500 to-cyan-400',
    toolCount: 15
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: '15 trackers pour monitorer vos progrès : poids, mensurations, performance…',
    icon: 'fa-chart-bar',
    color: 'from-orange-500 to-yellow-400',
    toolCount: 15
  },
  {
    id: 'generators',
    name: 'Planificateurs',
    description: '15 générateurs pour organiser : programmes, repas, routines, défis…',
    icon: 'fa-calendar-alt',
    color: 'from-purple-500 to-pink-400',
    toolCount: 15
  }
];

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
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <input
            type="text"
            placeholder="Rechercher un outil, calculateur ou tracker..."
            className="w-full px-6 py-4 rounded-full bg-white shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg placeholder:text-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {filtered.map((category, idx) => (
          <div
            key={category.id}
            className={`
              group relative overflow-hidden rounded-2xl shadow-xl 
              bg-gradient-to-br ${category.color}
              hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
              min-h-[300px] p-8
            `}
            style={{ animationDelay: `${idx * 0.1}s` }}
            onClick={() => onCategorySelect(category)}
          >
            <div className="flex flex-col h-full text-white">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <i className={`fas ${category.icon} text-3xl`}></i>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">
                  {category.name}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  {category.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="font-semibold">{category.toolCount} outils</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
