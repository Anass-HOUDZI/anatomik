
import React from 'react';
import { Search, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { Input } from './input';
import { StatsCounter } from './stats-counter';

// Import tool configs to get exact count
import nutritionalToolsConfig from '../tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from '../tool-configs/trainingToolsConfig';
import trackingToolsConfig from '../tool-configs/trackingToolsConfig';
import generatorToolsConfig from '../tool-configs/generatorToolsConfig';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchValue: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchValue }) => {
  // Calculate exact total tools (43)
  const totalTools = nutritionalToolsConfig.length + trainingToolsConfig.length + trackingToolsConfig.length + generatorToolsConfig.length;
  
  return (
    <div className="relative overflow-hidden text-white" style={{background: 'linear-gradient(to bottom right, #7303c0, #4a00e0)'}}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 sm:opacity-50">
        <svg width="40" height="40" viewBox="0 0 40 40" className="w-full h-full sm:w-60 sm:h-60">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" fillOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="text-center space-y-8 sm:space-y-10 md:space-y-12">
          {/* Main Title */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              {totalTools} Outils Professionnels Gratuits
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-pulse">
                Anatomik 🔬
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-6xl">
                L'anatomie réinventée
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed px-2">
              Suite complète d'outils de musculation et nutrition.
              <br className="hidden sm:block" />
              <span className="text-sm sm:text-base md:text-lg text-white/70 block sm:inline mt-2 sm:mt-0">
                Calculateurs avancés • Trackers intelligents • Planificateurs personnalisés
              </span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl sm:max-w-2xl mx-auto px-2">
            <div className="relative group">
              <Search className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Rechercher un outil..."
                className="pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 h-12 sm:h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-xl sm:rounded-2xl focus:bg-white/20 focus:border-white/40 transition-all duration-300 text-sm sm:text-base"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto px-2">
            <StatsCounter
              value={totalTools}
              label="Outils"
              icon={<Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />}
              delay={0}
            />
            <StatsCounter
              value={4}
              label="Catégories"
              icon={<Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />}
              delay={200}
            />
            <StatsCounter
              value={100}
              label="% Gratuit"
              icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />}
              delay={400}
            />
            <StatsCounter
              value={24}
              label="Support"
              icon={<Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
              delay={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
