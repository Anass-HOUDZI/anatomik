
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  muscleGroup: string;
}

interface VolumeAnalysis {
  totalVolume: number;
  averageIntensity: number;
  volumeByMuscle: { [muscle: string]: number };
  setsPerMuscle: { [muscle: string]: number };
  recommendations: string[];
  warnings: string[];
}

const muscleGroups = [
  'Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 
  'Quadriceps', 'Ischio-jambiers', 'Mollets', 'Abdominaux'
];

const volumeGuidelines = {
  'Pectoraux': { min: 10, max: 22 },
  'Dos': { min: 14, max: 25 },
  'Épaules': { min: 12, max: 20 },
  'Biceps': { min: 6, max: 18 },
  'Triceps': { min: 8, max: 20 },
  'Quadriceps': { min: 12, max: 24 },
  'Ischio-jambiers': { min: 8, max: 20 },
  'Mollets': { min: 8, max: 16 },
  'Abdominaux': { min: 6, max: 18 }
};

const VolumeCalculator = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    muscleGroup: ''
  });
  const [analysis, setAnalysis] = useState<VolumeAnalysis | null>(null);

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps || 
        !currentExercise.weight || !currentExercise.muscleGroup) {
      return;
    }

    const exercise: Exercise = {
      name: currentExercise.name,
      sets: parseInt(currentExercise.sets),
      reps: parseInt(currentExercise.reps),
      weight: parseFloat(currentExercise.weight),
      muscleGroup: currentExercise.muscleGroup
    };

    setExercises([...exercises, exercise]);
    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      muscleGroup: ''
    });
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const calculateVolume = () => {
    if (exercises.length === 0) return;

    let totalVolume = 0;
    let totalWeight = 0;
    const volumeByMuscle: { [muscle: string]: number } = {};
    const setsPerMuscle: { [muscle: string]: number } = {};

    exercises.forEach(exercise => {
      const exerciseVolume = exercise.sets * exercise.reps * exercise.weight;
      totalVolume += exerciseVolume;
      totalWeight += exercise.weight * exercise.sets;

      if (!volumeByMuscle[exercise.muscleGroup]) {
        volumeByMuscle[exercise.muscleGroup] = 0;
        setsPerMuscle[exercise.muscleGroup] = 0;
      }
      volumeByMuscle[exercise.muscleGroup] += exerciseVolume;
      setsPerMuscle[exercise.muscleGroup] += exercise.sets;
    });

    const averageIntensity = totalWeight / exercises.reduce((sum, ex) => sum + ex.sets, 0);

    // Generate recommendations and warnings
    const recommendations: string[] = [];
    const warnings: string[] = [];

    Object.entries(setsPerMuscle).forEach(([muscle, sets]) => {
      const guidelines = volumeGuidelines[muscle as keyof typeof volumeGuidelines];
      if (guidelines) {
        if (sets < guidelines.min) {
          warnings.push(`${muscle}: Volume insuffisant (${sets} sets vs ${guidelines.min}-${guidelines.max} recommandés)`);
        } else if (sets > guidelines.max) {
          warnings.push(`${muscle}: Volume excessif (${sets} sets vs ${guidelines.min}-${guidelines.max} recommandés)`);
        } else {
          recommendations.push(`${muscle}: Volume optimal (${sets} sets)`);
        }
      }
    });

    // General recommendations
    if (totalVolume < 50000) {
      recommendations.push("Considérez augmenter progressivement le volume total");
    } else if (totalVolume > 200000) {
      warnings.push("Volume très élevé - surveillez la récupération");
    }

    if (averageIntensity < 40) {
      recommendations.push("Intensité moyenne faible - augmentez les charges");
    } else if (averageIntensity > 85) {
      warnings.push("Intensité très élevée - attention au surentraînement");
    }

    setAnalysis({
      totalVolume,
      averageIntensity,
      volumeByMuscle,
      setsPerMuscle,
      recommendations,
      warnings
    });
  };

  const getVolumeStatus = (muscle: string, sets: number) => {
    const guidelines = volumeGuidelines[muscle as keyof typeof volumeGuidelines];
    if (!guidelines) return 'neutral';
    
    if (sets < guidelines.min) return 'low';
    if (sets > guidelines.max) return 'high';
    return 'optimal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-orange-600 bg-orange-50';
      case 'high': return 'text-red-600 bg-red-50';
      case 'optimal': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Exercise Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-calculator text-primary"></i>
            <span>Calculateur de Volume d'Entraînement</span>
          </CardTitle>
          <CardDescription>
            Calculez et analysez votre volume total (Sets × Reps × Poids)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="exerciseName">Exercice</Label>
              <Input
                id="exerciseName"
                value={currentExercise.name}
                onChange={(e) => setCurrentExercise({...currentExercise, name: e.target.value})}
                placeholder="Ex: Développé couché"
              />
            </div>
            <div>
              <Label htmlFor="sets">Séries</Label>
              <Input
                id="sets"
                type="number"
                value={currentExercise.sets}
                onChange={(e) => setCurrentExercise({...currentExercise, sets: e.target.value})}
                placeholder="4"
              />
            </div>
            <div>
              <Label htmlFor="reps">Répétitions</Label>
              <Input
                id="reps"
                type="number"
                value={currentExercise.reps}
                onChange={(e) => setCurrentExercise({...currentExercise, reps: e.target.value})}
                placeholder="10"
              />
            </div>
            <div>
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={currentExercise.weight}
                onChange={(e) => setCurrentExercise({...currentExercise, weight: e.target.value})}
                placeholder="80"
              />
            </div>
            <div>
              <Label htmlFor="muscleGroup">Groupe musculaire</Label>
              <Select 
                value={currentExercise.muscleGroup} 
                onValueChange={(value) => setCurrentExercise({...currentExercise, muscleGroup: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  {muscleGroups.map((muscle) => (
                    <SelectItem key={muscle} value={muscle}>{muscle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={addExercise} className="w-full">
            <i className="fas fa-plus mr-2"></i>
            Ajouter l'Exercice
          </Button>
        </CardContent>
      </Card>

      {/* Exercise List */}
      {exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Exercices de la Séance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-5 gap-4 flex-1 text-sm">
                    <span className="font-medium">{exercise.name}</span>
                    <span>{exercise.sets} séries</span>
                    <span>{exercise.reps} reps</span>
                    <span>{exercise.weight} kg</span>
                    <span className="text-muted-foreground">{exercise.muscleGroup}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {(exercise.sets * exercise.reps * exercise.weight).toLocaleString()} kg
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeExercise(index)}
                    >
                      <i className="fas fa-trash text-red-500"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button onClick={calculateVolume} className="w-full mt-4">
              <i className="fas fa-chart-bar mr-2"></i>
              Analyser le Volume
            </Button>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <>
          {/* Volume Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse du Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {analysis.totalVolume.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Volume Total (kg)</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary">
                    {analysis.averageIntensity.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Intensité Moyenne (kg)</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent">
                    {Object.values(analysis.setsPerMuscle).reduce((sum, sets) => sum + sets, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Séries</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volume by Muscle Group */}
          <Card>
            <CardHeader>
              <CardTitle>Volume par Groupe Musculaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analysis.setsPerMuscle).map(([muscle, sets]) => {
                  const guidelines = volumeGuidelines[muscle as keyof typeof volumeGuidelines];
                  const status = getVolumeStatus(muscle, sets);
                  const percentage = guidelines ? (sets / guidelines.max) * 100 : 0;
                  
                  return (
                    <div key={muscle} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{muscle}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                            {sets} séries
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {analysis.volumeByMuscle[muscle]?.toLocaleString()} kg
                          </span>
                        </div>
                      </div>
                      {guidelines && (
                        <div className="space-y-1">
                          <Progress value={Math.min(percentage, 100)} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Min: {guidelines.min}</span>
                            <span>Max: {guidelines.max}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations & Warnings */}
          {(analysis.recommendations.length > 0 || analysis.warnings.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <i className="fas fa-check-circle text-green-500 mt-1"></i>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {analysis.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">Attention</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <i className="fas fa-exclamation-triangle text-orange-500 mt-1"></i>
                          <span className="text-sm">{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Références Scientifiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Volume Optimal par Semaine (sets)</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(volumeGuidelines).map(([muscle, guidelines]) => (
                  <div key={muscle} className="flex justify-between">
                    <span>{muscle}:</span>
                    <span className="font-medium">{guidelines.min}-{guidelines.max} sets</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Principes du Volume</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                  <span>MEV (Minimum Effective Volume): seuil minimal pour progresser</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                  <span>MAV (Maximum Adaptive Volume): plafond avant fatigue excessive</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                  <span>MRV (Maximum Recoverable Volume): limite absolue récupérable</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolumeCalculator;
