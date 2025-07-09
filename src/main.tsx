
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialisation simplifiée sans PWA Optimizer bloquant
const initializeApp = () => {
  console.log('🚀 Démarrage FitMASTER PRO...');
  
  // Service Worker registration non-bloquant
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  }
  
  console.log('✨ Application initialisée avec succès!');
};

// Démarrage immédiat de l'application React
createRoot(document.getElementById("root")!).render(<App />);

// Initialisation en arrière-plan
setTimeout(initializeApp, 100);
