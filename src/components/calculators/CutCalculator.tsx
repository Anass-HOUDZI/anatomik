
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const CutCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    currentWeight: '',
    goalWeight: '',
    currentBodyFat: '',
    goalBodyFat: '',
    timeline: '12',
    approach: 'moderate',
    gender: 'M'
  });

  const [results, setResults] = useState({
    weeklyLoss: 0,
    dailyDeficit: 0,
    totalDeficit: 0,
    musclePreservation: 0,
    refeedFrequency: 0,
    breakFrequency: 0,
    warnings: [] as string[]
  });

  const approaches = [
    { value: 'conservative', label: 'Conservatrice (-0.3kg/semaine)', rate: 0.3, deficit: 330 },
    { value: 'moderate', label: 'Modérée (-0.5kg/semaine)', rate: 0.5, deficit: 550 },
    { value: 'aggressive', label: 'Agressive (-0.7kg/semaine)', rate: 0.7, deficit: 770 }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        currentWeight: profile.demographics.weight?.toString() || '',
        gender: profile.demographics.gender || 'M'
      }));
    }
  }, []);

  useEffect(() => {
    calculateCut();
  }, [formData]);

  const calculateCut = () => {
    const { currentWeight, goalWeight, currentBodyFat, goalBodyFat, timeline, approach, gender } = formData;
    
    if (!currentWeight || !goalWeight || !timeline) {
      setResults({ 
        weeklyLoss: 0, 
        dailyDeficit: 0, 
        totalDeficit: 0, 
        musclePreservation: 0, 
        refeedFrequency: 0, 
        breakFrequency: 0, 
        warnings: [] 
      });
      return;
    }

    const currentWeightNum = parseFloat(currentWeight);
    const goalWeightNum = parseFloat(goalWeight);
    const timelineNum = parseFloat(timeline);
    const currentBFNum = currentBodyFat ? parseFloat(currentBodyFat) : (gender === 'M' ? 15 : 25);
    const goalBFNum = goalBodyFat ? parseFloat(goalBodyFat) : (gender === 'M' ? 10 : 20);

    const totalLoss = currentWeightNum - goalWeightNum;
    const weeklyLoss = totalLoss / timelineNum;
    
    const approachData = approaches.find(a => a.value === approach);
    const recommendedRate = approachData?.rate || 0.5;
    const baseDeficit = approachData?.deficit || 550;
    
    // Ajustement déficit selon vitesse réelle
    const deficitMultiplier = weeklyLoss / recommendedRate;
    const dailyDeficit = Math.round(baseDeficit * deficitMultiplier);
    
    // Estimation préservation musculaire (plus le déficit est fort, plus la perte est élevée)
    let musclePreservation = 95;
    if (weeklyLoss > 0.7) musclePreservation = 85;
    else if (weeklyLoss > 0.5) musclePreservation = 90;
    else if (weeklyLoss > 0.3) musclePreservation = 95;
    else musclePreservation = 98;
    
    // Fréquence refeeds (selon durée et agressivité)
    let refeedFrequency = 0;
    if (timelineNum > 8 && dailyDeficit > 400) refeedFrequency = 7; // 1x/semaine
    else if (timelineNum > 12 && dailyDeficit > 300) refeedFrequency = 10; // 2x/3 semaines
    else if (timelineNum > 16) refeedFrequency = 14; // 1x/2 semaines
    
    // Fréquence diet breaks (pause de 1-2 semaines)
    let breakFrequency = 0;
    if (timelineNum > 16) breakFrequency = 8; // Toutes les 8 semaines
    else if (timelineNum > 12) breakFrequency = 6; // Toutes les 6 semaines
    
    const totalDeficit = dailyDeficit * (timelineNum * 7);

    // Warnings
    const warnings: string[] = [];
    if (weeklyLoss > 1.0) {
      warnings.push('Perte trop rapide - risque élevé de perte musculaire');
    }
    if (weeklyLoss < 0.2) {
      warnings.push('Perte très lente - considérez augmenter le déficit');
    }
    if (goalBFNum < (gender === 'M' ? 8 : 16)) {
      warnings.push('Taux de graisse très bas - surveillance médicale recommandée');
    }
    if (timelineNum > 20) {
      warnings.push('Sèche très longue - planifiez des diet breaks réguliers');
    }
    if (currentBFNum - goalBFNum > 15) {
      warnings.push('Objectif très ambitieux - considérez des étapes intermédiaires');
    }

    setResults({
      weeklyLoss: Math.round(weeklyLoss * 1000) / 1000,
      dailyDeficit,
      totalDeficit,
      musclePreservation,
      refeedFrequency,
      breakFrequency,
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
          <h3 className="text-2xl font-bold mb-6">Paramètres de sèche</h3>
          
          <div className="input-group-custom">
            <label htmlFor="currentWeight">Poids actuel (kg)</label>
            <input
              type="number"
              id="currentWeight"
              name="currentWeight"
              value={formData.currentWeight}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 80"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group-custom">
              <label htmlFor="currentBodyFat">% graisse actuel</label>
              <input
                type="number"
                id="currentBodyFat"
                name="currentBodyFat"
                value={formData.currentBodyFat}
                onChange={handleInputChange}
                className="form-control-custom"
                placeholder="Ex: 18"
                min="5"
                max="40"
                step="0.1"
              />
            </div>

            <div className="input-group-custom">
              <label htmlFor="goalBodyFat">% graisse objectif</label>
              <input
                type="number"
                id="goalBodyFat"
                name="goalBodyFat"
                value={formData.goalBodyFat}
                onChange={handleInputChange}
                className="form-control-custom"
                placeholder="Ex: 12"
                min="5"
                max="40"
                step="0.1"
              />
            </div>
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
              max="32"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="approach">Approche de sèche</label>
            <select
              id="approach"
              name="approach"
              value={formData.approach}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {approaches.map(approach => (
                <option key={approach.value} value={approach.value}>
                  {approach.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="gender">Sexe</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Plan de sèche</h3>
          
          {results.weeklyLoss > 0 ? (
            <div className="space-y-4">
              <div className="result-card bg-gradient-success">
                <div className="result-value">-{results.weeklyLoss} kg</div>
                <div className="result-label">Perte hebdomadaire cible</div>
              </div>

              <div className="result-card">
                <div className="result-value">-{results.dailyDeficit}</div>
                <div className="result-label">Déficit calorique quotidien</div>
                <small className="text-sm opacity-75 mt-2 block">
                  En dessous de votre maintenance
                </small>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="result-card bg-gradient-secondary">
                  <div className="result-value text-2xl">{results.musclePreservation}%</div>
                  <div className="result-label text-base">Préservation muscle</div>
                </div>

                <div className="result-card bg-gradient-dark">
                  <div className="result-value text-2xl">{Math.round(results.totalDeficit / 1000)}k</div>
                  <div className="result-label text-base">Déficit total (kcal)</div>
                </div>
              </div>

              {(results.refeedFrequency > 0 || results.breakFrequency > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-800 flex items-center">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    Stratégie métabolique
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    {results.refeedFrequency > 0 && (
                      <p>• <strong>Refeeds :</strong> Toutes les {results.refeedFrequency} jours</p>
                    )}
                    {results.breakFrequency > 0 && (
                      <p>• <strong>Diet breaks :</strong> 1-2 semaines toutes les {results.breakFrequency} semaines</p>
                    )}
                  </div>
                </div>
              )}

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
                  <li>• <strong>Protéines :</strong> 2.5-3g/kg pour préserver le muscle</li>
                  <li>• <strong>Entraînement :</strong> Maintenir les charges, volume si besoin</li>
                  <li>• <strong>Cardio :</strong> Ajouter progressivement si stagnation</li>
                  <li>• <strong>Patience :</strong> Ajuster le déficit selon les résultats</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-chart-line-down text-4xl mb-4"></i>
              <p className="text-lg">Définissez vos objectifs pour voir le plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CutCalculator;
