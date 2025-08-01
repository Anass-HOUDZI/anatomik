
import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from './ui/use-toast';

const PWAIndicator: React.FC = () => {
  const { 
    status, 
    queuedTasks, 
    installApp, 
    updateApp, 
    clearCache, 
    formatCacheSize,
    updateCacheStatus 
  } = usePWA();
  
  const [showDetails, setShowDetails] = useState(false);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "Installation réussie !",
        description: "Anatomik a été installé sur votre appareil.",
      });
    }
  };

  const handleUpdate = () => {
    updateApp();
    toast({
      title: "Mise à jour en cours...",
      description: "L'application va redémarrer avec la nouvelle version.",
    });
  };

  const handleClearCache = async () => {
    await clearCache();
    toast({
      title: "Cache vidé",
      description: "Toutes les données en cache ont été supprimées.",
    });
  };

  const getConnectionIcon = () => {
    return status.isOnline ? (
      <i className="fas fa-wifi text-green-500" />
    ) : (
      <i className="fas fa-wifi-slash text-red-500" />
    );
  };

  const getInstallationStatus = () => {
    if (status.isInstalled) {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Installée</Badge>;
    }
    if (status.canInstall) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Installable</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">Web</Badge>;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Indicateur principal */}
      <div className="flex items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 border">
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          <span className="text-sm font-medium">
            {status.isOnline ? 'En ligne' : 'Hors ligne'}
          </span>
        </div>
        
        {queuedTasks.length > 0 && (
          <Badge variant="destructive" className="ml-2">
            {queuedTasks.length}
          </Badge>
        )}
        
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              <i className="fas fa-info-circle" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <i className="fas fa-mobile-alt text-blue-500" />
                État de l'application
              </DialogTitle>
              <DialogDescription>
                Informations sur la PWA et les fonctionnalités offline
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Statut connexion */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getConnectionIcon()}
                    Connexion
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {status.isOnline ? 'Connecté à Internet' : 'Mode hors ligne actif'}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      status.isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </CardContent>
              </Card>

              {/* Installation */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <i className="fas fa-download text-purple-500" />
                    Installation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Statut</span>
                    {getInstallationStatus()}
                  </div>
                  
                  {status.canInstall && (
                    <Button onClick={handleInstall} size="sm" className="w-full">
                      <i className="fas fa-plus mr-2" />
                      Installer l'app
                    </Button>
                  )}
                  
                  {status.updateAvailable && (
                    <Button onClick={handleUpdate} variant="outline" size="sm" className="w-full">
                      <i className="fas fa-sync-alt mr-2" />
                      Mettre à jour
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Cache */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <i className="fas fa-database text-orange-500" />
                    Données locales
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taille du cache</span>
                      <span className="font-mono">
                        {formatCacheSize(status.cacheStatus.size)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Éléments stockés</span>
                      <span className="font-mono">{status.cacheStatus.items}</span>
                    </div>
                    {status.cacheStatus.lastUpdate && (
                      <div className="flex justify-between">
                        <span>Dernière maj</span>
                        <span className="text-xs text-muted-foreground">
                          {status.cacheStatus.lastUpdate.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleClearCache} 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    <i className="fas fa-trash mr-2" />
                    Vider le cache
                  </Button>
                </CardContent>
              </Card>

              {/* Tâches en attente */}
              {queuedTasks.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <i className="fas fa-clock text-yellow-500" />
                      Synchronisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tâches en attente</span>
                        <Badge variant="secondary">{queuedTasks.length}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Les données seront synchronisées automatiquement lors de la prochaine connexion.
                      </div>
                      <Progress value={(queuedTasks.length / 10) * 100} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fonctionnalités offline */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <i className="fas fa-tools text-green-500" />
                    Disponible hors ligne
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <i className="fas fa-calculator text-blue-400" />
                      <span>Calculateurs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-chart-line text-green-400" />
                      <span>Trackers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-save text-purple-400" />
                      <span>Sauvegarde locale</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="fas fa-file-export text-orange-400" />
                      <span>Export PDF</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notification mise à jour */}
      {status.updateAvailable && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-sm">
            <i className="fas fa-sync-alt" />
            <span>Mise à jour disponible</span>
            <Button 
              onClick={handleUpdate} 
              size="sm" 
              variant="secondary"
              className="ml-2 h-6 px-2 text-xs"
            >
              Installer
            </Button>
          </div>
        </div>
      )}

      {/* Mode offline */}
      {!status.isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <i className="fas fa-wifi-slash" />
            <span>Mode hors ligne - Fonctionnalités limitées</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAIndicator;
