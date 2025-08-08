
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from './components/Header';
import Footer from './components/Footer';
import ModernCategoryGrid from './components/modern-category-grid';
import ToolView from './components/ToolView';
import { StorageManager } from './utils/StorageManager';
import { ThemeProvider } from './context/ThemeContext';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Features from './pages/Features';
import AllTools from './pages/AllTools';

// Import all tool configs to get tools for AllTools page
import nutritionalToolsConfig from './components/tool-configs/nutritionalToolsConfig';
import trainingToolsConfig from './components/tool-configs/trainingToolsConfig';
import trackingToolsConfig from './components/tool-configs/trackingToolsConfig';
import generatorToolsConfig from './components/tool-configs/generatorToolsConfig';

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
  const [currentView, setCurrentView] = useState<'home' | 'category' | 'tool' | 'about' | 'contact' | 'faq' | 'features' | 'all-tools'>('home');
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

  const handleNavigate = (view: 'about' | 'contact' | 'faq' | 'features' | 'all-tools' | 'nutritional' | 'training' | 'tracking' | 'generators') => {
    if (['nutritional', 'training', 'tracking', 'generators'].includes(view)) {
      // Handle category navigation
      const categories = [
        { id: 'nutritional' as const, name: 'Nutrition', description: 'Calculateurs nutritionnels', icon: 'fa-apple-alt', color: 'from-blue-600 to-blue-800', toolCount: nutritionalToolsConfig.length },
        { id: 'training' as const, name: 'Entraînement', description: 'Calculateurs d\'entraînement', icon: 'fa-dumbbell', color: 'from-green-600 to-green-800', toolCount: trainingToolsConfig.length },
        { id: 'tracking' as const, name: 'Suivi', description: 'Outils de suivi', icon: 'fa-chart-line', color: 'from-purple-600 to-purple-800', toolCount: trackingToolsConfig.length },
        { id: 'generators' as const, name: 'Planificateurs', description: 'Générateurs et planificateurs', icon: 'fa-cogs', color: 'from-orange-600 to-orange-800', toolCount: generatorToolsConfig.length }
      ];
      const category = categories.find(cat => cat.id === view);
      if (category) {
        handleCategorySelect(category);
      }
    } else {
      setCurrentView(view as 'about' | 'contact' | 'faq' | 'features' | 'all-tools');
      setSelectedCategory(null);
      setSelectedTool(null);
      setError(null);
    }
  };

  // Get all tools for AllTools page
  const getAllTools = () => {
    return [
      ...nutritionalToolsConfig,
      ...trainingToolsConfig,
      ...trackingToolsConfig,
      ...generatorToolsConfig
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7303c0] to-[#4a00e0] flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-300 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Anatomik</h2>
            <p className="text-white/80 text-lg">Votre anatomie entre vos mains...</p>
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
        <div className="min-h-screen bg-gradient-to-br from-[#7303c0] to-[#4a00e0]">
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
              <>
                <ModernCategoryGrid 
                  onCategorySelect={handleCategorySelect} 
                  onNavigate={handleNavigate}
                />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}
            
            {currentView === 'category' && selectedCategory && (
              <>
                <ToolView 
                  category={selectedCategory}
                  onToolSelect={handleToolSelect}
                />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}
            
            {currentView === 'tool' && selectedTool && (
              <>
                {/* Hero header - gradient, white text only here */}
                <section className="w-full bg-gradient-to-br from-[#7303c0] to-[#4a00e0]">
                  <div className="text-center space-y-6 p-4 text-white">
                    <h2 className="text-4xl md:text-5xl font-bold">
                      {selectedTool.name}
                    </h2>
                    <p className="text-xl max-w-4xl mx-auto text-white/80 leading-relaxed">
                      {selectedTool.description}
                    </p>
                  </div>
                </section>

                {/* Tool content - reset to design system foreground/background */}
                <section className="w-full bg-background text-foreground">
                  {selectedTool.component ? (
                    <div className="animate-in fade-in-50 duration-500 w-full">
                      <selectedTool.component />
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <h3 className="text-2xl font-bold mb-4">Outil en développement</h3>
                      <p className="text-muted-foreground text-lg">
                        Cet outil sera bientôt disponible. Revenez prochainement !
                      </p>
                    </div>
                  )}
                </section>

                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}

            {currentView === 'about' && (
              <>
                <About onBack={handleBackToHome} />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}

            {currentView === 'contact' && (
              <>
                <Contact onBack={handleBackToHome} />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}

            {currentView === 'faq' && (
              <>
                <FAQ onBack={handleBackToHome} />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}

            {currentView === 'features' && (
              <>
                <Features onBack={handleBackToHome} />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}

            {currentView === 'all-tools' && (
              <>
                <AllTools 
                  onBack={handleBackToHome}
                  onToolSelect={handleToolSelect}
                />
                <Footer onNavigate={handleNavigate} onToolSelect={handleToolSelect} />
              </>
            )}
          </main>
        </div>
        
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
