
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TempoPattern {
  name: string;
  eccentric: number;
  pause1: number;
  concentric: number;
  pause2: number;
  total: number;
  objective: string;
  description: string;
  exercises: string[];
}

const TempoCalculator = () => {
  const [exercise, setExercise] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [sets, setSets] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const tempoPatterns: TempoPattern[] = [
    {
      name: "Force Explosive",
      eccentric: 2,
      pause1: 0,
      concentric: 1,
      pause2: 0,
      total: 3,
      objective: "power",
      description: "Maximise la vitesse concentrique et la puissance",
      exercises: ["Squat", "Développé couché", "Soulevé de terre"]
    },
    {
      name: "Force Maximale",
      eccentric: 3,
      pause1: 1,
      concentric: 1,
      pause2: 0,
      total: 5,
      objective: "strength",
      description: "Contrôle et stabilité pour charges lourdes",
      exercises: ["Squat", "Développé couché", "Développé militaire"]
    },
    {
      name: "Hypertrophie Standard",
      eccentric: 3,
      pause1: 1,
      concentric: 2,
      pause2: 1,
      total: 7,
      objective: "hypertrophy",
      description: "Temps sous tension optimal pour la croissance",
      exercises: ["Développé incliné", "Tractions", "Dips"]
    },
    {
      name: "Hypertrophie Intensive",
      eccentric: 4,
      pause1: 2,
      concentric: 2,
      pause2: 1,
      total: 9,
      objective: "hypertrophy",
      description: "TUT maximal pour stimulation métabolique",
      exercises: ["Curl biceps", "Extensions triceps", "Élévations latérales"]
    },
    {
      name: "Endurance Contrôlée",
      eccentric: 2,
      pause1: 0,
      concentric: 2,
      pause2: 0,
      total: 4,
      objective: "endurance",
      description: "Rythme soutenu pour endurance musculaire",
      exercises: ["Pompes", "Squats air", "Fentes"]
    },
    {
      name: "Technique/Apprentissage",
      eccentric: 5,
      pause1: 2,
      concentric: 3,
      pause2: 1,
      total: 11,
      objective: "technique",
      description: "Contrôle maximal pour maîtrise du mouvement",
      exercises: ["Tous exercices complexes"]
    }
  ];

  const calculateTempo = () => {
    if (!exercise || !objective || !reps || !sets) return;

    const relevantPatterns = tempoPatterns.filter(pattern => 
      pattern.objective === objective || objective === 'mixed'
    );

    const repCount = parseInt(reps);
    const setCount = parseInt(sets);

    const calculations = relevantPatterns.map(pattern => {
      const tutPerRep = pattern.total;
      const tutPerSet = tutPerRep * repCount;
      const totalTut = tutPerSet * setCount;
      
      return {
        ...pattern,
        tutPerRep,
        tutPerSet,
        totalTut,
        restSuggestion: getTutBasedRest(tutPerSet, objective),
        loadAdjustment: getLoadAdjustment(pattern, objective)
      };
    });

    const recommended = getRecommendedPattern(calculations, objective, level);

    setResults({
      patterns: calculations,
      recommended,
      generalAdvice: getGeneralAdvice(objective, exercise)
    });
  };

  const getTutBasedRest = (tutPerSet: number, obj: string) => {
    if (obj === 'power') return '3-5 minutes';
    if (obj === 'strength') return '2-4 minutes';
    if (tutPerSet > 60) return '2-3 minutes';
    if (tutPerSet > 40) return '1.5-2.5 minutes';
    return '1-2 minutes';
  };

  const getLoadAdjustment = (pattern: TempoPattern, obj: string) => {
    if (pattern.total <= 4) return '85-95% charge normale';
    if (pattern.total <= 6) return '80-90% charge normale';
    if (pattern.total <= 8) return '70-85% charge normale';
    return '60-80% charge normale';
  };

  const getRecommendedPattern = (patterns: any[], obj: string, lvl: string) => {
    if (obj === 'power') return patterns[0];
    if (obj === 'strength') return patterns.find(p => p.name.includes('Force'));
    if (obj === 'hypertrophy') {
      return lvl === 'beginner' 
        ? patterns.find(p => p.name === 'Hypertrophie Standard')
        : patterns.find(p => p.name === 'Hypertrophie Intensive');
    }
    return patterns[0];
  };

  const getGeneralAdvice = (obj: string, ex: string) => {
    const advice = {
      power: [
        "Concentrez-vous sur la vitesse concentrique maximale",
        "Utilisez des charges de 70-85% pour optimiser la puissance",
        "Repos complets entre séries (3-5 minutes minimum)"
      ],
      strength: [
        "Contrôlez parfaitement la phase excentrique",
        "Marquez une pause en position basse pour éliminer l'effet rebond",
        "Maintenez la tension tout au long du mouvement"
      ],
      hypertrophy: [
        "Le TUT est plus important que la charge absolue",
        "Ressentez la tension dans le muscle cible",
        "Ajustez le tempo selon votre niveau de fatigue"
      ],
      endurance: [
        "Maintenez un rythme constant et contrôlé",
        "Focus sur la technique même en fin de série",
        "Repos courts pour maintenir la challenge métabolique"
      ]
    };

    return advice[obj as keyof typeof advice] || advice.hypertrophy;
  };

  const formatTempo = (pattern: TempoPattern) => {
    return `${pattern.eccentric}-${pattern.pause1}-${pattern.concentric}-${pattern.pause2}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-clock text-primary"></i>
            <span>Calculateur de Tempo d'Exécution</span>
          </CardTitle>
          <CardDescription>
            Optimisez le rythme d'exécution selon vos objectifs d'entraînement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="exercise">Type d'exercice</Label>
                <Select value={exercise} onValueChange={setExercise}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'exercice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compound">Exercice polyarticulaire</SelectItem>
                    <SelectItem value="isolation">Exercice d'isolation</SelectItem>
                    <SelectItem value="upper">Haut du corps</SelectItem>
                    <SelectItem value="lower">Bas du corps</SelectItem>
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
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="reps">Répétitions par série</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Ex: 10"
                  min="1"
                  max="30"
                />
              </div>

              <div>
                <Label htmlFor="sets">Nombre de séries</Label>
                <Input
                  id="sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="Ex: 4"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Objectif principal</Label>
            <RadioGroup value={objective} onValueChange={setObjective} className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="power" id="power" />
                  <Label htmlFor="power" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Puissance</div>
                      <div className="text-sm text-muted-foreground">Vitesse maximale</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="strength" id="str" />
                  <Label htmlFor="str" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Force</div>
                      <div className="text-sm text-muted-foreground">Contrôle et stabilité</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="hypertrophy" id="hyp" />
                  <Label htmlFor="hyp" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Hypertrophie</div>
                      <div className="text-sm text-muted-foreground">Temps sous tension</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="endurance" id="end" />
                  <Label htmlFor="end" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Endurance</div>
                      <div className="text-sm text-muted-foreground">Capacité de répétition</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="technique" id="tech" />
                  <Label htmlFor="tech" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Technique</div>
                      <div className="text-sm text-muted-foreground">Apprentissage</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="cursor-pointer">
                    <div>
                      <div className="font-medium">Mixte</div>
                      <div className="text-sm text-muted-foreground">Voir toutes options</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={calculateTempo} className="w-full" disabled={!exercise || !objective || !reps || !sets}>
            <i className="fas fa-stopwatch mr-2"></i>
            Calculer le Tempo Optimal
          </Button>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Recommended Pattern */}
          {results.recommended && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <i className="fas fa-star text-yellow-500"></i>
                  <span>Tempo Recommandé</span>
                </CardTitle>
                <CardDescription>
                  Pattern optimal pour votre objectif et niveau
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 border-2 border-primary rounded-lg bg-primary/5">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{results.recommended.name}</h3>
                    <div className="text-4xl font-mono font-bold text-primary mb-2">
                      {formatTempo(results.recommended)}
                    </div>
                    <p className="text-muted-foreground">{results.recommended.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{results.recommended.eccentric}s</div>
                      <div className="text-sm text-red-800">Excentrique</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{results.recommended.pause1}s</div>
                      <div className="text-sm text-orange-800">Pause basse</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{results.recommended.concentric}s</div>
                      <div className="text-sm text-green-800">Concentrique</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{results.recommended.pause2}s</div>
                      <div className="text-sm text-blue-800">Pause haute</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">TUT par série</h4>
                      <div className="text-xl font-bold text-primary">{results.recommended.tutPerSet}s</div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">TUT total</h4>
                      <div className="text-xl font-bold text-primary">{results.recommended.totalTut}s</div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">Repos suggéré</h4>
                      <div className="text-lg font-medium">{results.recommended.restSuggestion}</div>
                    </div>
                  </div>

                  <Alert className="mt-4">
                    <i className="fas fa-weight-hanging"></i>
                    <AlertDescription>
                      <strong>Ajustement de charge:</strong> {results.recommended.loadAdjustment}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Patterns Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparaison des Tempos</CardTitle>
              <CardDescription>
                Tous les patterns disponibles pour votre objectif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.patterns.map((pattern: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 border rounded-lg ${
                      pattern.name === results.recommended?.name ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{pattern.name}</h3>
                        <div className="text-lg font-mono font-bold text-primary">
                          {formatTempo(pattern)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">TUT total</div>
                        <div className="text-xl font-bold">{pattern.totalTut}s</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-muted-foreground">{pattern.description}</p>
                      </div>
                      <div>
                        <span className="font-medium">Charge:</span>
                        <p className="text-muted-foreground">{pattern.loadAdjustment}</p>
                      </div>
                      <div>
                        <span className="font-medium">Repos:</span>
                        <p className="text-muted-foreground">{pattern.restSuggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Advice */}
          <Card>
            <CardHeader>
              <CardTitle>Conseils d'Application</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Conseils Spécifiques</h4>
                  <ul className="space-y-2">
                    {results.generalAdvice.map((advice: string, i: number) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <i className="fas fa-check text-green-500 mt-1"></i>
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Notation Tempo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1er chiffre:</span>
                      <span>Phase excentrique (descente)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2ème chiffre:</span>
                      <span>Pause en position étirée</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3ème chiffre:</span>
                      <span>Phase concentrique (montée)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4ème chiffre:</span>
                      <span>Pause en position contractée</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Guide du Tempo d'Entraînement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Temps Sous Tension (TUT)</h4>
              <ul className="space-y-1 text-sm">
                <li>• Force: 6-20s par série</li>
                <li>• Hypertrophie: 30-60s par série</li>
                <li>• Endurance: 60s+ par série</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Adaptations Physiologiques</h4>
              <ul className="space-y-1 text-sm">
                <li>• Tempo lent: Hypertrophie myofibrillaire</li>
                <li>• Tempo modéré: Équilibre force/volume</li>
                <li>• Tempo rapide: Puissance et explosivité</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Application Pratique</h4>
              <ul className="space-y-1 text-sm">
                <li>• Utilisez un métronome au début</li>
                <li>• Comptez mentalement une fois habitué</li>
                <li>• Adaptez selon votre niveau de fatigue</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TempoCalculator;
