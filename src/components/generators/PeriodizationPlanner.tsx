
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

interface Period {
  id: string;
  name: string;
  type: 'mass' | 'cut' | 'maintenance';
  duration: number;
  startWeek: number;
  endWeek: number;
  calories: number;
  description: string;
  tips: string[];
}

const PeriodizationPlanner = () => {
  const { toast } = useToast();
  const [totalDuration, setTotalDuration] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [results, setResults] = useState<Period[]>([]);

  const generatePeriodization = () => {
    if (!totalDuration || !primaryGoal || !currentWeight || !experience) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const weeks = parseInt(totalDuration);
    const current = parseFloat(currentWeight);
    const target = targetWeight ? parseFloat(targetWeight) : current;
    
    let periods: Period[] = [];

    if (primaryGoal === 'recomposition') {
      periods = generateRecompositionPlan(weeks, current);
    } else if (primaryGoal === 'mass') {
      periods = generateMassPlan(weeks, current, target);
    } else if (primaryGoal === 'cut') {
      periods = generateCutPlan(weeks, current, target);
    }

    setResults(periods);
    toast({
      title: "Périodisation générée",
      description: `Plan de ${weeks} semaines avec ${periods.length} phases`,
    });
  };

  const generateRecompositionPlan = (weeks: number, weight: number): Period[] => {
    const baseCalories = Math.round(weight * 25); // Estimation simple
    
    if (weeks <= 12) {
      return [
        {
          id: '1',
          name: 'Phase de Recomposition',
          type: 'maintenance',
          duration: weeks,
          startWeek: 1,
          endWeek: weeks,
          calories: baseCalories,
          description: 'Maintien avec focus sur la composition corporelle',
          tips: [
            'Privilégier les protéines (2g/kg)',
            'Entraînement intensif en résistance',
            'Cardio modéré 2-3x/semaine'
          ]
        }
      ];
    }

    return [
      {
        id: '1',
        name: 'Phase de Prise de Masse Légère',
        type: 'mass',
        duration: Math.floor(weeks * 0.6),
        startWeek: 1,
        endWeek: Math.floor(weeks * 0.6),
        calories: baseCalories + 200,
        description: 'Surplus calorique modéré pour gains musculaires',
        tips: [
          'Surplus de 200-300 kcal',
          'Focus sur les exercices composés',
          'Protéines à 2.2g/kg minimum'
        ]
      },
      {
        id: '2',
        name: 'Mini-Sèche',
        type: 'cut',
        duration: Math.ceil(weeks * 0.4),
        startWeek: Math.floor(weeks * 0.6) + 1,
        endWeek: weeks,
        calories: baseCalories - 300,
        description: 'Déficit pour révéler les gains musculaires',
        tips: [
          'Déficit modéré de 300-400 kcal',
          'Maintenir l\'intensité d\'entraînement',
          'Augmenter légèrement le cardio'
        ]
      }
    ];
  };

  const generateMassPlan = (weeks: number, current: number, target: number): Period[] => {
    const baseCalories = Math.round(current * 25);
    const weightGain = target - current;
    
    if (weeks <= 8) {
      return [
        {
          id: '1',
          name: 'Prise de Masse Courte',
          type: 'mass',
          duration: weeks,
          startWeek: 1,
          endWeek: weeks,
          calories: baseCalories + 400,
          description: 'Prise de masse intensive sur courte période',
          tips: [
            'Surplus de 400-500 kcal',
            'Prise de poids cible: 0.5-0.7kg/semaine',
            'Surveiller l\'évolution de la masse grasse'
          ]
        }
      ];
    }

    return [
      {
        id: '1',
        name: 'Phase d\'Accumulation',
        type: 'mass',
        duration: Math.floor(weeks * 0.7),
        startWeek: 1,
        endWeek: Math.floor(weeks * 0.7),
        calories: baseCalories + 300,
        description: 'Construction de masse musculaire progressive',
        tips: [
          'Surplus de 300-400 kcal',
          'Prise de poids: 0.3-0.5kg/semaine',
          'Volume d\'entraînement élevé'
        ]
      },
      {
        id: '2',
        name: 'Phase de Consolidation',
        type: 'maintenance',
        duration: Math.ceil(weeks * 0.3),
        startWeek: Math.floor(weeks * 0.7) + 1,
        endWeek: weeks,
        calories: baseCalories,
        description: 'Stabilisation et préparation éventuelle sèche',
        tips: [
          'Maintien du poids acquis',
          'Focus sur la qualité musculaire',
          'Préparation mentale pour la suite'
        ]
      }
    ];
  };

  const generateCutPlan = (weeks: number, current: number, target: number): Period[] => {
    const baseCalories = Math.round(current * 25);
    const weightLoss = current - target;
    
    if (weeks <= 8) {
      return [
        {
          id: '1',
          name: 'Sèche Courte',
          type: 'cut',
          duration: weeks,
          startWeek: 1,
          endWeek: weeks,
          calories: baseCalories - 400,
          description: 'Déficit soutenu pour perte rapide',
          tips: [
            'Déficit de 400-500 kcal',
            'Perte cible: 0.5-0.7kg/semaine',
            'Protéines élevées pour préserver muscle'
          ]
        }
      ];
    }

    return [
      {
        id: '1',
        name: 'Phase de Sèche Progressive',
        type: 'cut',
        duration: Math.floor(weeks * 0.6),
        startWeek: 1,
        endWeek: Math.floor(weeks * 0.6),
        calories: baseCalories - 300,
        description: 'Déficit modéré pour préserver le muscle',
        tips: [
          'Déficit de 300-400 kcal',
          'Perte: 0.3-0.5kg/semaine',
          'Maintenir l\'intensité d\'entraînement'
        ]
      },
      {
        id: '2',
        name: 'Phase d\'Affûtage',
        type: 'cut',
        duration: Math.floor(weeks * 0.3),
        startWeek: Math.floor(weeks * 0.6) + 1,
        endWeek: Math.floor(weeks * 0.9),
        calories: baseCalories - 500,
        description: 'Déficit plus important pour les derniers kilos',
        tips: [
          'Déficit de 500-600 kcal',
          'Cardio supplémentaire',
          'Surveillance étroite de la récupération'
        ]
      },
      {
        id: '3',
        name: 'Phase de Stabilisation',
        type: 'maintenance',
        duration: Math.ceil(weeks * 0.1),
        startWeek: Math.floor(weeks * 0.9) + 1,
        endWeek: weeks,
        calories: baseCalories - 100,
        description: 'Retour progressif vers le maintien',
        tips: [
          'Remontée calorique progressive',
          'Maintien du poids atteint',
          'Préparation phase suivante'
        ]
      }
    ];
  };

  const getPeriodColor = (type: string) => {
    switch (type) {
      case 'mass': return 'bg-green-100 border-green-300 text-green-800';
      case 'cut': return 'bg-red-100 border-red-300 text-red-800';
      case 'maintenance': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getPeriodIcon = (type: string) => {
    switch (type) {
      case 'mass': return 'fa-chart-line';
      case 'cut': return 'fa-chart-line-down';
      case 'maintenance': return 'fa-minus';
      default: return 'fa-circle';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-calendar-alt text-primary"></i>
            <span>Planificateur de Périodes</span>
          </CardTitle>
          <CardDescription>
            Planifiez vos cycles de masse, sèche et maintien selon vos objectifs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="duration">Durée totale (semaines)</Label>
                <Select value={totalDuration} onValueChange={setTotalDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Durée du plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 semaines</SelectItem>
                    <SelectItem value="12">12 semaines</SelectItem>
                    <SelectItem value="16">16 semaines</SelectItem>
                    <SelectItem value="20">20 semaines</SelectItem>
                    <SelectItem value="24">24 semaines</SelectItem>
                    <SelectItem value="32">32 semaines</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Niveau d'expérience</Label>
                <Select value={experience} onValueChange={setExperience}>
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

              <div>
                <Label htmlFor="weight">Poids actuel (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="70"
                  min="40"
                  max="150"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Objectif principal</Label>
                <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal} className="mt-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="mass" id="mass" />
                      <Label htmlFor="mass" className="cursor-pointer">
                        <div>
                          <div className="font-medium">Prise de Masse</div>
                          <div className="text-sm text-muted-foreground">Développer la masse musculaire</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cut" id="cut" />
                      <Label htmlFor="cut" className="cursor-pointer">
                        <div>
                          <div className="font-medium">Sèche</div>
                          <div className="text-sm text-muted-foreground">Perdre de la graisse</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="recomposition" id="recomp" />
                      <Label htmlFor="recomp" className="cursor-pointer">
                        <div>
                          <div className="font-medium">Recomposition</div>
                          <div className="text-sm text-muted-foreground">Muscle + perte de graisse</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {(primaryGoal === 'mass' || primaryGoal === 'cut') && (
                <div>
                  <Label htmlFor="target">Poids objectif (kg)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    placeholder="75"
                    min="40"
                    max="150"
                  />
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={generatePeriodization} 
            className="w-full"
            disabled={!totalDuration || !primaryGoal || !currentWeight || !experience}
          >
            <i className="fas fa-magic mr-2"></i>
            Générer la Périodisation
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Plan de Périodisation - {totalDuration} Semaines</CardTitle>
              <CardDescription>
                Votre plan personnalisé avec {results.length} phase(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((period, index) => (
                  <div
                    key={period.id}
                    className={`p-4 rounded-lg border-2 ${getPeriodColor(period.type)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <i className={`fas ${getPeriodIcon(period.type)} text-xl`}></i>
                        <div>
                          <h3 className="font-semibold text-lg">{period.name}</h3>
                          <p className="text-sm opacity-75">
                            Semaines {period.startWeek}-{period.endWeek} ({period.duration} semaines)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{period.calories} kcal/jour</div>
                        <div className="text-sm opacity-75">Objectif calorique</div>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{period.description}</p>
                    
                    <div>
                      <h4 className="font-medium mb-2">Conseils clés :</h4>
                      <ul className="text-sm space-y-1">
                        {period.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start space-x-2">
                            <span>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendrier Visuel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {Array.from({ length: parseInt(totalDuration) }, (_, i) => i + 1).map(week => {
                  const currentPeriod = results.find(p => 
                    week >= p.startWeek && week <= p.endWeek
                  );
                  
                  return (
                    <div
                      key={week}
                      className={`p-2 text-center text-xs rounded ${
                        currentPeriod ? getPeriodColor(currentPeriod.type) : 'bg-gray-100'
                      }`}
                      title={currentPeriod?.name}
                    >
                      <div className="font-bold">S{week}</div>
                      {currentPeriod && (
                        <div className="mt-1">
                          <i className={`fas ${getPeriodIcon(currentPeriod.type)}`}></i>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Prise de masse</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span>Sèche</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Maintien</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PeriodizationPlanner;
