
import React from 'react';
import { Search, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { Input } from './input';
import { StatsCounter } from './stats-counter';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchValue: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, searchValue }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          {/* Main Title */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              60 Outils Professionnels Gratuits
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-pulse">
                FitMASTER
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
                PRO
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Suite complète d'outils de musculation et nutrition fonctionnant 100% côté client.
              <br />
              <span className="text-lg text-white/70">Calculateurs avancés • Trackers intelligents • Planificateurs personnalisés</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher un outil ou une catégorie..."
                className="pl-14 pr-6 py-4 h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 rounded-2xl focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <StatsCounter
              value={60}
              label="Outils"
              icon={<Zap className="w-5 h-5 text-yellow-400" />}
              delay={0}
            />
            <StatsCounter
              value={15}
              label="Catégories"
              icon={<Trophy className="w-5 h-5 text-orange-400" />}
              delay={200}
            />
            <StatsCounter
              value={100}
              label="% Gratuit"
              icon={<Sparkles className="w-5 h-5 text-green-400" />}
              delay={400}
            />
            <StatsCounter
              value={24}
              label="Support"
              icon={<Users className="w-5 h-5 text-blue-400" />}
              delay={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
