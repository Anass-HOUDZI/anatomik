
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RMZone {
  reps: number;
  percentage: number;
  weight: number;
  applications: string[];
  restTime: string;
  sets: string;
}

const RMZoneCalculator = () => {
  const [oneRM, setOneRM] = useState<string>('');
  const [exercise, setExercise] = useState<string>('');
  const [targetReps, setTargetReps] = useState<string>('');
  const [results, setResults] = useState<RMZone[] | null>(null);

  const calculateRMZones = () => {
    const max = parseFloat(oneRM);
    if (!max || max <= 0) return;

    const zones: RMZone[] = [
      {
        reps: 1,
        percentage: 100,
        weight: max,
        applications: ['Test force maximale', 'Compétition powerlifting', 'Évaluation'],
        restTime: '5+ minutes',
        sets: '1-3'
      },
      {
        reps: 2,
        percentage: 95,
        weight: Math.round(max * 0.95 * 4) / 4,
        applications: ['Force pure', 'Préparation compétition', 'Pics d\'intensité'],
        restTime: '4-5 minutes',
        sets: '2-4'
      },
      {
        reps: 3,
        percentage: 90,
        weight: Math.round(max * 0.90 * 4) / 4,
        applications: ['Force maximale', 'Powerlifting', 'Affûtage'],
        restTime: '3-5 minutes',
        sets: '3-5'
      },
      {
        reps: 5,
        percentage: 85,
        weight: Math.round(max * 0.85 * 4) / 4,
        applications: ['Force fonctionnelle', 'Base powerlifting', 'Progression'],
        restTime: '3-4 minutes',
        sets: '3-5'
      },
      {
        reps: 8,
        percentage: 80,
        weight: Math.round(max * 0.80 * 4) / 4,
        applications: ['Force-hypertrophie', 'Polyvalence', 'Débutants force'],
        restTime: '2-3 minutes',
        sets: '3-5'
      },
      {
        reps: 10,
        percentage: 75,
        weight: Math.round(max * 0.75 * 4) / 4,
        applications: ['Hypertrophie', 'Volume d\'entraînement', 'Progression technique'],
        restTime: '2-3 minutes',
        sets: '3-6'
      },
      {
        reps: 12,
        percentage: 70,
        weight: Math.round(max * 0.70 * 4) / 4,
        applications: ['Hypertrophie pure', 'Congestion', 'Débutants'],
        restTime: '1-3 minutes',
        sets: '3-6'
      },
      {
        reps: 15,
        percentage: 65,
        weight: Math.round(max * 0.65 * 4) / 4,
        applications: ['Endurance de force', 'Définition', 'Récupération active'],
        restTime: '1-2 minutes',
        sets: '2-4'
      },
      {
        reps: 20,
        percentage: 60,
        weight: Math.round(max * 0.60 * 4) / 4,
        applications: ['Endurance musculaire', 'Échauffement lourd', 'Décharge'],
        restTime: '1-2 minutes',
        sets: '2-3'
      }
    ];

    setResults(zones);
  };

  const getExerciseSpecificTips = (exerciseType: string) => {
    const tips = {
      squat: {
        safety: 'Utilisez toujours des barres de sécurité pour les charges lourdes',
        technique: 'Descendez jusqu\'à parallèle minimum, contrôlez la montée',
        progression: 'Augmentez de 2.5-5kg selon votre niveau'
      },
      bench: {
        safety: 'Partenaire obligatoire ou barres de sécurité pour +85%',
        technique: 'Rétraction scapulaire, pieds au sol, trajectoire oblique',
        progression: 'Augmentez de 1.25-2.5kg, travaillez les points faibles'
      },
      deadlift: {
        safety: 'Échauffement progressif indispensable, technique prioritaire',
        technique: 'Dos neutre, hanches en arrière, tirage vertical',
        progression: 'Augmentez de 2.5-5kg, variez les variantes'
      },
      ohp: {
        safety: 'Rack à hauteur appropriée, trajectoire verticale stricte',
        technique: 'Core engagé, coudes sous la barre, pleine extension',
        progression: 'Progression plus lente, utilisez micro-charges'
      }
    };
    
    return tips[exerciseType as keyof typeof tips] || {
      safety: 'Respectez votre technique et écoutez votre corps',
      technique: 'Maîtrisez le mouvement avant d\'augmenter la charge',
      progression: 'Progression graduelle et constante'
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-layer-group text-primary"></i>
            <span>Calculateur RM par Zone</span>
          </CardTitle>
          <CardDescription>
            Calculez vos charges pour différentes zones de répétitions selon votre 1RM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="oneRM">1RM actuel (kg)</Label>
              <Input
                id="oneRM"
                type="number"
                value={oneRM}
                onChange={(e) => setOneRM(e.target.value)}
                placeholder="Ex: 100"
                step="0.25"
              />
            </div>
            <div>
              <Label htmlFor="exercise">Exercice</Label>
              <Select value={exercise} onValueChange={setExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'exercice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squat">Squat</SelectItem>
                  <SelectItem value="bench">Développé couché</SelectItem>
                  <SelectItem value="deadlift">Soulevé de terre</SelectItem>
                  <SelectItem value="ohp">Développé militaire</SelectItem>
                  <SelectItem value="other">Autre exercice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetReps">Zone cible (optionnel)</Label>
              <Select value={targetReps} onValueChange={setTargetReps}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1RM (100%)</SelectItem>
                  <SelectItem value="3">3RM (90%)</SelectItem>
                  <SelectItem value="5">5RM (85%)</SelectItem>
                  <SelectItem value="8">8RM (80%)</SelectItem>
                  <SelectItem value="10">10RM (75%)</SelectItem>
                  <SelectItem value="12">12RM (70%)</SelectItem>
                  <SelectItem value="15">15RM (65%)</SelectItem>
                  <SelectItem value="20">20RM (60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={calculateRMZones} className="w-full" disabled={!oneRM}>
            <i className="fas fa-calculator mr-2"></i>
            Calculer les Zones RM
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Référence Rapide</CardTitle>
              <CardDescription>
                Table complète des RM basée sur votre 1RM de {oneRM}kg
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((zone) => (
                  <div 
                    key={zone.reps}
                    className={`p-4 border rounded-lg ${
                      targetReps && parseInt(targetReps) === zone.reps 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-2xl font-bold text-primary">{zone.reps}RM</div>
                      <div className="text-lg font-semibold">{zone.weight}kg</div>
                      <div className="text-sm text-muted-foreground">{zone.percentage}% du 1RM</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Séries:</span>
                        <span className="font-medium">{zone.sets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Repos:</span>
                        <span className="font-medium">{zone.restTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Applications par Zone</CardTitle>
              <CardDescription>
                Utilisations spécifiques et objectifs de chaque zone RM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((zone) => (
                  <div key={zone.reps} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">
                        {zone.reps}RM - {zone.weight}kg ({zone.percentage}%)
                      </h3>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {zone.sets} séries × {zone.restTime}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Applications:</h4>
                        <ul className="space-y-1">
                          {zone.applications.map((app, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <i className="fas fa-check text-green-500 text-xs"></i>
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Objectifs:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {zone.reps <= 3 && (
                            <>
                              <li>• Force maximale</li>
                              <li>• Coordination neuromusculaire</li>
                              <li>• Préparation compétition</li>
                            </>
                          )}
                          {zone.reps > 3 && zone.reps <= 8 && (
                            <>
                              <li>• Force fonctionnelle</li>
                              <li>• Progression générale</li>
                              <li>• Base de puissance</li>
                            </>
                          )}
                          {zone.reps > 8 && zone.reps <= 12 && (
                            <>
                              <li>• Hypertrophie optimale</li>
                              <li>• Volume d'entraînement</li>
                              <li>• Congestion musculaire</li>
                            </>
                          )}
                          {zone.reps > 12 && (
                            <>
                              <li>• Endurance de force</li>
                              <li>• Récupération active</li>
                              <li>• Définition musculaire</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Fréquence:</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          {zone.reps <= 3 && (
                            <>
                              <li>• 1-2x par semaine max</li>
                              <li>• Récupération complète</li>
                              <li>• Supervision recommandée</li>
                            </>
                          )}
                          {zone.reps > 3 && zone.reps <= 8 && (
                            <>
                              <li>• 2-3x par semaine</li>
                              <li>• Base progression</li>
                              <li>• Polyvalence élevée</li>
                            </>
                          )}
                          {zone.reps > 8 && (
                            <>
                              <li>• 2-4x par semaine</li>
                              <li>• Volume important</li>
                              <li>• Récupération rapide</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exercise-Specific Tips */}
          {exercise && exercise !== 'other' && (
            <Card>
              <CardHeader>
                <CardTitle>Conseils Spécifiques - {exercise.charAt(0).toUpperCase() + exercise.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const tips = getExerciseSpecificTips(exercise);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <i className="fas fa-shield-alt text-orange-500 mr-2"></i>
                          Sécurité
                        </h4>
                        <p className="text-sm">{tips.safety}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <i className="fas fa-cogs text-blue-500 mr-2"></i>
                          Technique
                        </h4>
                        <p className="text-sm">{tips.technique}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center">
                          <i className="fas fa-chart-line text-green-500 mr-2"></i>
                          Progression
                        </h4>
                        <p className="text-sm">{tips.progression}</p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Target Zone Highlight */}
          {targetReps && (
            <Alert>
              <i className="fas fa-target"></i>
              <AlertDescription>
                <strong>Zone ciblée {targetReps}RM:</strong> Travaillez à {results.find(z => z.reps === parseInt(targetReps))?.weight}kg 
                ({results.find(z => z.reps === parseInt(targetReps))?.percentage}% de votre 1RM) pour atteindre vos objectifs spécifiques.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Guide d'Utilisation des Zones RM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Conseils Généraux</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span>Retestez votre 1RM toutes les 8-12 semaines</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span>Ajustez selon votre forme du jour (-5-10% si fatigué)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-lightbulb text-yellow-500 mt-1"></i>
                  <span>Variez les zones selon vos cycles d'entraînement</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Périodisation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-sync-alt text-blue-500 mt-1"></i>
                  <span>Débutants: Focus 8-12RM pendant 8-12 semaines</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-sync-alt text-blue-500 mt-1"></i>
                  <span>Intermédiaires: Alternez 5-8RM et 8-12RM</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-sync-alt text-blue-500 mt-1"></i>
                  <span>Avancés: Intégrez toutes les zones selon objectifs</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RMZoneCalculator;
