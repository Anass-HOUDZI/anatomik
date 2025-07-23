
import React, { useState } from 'react';
import { Calculator, Dumbbell, TrendingUp, Calendar, ArrowRight, Star, CheckCircle, Search, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '../App';
import { ModernCard } from './ui/modern-card';
import { HeroSection } from './ui/hero-section';

// Import real tool configurations to get accurate counts
import nutritionalToolsConfig from './tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './tool-configs/trainingToolsConfig';
import trackingToolsConfig from './tool-configs/trackingToolsConfig';
import generatorToolsConfig from './tool-configs/generatorToolsConfig';

const getToolCountForCategory = (categoryId: string): number => {
  switch (categoryId) {
    case 'nutritional':
      return nutritionalToolsConfig.length;
    case 'training':
      return trainingToolsConfig.length;
    case 'tracking':
      return trackingToolsConfig.length;
    case 'generators':
      return generatorToolsConfig.length;
    default:
      return 0;
  }
};

const categories: Category[] = [
  {
    id: 'nutritional',
    name: 'Calculateurs Nutritionnels',
    description: `${getToolCountForCategory('nutritional')} outils pour optimiser votre nutrition : BMR, macros, hydratation, timing nutritionnel et plus encore.`,
    icon: 'calculator',
    color: 'green',
    toolCount: getToolCountForCategory('nutritional')
  },
  {
    id: 'training',
    name: 'Calculateurs d\'Entraînement',
    description: `${getToolCountForCategory('training')} outils pour vos séances : 1RM, charges, volume, progression, récupération et périodisation.`,
    icon: 'dumbbell',
    color: 'blue',
    toolCount: getToolCountForCategory('training')
  },
  {
    id: 'tracking',
    name: 'Suivis et Analyses',
    description: `${getToolCountForCategory('tracking')} trackers pour monitorer vos progrès : poids, mensurations, performance et composition corporelle.`,
    icon: 'trending-up',
    color: 'orange',
    toolCount: getToolCountForCategory('tracking')
  },
  {
    id: 'generators',
    name: 'Planificateurs et Générateurs',
    description: `${getToolCountForCategory('generators')} générateurs pour organiser : programmes, repas, routines, défis et planification complète.`,
    icon: 'calendar',
    color: 'purple',
    toolCount: getToolCountForCategory('generators')
  }
];

const iconMap = {
  calculator: Calculator,
  dumbbell: Dumbbell,
  'trending-up': TrendingUp,
  calendar: Calendar
};

const categoryImages = {
  nutritional: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80", // Healthy vegetables and fruits
  training: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&q=80", // Gym dumbbells
  tracking: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80", // Analytics dashboard
  generators: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=500&q=80" // Planning notebook
};

interface ModernCategoryGridProps {
  onCategorySelect: (category: Category) => void;
}

const ModernCategoryGrid: React.FC<ModernCategoryGridProps> = ({ onCategorySelect }) => {
  const [search, setSearch] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const filteredCategories = categories.filter(
    cat =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate total tools implemented (43 total)
  const totalImplemented = categories.reduce((sum, cat) => {
    const tools = getToolCountForCategory(cat.id);
    return sum + tools;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Hero Section */}
      <HeroSection onSearch={setSearch} searchValue={search} />
      
      {/* Categories Section */}
      <div className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Explorez nos Catégories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              Chaque catégorie contient des outils professionnels conçus pour optimiser vos performances
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              {totalImplemented} outils entièrement fonctionnels disponibles
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredCategories.map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              const isHovered = hoveredCard === category.id;
              
              return (
                <ModernCard
                  key={category.id}
                  variant="gradient"
                  color={category.color as any}
                  clickable
                  onClick={() => onCategorySelect(category)}
                  image={categoryImages[category.id as keyof typeof categoryImages]}
                  glow
                  className={cn(
                    "min-h-[350px] transform transition-all duration-700",
                    isHovered ? "scale-105 z-10" : "scale-100"
                  )}
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="p-8 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold text-white">
                          {category.toolCount} outils
                        </div>
                        <div className="p-2 rounded-full bg-green-500/20 backdrop-blur-sm">
                          <CheckCircle className="w-4 h-4 text-green-300" />
                        </div>
                      </div>
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
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-300" />
                        <span className="text-white/90 font-medium">Premium</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white group-hover:translate-x-1 transition-transform duration-300">
                        <span className="font-semibold">Explorer</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </ModernCard>
              );
            })}
          </div>

          {/* No Results State */}
          {filteredCategories.length === 0 && search && (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Aucun résultat trouvé</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
                Essayez avec d'autres mots-clés ou explorez nos catégories d'outils.
              </p>
              <button
                onClick={() => setSearch('')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
            <defs>
              <pattern id="footer-dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="white" fillOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-dots)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10 space-y-8">
          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">À propos</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Notre mission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Signaler un bug</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Catégories</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="#nutritional" className="hover:text-white transition-colors">Nutrition</a></li>
                <li><a href="#training" className="hover:text-white transition-colors">Entraînement</a></li>
                <li><a href="#tracking" className="hover:text-white transition-colors">Suivi</a></li>
                <li><a href="#generators" className="hover:text-white transition-colors">Planificateurs</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Outils</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Calculateur BMR</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tracker de poids</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Planificateur repas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tous les outils</a></li>
              </ul>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <a
              href="https://www.linkedin.com/in/anasshoudzi/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="font-medium">Anass Houdzi</span>
            </a>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg font-medium">
              Copyright © 2025 Anass Houdzi – Tous droits réservés.
            </p>
            <p className="text-white/80">
              Application web progressive optimisée pour tous les appareils • {totalImplemented} outils professionnels
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernCategoryGrid;
