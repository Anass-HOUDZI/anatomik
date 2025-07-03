
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
          
          <main className="container mx-auto px-4 py-8">
            {currentView === 'home' && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    FitMASTER PRO
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    60 outils gratuits de musculation et nutrition
                  </p>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Suite complète d'outils professionnels fonctionnant 100% côté client.
                  </p>
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
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">{selectedTool.name}</h2>
                  <p className="text-muted-foreground">{selectedTool.description}</p>
                </div>
                
                {selectedTool.component && <selectedTool.component />}
              </div>
            )}
          </main>
          
          <footer className="bg-muted/50 text-center py-6 mt-12">
            <p className="text-sm text-muted-foreground">
              Copyright © 2025 Anass Houdzi – Tous droits réservés.
            </p>
          </footer>
        </div>
        
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
