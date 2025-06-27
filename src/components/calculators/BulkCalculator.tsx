
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    { value: 'slow', label: 'Lent (prend facilement)', multiplier: 0.8 },
    { value: 'normal', label: 'Normal', multiplier: 1.0 },
    { value: 'fast', label: 'Rapide (difficile)', multiplier: 1.3 }
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
    
    const expLevel = experienceLevels.find(e => e.value === experience);
    const maxWeeklyGain = expLevel?.gainRate || 0.25;
    
    const metabType = metabolismTypes.find(m => m.value === metabolism);
    const metabMultiplier = metabType?.multiplier || 1.0;
    
    const muscleRatio = experience === 'beginner' ? 0.7 : experience === 'intermediate' ? 0.6 : 0.5;
    const fatRatio = 1 - muscleRatio;
    
    const estimatedGainMuscle = totalGain * muscleRatio;
    const estimatedGainFat = totalGain * fatRatio;
    
    const dailySurplus = Math.round((weeklyGain * 7700 / 7) * metabMultiplier);
    const totalSurplus = dailySurplus * (timelineNum * 7);

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
    <ResponsiveContainer className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <MobileCard className="w-full">
          <div className="p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-black">Paramètres de prise de masse</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentWeight" className="text-sm md:text-base font-medium">Poids actuel (kg)</Label>
                <Input
                  type="number"
                  id="currentWeight"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  className="mobile-input"
                  placeholder="Ex: 70"
                  min="40"
                  max="200"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalWeight" className="text-sm md:text-base font-medium">Poids objectif (kg)</Label>
                <Input
                  type="number"
                  id="goalWeight"
                  name="goalWeight"
                  value={formData.goalWeight}
                  onChange={handleInputChange}
                  className="mobile-input"
                  placeholder="Ex: 75"
                  min="40"
                  max="200"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-sm md:text-base font-medium">Durée (semaines)</Label>
                <Input
                  type="number"
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="mobile-input"
                  placeholder="Ex: 12"
                  min="4"
                  max="52"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm md:text-base font-medium">Niveau d'expérience</Label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mobile-input"
                >
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metabolism" className="text-sm md:text-base font-medium">Type de métabolisme</Label>
                <select
                  id="metabolism"
                  name="metabolism"
                  value={formData.metabolism}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg mobile-input"
                >
                  {metabolismTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyFat" className="text-sm md:text-base font-medium">% de graisse corporelle (optionnel)</Label>
                <Input
                  type="number"
                  id="bodyFat"
                  name="bodyFat"
                  value={formData.bodyFat}
                  onChange={handleInputChange}
                  className="mobile-input"
                  placeholder="Ex: 15"
                  min="5"
                  max="35"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </MobileCard>

        {/* Results */}
        <MobileCard className="w-full">
          <div className="p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-black">Plan de prise de masse</h3>
            
            {results.weeklyGain > 0 ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{results.weeklyGain} kg</div>
                  <div className="text-green-800 font-medium">Gain hebdomadaire cible</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">+{results.dailySurplus}</div>
                  <div className="text-blue-800 font-medium">Surplus calorique quotidien</div>
                  <small className="text-blue-600 text-sm">Au-dessus de votre maintenance</small>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{results.estimatedGainMuscle} kg</div>
                    <div className="text-purple-800 font-medium text-sm">Muscle estimé</div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{results.estimatedGainFat} kg</div>
                    <div className="text-orange-800 font-medium text-sm">Graisse estimée</div>
                  </div>
                </div>

                {results.warnings.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold mb-2 text-red-800">⚠️ Avertissements</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {results.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3 text-gray-800">💡 Conseils pour réussir</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• <strong>Pesée :</strong> Chaque matin à jeun, même conditions</li>
                    <li>• <strong>Ajustements :</strong> Réviser le surplus toutes les 2 semaines</li>
                    <li>• <strong>Entraînement :</strong> Progresser en charge régulièrement</li>
                    <li>• <strong>Protéines :</strong> 2-2.5g/kg pour optimiser les gains</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-lg">Remplissez vos objectifs pour voir le plan</p>
              </div>
            )}
          </div>
        </MobileCard>
      </div>
    </ResponsiveContainer>
  );
};

export default BulkCalculator;
