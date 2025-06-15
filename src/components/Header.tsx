
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import type { Category, Tool } from '../App';

interface HeaderProps {
  currentView: 'home' | 'category' | 'tool';
  selectedCategory: Category | null;
  selectedTool: Tool | null;
  onBackToHome: () => void;
  onBackToCategory: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedCategory,
  selectedTool,
  onBackToHome,
  onBackToCategory
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar-glass sticky top-0 z-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4">
            {currentView !== 'home' && (
              <button
                onClick={currentView === 'tool' ? onBackToCategory : onBackToHome}
                className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                <span className="hidden sm:inline">
                  {currentView === 'tool' ? 'Retour aux outils' : 'Accueil'}
                </span>
              </button>
            )}
            
            <div 
              onClick={onBackToHome}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
                FM
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">FitMASTER PRO</h1>
                {currentView === 'category' && selectedCategory && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory.name} • {selectedCategory.toolCount} outils
                  </p>
                )}
                {currentView === 'tool' && selectedTool && (
                  <p className="text-sm text-muted-foreground">
                    {selectedTool.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* PWA Install Button - will be shown when PWA is installable */}
            <div id="pwa-install" className="hidden">
              <button className="btn btn-outline-primary btn-sm">
                <i className="fas fa-download me-2"></i>
                Installer
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-custom hover:bg-muted transition-colors"
              title={`Passer au mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>

            {/* Menu Button for Mobile */}
            <div className="dropdown">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-custom hover:bg-muted transition-colors"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => window.location.reload()}>
                    <i className="fas fa-sync-alt me-2"></i>
                    Actualiser
                  </button>
                </li>
                <li>
                  <button className="dropdown-item">
                    <i className="fas fa-download me-2"></i>
                    Exporter données
                  </button>
                </li>
                <li>
                  <button className="dropdown-item">
                    <i className="fas fa-upload me-2"></i>
                    Importer données
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger">
                    <i className="fas fa-trash me-2"></i>
                    Effacer données
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
