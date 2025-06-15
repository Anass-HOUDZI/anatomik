
import React, { useState } from 'react';
import type { Category } from '../App';

// Palette moderne & icônes améliorées : possibilité de switch avec Lucide plus tard
const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: '15 outils pour optimiser votre nutrition : BMR, macros, hydratation, timing…',
    icon: 'fa-apple-alt',
    color: 'nutritional',
    toolCount: 15
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: '15 outils pour vos séances : 1RM, charges, volume, progression, récupération…',
    icon: 'fa-dumbbell',
    color: 'training',
    toolCount: 15
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: '15 trackers pour monitorer vos progrès : poids, mensurations, performance…',
    icon: 'fa-chart-line',
    color: 'tracking',
    toolCount: 15
  },
  {
    id: 'generators',
    name: 'Planificateurs',
    description: '15 générateurs pour organiser : programmes, repas, routines, défis…',
    icon: 'fa-calendar-alt',
    color: 'generators',
    toolCount: 15
  }
];

interface CategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategorySelect }) => {
  const [search, setSearch] = useState('');

  // Filtrage rapide, insensible à la casse
  const filtered = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Barre de recherche */}
      <div className="flex justify-center mb-8 animate-fade-in">
        <input
          type="text"
          placeholder="Rechercher un outil, calculateur ou tracker..."
          className="w-full max-w-xl px-5 py-3 rounded-full bg-white/70 shadow-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg transition placeholder:text-gray-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* Grille compacte */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 md:gap-8 max-w-4xl mx-auto">
        {filtered.map((category, idx) => (
          <button
            key={category.id}
            className={`
              group relative overflow-hidden p-0 m-0 rounded-3xl shadow-3d 
              category-card-modern ${category.color}
              flex flex-col items-center hover:scale-[1.03]
              hover:shadow-2xl focus:outline-none transition-all duration-300 ease-in-out
              animate-slide-up
            `}
            style={{ animationDelay: `${idx * 0.09}s` }}
            onClick={() => onCategorySelect(category)}
          >
            {/* Icône rond moderne */}
            <div className="w-20 h-20 mt-7 rounded-full bg-white flex items-center justify-center shadow-lg z-10
                border-4 border-white/40 group-hover:border-blue-200 transition-all duration-200
                absolute -top-10 left-1/2 -translate-x-1/2 animate-float">
              <i className={`fas ${category.icon} text-4xl text-gradient`} />
            </div>
            {/* Corps carte */}
            <div className="flex-1 flex flex-col justify-end w-full px-4 pt-16 pb-7 items-center text-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold gradient-text mb-2">
                {category.name}
              </h3>
              <p className="text-base sm:text-lg text-gray-100 text-opacity-90 font-medium mb-4">
                {category.description}
              </p>
              {/* Badge outils */}
              <div className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full
                bg-white/10 border-2 border-white/10 backdrop-blur-lg shadow
                group-hover:bg-white/20 transition-all duration-200
                font-semibold text-white text-sm">
                <span>{category.toolCount} outils</span>
                <i className="fas fa-arrow-right text-white"></i>
              </div>
            </div>
            {/* Bottom pill mini gradient décoratif */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2/3 rounded-full bg-gradient-to-r from-white/40 via-blue-100/50 to-white/40 blur-md opacity-70" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
