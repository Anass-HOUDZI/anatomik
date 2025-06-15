
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Paramètres d'entraînement</h3>
          
          <div className="input-group-custom">
            <label htmlFor="workoutTime">Heure d'entraînement</label>
            <input
              type="time"
              id="workoutTime"
              name="workoutTime"
              value={formData.workoutTime}
              onChange={handleInputChange}
              className="form-control-custom"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="workoutDuration">Durée (minutes)</label>
            <input
              type="number"
              id="workoutDuration"
              name="workoutDuration"
              value={formData.workoutDuration}
              onChange={handleInputChange}
              className="form-control-custom"
              min="30"
              max="180"
              step="15"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="workoutType">Type d'entraînement</label>
            <select
              id="workoutType"
              name="workoutType"
              value={formData.workoutType}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {workoutTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="goal">Objectif principal</label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {goals.map(goal => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="weight">Poids corporel (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 70"
              min="40"
              max="200"
              step="0.1"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="preworkoutMeal">Dernier repas avant (heures)</label>
            <select
              id="preworkoutMeal"
              name="preworkoutMeal"
              value={formData.preworkoutMeal}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              <option value="1">1 heure</option>
              <option value="2">2 heures</option>
              <option value="3">3 heures</option>
              <option value="4">4+ heures</option>
            </select>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Planning nutritionnel</h3>
          
          {recommendations.preWorkout.length > 0 && (
            <div className="bg-card border border-custom rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center text-blue-600">
                <i className="fas fa-clock mr-2"></i>
                Pré-entraînement
              </h4>
              <div className="space-y-3">
                {recommendations.preWorkout.map((rec, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="font-medium text-blue-900">{rec.time}</div>
                    <div className="text-sm font-medium">{rec.food}</div>
                    <div className="text-xs text-muted-foreground">{rec.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.duringWorkout.length > 0 && (
            <div className="bg-card border border-custom rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center text-green-600">
                <i className="fas fa-dumbbell mr-2"></i>
                Pendant l'entraînement
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
            <div className="bg-card border border-custom rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center text-orange-600">
                <i className="fas fa-bolt mr-2"></i>
                Post-entraînement
              </h4>
              <div className="space-y-3">
                {recommendations.postWorkout.map((rec, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4">
                    <div className="font-medium text-orange-900">{rec.time}</div>
                    <div className="text-sm font-medium">{rec.food}</div>
                    <div className="text-xs text-muted-foreground">{rec.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.evening.length > 0 && (
            <div className="bg-card border border-custom rounded-lg p-6">
              <h4 className="font-semibold mb-4 flex items-center text-purple-600">
                <i className="fas fa-moon mr-2"></i>
                Soirée
              </h4>
              <div className="space-y-3">
                {recommendations.evening.map((rec, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="font-medium text-purple-900">{rec.time}</div>
                    <div className="text-sm font-medium">{rec.food}</div>
                    <div className="text-xs text-muted-foreground">{rec.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-blue-900 flex items-center">
              <i className="fas fa-lightbulb mr-2"></i>
              Principes clés
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Fenêtre anabolique :</strong> 30min-2h post-workout</li>
              <li>• <strong>Hydratation :</strong> Commencer 2h avant l'entraînement</li>
              <li>• <strong>Digestion :</strong> Éviter repas copieux 2h avant</li>
              <li>• <strong>Récupération :</strong> Protéines + glucides dans l'heure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimingCalculator;
