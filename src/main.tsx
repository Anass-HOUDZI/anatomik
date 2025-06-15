
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Bootstrap JS for interactive components
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// PWA Optimizer
import { pwaOptimizer } from './services/PWAOptimizer'

// Initialisation PWA complète
const initializePWA = async () => {
  console.log('🚀 Initialisation FitMASTER PRO PWA...');

  // Service Worker registration avec gestion d'erreurs
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker enregistré:', registration.scope);

      // Écoute des mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Nouvelle version disponible');
              // Notification automatique via PWAIndicator
            }
          });
        }
      });

    } catch (error) {
      console.error('❌ Erreur Service Worker:', error);
    }
  }

  // Optimisations PWA
  try {
    pwaOptimizer.optimizePerformance();
    console.log('⚡ Optimisations PWA activées');
  } catch (error) {
    console.error('❌ Erreur optimisations PWA:', error);
  }

  // Detection mode standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Application lancée en mode standalone');
    document.body.classList.add('standalone-mode');
  }

  // Gestion orientation mobile
  if ('screen' in window && 'orientation' in window.screen) {
    window.screen.orientation.addEventListener('change', () => {
      console.log('🔄 Orientation changée:', window.screen.orientation.angle);
    });
  }

  // Gestion connexion réseau
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log(`🌐 Connexion: ${connection.effectiveType}, ${connection.downlink}Mbps`);
    
    connection.addEventListener('change', () => {
      console.log(`🔄 Connexion changée: ${connection.effectiveType}`);
    });
  }

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
      console.log(`⏱️ Temps de chargement: ${loadTime}ms`);
      
      // Log si temps > 3s
      if (loadTime > 3000) {
        console.warn('⚠️ Chargement lent détecté');
      }
    });
  }

  console.log('✨ PWA FitMASTER PRO initialisée avec succès!');
};

// Démarrage application React
createRoot(document.getElementById("root")!).render(<App />);

// Lancement de l'initialisation PWA en arrière-plan
initializePWA();
