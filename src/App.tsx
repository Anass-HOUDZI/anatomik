
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from './components/Header';
import ModernCategoryGrid from './components/modern-category-grid';
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
        
        // Optimized loading - reduced delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">FitMASTER PRO</h2>
            <p className="text-white/80 text-lg">Chargement de votre expérience premium...</p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
            <span className="text-4xl">⚠️</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Erreur de Chargement</h2>
            <p className="text-white/90 text-lg">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
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
          {currentView !== 'home' && (
            <Header 
              currentView={currentView}
              selectedCategory={selectedCategory}
              selectedTool={selectedTool}
              onBackToHome={handleBackToHome}
              onBackToCategory={handleBackToCategory}
            />
          )}
          
          <main className={currentView === 'home' ? '' : ''}>
            {currentView === 'home' && (
              <ModernCategoryGrid onCategorySelect={handleCategorySelect} />
            )}
            
            {currentView === 'category' && selectedCategory && (
              <ToolView 
                category={selectedCategory}
                onToolSelect={handleToolSelect}
              />
            )}
            
            {currentView === 'tool' && selectedTool && (
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
                <div className="container mx-auto px-4 py-20">
                  <div className="space-y-12">
                    <div className="text-center space-y-6">
                      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                        {selectedTool.name}
                      </h2>
                      <p className="text-xl max-w-4xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
                        {selectedTool.description}
                      </p>
                    </div>
                    
                    {selectedTool.component ? (
                      <div className="animate-in fade-in-50 duration-500">
                        <selectedTool.component />
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <span className="text-3xl">🚧</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Outil en développement</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                          Cet outil sera bientôt disponible. Revenez prochainement !
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
        
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
