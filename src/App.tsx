
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import ToolView from './components/ToolView';
import { StorageManager } from './utils/StorageManager';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize storage
        await StorageManager.init();
        
        // Small delay to ensure smooth loading
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur initialisation:', err);
        setError('Erreur lors de l\'initialisation de l\'application');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleCategorySelect = (category: Category) => {
    try {
      setSelectedCategory(category);
      setCurrentView('category');
      setError(null);
    } catch (err) {
      console.error('Erreur sélection catégorie:', err);
      setError('Erreur lors de la sélection de la catégorie');
    }
  };

  const handleToolSelect = (tool: Tool) => {
    try {
      setSelectedTool(tool);
      setCurrentView('tool');
      setError(null);
    } catch (err) {
      console.error('Erreur sélection outil:', err);
      setError('Erreur lors de la sélection de l\'outil');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory(null);
    setSelectedTool(null);
    setError(null);
  };

  const handleBackToCategory = () => {
    setCurrentView('category');
    setSelectedTool(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">FitMASTER PRO</h2>
            <p className="text-muted-foreground">Chargement en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Erreur</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Recharger l'application
          </button>
        </div>
      </div>
    );
  }

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
          
          <main className="container mx-auto px-4 py-12">
            {currentView === 'home' && (
              <div className="space-y-16">
                <div className="text-center space-y-8">
                  <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    FitMASTER PRO
                  </h1>
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                      60 outils gratuits de musculation et nutrition
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Suite complète d'outils professionnels fonctionnant 100% côté client.
                      Calculateurs avancés, trackers intelligents, planificateurs personnalisés - 
                      tout ce dont vous avez besoin pour optimiser vos performances et atteindre vos objectifs.
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
              <div className="space-y-12">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {selectedTool.name}
                  </h2>
                  <p className="text-lg max-w-4xl mx-auto text-muted-foreground leading-relaxed">
                    {selectedTool.description}
                  </p>
                </div>
                
                {selectedTool.component ? (
                  <div className="animate-in fade-in-50 duration-500">
                    <selectedTool.component />
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-3xl">🚧</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Outil en développement</h3>
                    <p className="text-muted-foreground text-lg">
                      Cet outil sera bientôt disponible. Revenez prochainement !
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
          
          <footer className="bg-muted/30 text-center py-12 mt-20 border-t">
            <div className="container mx-auto px-4 space-y-4">
              <p className="text-base font-medium text-foreground">
                Copyright © 2025 Anass Houdzi – Tous droits réservés.
              </p>
              <p className="text-sm text-muted-foreground">
                Application web progressive optimisée pour tous les appareils • 60 outils professionnels
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
