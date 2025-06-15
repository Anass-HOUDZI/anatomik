
// Service d'optimisation PWA avec lazy loading et compression
export class PWAOptimizer {
  private static instance: PWAOptimizer;
  private loadedModules: Set<string> = new Set();
  private preloadCache: Map<string, Promise<any>> = new Map();

  static getInstance(): PWAOptimizer {
    if (!this.instance) {
      this.instance = new PWAOptimizer();
    }
    return this.instance;
  }

  // Lazy loading des composants
  async loadComponent(componentName: string): Promise<any> {
    if (this.loadedModules.has(componentName)) {
      return Promise.resolve();
    }

    try {
      let component;
      
      switch (componentName) {
        case 'BMRCalculator':
          component = await import('../components/calculators/BMRCalculator');
          break;
        case 'WeightTracker':
          component = await import('../components/trackers/WeightTracker');
          break;
        case 'WorkoutGenerator':
          component = await import('../components/generators/WorkoutGenerator');
          break;
        // Ajouter d'autres composants selon les besoins
        default:
          throw new Error(`Composant ${componentName} non trouvé`);
      }

      this.loadedModules.add(componentName);
      return component.default;
    } catch (error) {
      console.error(`Erreur chargement composant ${componentName}:`, error);
      throw error;
    }
  }

  // Preload des ressources critiques
  preloadCriticalResources(): void {
    const criticalComponents = [
      'BMRCalculator',
      'WeightTracker',
      'MacroCalculator'
    ];

    criticalComponents.forEach(component => {
      if (!this.preloadCache.has(component)) {
        this.preloadCache.set(component, this.loadComponent(component));
      }
    });
  }

  // Compression des données avant stockage
  compressData(data: any): string {
    try {
      // Simulation compression basique (en production, utiliser pako ou similaire)
      const jsonString = JSON.stringify(data);
      
      // Suppression des espaces inutiles
      const compressed = jsonString
        .replace(/\s+/g, ' ')
        .replace(/:\s/g, ':')
        .replace(/,\s/g, ',');
      
      return compressed;
    } catch (error) {
      console.error('Erreur compression:', error);
      return JSON.stringify(data);
    }
  }

  // Décompression des données
  decompressData(compressedData: string): any {
    try {
      return JSON.parse(compressedData);
    } catch (error) {
      console.error('Erreur décompression:', error);
      return null;
    }
  }

  // Optimisation des images
  optimizeImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcul nouvelles dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Dessin image redimensionnée
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Conversion en blob avec compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Erreur optimisation image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Erreur chargement image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Nettoyage automatique du cache
  async cleanupCache(): Promise<void> {
    const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
    const MAX_AGE_DAYS = 7;

    try {
      // Vérification taille cache
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        
        if (estimate.usage && estimate.usage > MAX_CACHE_SIZE) {
          await this.performCacheCleanup(MAX_AGE_DAYS);
        }
      }

      // Nettoyage localStorage ancien
      this.cleanupLocalStorage(MAX_AGE_DAYS);
      
    } catch (error) {
      console.error('Erreur nettoyage cache:', error);
    }
  }

  // Nettoyage cache interne
  private async performCacheCleanup(maxAgeDays: number): Promise<void> {
    const cacheNames = await caches.keys();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get('date');
          if (dateHeader) {
            const responseDate = new Date(dateHeader);
            if (responseDate < cutoffDate) {
              await cache.delete(request);
              console.log(`Cache expiré supprimé: ${request.url}`);
            }
          }
        }
      }
    }
  }

  // Nettoyage localStorage
  private cleanupLocalStorage(maxAgeDays: number): void {
    const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('fitmaster_temp_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.timestamp && data.timestamp < cutoffTime) {
            localStorage.removeItem(key);
            console.log(`Données temporaires supprimées: ${key}`);
          }
        } catch (error) {
          // Suppression si données corrompues
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Préchargement intelligent basé sur l'usage
  intelligentPreload(): void {
    // Analyse de l'usage utilisateur depuis localStorage
    const usageStats = this.getUserUsageStats();
    
    // Preload des outils les plus utilisés
    const mostUsedTools = usageStats
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 3)
      .map(tool => tool.name);

    mostUsedTools.forEach(toolName => {
      if (!this.preloadCache.has(toolName)) {
        this.preloadCache.set(toolName, this.loadComponent(toolName));
      }
    });
  }

  // Statistiques d'usage
  private getUserUsageStats(): Array<{name: string, usage: number}> {
    try {
      const stats = localStorage.getItem('fitmaster_usage_stats');
      return stats ? JSON.parse(stats) : [];
    } catch (error) {
      return [];
    }
  }

  // Enregistrement utilisation outil
  recordToolUsage(toolName: string): void {
    try {
      const stats = this.getUserUsageStats();
      const existingTool = stats.find(tool => tool.name === toolName);

      if (existingTool) {
        existingTool.usage++;
      } else {
        stats.push({ name: toolName, usage: 1 });
      }

      localStorage.setItem('fitmaster_usage_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Erreur enregistrement usage:', error);
    }
  }

  // Optimisation des performances
  optimizePerformance(): void {
    // Preload critique
    this.preloadCriticalResources();
    
    // Preload intelligent
    this.intelligentPreload();
    
    // Nettoyage périodique
    setTimeout(() => this.cleanupCache(), 5000);
    
    // Optimisation images automatique
    this.setupImageOptimization();
  }

  // Configuration optimisation images
  private setupImageOptimization(): void {
    // Intercepter les uploads d'images pour optimisation automatique
    document.addEventListener('change', async (event) => {
      const input = event.target as HTMLInputElement;
      
      if (input.type === 'file' && input.files?.length) {
        const file = input.files[0];
        
        if (file.type.startsWith('image/') && file.size > 500 * 1024) { // > 500KB
          try {
            const optimizedBlob = await this.optimizeImage(file);
            console.log(`Image optimisée: ${file.size} -> ${optimizedBlob.size} bytes`);
            
            // Remplacer le fichier par la version optimisée si nécessaire
            // (implementation dépend du composant d'upload)
          } catch (error) {
            console.error('Erreur optimisation image:', error);
          }
        }
      }
    });
  }
}

// Export instance singleton
export const pwaOptimizer = PWAOptimizer.getInstance();
