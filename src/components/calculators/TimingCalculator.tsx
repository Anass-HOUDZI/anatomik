
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TimingCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    workoutTime: '18:00',
    workoutDuration: '60',
    workoutType: 'strength',
    goal: 'muscle_gain',
    weight: '',
    preworkoutMeal: '2',
    postworkoutWindow: '30'
  });

  const [recommendations, setRecommendations] = useState({
    preWorkout: [] as Array<{time: string, food: string, reason: string}>,
    duringWorkout: [] as Array<{timing: string, supplement: string, amount: string}>,
    postWorkout: [] as Array<{time: string, food: string, reason: string}>,
    evening: [] as Array<{time: string, food: string, reason: string}>
  });

  const workoutTypes = [
    { value: 'strength', label: 'Musculation/Force' },
    { value: 'cardio', label: 'Cardio/Endurance' },
    { value: 'hiit', label: 'HIIT/Fractionné' },
    { value: 'mixed', label: 'Mixte (Force + Cardio)' }
  ];

  const goals = [
    { value: 'muscle_gain', label: 'Prise de masse' },
    { value: 'fat_loss', label: 'Perte de graisse' },
    { value: 'performance', label: 'Performance' },
    { value: 'maintenance', label: 'Maintien' }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        weight: profile.demographics.weight?.toString() || ''
      }));
    }
  }, []);

  useEffect(() => {
    calculateTiming();
  }, [formData]);

  const calculateTiming = () => {
    const { workoutTime, workoutDuration, workoutType, goal, weight, preworkoutMeal, postworkoutWindow } = formData;
    
    if (!workoutTime || !weight) return;

    const weightNum = parseFloat(weight);
    const workoutStart = new Date(`2024-01-01T${workoutTime}`);
    const workoutEnd = new Date(workoutStart.getTime() + parseInt(workoutDuration) * 60000);
    const preTime = new Date(workoutStart.getTime() - parseInt(preworkoutMeal) * 3600000);
    const postTime = new Date(workoutEnd.getTime() + parseInt(postworkoutWindow) * 60000);

    const preWorkout = [];
    const duringWorkout = [];
    const postWorkout = [];
    const evening = [];

    // Pré-entraînement
    if (parseInt(preworkoutMeal) >= 2) {
      preWorkout.push({
        time: preTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        food: `Glucides complexes (${Math.round(weightNum * 0.5)}g) + Protéines (${Math.round(weightNum * 0.3)}g)`,
        reason: 'Énergie durable et prévention catabolisme'
      });
    } else {
      preWorkout.push({
        time: preTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        food: `Fruits + Caféine (200mg) ou BCAA (${Math.round(weightNum * 0.15)}g)`,
        reason: 'Énergie rapide sans inconfort digestif'
      });
    }

    // Pendant l'entraînement
    if (parseInt(workoutDuration) > 60 || workoutType === 'cardio') {
      duringWorkout.push({
        timing: 'Toutes les 20-30 min',
        supplement: 'Boisson énergétique',
        amount: `${Math.round(weightNum * 8)}ml (6-8% glucides)`
      });
    }
    
    duringWorkout.push({
      timing: 'Pendant toute la séance',
      supplement: 'Eau',
      amount: `${Math.round(150 + weightNum * 8)}ml`
    });

    // Post-entraînement
    if (goal === 'muscle_gain' || goal === 'performance') {
      postWorkout.push({
        time: postTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        food: `Protéines rapides (${Math.round(weightNum * 0.4)}g) + Glucides simples (${Math.round(weightNum * 0.8)}g)`,
        reason: 'Fenêtre anabolique - synthèse protéique maximale'
      });
    } else {
      postWorkout.push({
        time: postTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        food: `Protéines (${Math.round(weightNum * 0.3)}g) + Légumes`,
        reason: 'Récupération sans surplus calorique'
      });
    }

    // Soirée
    const eveningTime = new Date(`2024-01-01T22:00`);
    if (goal === 'muscle_gain') {
      evening.push({
        time: eveningTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        food: `Caséine (${Math.round(weightNum * 0.3)}g) ou Fromage blanc`,
        reason: 'Protéines lentes pour synthèse nocturne'
      });
    }

    setRecommendations({ preWorkout, duringWorkout, postWorkout, evening });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ResponsiveContainer className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <MobileCard className="w-full">
          <div className="p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-black">Paramètres d'entraînement</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workoutTime" className="text-sm md:text-base font-medium">Heure d'entraînement</Label>
                <Input
                  type="time"
                  id="workoutTime"
                  name="workoutTime"
                  value={formData.workoutTime}
                  onChange={handleInputChange}
                  className="mobile-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workoutDuration" className="text-sm md:text-base font-medium">Durée (minutes)</Label>
                <Input
                  type="number"
                  id="workoutDuration"
                  name="workoutDuration"
                  value={formData.workoutDuration}
                  onChange={handleInputChange}
                  className="mobile-input"
                  min="30"
                  max="180"
                  step="15"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workoutType" className="text-sm md:text-base font-medium">Type d'entraînement</Label>
                <select
                  id="workoutType"
                  name="workoutType"
                  value={formData.workoutType}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mobile-input"
                >
                  {workoutTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm md:text-base font-medium">Objectif principal</Label>
                <select
                  id="goal"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mobile-input"
                >
                  {goals.map(goal => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="text-sm md:text-base font-medium">Poids corporel (kg)</Label>
                <Input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mobile-input"
                  placeholder="Ex: 70"
                  min="40"
                  max="200"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preworkoutMeal" className="text-sm md:text-base font-medium">Dernier repas avant (heures)</Label>
                <select
                  id="preworkoutMeal"
                  name="preworkoutMeal"
                  value={formData.preworkoutMeal}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mobile-input"
                >
                  <option value="1">1 heure</option>
                  <option value="2">2 heures</option>
                  <option value="3">3 heures</option>
                  <option value="4">4+ heures</option>
                </select>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Recommendations */}
        <MobileCard className="w-full">
          <div className="p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-black">Planning nutritionnel</h3>
            
            <div className="space-y-6">
              {recommendations.preWorkout.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center text-blue-600">
                    🕐 Pré-entraînement
                  </h4>
                  <div className="space-y-3">
                    {recommendations.preWorkout.map((rec, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="font-medium text-blue-900">{rec.time}</div>
                        <div className="text-sm font-medium">{rec.food}</div>
                        <div className="text-xs text-blue-700">{rec.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.duringWorkout.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center text-green-600">
                    🏋️ Pendant l'entraînement
                  </h4>
                  <div className="space-y-3">
                    {recommendations.duringWorkout.map((rec, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="font-medium text-green-900">{rec.timing}</div>
                        <div className="text-sm font-medium">{rec.supplement} - {rec.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.postWorkout.length > 0 && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center text-orange-600">
                    ⚡ Post-entraînement
                  </h4>
                  <div className="space-y-3">
                    {recommendations.postWorkout.map((rec, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <div className="font-medium text-orange-900">{rec.time}</div>
                        <div className="text-sm font-medium">{rec.food}</div>
                        <div className="text-xs text-orange-700">{rec.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.evening.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center text-purple-600">
                    🌙 Soirée
                  </h4>
                  <div className="space-y-3">
                    {recommendations.evening.map((rec, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4">
                        <div className="font-medium text-purple-900">{rec.time}</div>
                        <div className="text-sm font-medium">{rec.food}</div>
                        <div className="text-xs text-purple-700">{rec.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-900 flex items-center">
                  💡 Principes clés
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Fenêtre anabolique :</strong> 30min-2h post-entraînement</li>
                  <li>• <strong>Hydratation :</strong> Avant, pendant et après l'effort</li>
                  <li>• <strong>Timing :</strong> Adaptation selon objectifs et contraintes</li>
                  <li>• <strong>Consistance :</strong> Régularité plus importante que perfection</li>
                </ul>
              </div>
            </div>
          </div>
        </MobileCard>
      </div>
    </ResponsiveContainer>
  );
};

export default TimingCalculator;
