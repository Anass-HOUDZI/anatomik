
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { StorageManager } from '../../utils/StorageManager';
import { useToast } from '../../hooks/use-toast';
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";

interface HydrationResult {
  baseNeeds: number;
  activityBonus: number;
  climateAdjustment: number;
  exerciseBonus: number;
  totalNeeds: number;
  recommendations: string[];
}

const HydrationCalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [climate, setClimate] = useState<'temperate' | 'hot' | 'cold'>('temperate');
  const [exerciseDuration, setExerciseDuration] = useState<number>(0);
  const [result, setResult] = useState<HydrationResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile?.demographics) {
      setWeight(profile.demographics.weight);
      setActivityLevel(profile.demographics.activityLevel);
    }
  }, []);

  const calculateHydration = () => {
    try {
      const baseNeeds = weight * 35;
      
      const activityBonuses = {
        sedentary: 0,
        light: 300,
        moderate: 500,
        active: 700,
        very_active: 1000
      };
      
      const activityBonus = activityBonuses[activityLevel as keyof typeof activityBonuses] || 500;
      
      let climateMultiplier = 1;
      if (climate === 'hot') climateMultiplier = 1.2;
      if (climate === 'cold') climateMultiplier = 0.95;
      
      const climateAdjustment = (baseNeeds + activityBonus) * (climateMultiplier - 1);
      const exerciseBonus = (exerciseDuration / 15) * 150;
      const totalNeeds = Math.round((baseNeeds + activityBonus) * climateMultiplier + exerciseBonus);
      
      const recommendations = [
        `Buvez ${Math.round(totalNeeds / 8)} verres d'eau par jour`,
        `Répartissez sur la journée : ${Math.round(totalNeeds / 12)}ml toutes les heures`,
        exerciseDuration > 0 ? `Hydratation exercice : ${Math.round(exerciseBonus)}ml supplémentaires` : '',
        climate === 'hot' ? 'Augmentez l\'hydratation par temps chaud (+20%)' : '',
        'Surveillez la couleur de vos urines (jaune pâle = bien hydraté)',
        'Buvez avant d\'avoir soif, la soif indique déjà une déshydratation'
      ].filter(Boolean);

      const hydrationResult: HydrationResult = {
        baseNeeds: Math.round(baseNeeds),
        activityBonus,
        climateAdjustment: Math.round(climateAdjustment),
        exerciseBonus: Math.round(exerciseBonus),
        totalNeeds,
        recommendations
      };

      setResult(hydrationResult);

      toast({
        title: "Calcul terminé",
        description: `Vos besoins en eau : ${totalNeeds}ml/jour`,
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
      const trackingData = StorageManager.getTrackingData();
      const hydrationEntry = {
        date: new Date().toISOString().slice(0, 10),
        value: result.totalNeeds,
        unit: 'ml'
      };

      if (!trackingData.hydration) {
        trackingData.hydration = [];
      }
      trackingData.hydration.push(hydrationEntry);

      StorageManager.saveTrackingData(trackingData);

      toast({
        title: "Données sauvegardées",
        description: "Vos besoins en hydratation ont été enregistrés",
      });
    }
  };

  return (
    <ResponsiveContainer className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-foreground mb-1">Calculateur d'Hydratation</h3>
        <p className="text-xs text-muted-foreground">
          Calculez vos besoins quotidiens en eau selon votre profil et activité
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inputs Section */}
        <MobileCard className="bg-card border border-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-edit text-primary"></i>
              <h3 className="text-lg font-semibold text-foreground">Paramètres</h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm font-medium">Poids corporel (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min="40"
                  max="200"
                  step="0.1"
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="text-sm font-medium">Niveau d'activité</Label>
                <select
                  id="activity"
                  className="w-full p-1 border rounded-lg h-8 text-sm"
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

              <div className="space-y-2">
                <Label htmlFor="climate" className="text-sm font-medium">Climat</Label>
                <select
                  id="climate"
                  className="w-full p-1 border rounded-lg h-8 text-sm"
                  value={climate}
                  onChange={(e) => setClimate(e.target.value as any)}
                >
                  <option value="temperate">Tempéré</option>
                  <option value="hot">Chaud</option>
                  <option value="cold">Froid</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercise" className="text-sm font-medium">Durée d'exercice (min/jour)</Label>
                <Input
                  id="exercise"
                  type="number"
                  value={exerciseDuration}
                  onChange={(e) => setExerciseDuration(Number(e.target.value))}
                  min="0"
                  max="480"
                  className="h-8 text-sm"
                />
              </div>

              <div className="border-t border-border pt-3 mt-3">
                <MobileButton onClick={calculateHydration} className="w-full h-8 text-sm mb-2">
                  <span className="mr-1">🧮</span>
                  Appliquer et Calculer
                </MobileButton>
                {result && (
                  <MobileButton onClick={saveResult} variant="outline" className="w-full h-8 text-sm">
                    <span className="mr-1">💾</span>
                    Sauvegarder
                  </MobileButton>
                )}
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Results Section */}
        <MobileCard className="bg-card border border-border">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <i className="fas fa-calculator text-primary"></i>
              <h3 className="text-lg font-semibold text-foreground">Résultats</h3>
            </div>
            
            {!result ? (
              <div className="text-center py-6 text-muted-foreground">
                <i className="fas fa-tint text-2xl mb-2"></i>
                <p className="text-sm">Calculez vos besoins pour voir les résultats</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-muted border border-border rounded-lg p-2">
                  <h4 className="font-medium mb-2 flex items-center text-foreground text-sm">
                    <i className="fas fa-tint text-primary mr-1"></i>
                    Facteurs d'hydratation
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Poids corporel : base 35ml/kg</li>
                    <li>• Activité physique : +300-1000ml</li>
                    <li>• Climat chaud : +20%</li>
                    <li>• Exercice : +150ml/15min</li>
                  </ul>
                </div>

                <div className="bg-muted border border-border rounded-lg p-2">
                  <h4 className="font-medium mb-2 flex items-center text-foreground text-sm">
                    <i className="fas fa-exclamation-triangle text-primary mr-1"></i>
                    Signes de déshydratation
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Urine foncée</li>
                    <li>• Fatigue, maux de tête</li>
                    <li>• Bouche sèche</li>
                    <li>• Diminution performance</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </MobileCard>
      </div>

        {result && (
          <MobileCard className="w-full">
            <div className="p-4 md:p-6">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">
                  💧 Vos besoins en hydratation
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.baseNeeds}ml</div>
                    <div className="text-sm text-blue-800">Besoins de base</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">+{result.activityBonus}ml</div>
                    <div className="text-sm text-green-800">Bonus activité</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {result.exerciseBonus > 0 ? `+${result.exerciseBonus}` : result.exerciseBonus}ml
                    </div>
                    <div className="text-sm text-orange-800">Exercice</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{result.totalNeeds}ml</div>
                    <div className="text-sm text-purple-800">Total/jour</div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-4">💡 Recommandations personnalisées</h4>
                  <div className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1 text-sm">✓</span>
                        <span className="text-blue-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center space-x-4 p-6 bg-white rounded-lg border shadow-sm">
                    <div className="text-4xl font-bold text-blue-600">{Math.round(result.totalNeeds / 250)}</div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Verres d'eau</div>
                      <div className="text-sm text-gray-500">par jour (250ml/verre)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MobileCard>
        )}
    </ResponsiveContainer>
  );
};

export default HydrationCalculator;
