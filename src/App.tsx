
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
    // Initialize storage and load user preferences
    StorageManager.init();
    console.log('FitMASTER PRO - Application initialized');
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background transition-colors duration-300">
            <Header 
              currentView={currentView}
              selectedCategory={selectedCategory}
              selectedTool={selectedTool}
              onBackToHome={handleBackToHome}
              onBackToCategory={handleBackToCategory}
            />
            
            <main className="container mx-auto px-4 py-8">
              {currentView === 'home' && (
                <div className="fade-in">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
                      FitMASTER PRO
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                      60 outils gratuits de musculation et nutrition
                    </p>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                      Suite complète d'outils professionnels fonctionnant 100% côté client. 
                      Calculateurs, trackers, planificateurs - tout accessible offline !
                    </p>
                  </div>
                  
                  <CategoryGrid onCategorySelect={handleCategorySelect} />
                </div>
              )}
              
              {currentView === 'category' && selectedCategory && (
                <div className="fade-in">
                  <ToolView 
                    category={selectedCategory}
                    onToolSelect={handleToolSelect}
                  />
                </div>
              )}
              
              {currentView === 'tool' && selectedTool && (
                <div className="fade-in">
                  <div className="calculator-container">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white text-2xl mb-4">
                        <i className={`fas ${selectedTool.icon}`}></i>
                      </div>
                      <h2 className="text-3xl font-bold mb-2">{selectedTool.name}</h2>
                      <p className="text-lg text-muted-foreground">{selectedTool.description}</p>
                    </div>
                    
                    {selectedTool.component && <selectedTool.component />}
                  </div>
                </div>
              )}
            </main>
            
            <footer className="bg-gradient-dark text-white py-8 mt-16">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold mb-4">FitMASTER PRO</h3>
                <p className="text-lg mb-4">
                  60 outils gratuits • 100% offline • 0% collecte de données
                </p>
                <div className="flex justify-center space-x-6 text-sm opacity-75">
                  <span>Calculateurs nutritionnels (15)</span>
                  <span>•</span>
                  <span>Calculateurs d'entraînement (15)</span>
                  <span>•</span>
                  <span>Outils de suivi (15)</span>
                  <span>•</span>
                  <span>Planificateurs (15)</span>
                </div>
              </div>
            </footer>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
