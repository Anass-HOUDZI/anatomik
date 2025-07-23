
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const FiberCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    calories: '',
    currentFiber: '',
    digestiveSensitivity: 'normal',
    goal: 'health'
  });

  const [results, setResults] = useState({
    targetFiber: 0,
    solubleFiber: 0,
    insolubleFiber: 0,
    progression: [] as Array<{week: number, daily: number}>,
    recommendations: [] as Array<{food: string, fiber: number, serving: string}>
  });

  const sensitivity = [
    { value: 'high', label: 'Élevée (ballonnements fréquents)' },
    { value: 'normal', label: 'Normale' },
    { value: 'low', label: 'Faible (digestion robuste)' }
  ];

  const goals = [
    { value: 'health', label: 'Santé générale' },
    { value: 'weight_loss', label: 'Perte de poids' },
    { value: 'digestive', label: 'Santé digestive' },
    { value: 'satiety', label: 'Satiété (sèche)' }
  ];

  const fiberRichFoods = [
    { food: 'Haricots rouges', fiber: 16, serving: '100g cuits', type: 'soluble' },
    { food: 'Artichaut', fiber: 10, serving: '1 moyen', type: 'insoluble' },
    { food: 'Poire avec peau', fiber: 6, serving: '1 moyenne', type: 'both' },
    { food: 'Avoine', fiber: 10, serving: '100g', type: 'soluble' },
    { food: 'Framboises', fiber: 8, serving: '100g', type: 'both' },
    { food: 'Brocoli', fiber: 5, serving: '100g', type: 'insoluble' },
    { food: 'Pain complet', fiber: 7, serving: '100g', type: 'insoluble' },
    { food: 'Pomme avec peau', fiber: 4, serving: '1 moyenne', type: 'both' },
    { food: 'Lentilles', fiber: 8, serving: '100g cuites', type: 'soluble' },
    { food: 'Graines de chia', fiber: 34, serving: '100g', type: 'both' },
    { food: 'Épinards', fiber: 4, serving: '100g', type: 'insoluble' },
    { food: 'Orge', fiber: 17, serving: '100g', type: 'soluble' }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        age: profile.demographics.age?.toString() || '',
        gender: profile.demographics.gender || 'M'
      }));
    }
  }, []);

  useEffect(() => {
    calculateFiberNeeds();
  }, [formData]);

  const calculateFiberNeeds = () => {
    const { age, gender, calories, currentFiber, digestiveSensitivity, goal } = formData;
    
    if (!age || !calories) return;

    const ageNum = parseInt(age);
    const caloriesNum = parseInt(calories);
    const currentFiberNum = parseFloat(currentFiber) || 0;

    // Calcul besoins selon recommandations officielles
    let baseFiber: number;
    if (gender === 'M') {
      baseFiber = ageNum <= 50 ? 38 : 30;
    } else {
      baseFiber = ageNum <= 50 ? 25 : 21;
    }

    // Ajustement selon calories (14g pour 1000 kcal)
    const calorieAdjustedFiber = (caloriesNum / 1000) * 14;
    let targetFiber = Math.max(baseFiber, calorieAdjustedFiber);

    // Ajustement selon objectif
    switch (goal) {
      case 'weight_loss':
      case 'satiety':
        targetFiber *= 1.2; // +20% pour satiété
        break;
      case 'digestive':
        targetFiber *= 1.1; // +10% pour santé digestive
        break;
    }

    // Limites de sécurité
    targetFiber = Math.min(targetFiber, 50); // Max 50g/jour
    targetFiber = Math.round(targetFiber);

    // Répartition solubles/insolubles (1:2 ratio optimal)
    const solubleFiber = Math.round(targetFiber * 0.33);
    const insolubleFiber = Math.round(targetFiber * 0.67);

    // Progression graduelle sur 4 semaines
    const progression = [];
    const increment = Math.max(5, (targetFiber - currentFiberNum) / 4);
    
    for (let week = 1; week <= 4; week++) {
      const weeklyTarget = Math.min(
        currentFiberNum + (increment * week),
        targetFiber
      );
      progression.push({
        week,
        daily: Math.round(weeklyTarget)
      });
    }

    // Recommandations d'aliments selon sensibilité
    let recommendations = [...fiberRichFoods];
    
    if (digestiveSensitivity === 'high') {
      // Privilégier fibres solubles pour sensibilité élevée
      recommendations = recommendations
        .filter(food => food.type === 'soluble' || food.type === 'both')
        .sort((a, b) => a.fiber - b.fiber); // Commencer doucement
    } else {
      // Trier par densité en fibres
      recommendations = recommendations
        .sort((a, b) => b.fiber - a.fiber);
    }

    recommendations = recommendations.slice(0, 8); // Top 8

    setResults({
      targetFiber,
      solubleFiber,
      insolubleFiber,
      progression,
      recommendations
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Profil et objectifs</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="input-group-custom">
              <label htmlFor="age">Âge</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="form-control-custom"
                placeholder="Ex: 30"
                min="16"
                max="80"
              />
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

          <div className="input-group-custom">
            <label htmlFor="calories">Calories quotidiennes</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 2000"
              min="1200"
              max="4000"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="currentFiber">Fibres actuelles (g/jour)</label>
            <input
              type="number"
              id="currentFiber"
              name="currentFiber"
              value={formData.currentFiber}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 15"
              min="0"
              max="50"
              step="1"
            />
            <small className="text-muted-foreground">
              Moyenne française : 17g (homme), 15g (femme)
            </small>
          </div>

          <div className="input-group-custom">
            <label htmlFor="digestiveSensitivity">Sensibilité digestive</label>
            <select
              id="digestiveSensitivity"
              name="digestiveSensitivity"
              value={formData.digestiveSensitivity}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {sensitivity.map(sens => (
                <option key={sens.value} value={sens.value}>
                  {sens.label}
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
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Plan fibres personnalisé</h3>
          
          {results.targetFiber > 0 ? (
            <div className="space-y-6">
              {/* Target */}
              <div className="result-card bg-gradient-success">
                <div className="result-value">{results.targetFiber}g</div>
                <div className="result-label">Objectif quotidien</div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="font-medium">Solubles :</span> {results.solubleFiber}g
                  </div>
                  <div>
                    <span className="font-medium">Insolubles :</span> {results.insolubleFiber}g
                  </div>
                </div>
              </div>

              {/* Progression */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-chart-line mr-2 text-blue-600"></i>
                  Progression sur 4 semaines
                </h4>
                <div className="space-y-3">
                  {results.progression.map((week) => (
                    <div key={week.week} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">Semaine {week.week}</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {week.daily}g/jour
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Augmentation progressive pour éviter les troubles digestifs
                </p>
              </div>

              {/* Food Recommendations */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-apple-alt mr-2 text-green-600"></i>
                  Aliments riches en fibres
                </h4>
                <div className="grid gap-3">
                  {results.recommendations.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{item.food}</span>
                        <div className="text-sm text-muted-foreground">{item.serving}</div>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {item.fiber}g
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Conseils pour réussir
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Hydratation :</strong> Boire 250ml d'eau par 10g de fibres</li>
                  <li>• <strong>Progressivité :</strong> Augmenter de 5g par semaine maximum</li>
                  <li>• <strong>Variété :</strong> Alterner fibres solubles et insolubles</li>
                  <li>• <strong>Timing :</strong> Répartir sur tous les repas</li>
                </ul>
              </div>

              {/* Warnings */}
              {parseFloat(formData.currentFiber || '0') < 10 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-orange-800 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Attention
                  </h4>
                  <p className="text-sm text-orange-700">
                    Votre apport actuel est très faible. Commencez très progressivement 
                    (2-3g par semaine) pour éviter ballonnements et inconfort.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-seedling text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos informations pour voir le plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiberCalculator;
