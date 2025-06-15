
import { useState, useEffect } from 'react';

export interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  updateAvailable: boolean;
  cacheStatus: {
    size: number;
    items: number;
    lastUpdate: Date | null;
  };
}

export interface QueuedTask {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isOnline: navigator.onLine,
    isInstalled: false,
    canInstall: false,
    updateAvailable: false,
    cacheStatus: {
      size: 0,
      items: 0,
      lastUpdate: null
    }
  });

  const [queuedTasks, setQueuedTasks] = useState<QueuedTask[]>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Détection mode installé
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setStatus(prev => ({ 
        ...prev, 
        isInstalled: isStandalone || isInWebAppiOS 
      }));
    };

    // Écouteurs online/offline
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      processPendingTasks();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    // Prompt d'installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setStatus(prev => ({ ...prev, canInstall: true }));
    };

    // Service Worker messages
    const handleSWMessage = (event: MessageEvent) => {
      const { type, message } = event.data;
      
      switch (type) {
        case 'SW_UPDATED':
          setStatus(prev => ({ ...prev, updateAvailable: true }));
          console.log('PWA: Service Worker mis à jour');
          break;
        case 'CACHE_UPDATED':
          updateCacheStatus();
          break;
      }
    };

    // Initialisation
    checkInstalled();
    updateCacheStatus();
    loadQueuedTasks();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, []);

  // Mise à jour statut cache
  const updateCacheStatus = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const messageChannel = new MessageChannel();
        
        messageChannel.port1.onmessage = (event) => {
          const { caches, totalSize, status } = event.data;
          
          if (status === 'ready') {
            setStatus(prev => ({
              ...prev,
              cacheStatus: {
                size: totalSize,
                items: caches,
                lastUpdate: new Date()
              }
            }));
          }
        };

        navigator.serviceWorker.controller.postMessage(
          { type: 'GET_CACHE_STATUS' },
          [messageChannel.port2]
        );
      } catch (error) {
        console.error('Erreur statut cache:', error);
      }
    }
  };

  // Installation PWA
  const installApp = async () => {
    if (!deferredPrompt) return false;
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setStatus(prev => ({ ...prev, canInstall: false, isInstalled: true }));
        setDeferredPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur installation:', error);
      return false;
    }
  };

  // Rechargement pour mise à jour
  const updateApp = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Ajout tâche en queue
  const addTaskToQueue = (task: Omit<QueuedTask, 'id' | 'timestamp' | 'retryCount'>) => {
    const newTask: QueuedTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryCount: 0
    };

    setQueuedTasks(prev => {
      const updated = [...prev, newTask];
      localStorage.setItem('pwa_queued_tasks', JSON.stringify(updated));
      return updated;
    });

    return newTask.id;
  };

  // Traitement tâches en attente
  const processPendingTasks = async () => {
    if (!status.isOnline || queuedTasks.length === 0) return;

    const tasksToProcess = [...queuedTasks];
    const completedTasks: string[] = [];

    for (const task of tasksToProcess) {
      try {
        // Simulation traitement tâche
        await processTask(task);
        completedTasks.push(task.id);
        console.log(`Tâche ${task.id} traitée avec succès`);
      } catch (error) {
        console.error(`Échec traitement tâche ${task.id}:`, error);
        
        // Retry logic
        if (task.retryCount < 3) {
          const updatedTask = {
            ...task,
            retryCount: task.retryCount + 1
          };
          
          setQueuedTasks(prev => 
            prev.map(t => t.id === task.id ? updatedTask : t)
          );
        } else {
          completedTasks.push(task.id); // Abandon après 3 tentatives
        }
      }
    }

    // Suppression tâches terminées
    if (completedTasks.length > 0) {
      setQueuedTasks(prev => {
        const filtered = prev.filter(t => !completedTasks.includes(t.id));
        localStorage.setItem('pwa_queued_tasks', JSON.stringify(filtered));
        return filtered;
      });
    }
  };

  // Traitement individuel tâche
  const processTask = async (task: QueuedTask): Promise<void> => {
    // Implémentation spécifique selon le type de tâche
    switch (task.type) {
      case 'SAVE_WORKOUT':
        // Sauvegarder workout data
        break;
      case 'SYNC_WEIGHT':
        // Synchroniser données poids
        break;
      case 'EXPORT_DATA':
        // Exporter données utilisateur
        break;
      default:
        console.warn(`Type de tâche inconnu: ${task.type}`);
    }
  };

  // Chargement tâches depuis localStorage
  const loadQueuedTasks = () => {
    try {
      const saved = localStorage.getItem('pwa_queued_tasks');
      if (saved) {
        const tasks = JSON.parse(saved);
        setQueuedTasks(tasks);
      }
    } catch (error) {
      console.error('Erreur chargement tâches:', error);
    }
  };

  // Nettoyage cache
  const clearCache = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        const { status } = event.data;
        if (status === 'cleared') {
          setStatus(prev => ({
            ...prev,
            cacheStatus: { size: 0, items: 0, lastUpdate: new Date() }
          }));
        }
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    }
  };

  // Sauvegarde données locales
  const saveToCache = async (data: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_DATA',
        data: data
      });
    }
  };

  // Formatage taille cache
  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    status,
    queuedTasks,
    installApp,
    updateApp,
    addTaskToQueue,
    processPendingTasks,
    clearCache,
    saveToCache,
    formatCacheSize,
    updateCacheStatus
  };
};
