
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressionPlan {
  weeks: ProgressionWeek[];
  strategy: string;
  totalIncrease: number;
  plateauRisk: string;
}

interface ProgressionWeek {
  week: number;
  weight: number;
  reps: number;
  volume: number;
  notes: string;
}

const progressionStrategies = [
  { 
    id: 'linear', 
    name: 'Progression Linéaire', 
    description: 'Augmentation constante du poids chaque semaine',
    suitableFor: 'Débutants (0-1 an)',
    increment: 2.5
  },
  { 
    id: 'double_progression', 
    name: 'Double Progression', 
    description: 'Augmentation des reps puis du poids',
    suitableFor: 'Intermédiaires (1-3 ans)',
    increment: 2.5
  },
  { 
    id: 'periodized', 
    name: 'Périodisation', 
    description: 'Cycles d\'intensité et volume',
    suitableFor: 'Avancés (3+ ans)',
    increment: 1.25
  },
  { 
    id: 'wave_loading', 
    name: 'Wave Loading', 
    description: 'Progression en vagues avec deloads',
    suitableFor: 'Très avancés',
    increment: 1.25
  }
];

const exerciseCategories = [
  { name: 'Squat', baseIncrement: 2.5, difficulty: 'Compound' },
  { name: 'Développé Couché', baseIncrement: 2.5, difficulty: 'Compound' },
  { name: 'Soulevé de Terre', baseIncrement: 5, difficulty: 'Compound' },
  { name: 'Développé Militaire', baseIncrement: 1.25, difficulty: 'Compound' },
  { name: 'Rowing', baseIncrement: 2.5, difficulty: 'Compound' },
  { name: 'Isolation', baseIncrement: 1.25, difficulty: 'Isolation' }
];

const ProgressionCalculator = () => {
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentReps, setCurrentReps] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('12');
  const [strategy, setStrategy] = useState<string>('');
  const [exercise, setExercise] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [progressionPlan, setProgressionPlan] = useState<ProgressionPlan | null>(null);

  const calculateProgression = () => {
    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);
    const reps = parseInt(currentReps);
    const weeks = parseInt(timeline);
    
    if (!current || !target || !reps || !weeks || !strategy) return;

    const selectedStrategy = progressionStrategies.find(s => s.id === strategy);
    const selectedExercise = exerciseCategories.find(e => e.name === exercise);
    
    if (!selectedStrategy || !selectedExercise) return;

    const totalIncrease = target - current;
    const weeklyIncrease = totalIncrease / weeks;
    
    // Adjust increment based on exercise and level
    let adjustedIncrement = selectedStrategy.increment;
    if (selectedExercise.name === 'Soulevé de Terre') adjustedIncrement *= 2;
    if (level === 'advanced') adjustedIncrement *= 0.5;

    const progressionWeeks: ProgressionWeek[] = [];
    
    for (let week = 1; week <= weeks; week++) {
      let weekWeight = current;
      let weekReps = reps;
      let notes = '';

      switch (strategy) {
        case 'linear':
          weekWeight = current + (adjustedIncrement * (week - 1));
          notes = week % 4 === 0 ? 'Semaine de décharge (-20%)' : 'Progression linéaire';
          if (week % 4 === 0) weekWeight *= 0.8;
          break;
          
        case 'double_progression':
          if (week <= weeks / 2) {
            weekReps = Math.min(reps + Math.floor(week / 2), reps + 3);
            notes = `Augmentation reps: ${weekReps}`;
          } else {
            weekWeight = current + adjustedIncrement * Math.floor((week - weeks/2) / 2);
            weekReps = reps;
            notes = `Augmentation poids: ${weekWeight}kg`;
          }
          break;
          
        case 'periodized':
          const phase = Math.floor((week - 1) / 4) % 3;
          if (phase === 0) { // Volume
            weekReps = reps + 2;
            weekWeight = current * 0.85;
            notes = 'Phase volume';
          } else if (phase === 1) { // Intensité
            weekReps = reps - 1;
            weekWeight = current + adjustedIncrement * Math.floor(week / 4);
            notes = 'Phase intensité';
          } else { // Récupération
            weekReps = reps;
            weekWeight = current * 0.7;
            notes = 'Phase récupération';
          }
          break;
          
        case 'wave_loading':
          const waveWeek = week % 4;
          const waveNumber = Math.floor((week - 1) / 4);
          weekWeight = current + (adjustedIncrement * waveNumber);
          if (waveWeek === 1) weekWeight *= 0.85;
          if (waveWeek === 2) weekWeight *= 0.9;
          if (waveWeek === 3) weekWeight *= 0.95;
          if (waveWeek === 0) weekWeight *= 1.0;
          notes = `Vague ${waveNumber + 1}, Semaine ${waveWeek || 4}`;
          break;
      }

      progressionWeeks.push({
        week,
        weight: Math.round(weekWeight * 4) / 4, // Round to nearest 1.25kg
        reps: weekReps,
        volume: weekWeight * weekReps * 4, // Assuming 4 sets
        notes
      });
    }

    // Calculate plateau risk
    const weeklyIncreasePercentage = (weeklyIncrease / current) * 100;
    let plateauRisk = 'Faible';
    if (weeklyIncreasePercentage > 2) plateauRisk = 'Élevé';
    else if (weeklyIncreasePercentage > 1) plateauRisk = 'Modéré';

    setProgressionPlan({
      weeks: progressionWeeks,
      strategy: selectedStrategy.name,
      totalIncrease,
      plateauRisk
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Faible': return 'text-green-600 bg-green-50';
      case 'Modéré': return 'text-orange-600 bg-orange-50';
      case 'Élevé': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-arrow-up text-primary"></i>
            <span>Calculateur de Progression</span>
          </CardTitle>
          <CardDescription>
            Planifiez votre progression à long terme avec la surcharge progressive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currentWeight">Poids actuel (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="80"
              />
            </div>
            <div>
              <Label htmlFor="currentReps">Répétitions actuelles</Label>
              <Input
                id="currentReps"
                type="number"
                value={currentReps}
                onChange={(e) => setCurrentReps(e.target.value)}
                placeholder="8"
              />
            </div>
            <div>
              <Label htmlFor="targetWeight">Objectif poids (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="timeline">Délai (semaines)</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="exercise">Type d'exercice</Label>
              <Select value={exercise} onValueChange={setExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir exercice" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseCategories.map((ex) => (
                    <SelectItem key={ex.name} value={ex.name}>
                      {ex.name} ({ex.difficulty})
                    </SelectItem>
                  ))}
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
                  <SelectItem value="beginner">Débutant (0-1 an)</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire (1-3 ans)</SelectItem>
                  <SelectItem value="advanced">Avancé (3+ ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="strategy">Stratégie de progression</Label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir stratégie" />
              </SelectTrigger>
              <SelectContent>
                {progressionStrategies.map((strat) => (
                  <SelectItem key={strat.id} value={strat.id}>
                    {strat.name} - {strat.suitableFor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {strategy && (
              <p className="text-sm text-muted-foreground mt-2">
                {progressionStrategies.find(s => s.id === strategy)?.description}
              </p>
            )}
          </div>
          
          <Button onClick={calculateProgression} className="w-full">
            <i className="fas fa-chart-line mr-2"></i>
            Calculer la Progression
          </Button>
        </CardContent>
      </Card>

      {progressionPlan && (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Plan de Progression - {progressionPlan.strategy}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    +{progressionPlan.totalIncrease}kg
                  </div>
                  <div className="text-sm text-muted-foreground">Augmentation totale</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {(progressionPlan.totalIncrease / progressionPlan.weeks.length).toFixed(1)}kg
                  </div>
                  <div className="text-sm text-muted-foreground">Par semaine (moyenne)</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {progressionPlan.weeks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Semaines</div>
                </div>
                <div className="text-center p-4 rounded-lg">
                  <div className={`text-lg font-bold px-3 py-1 rounded ${getRiskColor(progressionPlan.plateauRisk)}`}>
                    {progressionPlan.plateauRisk}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Risque plateau</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution Prévue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressionPlan.weeks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Poids (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Planning Détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {progressionPlan.weeks.map((week) => (
                  <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium w-16">S{week.week}</span>
                      <span className="text-lg font-bold text-primary w-20">{week.weight}kg</span>
                      <span className="w-16">{week.reps} reps</span>
                      <span className="text-sm text-muted-foreground flex-1">{week.notes}</span>
                    </div>
                    <span className="text-sm font-medium">
                      Volume: {Math.round(week.volume).toLocaleString()}kg
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Conseils pour Réussir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Principes Clés</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Respectez scrupuleusement la technique</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Notez toutes vos performances</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Dormez 7-9h par nuit pour récupérer</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-check text-green-500 mt-1"></i>
                      <span>Mangez en surplus calorique modéré</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Signaux d'Alarme</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-exclamation-triangle text-orange-500 mt-1"></i>
                      <span>Échec sur plusieurs séances consécutives</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-exclamation-triangle text-orange-500 mt-1"></i>
                      <span>Douleurs articulaires persistantes</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-exclamation-triangle text-orange-500 mt-1"></i>
                      <span>Fatigue chronique et baisse motivation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <i className="fas fa-exclamation-triangle text-orange-500 mt-1"></i>
                      <span>Dégradation technique sous fatigue</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ProgressionCalculator;
