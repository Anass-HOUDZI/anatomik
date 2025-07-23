import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { NutritionCalculations } from '../../services/calculations/nutritionFormulas';
import { StorageManager } from '../../utils/StorageManager';
import { useToast } from '../../hooks/use-toast';

interface ProteinResult {
  dailyNeeds: number;
  perMeal: number;
  perKg: number;
  timing: {
    preWorkout: number;
    postWorkout: number;
    beforeBed: number;
  };
  sources: Array<{
    name: string;
    protein: number;
    serving: string;
    quality: 'excellent' | 'good' | 'moderate';
  }>;
  recommendations: string[];
}

const ProteinCalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(70);
  const [goal, setGoal] = useState<string>('maintenance');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [age, setAge] = useState<number>(30);
  const [dietType, setDietType] = useState<string>('omnivore');
  const [result, setResult] = useState<ProteinResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Charger profil utilisateur
    const profile = StorageManager.getUserProfile();
    if (profile?.demographics) {
      setWeight(profile.demographics.weight);
      setAge(profile.demographics.age);
      setActivityLevel(profile.demographics.activityLevel);
    }
  }, []);

  const calculateProtein = () => {
    try {
      // Besoins de base selon activité et objectif
      const baseNeeds = {
        sedentary: 0.8,
        light: 1.2,
        moderate: 1.6,
        active: 2.0,
        very_active: 2.4
      };

      let multiplier = baseNeeds[activityLevel as keyof typeof baseNeeds] || 1.6;

      // Ajustement selon objectif
      if (goal === 'cutting') {
        multiplier *= 1.3; // +30% en sèche
      } else if (goal === 'bulking') {
        multiplier *= 1.1; // +10% en prise de masse
      }

      // Ajustement âge (besoins augmentent après 65 ans)
      if (age > 65) {
        multiplier *= 1.2;
      }

      const dailyNeeds = Math.round(weight * multiplier);
      const perMeal = Math.round(dailyNeeds / 4); // 4 repas
      const perKg = Math.round(multiplier * 10) / 10;

      // Timing optimal
      const timing = {
        preWorkout: Math.round(dailyNeeds * 0.15), // 15% avant
        postWorkout: Math.round(dailyNeeds * 0.25), // 25% après
        beforeBed: Math.round(dailyNeeds * 0.20)   // 20% avant coucher (caséine)
      };

      // Sources de protéines selon régime
      const proteinSources = {
        omnivore: [
          { name: 'Blanc de poulet', protein: 31, serving: '100g', quality: 'excellent' as const },
          { name: 'Œufs entiers', protein: 13, serving: '2 œufs', quality: 'excellent' as const },
          { name: 'Saumon', protein: 25, serving: '100g', quality: 'excellent' as const },
          { name: 'Bœuf maigre', protein: 26, serving: '100g', quality: 'excellent' as const },
          { name: 'Fromage blanc 0%', protein: 10, serving: '100g', quality: 'good' as const },
          { name: 'Thon en conserve', protein: 25, serving: '100g', quality: 'excellent' as const }
        ],
        vegetarian: [
          { name: 'Œufs entiers', protein: 13, serving: '2 œufs', quality: 'excellent' as const },
          { name: 'Fromage blanc', protein: 10, serving: '100g', quality: 'good' as const },
          { name: 'Lentilles cuites', protein: 9, serving: '100g', quality: 'good' as const },
          { name: 'Quinoa cuit', protein: 4.5, serving: '100g', quality: 'good' as const },
          { name: 'Tofu ferme', protein: 15, serving: '100g', quality: 'good' as const },
          { name: 'Haricots noirs', protein: 9, serving: '100g', quality: 'moderate' as const }
        ],
        vegan: [
          { name: 'Tofu ferme', protein: 15, serving: '100g', quality: 'good' as const },
          { name: 'Tempeh', protein: 19, serving: '100g', quality: 'good' as const },
          { name: 'Lentilles cuites', protein: 9, serving: '100g', quality: 'good' as const },
          { name: 'Pois chiches', protein: 8, serving: '100g', quality: 'moderate' as const },
          { name: 'Quinoa cuit', protein: 4.5, serving: '100g', quality: 'good' as const },
          { name: 'Spiruline', protein: 57, serving: '100g', quality: 'good' as const }
        ]
      };

      const recommendations = [
        `Consommez ${dailyNeeds}g de protéines par jour (${perKg}g/kg)`,
        `Répartissez en 4 repas : ~${perMeal}g par repas`,
        `Post-entraînement : ${timing.postWorkout}g dans les 2h`,
        goal === 'cutting' ? 'En sèche, privilégiez les protéines pour préserver le muscle' : '',
        dietType === 'vegan' ? 'Combinez différentes sources végétales pour un profil complet' : '',
        age > 65 ? 'Après 65 ans, augmentez vos apports (+20%) pour contrer la sarcopénie' : '',
        'Hydratez-vous bien : les protéines augmentent les besoins en eau',
        'Privilégiez les sources complètes (œufs, viande, poisson, quinoa)'
      ].filter(Boolean);

      const proteinResult: ProteinResult = {
        dailyNeeds,
        perMeal,
        perKg,
        timing,
        sources: proteinSources[dietType as keyof typeof proteinSources] || proteinSources.omnivore,
        recommendations
      };

      setResult(proteinResult);

      toast({
        title: "Calcul terminé",
        description: `Vos besoins en protéines : ${dailyNeeds}g/jour`,
      });
    } catch (error) {
      toast({
        title: "Erreur de calcul",
        description: "Vérifiez vos données et réessayez",
        variant: "destructive",
      });
    }
  };

  const saveResult = () => {
    if (result) {
      // Sauvegarder dans le profil nutritionnel
      const profile = StorageManager.getUserProfile();
      
      if (profile) {
        // Update existing profile
        const updatedProfile = {
          ...profile,
          demographics: {
            ...profile.demographics,
            weight: weight,
            age: age,
            activityLevel: activityLevel as any
          }
        };
        StorageManager.saveUserProfile(updatedProfile);
      }
      
      toast({
        title: "Données sauvegardées",
        description: "Vos besoins en protéines ont été enregistrés",
      });
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Calculateur de Protéines</h3>
            <p className="text-muted-foreground">
              Calculez vos besoins en protéines selon vos objectifs et votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Poids corporel (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min="40"
                  max="200"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="age">Âge (années)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min="16"
                  max="80"
                />
              </div>

              <div>
                <Label htmlFor="goal">Objectif</Label>
                <select
                  id="goal"
                  className="w-full p-2 border rounded-md"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  <option value="maintenance">Maintien</option>
                  <option value="cutting">Sèche/Perte de poids</option>
                  <option value="bulking">Prise de masse</option>
                  <option value="performance">Performance sportive</option>
                </select>
              </div>

              <div>
                <Label htmlFor="activity">Niveau d'activité</Label>
                <select
                  id="activity"
                  className="w-full p-2 border rounded-md"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="sedentary">Sédentaire</option>
                  <option value="light">Légèrement actif</option>
                  <option value="moderate">Modérément actif</option>
                  <option value="active">Très actif</option>
                  <option value="very_active">Extrêmement actif</option>
                </select>
              </div>

              <div>
                <Label htmlFor="diet">Type d'alimentation</Label>
                <select
                  id="diet"
                  className="w-full p-2 border rounded-md"
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                >
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Végétarien</option>
                  <option value="vegan">Végétalien</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  <i className="fas fa-dumbbell mr-2"></i>
                  Besoins selon activité
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Sédentaire : 0.8g/kg</li>
                  <li>• Actif : 1.2-1.6g/kg</li>
                  <li>• Très actif : 2.0-2.4g/kg</li>
                  <li>• Sèche : +30% pour préserver muscle</li>
                  <li>• +65 ans : +20% (sarcopénie)</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">
                  <i className="fas fa-clock mr-2"></i>
                  Timing optimal
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Post-entraînement : dans les 2h</li>
                  <li>• Répartition : 4-6 repas/jour</li>
                  <li>• Avant coucher : caséine ou fromage blanc</li>
                  <li>• Pré-entraînement : 15-20g</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={calculateProtein} className="flex-1">
              <i className="fas fa-calculator mr-2"></i>
              Calculer mes besoins
            </Button>
            {result && (
              <Button onClick={saveResult} variant="outline">
                <i className="fas fa-save mr-2"></i>
                Sauvegarder
              </Button>
            )}
          </div>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">
                <i className="fas fa-drumstick-bite mr-2 text-green-500"></i>
                Vos besoins en protéines
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{result.dailyNeeds}g</div>
                  <div className="text-sm text-green-800">Par jour</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{result.perMeal}g</div>
                  <div className="text-sm text-blue-800">Par repas</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{result.perKg}g</div>
                  <div className="text-sm text-purple-800">Par kg de poids</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">{result.timing.preWorkout}g</div>
                  <div className="text-xs text-yellow-800">Pré-entraînement</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{result.timing.postWorkout}g</div>
                  <div className="text-xs text-red-800">Post-entraînement</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">{result.timing.beforeBed}g</div>
                  <div className="text-xs text-indigo-800">Avant coucher</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold mb-4">
              <i className="fas fa-utensils mr-2"></i>
              Sources de protéines recommandées
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.sources.map((source, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    source.quality === 'excellent' ? 'bg-green-50 border-green-200' :
                    source.quality === 'good' ? 'bg-blue-50 border-blue-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="font-semibold">{source.name}</div>
                  <div className="text-2xl font-bold text-gray-800">{source.protein}g</div>
                  <div className="text-sm text-gray-600">pour {source.serving}</div>
                  <div className={`text-xs mt-1 ${
                    source.quality === 'excellent' ? 'text-green-600' :
                    source.quality === 'good' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    Qualité {source.quality === 'excellent' ? 'excellente' : 
                             source.quality === 'good' ? 'bonne' : 'modérée'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold text-blue-900 mb-4">
              <i className="fas fa-lightbulb mr-2"></i>
              Recommandations personnalisées
            </h4>
            <div className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <i className="fas fa-check-circle text-blue-500 mt-1 text-sm"></i>
                  <span className="text-blue-800">{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProteinCalculator;
