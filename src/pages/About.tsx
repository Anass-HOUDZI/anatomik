import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutProps {
  onBack: () => void;
}

const About = ({ onBack }: AboutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-8 flex items-center gap-2 hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              À propos d'Anatomik
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Votre plateforme complète de musculation et nutrition, entièrement gratuite et fonctionnant 100% côté client.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Notre Mission</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Démocratiser l'accès aux outils professionnels de fitness en offrant 60 calculateurs et trackers gratuits, 
              basés sur la science et fonctionnant entièrement dans votre navigateur.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Nous croyons que chacun mérite d'avoir accès aux meilleurs outils pour atteindre ses objectifs de santé 
              et de forme physique, sans coût ni barrière technologique.
            </p>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🎯 Précision Scientifique</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tous nos calculateurs sont basés sur des formules scientifiquement validées et des références 
                de la littérature sportive moderne.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🔒 Confidentialité Totale</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Vos données restent sur votre appareil. Aucune information personnelle n'est transmise 
                ou stockée sur nos serveurs.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">⚡ Performance Optimale</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Fonctionnement 100% offline après le premier chargement, avec des calculs instantanés 
                et une interface ultra-responsive.
              </p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🆓 Gratuité Permanente</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tous nos outils resteront toujours gratuits, sans publicité intrusive ni limitations 
                artificielles de fonctionnalités.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Anatomik en chiffres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">43</div>
                <div className="text-sm opacity-90">Outils Gratuits</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="text-sm opacity-90">Catégories</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">Côté Client</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0€</div>
                <div className="text-sm opacity-90">Pour Toujours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;