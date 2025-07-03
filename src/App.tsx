
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
import PWAIndicator from './components/PWAIndicator';
import { GestureProvider } from './contexts/GestureContext';
import './styles/mobile-optimizations.css';

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
        <GestureProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground">
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
                      <p className="text-xl md:text-2xl text-muted-foreground">
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
                  <ToolView 
                    category={selectedCategory}
                    onToolSelect={handleToolSelect}
                  />
                )}
                
                {currentView === 'tool' && selectedTool && (
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl">
                        <i className={`fas ${selectedTool.icon}`}></i>
                      </div>
                      <h2 className="text-3xl font-bold">{selectedTool.name}</h2>
                      <p className="text-lg text-muted-foreground">{selectedTool.description}</p>
                    </div>
                    
                    {selectedTool.component && <selectedTool.component />}
                  </div>
                )}
              </main>
              
              <footer className="bg-muted/50 text-center py-6 mt-12">
                <div className="container mx-auto px-4">
                  <p className="text-sm text-muted-foreground">
                    Copyright © 2025{" "}
                    <a
                      href="https://www.linkedin.com/in/anasshoudzi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Anass Houdzi
                    </a>
                    {" "}– Tous droits réservés.
                  </p>
                </div>
              </footer>
              
              <PWAIndicator />
            </div>
            
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </GestureProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
