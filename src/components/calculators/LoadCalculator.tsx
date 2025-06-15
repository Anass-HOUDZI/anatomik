
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface LoadZone {
  name: string;
  percentage: [number, number];
  reps: string;
  description: string;
  color: string;
}

const trainingZones: LoadZone[] = [
  {
    name: "Force Maximale",
    percentage: [90, 100],
    reps: "1-3",
    description: "Développement de la force pure, coordination neuromusculaire",
    color: "bg-red-500"
  },
  {
    name: "Force",
    percentage: [85, 90],
    reps: "3-5",
    description: "Force fonctionnelle, transfert vers autres exercices",
    color: "bg-orange-500"
  },
  {
    name: "Force-Hypertrophie",
    percentage: [80, 85],
    reps: "5-8",
    description: "Zone mixte force et volume, idéale pour progression",
    color: "bg-yellow-500"
  },
  {
    name: "Hypertrophie",
    percentage: [65, 80],
    reps: "8-15",
    description: "Croissance musculaire optimale, volume d'entraînement",
    color: "bg-green-500"
  },
  {
    name: "Endurance de Force",
    percentage: [50, 65],
    reps: "15-25",
    description: "Capacité de répétition, congestion musculaire",
    color: "bg-blue-500"
  }
];

const LoadCalculator = () => {
  const [oneRM, setOneRM] = useState<string>('');
  const [targetZone, setTargetZone] = useState<string>('');
  const [customPercentage, setCustomPercentage] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateLoads = () => {
    const max = parseFloat(oneRM);
    if (!max || max <= 0) return;

    const allZones = trainingZones.map(zone => ({
      ...zone,
      weights: [
        Math.round(max * zone.percentage[0] / 100 * 4) / 4, // Round to nearest 1.25kg
        Math.round(max * zone.percentage[1] / 100 * 4) / 4
      ]
    }));

    const percentageTable = [];
    for (let i = 50; i <= 100; i += 5) {
      percentageTable.push({
        percentage: i,
        weight: Math.round(max * i / 100 * 4) / 4,
        estimatedReps: getEstimatedReps(i)
      });
    }

    setResults({
      oneRM: max,
      zones: allZones,
      percentageTable,
      customWeight: customPercentage ? Math.round(max * parseFloat(customPercentage) / 100 * 4) / 4 : null
    });
  };

  const getEstimatedReps = (percentage: number): string => {
    if (percentage >= 95) return "1-2";
    if (percentage >= 90) return "2-3";
    if (percentage >= 85) return "3-5";
    if (percentage >= 80) return "5-8";
    if (percentage >= 70) return "8-12";
    if (percentage >= 60) return "12-18";
    return "18+";
  };

  const getZoneRecommendations = (zoneName: string) => {
    const recommendations = {
      "Force Maximale": {
        sets: "3-5 séries",
        rest: "3-5 minutes",
        frequency: "2-3x/semaine max",
        tips: ["Échauffement prolongé obligatoire", "Technique parfaite", "Partenaire recommandé"]
      },
      "Force": {
        sets: "3-6 séries",
        rest: "2-4 minutes",
        frequency: "2-4x/semaine",
        tips: ["Base solide pour progression", "Bon compromis force/volume", "Excellents transferts"]
      },
      "Force-Hypertrophie": {
        sets: "3-5 séries",
        rest: "2-3 minutes",
        frequency: "2-3x/semaine",
        tips: ["Zone polyvalente", "Progression linéaire facile", "Idéal intermédiaires"]
      },
      "Hypertrophie": {
        sets: "3-6 séries",
        rest: "1-3 minutes",
        frequency: "2-3x/semaine",
        tips: ["Volume total important", "Tempo contrôlé", "Congestion recherchée"]
      },
      "Endurance de Force": {
        sets: "2-4 séries",
        rest: "1-2 minutes",
        frequency: "2-3x/semaine",
        tips: ["Décharge active", "Amélioration récupération", "Travail mental"]
      }
    };
    return recommendations[zoneName as keyof typeof recommendations];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-percent text-primary"></i>
            <span>Calculateur de Charges d'Entraînement</span>
          </CardTitle>
          <CardDescription>
            Déterminez vos charges de travail selon votre 1RM et vos objectifs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="oneRM">1RM (kg)</Label>
              <Input
                id="oneRM"
                type="number"
                value={oneRM}
                onChange={(e) => setOneRM(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>
            <div>
              <Label htmlFor="targetZone">Zone d'entraînement cible</Label>
              <Select value={targetZone} onValueChange={setTargetZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  {trainingZones.map((zone) => (
                    <SelectItem key={zone.name} value={zone.name}>
                      {zone.name} ({zone.percentage[0]}-{zone.percentage[1]}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="customPercentage">Pourcentage personnalisé (%)</Label>
              <Input
                id="customPercentage"
                type="number"
                value={customPercentage}
                onChange={(e) => setCustomPercentage(e.target.value)}
                placeholder="Ex: 75"
                min="1"
                max="100"
              />
            </div>
          </div>
          
          <Button onClick={calculateLoads} className="w-full" disabled={!oneRM}>
            <i className="fas fa-calculator mr-2"></i>
            Calculer les Charges
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Training Zones */}
          <Card>
            <CardHeader>
              <CardTitle>Zones d'Entraînement</CardTitle>
              <CardDescription>
                Charges recommandées par zone d'intensité (1RM: {results.oneRM}kg)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.zones.map((zone: any) => (
                  <div 
                    key={zone.name}
                    className={`p-4 rounded-lg border-2 ${
                      targetZone === zone.name ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-4 h-4 rounded ${zone.color}`}></div>
                      <h3 className="font-semibold">{zone.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Intensité:</span>
                        <span className="font-medium">{zone.percentage[0]}-{zone.percentage[1]}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charge:</span>
                        <span className="font-medium">{zone.weights[0]}-{zone.weights[1]}kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Répétitions:</span>
                        <span className="font-medium">{zone.reps}</span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-2">
                        {zone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Target Zone Details */}
          {targetZone && (
            <Card>
              <CardHeader>
                <CardTitle>Recommandations - {targetZone}</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const recs = getZoneRecommendations(targetZone);
                  return recs ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Nombre de séries:</span>
                          <span className="ml-2">{recs.sets}</span>
                        </div>
                        <div>
                          <span className="font-medium">Temps de repos:</span>
                          <span className="ml-2">{recs.rest}</span>
                        </div>
                        <div>
                          <span className="font-medium">Fréquence:</span>
                          <span className="ml-2">{recs.frequency}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Conseils pratiques:</h4>
                        <ul className="space-y-1 text-sm">
                          {recs.tips.map((tip, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <i className="fas fa-check text-green-500 text-xs"></i>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          {/* Percentage Table */}
          <Card>
            <CardHeader>
              <CardTitle>Table des Pourcentages</CardTitle>
              <CardDescription>
                Charges précises par pourcentage du 1RM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {results.percentageTable.map((row: any) => (
                  <div 
                    key={row.percentage}
                    className={`p-3 rounded border text-center ${
                      customPercentage && parseInt(customPercentage) === row.percentage 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border'
                    }`}
                  >
                    <div className="font-bold text-lg">{row.percentage}%</div>
                    <div className="text-xl font-semibold text-primary">{row.weight}kg</div>
                    <div className="text-xs text-muted-foreground">{row.estimatedReps} reps</div>
                  </div>
                ))}
              </div>
              
              {results.customWeight && (
                <Alert className="mt-4">
                  <i className="fas fa-target"></i>
                  <AlertDescription>
                    <strong>Charge personnalisée:</strong> {customPercentage}% = {results.customWeight}kg
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Guide d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Conseils Généraux</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span>Commencez toujours par un échauffement progressif</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span>Ajustez selon votre forme du jour (-5% si fatigué)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span>Privilégiez la technique sur la charge absolue</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Progression</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-arrow-up text-green-500 mt-1"></i>
                  <span>Augmentez de 2.5-5kg quand vous atteignez le haut de la fourchette</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-arrow-up text-green-500 mt-1"></i>
                  <span>Retestez votre 1RM toutes les 8-12 semaines</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-arrow-up text-green-500 mt-1"></i>
                  <span>Variez les zones selon vos cycles d'entraînement</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadCalculator;
