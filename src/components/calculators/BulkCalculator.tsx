import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const BulkCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    currentWeight: '',
    goalWeight: '',
    timeline: '12',
    experience: 'intermediate',
    metabolism: 'normal',
    bodyFat: ''
  });

  const [results, setResults] = useState({
    weeklyGain: 0,
    dailySurplus: 0,
    totalSurplus: 0,
    estimatedGainMuscle: 0,
    estimatedGainFat: 0,
    warnings: [] as string[]
  });

  const experienceLevels = [
    { value: 'beginner', label: 'Débutant (< 6 mois)', gainRate: 0.5 },
    { value: 'intermediate', label: 'Intermédiaire (6 mois - 2 ans)', gainRate: 0.25 },
    { value: 'advanced', label: 'Avancé (> 2 ans)', gainRate: 0.125 }
  ];

  const metabolismTypes = [
    { value: 'slow', label: 'Lent (prend facilement du poids)', multiplier: 0.8 },
    { value: 'normal', label: 'Normal', multiplier: 1.0 },
    { value: 'fast', label: 'Rapide (difficile de prendre du poids)', multiplier: 1.3 }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        currentWeight: profile.demographics.weight?.toString() || ''
      }));
    }
  }, []);

  useEffect(() => {
    calculateBulk();
  }, [formData]);

  const calculateBulk = () => {
    const { currentWeight, goalWeight, timeline, experience, metabolism, bodyFat } = formData;
    
    if (!currentWeight || !goalWeight || !timeline) {
      setResults({ weeklyGain: 0, dailySurplus: 0, totalSurplus: 0, estimatedGainMuscle: 0, estimatedGainFat: 0, warnings: [] });
      return;
    }

    const currentWeightNum = parseFloat(currentWeight);
    const goalWeightNum = parseFloat(goalWeight);
    const timelineNum = parseFloat(timeline);
    const bodyFatNum = bodyFat ? parseFloat(bodyFat) : 15;

    const totalGain = goalWeightNum - currentWeightNum;
    const weeklyGain = totalGain / timelineNum;
    
    // Taux de gain recommandé selon expérience
    const expLevel = experienceLevels.find(e => e.value === experience);
    const maxWeeklyGain = expLevel?.gainRate || 0.25;
    
    // Ajustement métabolisme
    const metabType = metabolismTypes.find(m => m.value === metabolism);
    const metabMultiplier = metabType?.multiplier || 1.0;
    
    // Calcul surplus calorique (1kg = ~7700 kcal, ratio muscle/graisse selon expérience)
    const muscleRatio = experience === 'beginner' ? 0.7 : experience === 'intermediate' ? 0.6 : 0.5;
    const fatRatio = 1 - muscleRatio;
    
    const estimatedGainMuscle = totalGain * muscleRatio;
    const estimatedGainFat = totalGain * fatRatio;
    
    // Surplus quotidien (ajusté métabolisme)
    const dailySurplus = Math.round((weeklyGain * 7700 / 7) * metabMultiplier);
    const totalSurplus = dailySurplus * (timelineNum * 7);

    // Warnings
    const warnings: string[] = [];
    if (weeklyGain > maxWeeklyGain * 1.5) {
      warnings.push('Gain trop rapide - risque d\'accumulation de graisse excessive');
    }
    if (weeklyGain < maxWeeklyGain * 0.5) {
      warnings.push('Gain très lent - considérez augmenter légèrement le surplus');
    }
    if (bodyFatNum > 20) {
      warnings.push('Taux de graisse élevé - considérez une mini-cut avant la prise de masse');
    }
    if (totalGain > currentWeightNum * 0.15) {
      warnings.push('Objectif très ambitieux - considérez diviser en plusieurs phases');
    }

    setResults({
      weeklyGain: Math.round(weeklyGain * 1000) / 1000,
      dailySurplus,
      totalSurplus,
      estimatedGainMuscle: Math.round(estimatedGainMuscle * 100) / 100,
      estimatedGainFat: Math.round(estimatedGainFat * 100) / 100,
      warnings
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-black">Paramètres de prise de masse</h3>
          
          <div className="input-group-custom">
            <label htmlFor="currentWeight">Poids actuel (kg)</label>
            <input
              type="number"
              id="currentWeight"
              name="currentWeight"
              value={formData.currentWeight}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 70"
              min="40"
              max="200"
              step="0.1"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="goalWeight">Poids objectif (kg)</label>
            <input
              type="number"
              id="goalWeight"
              name="goalWeight"
              value={formData.goalWeight}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 75"
              min="40"
              max="200"
              step="0.1"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="timeline">Durée (semaines)</label>
            <input
              type="number"
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 12"
              min="4"
              max="52"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="experience">Niveau d'expérience</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="metabolism">Type de métabolisme</label>
            <select
              id="metabolism"
              name="metabolism"
              value={formData.metabolism}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {metabolismTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="bodyFat">% de graisse corporelle (optionnel)</label>
            <input
              type="number"
              id="bodyFat"
              name="bodyFat"
              value={formData.bodyFat}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 15"
              min="5"
              max="35"
              step="0.1"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-black">Plan de prise de masse</h3>
          
          {results.weeklyGain > 0 ? (
            <div className="space-y-4">
              <div className="result-card bg-gradient-success">
                <div className="result-value">{results.weeklyGain} kg</div>
                <div className="result-label">Gain hebdomadaire cible</div>
              </div>

              <div className="result-card">
                <div className="result-value">+{results.dailySurplus}</div>
                <div className="result-label">Surplus calorique quotidien</div>
                <small className="text-sm opacity-75 mt-2 block">
                  Au-dessus de votre maintenance
                </small>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="result-card bg-gradient-secondary">
                  <div className="result-value text-2xl">{results.estimatedGainMuscle} kg</div>
                  <div className="result-label text-base">Muscle estimé</div>
                </div>

                <div className="result-card bg-gradient-warning">
                  <div className="result-value text-2xl">{results.estimatedGainFat} kg</div>
                  <div className="result-label text-base">Graisse estimée</div>
                </div>
              </div>

              {results.warnings.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-orange-800 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Avertissements
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {results.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-card border border-custom rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <i className="fas fa-lightbulb text-warning mr-2"></i>
                  Conseils pour réussir
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Pesée :</strong> Chaque matin à jeun, même conditions</li>
                  <li>• <strong>Ajustements :</strong> Réviser le surplus toutes les 2 semaines</li>
                  <li>• <strong>Entraînement :</strong> Progresser en charge régulièrement</li>
                  <li>• <strong>Protéines :</strong> 2-2.5g/kg pour optimiser les gains</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-chart-line text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos objectifs pour voir le plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkCalculator;
