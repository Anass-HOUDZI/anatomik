import React from 'react';
import { BarChart3 } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'about' | 'contact' | 'faq' | 'features' | 'all-tools' | 'nutritional' | 'training' | 'tracking' | 'generators') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-gradient-to-br from-[#7303c0] to-[#4a00e0] text-white py-16">
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
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* À propos */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-6">À propos</h3>
            <div className="space-y-4">
              <button 
                onClick={() => onNavigate?.('about')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Notre mission
              </button>
              <button 
                onClick={() => onNavigate?.('features')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Fonctionnalités
              </button>
              <button 
                onClick={() => onNavigate?.('faq')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-6">Contact</h3>
            <div className="space-y-4">
              <button 
                onClick={() => onNavigate?.('contact')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Support
              </button>
              <button 
                onClick={() => onNavigate?.('contact')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Feedback
              </button>
              <button 
                onClick={() => onNavigate?.('contact')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Signaler un bug
              </button>
            </div>
          </div>

          {/* Catégories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-6">Catégories</h3>
            <div className="space-y-4">
              <button 
                onClick={() => onNavigate?.('nutritional')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Nutrition
              </button>
              <button 
                onClick={() => onNavigate?.('training')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Entraînement
              </button>
              <button 
                onClick={() => onNavigate?.('tracking')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Suivi
              </button>
              <button 
                onClick={() => onNavigate?.('generators')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Planificateurs
              </button>
            </div>
          </div>

          {/* Outils */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-6">Outils</h3>
            <div className="space-y-4">
              <span className="block text-white/80">Calculateur BMR</span>
              <span className="block text-white/80">Tracker de poids</span>
              <span className="block text-white/80">Planificateur repas</span>
              <button 
                onClick={() => onNavigate?.('all-tools')}
                className="block text-white/80 hover:text-white transition-colors duration-200 text-left"
              >
                Tous les outils
              </button>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center border-t border-white/20 pt-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <BarChart3 size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30">
              Anass Houdzi
            </span>
          </div>
          <p className="text-white/80 text-lg mb-4">
            Copyright © 2025 Anass Houdzi – Tous droits réservés.
          </p>
          <p className="text-white/60">
            Application web progressive optimisée pour tous les appareils • 43 outils professionnels
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;