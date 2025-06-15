import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MuscleGroup {
  name: string;
  frequency: number;
  recovery: number;
  priority: 'high' | 'medium' | 'low';
}

const FrequencyCalculator = () => {
  const [level, setLevel] = useState<string>('');
  const [timeAvailable, setTimeAvailable] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [recoveryCapacity, setRecoveryCapacity] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateFrequency = () => {
    if (!level || !timeAvailable || !objective || !recoveryCapacity) return;

    const baseFrequencies = {
      beginner: { chest: 2, back: 2, legs: 2, shoulders: 2, arms: 2, core: 3 },
      intermediate: { chest: 2, back: 2, legs: 2, shoulders: 2, arms: 2, core: 3 },
      advanced: { chest: 3, back: 3, legs: 2, shoulders: 3, arms: 3, core: 4 }
    };

    const levelKey = level as keyof typeof baseFrequencies;
    let frequencies = { ...baseFrequencies[levelKey] };

    // Ajustements selon l'objectif
    if (objective === 'strength') {
      frequencies.chest += 1;
      frequencies.back += 1;
      frequencies.legs += 1;
    } else if (objective === 'hypertrophy') {
      Object.keys(frequencies).forEach(key => {
        frequencies[key as keyof typeof frequencies] = Math.min(frequencies[key as keyof typeof frequencies] + 1, 4);
      });
    }

    // Ajustements selon la récupération
    if (recoveryCapacity === 'low') {
      Object.keys(frequencies).forEach(key => {
        frequencies[key as keyof typeof frequencies] = Math.max(frequencies[key as keyof typeof frequencies] - 1, 1);
      });
    } else if (recoveryCapacity === 'high') {
      Object.keys(frequencies).forEach(key => {
        frequencies[key as keyof typeof frequencies] = Math.min(frequencies[key as keyof typeof frequencies] + 1, 5);
      });
    }

    // Génération des splits recommandés
    const splits = generateSplitRecommendations(frequencies, parseInt(timeAvailable));

    setResults({
      frequencies,
      totalSessions: Math.ceil(Object.values(frequencies).reduce((a, b) => a + b, 0) / 2),
      splits,
      recommendations: getRecommendations(levelKey, objective)
    });
  };

  const generateSplitRecommendations = (freq: any, daysAvailable: number) => {
    const splits = [];

    if (daysAvailable >= 6) {
      splits.push({
        name: "Push/Pull/Legs (2x)",
        schedule: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Repos"],
        description: "Optimal pour volume élevé et récupération"
      });
    }

    if (daysAvailable >= 4) {
      splits.push({
        name: "Upper/Lower",
        schedule: daysAvailable === 4 
          ? ["Upper", "Lower", "Repos", "Upper", "Lower", "Repos", "Repos"]
          : ["Upper", "Lower", "Repos", "Upper", "Lower", "Repos", "Upper"],
        description: "Équilibre parfait volume/récupération"
      });
    }

    if (daysAvailable >= 3) {
      splits.push({
        name: "Full Body",
        schedule: ["Full Body", "Repos", "Full Body", "Repos", "Full Body", "Repos", "Repos"],
        description: "Idéal débutants et contraintes de temps"
      });
    }

    return splits;
  };

  const getRecommendations = (level: string, obj: string) => {
    const base = {
      beginner: {
        volume: "12-16 sets/muscle/semaine",
        intensity: "Charges modérées (65-80% 1RM)",
        tips: ["Focus technique", "Progression linéaire", "Récupération prioritaire"]
      },
      intermediate: {
        volume: "16-20 sets/muscle/semaine", 
        intensity: "Variation intensité (60-90% 1RM)",
        tips: ["Périodisation", "Exercices variés", "Écoute du corps"]
      },
      advanced: {
        volume: "20-25 sets/muscle/semaine",
        intensity: "Intensité élevée (70-95% 1RM)",
        tips: ["Techniques avancées", "Auto-régulation", "Spécialisation"]
      }
    };

    return base[level as keyof typeof base];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-calendar-week text-primary"></i>
            <span>Calculateur de Fréquence d'Entraînement</span>
          </CardTitle>
          <CardDescription>
            Déterminez la fréquence optimale d'entraînement par groupe musculaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Niveau d'expérience</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner votre niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Débutant (&lt; 1 an)</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire (1-3 ans)</SelectItem>
                  <SelectItem value="advanced">Avancé (&gt; 3 ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Jours disponibles par semaine</Label>
              <Select value={timeAvailable} onValueChange={setTimeAvailable}>
                <SelectTrigger>
                  <SelectValue placeholder="Nombre de jours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 jours</SelectItem>
                  <SelectItem value="4">4 jours</SelectItem>
                  <SelectItem value="5">5 jours</SelectItem>
                  <SelectItem value="6">6 jours</SelectItem>
                  <SelectItem value="7">7 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Objectif principal</Label>
            <RadioGroup value={objective} onValueChange={setObjective} className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="strength" id="strength" />
                  <Label htmlFor="strength" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Force</div>
                      <div className="text-sm text-muted-foreground">Augmenter les charges</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="hypertrophy" id="hypertrophy" />
                  <Label htmlFor="hypertrophy" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Hypertrophie</div>
                      <div className="text-sm text-muted-foreground">Prise de masse musculaire</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="endurance" id="endurance" />
                  <Label htmlFor="endurance" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Endurance</div>
                      <div className="text-sm text-muted-foreground">Capacité de répétition</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Capacité de récupération</Label>
            <Select value={recoveryCapacity} onValueChange={setRecoveryCapacity}>
              <SelectTrigger>
                <SelectValue placeholder="Évaluez votre récupération" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible (stress élevé, peu de sommeil)</SelectItem>
                <SelectItem value="medium">Moyenne (conditions normales)</SelectItem>
                <SelectItem value="high">Excellente (sommeil optimal, stress faible)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculateFrequency} className="w-full" disabled={!level || !timeAvailable || !objective || !recoveryCapacity}>
            <i className="fas fa-calculator mr-2"></i>
            Calculer la Fréquence Optimale
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Frequency Results */}
          <Card>
            <CardHeader>
              <CardTitle>Fréquences Recommandées</CardTitle>
              <CardDescription>
                Nombre de séances par groupe musculaire par semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(results.frequencies).map(([muscle, freq]) => (
                  <div key={muscle} className="p-4 border rounded-lg text-center">
                    <h3 className="font-semibold capitalize">{muscle === 'legs' ? 'Jambes' : muscle === 'chest' ? 'Pectoraux' : muscle === 'back' ? 'Dos' : muscle === 'shoulders' ? 'Épaules' : muscle === 'arms' ? 'Bras' : 'Core'}</h3>
                    <div className="text-2xl font-bold text-primary mt-2">{freq}x</div>
                    <div className="text-sm text-muted-foreground">par semaine</div>
                  </div>
                ))}
              </div>
              <Alert className="mt-4">
                <i className="fas fa-info-circle"></i>
                <AlertDescription>
                  <strong>Total recommandé:</strong> {results.totalSessions} séances par semaine
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Split Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Splits Recommandés</CardTitle>
              <CardDescription>
                Organisation optimale selon vos contraintes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.splits.map((split: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{split.name}</h3>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        Recommandé
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-3">
                      {split.schedule.map((day: string, i: number) => (
                        <div key={i} className={`p-2 text-xs text-center rounded ${
                          day === 'Repos' ? 'bg-gray-100 text-gray-600' : 'bg-primary/10 text-primary'
                        }`}>
                          <div className="font-medium">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                          </div>
                          <div>{day}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{split.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations Détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Volume Hebdomadaire</h4>
                  <p className="text-sm">{results.recommendations.volume}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Intensité</h4>
                  <p className="text-sm">{results.recommendations.intensity}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Conseils Clés</h4>
                  <ul className="text-sm space-y-1">
                    {(results.recommendations.tips as string[]).map((tip, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <i className="fas fa-check text-green-500 text-xs"></i>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Principes de Fréquence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Synthèse Protéique</h4>
              <ul className="space-y-2 text-sm">
                <li>• Pic à 24-48h post-entraînement</li>
                <li>• Retour baseline à 72-96h</li>
                <li>• Fréquence élevée = stimulation constante</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Facteurs Limitants</h4>
              <ul className="space-y-2 text-sm">
                <li>• Capacité de récupération individuelle</li>
                <li>• Volume total hebdomadaire</li>
                <li>• Contraintes de temps et logistique</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequencyCalculator;
