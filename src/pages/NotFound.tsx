import { memo } from "react";
import { Button } from "@/components/ui/button";

const NotFound = memo(() => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900/20 dark:to-purple-900/20">
      <div className="text-center space-y-8 max-w-md mx-auto p-8">
        <div className="space-y-4">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text">
            404
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Page non trouvée
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Retour à l'accueil
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ou utilisez le menu de navigation pour trouver ce que vous cherchez.
          </p>
        </div>
      </div>
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;
