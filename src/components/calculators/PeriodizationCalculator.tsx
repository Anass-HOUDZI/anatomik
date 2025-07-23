
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";

interface Phase {
  name: string;
  duration: number;
  intensity: string;
  volume: string;
  focus: string;
  description: string;
}

const PeriodizationCalculator = () => {
  const [objective, setObjective] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [competition, setCompetition] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculatePeriodization = () => {
    if (!objective || !duration || !level) return;

    const totalWeeks = parseInt(duration);
    let phases: Phase[] = [];

    if (objective === 'strength') {
      phases = generateStrengthPeriodization(totalWeeks, level);
    } else if (objective === 'hypertrophy') {
      phases = generateHypertrophyPeriodization(totalWeeks, level);
    } else if (objective === 'competition') {
      phases = generateCompetitionPeriodization(totalWeeks, level);
    }

    const timeline = generateTimeline(phases);
    const deloadWeeks = calculateDeloadWeeks(totalWeeks);

    setResults({
      phases,
      timeline,
      deloadWeeks,
      totalWeeks,
      peakWeek: competition ? parseInt(competition) : totalWeeks
    });
  };

  const generateStrengthPeriodization = (weeks: number, level: string): Phase[] => {
    if (weeks <= 8) {
      return [
        {
          name: "Phase d'Accumulation",
          duration: Math.floor(weeks * 0.6),
          intensity: "70-85% 1RM",
          volume: "Élevé",
          focus: "Volume et technique",
          description: "Construction de la base de force"
        },
        {
          name: "Phase d'Intensification",
          duration: Math.ceil(weeks * 0.4),
          intensity: "85-95% 1RM",
          volume: "Modéré",
          focus: "Force maximale",
          description: "Spécialisation en force pure"
        }
      ];
    }

    return [
      {
        name: "Phase d'Accumulation",
        duration: Math.floor(weeks * 0.4),
        intensity: "65-80% 1RM",
        volume: "Très élevé",
        focus: "Hypertrophie fonctionnelle",
        description: "Développement de la masse musculaire"
      },
      {
        name: "Phase d'Intensification",
        duration: Math.floor(weeks * 0.35),
        intensity: "80-90% 1RM",
        volume: "Élevé",
        focus: "Force-vitesse",
        description: "Transition vers la force spécifique"
      },
      {
        name: "Phase de Réalisation",
        duration: Math.ceil(weeks * 0.25),
        intensity: "90-100% 1RM",
        volume: "Faible",
        focus: "Force maximale",
        description: "Expression de la force maximale"
      }
    ];
  };

  const generateHypertrophyPeriodization = (weeks: number, level: string): Phase[] => {
    return [
      {
        name: "Phase d'Adaptation",
        duration: Math.floor(weeks * 0.25),
        intensity: "60-75% 1RM",
        volume: "Progressif",
        focus: "Adaptation tissulaire",
        description: "Préparation des structures"
      },
      {
        name: "Phase d'Accumulation",
        duration: Math.floor(weeks * 0.5),
        intensity: "65-80% 1RM",
        volume: "Très élevé",
        focus: "Volume maximal",
        description: "Stimulation hypertrophique maximale"
      },
      {
        name: "Phase d'Intensification",
        duration: Math.ceil(weeks * 0.25),
        intensity: "75-85% 1RM",
        volume: "Élevé",
        focus: "Qualité musculaire",
        description: "Consolidation et définition"
      }
    ];
  };

  const generateCompetitionPeriodization = (weeks: number, level: string): Phase[] => {
    return [
      {
        name: "Préparation Générale",
        duration: Math.floor(weeks * 0.4),
        intensity: "60-80% 1RM",
        volume: "Élevé",
        focus: "Base générale",
        description: "Développement des qualités de base"
      },
      {
        name: "Préparation Spécifique",
        duration: Math.floor(weeks * 0.35),
        intensity: "75-90% 1RM",
        volume: "Modéré-élevé",
        focus: "Spécialisation",
        description: "Travail spécifique à la compétition"
      },
      {
        name: "Affûtage",
        duration: Math.floor(weeks * 0.15),
        intensity: "85-95% 1RM",
        volume: "Faible",
        focus: "Forme de pointe",
        description: "Optimisation pour la performance"
      },
      {
        name: "Compétition",
        duration: Math.ceil(weeks * 0.1),
        intensity: "Variable",
        volume: "Minimal",
        focus: "Maintien",
        description: "Expression de la performance"
      }
    ];
  };

  const generateTimeline = (phases: Phase[]) => {
    let currentWeek = 1;
    return phases.map(phase => {
      const startWeek = currentWeek;
      const endWeek = currentWeek + phase.duration - 1;
      currentWeek += phase.duration;
      return {
        ...phase,
        startWeek,
        endWeek,
        weeks: Array.from({ length: phase.duration }, (_, i) => startWeek + i)
      };
    });
  };

  const calculateDeloadWeeks = (totalWeeks: number) => {
    const deloads = [];
    for (let week = 4; week <= totalWeeks; week += 4) {
      if (week < totalWeeks) {
        deloads.push(week);
      }
    }
    return deloads;
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-sync-alt text-primary"></i>
            <span>Calculateur de Périodisation</span>
          </CardTitle>
          <CardDescription>
            Planifiez vos cycles d'entraînement long terme pour optimiser vos résultats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Objectif principal</Label>
              <RadioGroup value={objective} onValueChange={setObjective} className="mt-2">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="strength" id="str" />
                    <Label htmlFor="str" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Force Maximale</div>
                        <div className="text-sm text-muted-foreground">Augmenter votre 1RM</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="hypertrophy" id="hyp" />
                    <Label htmlFor="hyp" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Hypertrophie</div>
                        <div className="text-sm text-muted-foreground">Maximiser la prise de masse</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="competition" id="comp" />
                    <Label htmlFor="comp" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Compétition</div>
                        <div className="text-sm text-muted-foreground">Préparation spécifique</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Durée du cycle (semaines)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durée totale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 semaines</SelectItem>
                    <SelectItem value="12">12 semaines</SelectItem>
                    <SelectItem value="16">16 semaines</SelectItem>
                    <SelectItem value="20">20 semaines</SelectItem>
                    <SelectItem value="24">24 semaines</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="level">Niveau d'expérience</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Débutant</SelectItem>
                    <SelectItem value="intermediate">Intermédiaire</SelectItem>
                    <SelectItem value="advanced">Avancé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {objective === 'competition' && (
                <div>
                  <Label htmlFor="competition">Semaine de compétition</Label>
                  <Input
                    id="competition"
                    type="number"
                    value={competition}
                    onChange={(e) => setCompetition(e.target.value)}
                    placeholder="Ex: 16"
                    min="1"
                    max={duration}
                  />
                </div>
              )}
            </div>
          </div>

          <Button onClick={calculatePeriodization} className="w-full" disabled={!objective || !duration || !level}>
            <i className="fas fa-calendar-alt mr-2"></i>
            Générer la Périodisation
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Timeline Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Vue d'Ensemble - {results.totalWeeks} Semaines</CardTitle>
              <CardDescription>
                Planification complète de votre cycle d'entraînement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.timeline.map((phase: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{phase.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Durée:</span>
                            <span className="ml-1">{phase.duration} semaines</span>
                          </div>
                          <div>
                            <span className="font-medium">Intensité:</span>
                            <span className="ml-1">{phase.intensity}</span>
                          </div>
                          <div>
                            <span className="font-medium">Volume:</span>
                            <span className="ml-1">{phase.volume}</span>
                          </div>
                          <div>
                            <span className="font-medium">Focus:</span>
                            <span className="ml-1">{phase.focus}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          S{phase.startWeek}-{phase.endWeek}
                        </div>
                        <Progress 
                          value={(phase.endWeek / results.totalWeeks) * 100} 
                          className="w-20 mt-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deload Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Semaines de Décharge</CardTitle>
              <CardDescription>
                Planification de la récupération active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Semaines de Deload</h4>
                  <div className="space-y-2">
                    {results.deloadWeeks.map((week: number) => (
                      <div key={week} className="flex items-center space-x-2 p-2 bg-orange-50 rounded">
                        <i className="fas fa-pause text-orange-500"></i>
                        <span>Semaine {week} - Décharge active</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Protocole Deload</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Volume: -40-50% du volume normal</li>
                    <li>• Intensité: -10-20% de l'intensité</li>
                    <li>• Focus: Technique et mobilité</li>
                    <li>• Récupération: Sommeil et nutrition prioritaires</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Calendrier Détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {Array.from({ length: results.totalWeeks }, (_, i) => i + 1).map(week => {
                  const isDeload = results.deloadWeeks.includes(week);
                  const isPeak = week === results.peakWeek;
                  const currentPhase = results.timeline.find((p: any) => 
                    week >= p.startWeek && week <= p.endWeek
                  );
                  
                  return (
                    <div
                      key={week}
                      className={`p-2 text-center text-xs rounded ${
                        isPeak ? 'bg-red-500 text-white' :
                        isDeload ? 'bg-orange-200 text-orange-800' :
                        'bg-primary/10 text-primary'
                      }`}
                    >
                      <div className="font-bold">S{week}</div>
                      {currentPhase && (
                        <div className="truncate" title={currentPhase.name}>
                          {currentPhase.name.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-primary/10 rounded"></div>
                  <span>Phase normale</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-200 rounded"></div>
                  <span>Deload</span>
                </div>
                {results.peakWeek && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Pic de forme</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Principes de Périodisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Syndrome d'Adaptation Générale</h4>
              <ul className="text-sm space-y-1">
                <li>• Alarme: Stress initial</li>
                <li>• Résistance: Adaptation</li>
                <li>• Épuisement: Surentraînement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Spécificité Progressive</h4>
              <ul className="text-sm space-y-1">
                <li>• Général vers spécifique</li>
                <li>• Volume vers intensité</li>
                <li>• Complexe vers simple</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Surcompensation</h4>
              <ul className="text-sm space-y-1">
                <li>• Cycles stress/récupération</li>
                <li>• Amélioration graduelle</li>
                <li>• Timing optimal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodizationCalculator;
