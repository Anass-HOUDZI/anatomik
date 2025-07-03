import React from 'react';
import { ArrowLeft, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { IconButton } from './ui/icon-button';
import { Breadcrumb } from './ui/breadcrumb';
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

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Accueil', onClick: onBackToHome, current: currentView === 'home' }
    ];

    if (selectedCategory) {
      items.push({
        label: selectedCategory.name,
        onClick: onBackToCategory,
        current: currentView === 'category'
      });
    }

    if (selectedTool) {
      items.push({
        label: selectedTool.name,
        onClick: () => {}, // Empty function for current tool
        current: true
      });
    }

    return items;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between mobile-padding">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {currentView !== 'home' && (
            <IconButton
              icon={<ArrowLeft size={18} />}
              variant="ghost"
              onClick={currentView === 'tool' ? onBackToCategory : onBackToHome}
              tooltip={currentView === 'tool' ? 'Retour aux outils' : 'Retour à l\'accueil'}
              className="touch-target"
            />
          )}
          
          {/* Logo & Brand */}
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-3 focus-ring rounded-lg p-2 -m-2 group"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform duration-200">
              FM
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                FitMASTER PRO
              </h1>
              {currentView !== 'home' && (
                <p className="text-xs text-muted-foreground">
                  Suite complète fitness & nutrition
                </p>
              )}
            </div>
          </button>
        </div>

        {/* Center Section - Breadcrumb */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <IconButton
            icon={theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            variant="ghost"
            onClick={toggleTheme}
            tooltip={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            className="touch-target"
          />

          {/* Home Button (mobile) */}
          {currentView !== 'home' && (
            <IconButton
              icon={<Home size={18} />}
              variant="ghost"
              onClick={onBackToHome}
              tooltip="Retour à l'accueil"
              className="touch-target sm:hidden"
            />
          )}
        </div>
      </div>

      {/* Mobile Breadcrumb */}
      <div className="md:hidden border-t bg-muted/30 px-4 py-2">
        <Breadcrumb items={getBreadcrumbItems()} className="text-xs" />
      </div>
    </header>
  );
};

export default Header;
