import { ArrowLeft, Calculator, TrendingUp, Target, Users, Shield, Zap, Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeaturesProps {
  onBack: () => void;
}

const Features = ({ onBack }: FeaturesProps) => {
  const mainFeatures = [
    {
      icon: Calculator,
      title: "15 Calculateurs Nutritionnels",
      description: "BMR, macronutriments, hydratation, vitamines, minéraux et plus encore avec des formules scientifiques validées.",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
    },
    {
      icon: Target,
      title: "15 Calculateurs d'Entraînement",
      description: "1RM, charges optimales, volume, progression, périodisation et méthodes avancées pour tous niveaux.",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600"
    },
    {
      icon: TrendingUp,
      title: "15 Trackers de Suivi",
      description: "Poids, mensurations, performance, composition corporelle, sommeil et fatigue avec analyses détaillées.",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
    },
    {
      icon: Users,
      title: "15 Générateurs et Planificateurs",
      description: "Programmes d'entraînement, plans nutritionnels, meal prep et routines personnalisées automatiquement.",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
    }
  ];

  const technicalFeatures = [
    {
      icon: Shield,
      title: "Confidentialité Totale",
      description: "Toutes vos données restent sur votre appareil. Aucune transmission vers nos serveurs.",
      color: "bg-red-100 dark:bg-red-900/30 text-red-600"
    },
    {
      icon: Zap,
      title: "Performance Optimale",
      description: "Calculs instantanés, interface fluide et fonctionnement 100% offline après chargement.",
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
    },
    {
      icon: Smartphone,
      title: "Multi-Plateforme",
      description: "Compatible mobile, tablette et desktop avec interface responsive adaptée.",
      color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600"
    },
    {
      icon: Download,
      title: "Installation PWA",
      description: "Installez l'app comme une application native sur tous vos appareils.",
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600"
    }
  ];

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

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Fonctionnalités
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Découvrez tous les outils et fonctionnalités qui font d'Anatomik la plateforme fitness la plus complète et gratuite.
            </p>
          </div>

          {/* Main Categories */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              43 Outils Répartis en 4 Catégories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {mainFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technical Features */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Avantages Techniques
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {technicalFeatures.map((feature, index) => (
                <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${feature.color}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Detailed Features List */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Liste Complète des Outils
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Nutritional Tools */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-600">📊 Calculateurs Nutritionnels</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Calculateur de Besoins Caloriques (BMR/TDEE)</li>
                  <li>• Calculateur de Macronutriments</li>
                  <li>• Calculateur de Prise de Masse</li>
                  <li>• Calculateur de Sèche</li>
                  <li>• Calculateur d'Hydratation</li>
                  <li>• Calculateur de Protéines</li>
                  <li>• Calculateur d'Index Glycémique</li>
                  <li>• Calculateur de Timing Nutritionnel</li>
                  <li>• Calculateur de Suppléments</li>
                  <li>• Calculateur de Ratio Oméga 3/6</li>
                  <li>• Calculateur de Fibres</li>
                  <li>• Calculateur de Sodium</li>
                  <li>• Calculateur de Vitamines</li>
                  <li>• Calculateur de Minéraux</li>
                  <li>• Calculateur de Densité Nutritionnelle</li>
                </ul>
              </div>

              {/* Training Tools */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-600">🏋️ Calculateurs d'Entraînement</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Calculateur de 1RM</li>
                  <li>• Calculateur de Charges</li>
                  <li>• Calculateur de Volume</li>
                  <li>• Calculateur de Progression</li>
                  <li>• Calculateur de Temps de Repos</li>
                  <li>• Calculateur de Fréquence</li>
                  <li>• Calculateur de Périodisation</li>
                  <li>• Calculateur de RM par Zone</li>
                  <li>• Calculateur de Vitesse de Répétition</li>
                  <li>• Calculateur de Drop Sets</li>
                  <li>• Calculateur de Superset</li>
                  <li>• Calculateur de Circuit Training</li>
                  <li>• Calculateur de Cardio HIIT</li>
                  <li>• Calculateur de Récupération</li>
                  <li>• Calculateur de Deload</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à Transformer Votre Entraînement ?</h2>
            <p className="text-xl mb-6 opacity-90">
              Accédez à tous ces outils dès maintenant, gratuitement et sans inscription !
            </p>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-lg px-8 py-3"
              onClick={onBack}
            >
              Commencer Maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;