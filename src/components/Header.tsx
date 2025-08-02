
import React from 'react';
import { ArrowLeft, Home, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Breadcrumb } from './ui/breadcrumb';
import type { Category, Tool } from '../App';

interface HeaderProps {
  currentView: 'home' | 'category' | 'tool' | 'about' | 'contact' | 'faq' | 'features' | 'all-tools';
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
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-gray-900/95">
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
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/41f3eec7-2593-4eec-ae9f-6f215340e234.png" 
              alt="Anatomik Logo" 
              className="h-8 w-auto"
            />
          </button>
        </div>

        {/* Center Section - Breadcrumb */}
        {currentView !== 'about' && currentView !== 'contact' && (
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
        )}

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
      {currentView !== 'about' && currentView !== 'contact' && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900 px-4 py-2">
          <Breadcrumb items={getBreadcrumbItems()} className="text-xs" />
        </div>
      )}
    </header>
  );
};

export default Header;
