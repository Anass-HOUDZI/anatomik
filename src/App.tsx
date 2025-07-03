
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import ToolView from './components/ToolView';
import { StorageManager } from './utils/StorageManager';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'nutritional' | 'training' | 'tracking' | 'generators';
  icon: string;
  component?: React.ComponentType;
}

export interface Category {
  id: 'nutritional' | 'training' | 'tracking' | 'generators';
  name: string;
  description: string;
  icon: string;
  color: string;
  toolCount: number;
}

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'tool'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  useEffect(() => {
    StorageManager.init();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setCurrentView('tool');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedTool(null);
  };

  const handleBackToCategory = () => {
    setCurrentView('category');
    setSelectedTool(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-background">
          <Header 
            currentView={currentView}
            selectedCategory={selectedCategory}
            selectedTool={selectedTool}
            onBackToHome={handleBackToHome}
            onBackToCategory={handleBackToCategory}
          />
          
          <main className="container mx-auto mobile-padding py-8">
            {currentView === 'home' && (
              <div className="space-y-12">
                {/* Hero Section */}
                <div className="text-center space-y-6 animate-fade-in-up">
                  <h1 className="heading-primary">
                    FitMASTER PRO
                  </h1>
                  <div className="space-y-4">
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                      60 outils gratuits de musculation et nutrition
                    </p>
                    <p className="text-body max-w-3xl mx-auto text-lg">
                      Suite complète d'outils professionnels fonctionnant 100% côté client.
                      Calculateurs, trackers, planificateurs - tout ce dont vous avez besoin pour optimiser vos performances.
                    </p>
                  </div>
                </div>
                
                <CategoryGrid onCategorySelect={handleCategorySelect} />
              </div>
            )}
            
            {currentView === 'category' && selectedCategory && (
              <ToolView 
                category={selectedCategory}
                onToolSelect={handleToolSelect}
              />
            )}
            
            {currentView === 'tool' && selectedTool && (
              <div className="space-y-8">
                <div className="text-center space-y-4 animate-fade-in-up">
                  <h2 className="heading-secondary">{selectedTool.name}</h2>
                  <p className="text-body text-lg max-w-3xl mx-auto">{selectedTool.description}</p>
                </div>
                
                {selectedTool.component && (
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <selectedTool.component />
                  </div>
                )}
              </div>
            )}
          </main>
          
          <footer className="bg-muted/30 text-center py-8 mt-16 border-t">
            <div className="container mx-auto mobile-padding">
              <p className="text-sm text-muted-foreground">
                Copyright © 2025 Anass Houdzi – Tous droits réservés.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Application web progressive optimisée pour tous les appareils
              </p>
            </div>
          </footer>
        </div>
        
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
