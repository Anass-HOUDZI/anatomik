
import React from 'react';
import { ArrowLeft, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
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
        onClick: () => {},
        current: true
      });
    }

    return items;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {currentView !== 'home' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={currentView === 'tool' ? onBackToCategory : onBackToHome}
            >
              <ArrowLeft size={18} />
            </Button>
          )}
          
          <button 
            onClick={onBackToHome}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              FM
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                FitMASTER PRO
              </h1>
            </div>
          </button>
        </div>

        {/* Center Section - Breadcrumb */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>

          {currentView !== 'home' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToHome}
              className="sm:hidden"
            >
              <Home size={18} />
            </Button>
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
