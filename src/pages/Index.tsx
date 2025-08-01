
// Cette page est maintenant remplacée par le composant App principal
// Redirection vers l'App principal qui gère toute la logique

import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Cette page ne devrait plus être utilisée avec la nouvelle architecture
    console.log('Index page loaded - redirecting to main App component');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Chargement d'Anatomik...</p>
      </div>
    </div>
  );
};

export default Index;
