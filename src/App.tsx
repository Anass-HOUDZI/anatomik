
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
        <GestureProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col mobile-optimized">
              <Header 
                currentView={currentView}
                selectedCategory={selectedCategory}
                selectedTool={selectedTool}
                onBackToHome={handleBackToHome}
                onBackToCategory={handleBackToCategory}
              />
              
              <main className="flex-1 w-full mobile-scroll">
                {currentView === 'home' && (
                  <div className="fade-in mobile-fade-scale w-full">
                    <div className="text-center mb-8 px-4">
                      <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4 heading-mobile-responsive">
                        FitMASTER PRO
                      </h1>
                      <p className="text-xl md:text-2xl text-muted-foreground mb-4 text-mobile-responsive">
                        60 outils gratuits de musculation et nutrition
                      </p>
                      <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-mobile-responsive px-4">
                        Suite complète d'outils professionnels fonctionnant 100% côté client. 
                        Calculateurs, trackers, planificateurs - tout accessible offline !
                      </p>
                    </div>
                    
                    <CategoryGrid onCategorySelect={handleCategorySelect} />
                  </div>
                )}
                
                {currentView === 'category' && selectedCategory && (
                  <div className="fade-in mobile-slide-up w-full">
                    <ToolView 
                      category={selectedCategory}
                      onToolSelect={handleToolSelect}
                    />
                  </div>
                )}
                
                {currentView === 'tool' && selectedTool && (
                  <div className="fade-in mobile-fade-scale w-full">
                    <div className="w-full px-4 py-6">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white text-2xl mb-4 mobile-optimized">
                          <i className={`fas ${selectedTool.icon}`}></i>
                        </div>
                        <h2 className="text-3xl font-bold mb-2 heading-mobile-responsive">{selectedTool.name}</h2>
                        <p className="text-lg text-muted-foreground text-mobile-responsive">{selectedTool.description}</p>
                      </div>
                      
                      {selectedTool.component && <selectedTool.component />}
                    </div>
                  </div>
                )}
              </main>
              
              <footer className="bg-transparent text-center py-4 shadow-none select-none safe-area-horizontal">
                <div className="text-xs md:text-sm text-muted-foreground text-mobile-responsive px-4">
                  Copyright © 2025{" "}
                  <a
                    href="https://www.linkedin.com/in/anasshoudzi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold text-blue-700 hover:text-blue-900 transition-colors touch-target"
                  >
                    Anass Houdzi
                  </a>
                  {" "}– Tous droits réservés.
                </div>
              </footer>
              
              {/* Indicateur PWA */}
              <PWAIndicator />
            </div>
          </TooltipProvider>
        </GestureProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
