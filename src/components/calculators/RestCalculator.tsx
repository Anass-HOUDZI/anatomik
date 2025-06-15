
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface RestRecommendation {
  restTime: number;
  restRange: [number, number];
  reasoning: string;
  tips: string[];
  adaptations: string[];
}

interface WorkoutPlan {
  exercises: ExerciseRest[];
  totalWorkoutTime: number;
  efficiencyScore: number;
}

interface ExerciseRest {
  name: string;
  sets: number;
  restTime: number;
  totalTime: number;
  intensity: string;
}

const intensityLevels = [
  { id: 'max', name: 'Maximale (90-100%)', rest: [180, 300], color: 'bg-red-500' },
  { id: 'high', name: 'Élevée (80-90%)', rest: [120, 180], color: 'bg-orange-500' },
  { id: 'moderate', name: 'Modérée (70-80%)', rest: [90, 120], color: 'bg-yellow-500' },
  { id: 'light', name: 'Légère (60-70%)', rest: [60, 90], color: 'bg-green-500' },
  { id: 'endurance', name: 'Endurance (<60%)', rest: [30, 60], color: 'bg-blue-500' }
];

const exerciseTypes = [
  { name: 'Squat', compound: true, large: true },
  { name: 'Soulevé de Terre', compound: true, large: true },
  { name: 'Développé Couché', compound: true, large: false },
  { name: 'Développé Militaire', compound: true, large: false },
  { name: 'Rowing', compound: true, large: false },
  { name: 'Isolation Gros Muscles', compound: false, large: true },
  { name: 'Isolation Petits Muscles', compound: false, large: false }
];

const goals = [
  { id: 'strength', name: 'Force Maximale', restMultiplier: 1.2 },
  { id: 'hypertrophy', name: 'Hypertrophie', restMultiplier: 1.0 },
  { id: 'endurance', name: 'Endurance Musculaire', restMultiplier: 0.6 },
  { id: 'power', name: 'Puissance', restMultiplier: 1.5 },
  { id: 'fat_loss', name: 'Perte de Graisse', restMultiplier: 0.7 }
];

const RestCalculator = () => {
  const [intensity, setIntensity] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('');
  const [goal, setGoal] = useState<string>('');
  const [sets, setSets] = useState<string>('');
  const [timeAvailable, setTimeAvailable] = useState<string>('');
  const [currentSet, setCurrentSet] = useState<string>('1');
  const [fatigue, setFatigue] = useState<string>('normal');
  const [recommendation, setRecommendation] = useState<RestRecommendation | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const calculateRest = () => {
    if (!intensity || !exerciseType || !goal) return;

    const intensityData = intensityLevels.find(i => i.id === intensity);
    const exerciseData = exerciseTypes.find(e => e.name === exerciseType);
    const goalData = goals.find(g => g.id === goal);

    if (!intensityData || !exerciseData || !goalData) return;

    // Base rest time from intensity
    let baseRest = (intensityData.rest[0] + intensityData.rest[1]) / 2;

    // Adjust for exercise type
    if (exerciseData.compound) baseRest *= 1.2;
    if (exerciseData.large) baseRest *= 1.1;

    // Adjust for goal
    baseRest *= goalData.restMultiplier;

    // Adjust for current set
    const setNumber = parseInt(currentSet);
    if (setNumber > 1) {
      baseRest *= (1 + (setNumber - 1) * 0.1); // +10% per set
    }

    // Adjust for fatigue
    const fatigueMultipliers = {
      fresh: 0.9,
      normal: 1.0,
      tired: 1.2,
      exhausted: 1.4
    };
    baseRest *= fatigueMultipliers[fatigue as keyof typeof fatigueMultipliers];

    const finalRest = Math.round(baseRest);
    const restRange: [number, number] = [
      Math.max(30, Math.round(finalRest * 0.8)),
      Math.round(finalRest * 1.2)
    ];

    const tips = [
      "Respirez profondément pendant le repos",
      "Hydratez-vous si nécessaire",
      "Préparez mentalement la série suivante"
    ];

    if (intensity === 'max') {
      tips.push("Considérez un partenaire pour la sécurité");
    }

    if (goal === 'fat_loss') {
      tips.push("Maintenez une activité légère (marche) pendant le repos");
    }

    const adaptations = [];
    if (timeAvailable) {
      const available = parseInt(timeAvailable);
      if (finalRest > available) {
        adaptations.push(`Réduisez à ${available}s si contrainte temps`);
        adaptations.push("Compensez en réduisant légèrement l'intensité");
      }
    }

    setRecommendation({
      restTime: finalRest,
      restRange,
      reasoning: `Basé sur ${intensityData.name.toLowerCase()}, ${exerciseData.name.toLowerCase()}, objectif ${goalData.name.toLowerCase()}`,
      tips,
      adaptations
    });
  };

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setTimerRunning(true);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          clearInterval(interval);
          // Could add audio notification here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateWorkoutPlan = () => {
    if (!sets || !recommendation) return;

    const numSets = parseInt(sets);
    const exerciseTime = 45; // Average time per set (seconds)
    
    const exercises: ExerciseRest[] = [{
      name: exerciseType,
      sets: numSets,
      restTime: recommendation.restTime,
      totalTime: (numSets * exerciseTime) + ((numSets - 1) * recommendation.restTime),
      intensity: intensity
    }];

    const totalTime = exercises.reduce((sum, ex) => sum + ex.totalTime, 0);
    const efficiencyScore = Math.min(100, Math.max(0, 100 - (totalTime - 600) / 10)); // Optimal around 10 mins

    setWorkoutPlan({
      exercises,
      totalWorkoutTime: totalTime,
      efficiencyScore
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-clock text-primary"></i>
            <span>Calculateur de Temps de Repos</span>
          </CardTitle>
          <CardDescription>
            Optimisez vos temps de récupération inter-séries selon l'intensité et vos objectifs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="intensity">Intensité d'entraînement</Label>
              <Select value={intensity} onValueChange={setIntensity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir intensité" />
                </SelectTrigger>
                <SelectContent>
                  {intensityLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="exerciseType">Type d'exercice</Label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir exercice" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseTypes.map((exercise) => (
                    <SelectItem key={exercise.name} value={exercise.name}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal">Objectif principal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Votre objectif" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentSet">Série actuelle</Label>
              <Select value={currentSet} onValueChange={setCurrentSet}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      Série {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fatigue">Niveau de fatigue</Label>
              <Select value={fatigue} onValueChange={setFatigue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh">Frais/Reposé</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="tired">Fatigué</SelectItem>
                  <SelectItem value="exhausted">Épuisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeAvailable">Temps max disponible (sec)</Label>
              <Input
                id="timeAvailable"
                type="number"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                placeholder="180"
              />
            </div>
          </div>
          
          <Button onClick={calculateRest} className="w-full">
            <i className="fas fa-stopwatch mr-2"></i>
            Calculer le Temps de Repos
          </Button>
        </CardContent>
      </Card>

      {recommendation && (
        <>
          {/* Rest Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle>Temps de Repos Recommandé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-primary mb-2">
                  {formatTime(recommendation.restTime)}
                </div>
                <div className="text-lg text-muted-foreground mb-4">
                  Fourchette: {formatTime(recommendation.restRange[0])} - {formatTime(recommendation.restRange[1])}
                </div>
                <p className="text-sm text-muted-foreground italic">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* Timer */}
              <div className="text-center mb-6">
                {!timerRunning ? (
                  <div className="space-x-2">
                    <Button 
                      onClick={() => startTimer(recommendation.restTime)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <i className="fas fa-play mr-2"></i>
                      Démarrer {formatTime(recommendation.restTime)}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => startTimer(recommendation.restRange[0])}
                    >
                      Min ({formatTime(recommendation.restRange[0])})
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => startTimer(recommendation.restRange[1])}
                    >
                      Max ({formatTime(recommendation.restRange[1])})
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl font-bold text-green-600">
                      {formatTime(timeLeft)}
                    </div>
                    <Progress 
                      value={(1 - timeLeft / recommendation.restTime) * 100} 
                      className="w-full max-w-md mx-auto"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setTimerRunning(false);
                        setTimeLeft(0);
                      }}
                    >
                      <i className="fas fa-stop mr-2"></i>
                      Arrêter
                    </Button>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <i className="fas fa-lightbulb text-yellow-500"></i>
                    <span>Conseils pendant le repos</span>
                  </h4>
                  <ul className="space-y-2">
                    {recommendation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <i className="fas fa-check text-green-500 mt-1"></i>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {recommendation.adaptations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <i className="fas fa-adjust text-blue-500"></i>
                      <span>Adaptations possibles</span>
                    </h4>
                    <ul className="space-y-2">
                      {recommendation.adaptations.map((adaptation, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <i className="fas fa-arrow-right text-blue-500 mt-1"></i>
                          <span>{adaptation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Workout Planning */}
          {sets && (
            <Card>
              <CardHeader>
                <CardTitle>Planning de Séance</CardTitle>
                <CardDescription>
                  Estimation du temps total avec {sets} séries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={calculateWorkoutPlan} className="mb-4">
                  <i className="fas fa-calculator mr-2"></i>
                  Calculer le temps total
                </Button>

                {workoutPlan && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {formatTime(workoutPlan.totalWorkoutTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">Temps total</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/10 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">
                          {workoutPlan.exercises[0].sets}
                        </div>
                        <div className="text-sm text-muted-foreground">Séries</div>
                      </div>
                      <div className="text-center p-4 bg-accent/10 rounded-lg">
                        <div className="text-2xl font-bold text-accent">
                          {Math.round(workoutPlan.efficiencyScore)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Efficience</div>
                      </div>
                    </div>

                    <Alert>
                      <i className="fas fa-info-circle"></i>
                      <AlertDescription>
                        Temps estimé incluant 45 secondes par série + repos recommandé entre les séries.
                        {workoutPlan.efficiencyScore < 70 && " Séance potentiellement longue - considérez réduire le repos ou le nombre de séries."}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Scientific Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Références Scientifiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Temps de repos par objectif</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span>Force maximale (90-100%)</span>
                  <Badge className="bg-red-500">3-5 min</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                  <span>Hypertrophie (70-85%)</span>
                  <Badge className="bg-orange-500">1-3 min</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span>Endurance (&lt;70%)</span>
                  <Badge className="bg-green-500">30-90 sec</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span>Puissance</span>
                  <Badge className="bg-blue-500">3-5 min</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Facteurs modulateurs</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-dumbbell text-gray-500 mt-1"></i>
                  <span><strong>Exercices composés:</strong> +20-30% de repos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-user text-gray-500 mt-1"></i>
                  <span><strong>Gros groupes musculaires:</strong> +10-20%</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-thermometer-half text-gray-500 mt-1"></i>
                  <span><strong>Environnement chaud:</strong> +15-25%</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-battery-quarter text-gray-500 mt-1"></i>
                  <span><strong>Fatigue accumulée:</strong> +20-40%</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestCalculator;
