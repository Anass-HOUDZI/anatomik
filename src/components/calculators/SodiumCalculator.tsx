
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const SodiumCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    bloodPressure: 'normal',
    activityLevel: 'moderate',
    climate: 'temperate',
    goal: 'health',
    currentSodium: ''
  });

  const [results, setResults] = useState({
    targetSodium: 0,
    minSodium: 0,
    maxSodium: 0,
    exerciseNeeds: 0,
    waterRetention: '',
    recommendations: [] as Array<{category: string, sodium: number, serving: string, tips: string}>
  });

  const bloodPressureTypes = [
    { value: 'low', label: 'Hypotension (<90/60)' },
    { value: 'normal', label: 'Normal (90-139/60-89)' },
    { value: 'high', label: 'Hypertension (>140/90)' },
    { value: 'very_high', label: 'Hypertension sévère' }
  ];

  const climates = [
    { value: 'cold', label: 'Froid (peu de sudation)' },
    { value: 'temperate', label: 'Tempéré' },
    { value: 'hot', label: 'Chaud (sudation importante)' },
    { value: 'very_hot', label: 'Très chaud/humide' }
  ];

  const goals = [
    { value: 'health', label: 'Santé générale' },
    { value: 'performance', label: 'Performance sportive' },
    { value: 'definition', label: 'Définition musculaire' },
    { value: 'medical', label: 'Prescription médicale' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sédentaire' },
    { value: 'light', label: 'Léger (1-3x/sem)' },
    { value: 'moderate', label: 'Modéré (3-5x/sem)' },
    { value: 'active', label: 'Actif (6-7x/sem)' },
    { value: 'very_active', label: 'Très actif (2x/jour)' }
  ];

  const sodiumSources = [
    { category: 'Pain et céréales', sodium: 400, serving: '100g pain', tips: 'Choisir pain sans sel ajouté' },
    { category: 'Charcuterie', sodium: 1200, serving: '100g jambon', tips: 'Limiter à 2-3x/semaine max' },
    { category: 'Fromage', sodium: 800, serving: '100g fromage dur', tips: 'Fromage frais moins salé' },
    { category: 'Plats préparés', sodium: 900, serving: '1 portion', tips: 'Cuisiner maison autant que possible' },
    { category: 'Sauce soja', sodium: 5500, serving: '100ml', tips: 'Version allégée en sodium' },
    { category: 'Conserves', sodium: 600, serving: '100g légumes', tips: 'Rincer avant consommation' },
    { category: 'Chips/snacks', sodium: 1000, serving: '100g', tips: 'Remplacer par fruits secs' },
    { category: 'Bouillon cube', sodium: 20000, serving: '1 cube', tips: 'Bouillon maison aux herbes' }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        age: profile.demographics.age?.toString() || '',
        weight: profile.demographics.weight?.toString() || '',
        activityLevel: profile.demographics.activityLevel || 'moderate'
      }));
    }
  }, []);

  useEffect(() => {
    calculateSodiumNeeds();
  }, [formData]);

  const calculateSodiumNeeds = () => {
    const { age, weight, bloodPressure, activityLevel, climate, goal, currentSodium } = formData;
    
    if (!age || !weight) return;

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const currentSodiumNum = parseFloat(currentSodium) || 3000; // Moyenne française

    // Base selon recommandations OMS/AHA
    let baseSodium = 2300; // mg/jour (limite supérieure)
    let minSodium = 500;   // mg/jour (minimum physiologique)

    // Ajustements selon pression artérielle
    switch (bloodPressure) {
      case 'low':
        baseSodium = 3000; // Plus permissif pour hypotension
        break;
      case 'high':
        baseSodium = 1500; // Restriction importante
        break;
      case 'very_high':
        baseSodium = 1000; // Restriction sévère
        break;
    }

    // Ajustements selon objectif
    switch (goal) {
      case 'definition':
        baseSodium = Math.min(baseSodium, 1000); // Restriction pour définition
        break;
      case 'performance':
        // Plus permissif pour performance
        baseSodium = Math.max(baseSodium, 2000);
        break;
      case 'medical':
        baseSodium = 1500; // Approche médicale conservative
        break;
    }

    // Besoins supplémentaires selon activité et climat
    const activityMultipliers = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.2,
      active: 1.3,
      very_active: 1.5
    };

    const climateMultipliers = {
      cold: 0.9,
      temperate: 1.0,
      hot: 1.3,
      very_hot: 1.6
    };

    const exerciseNeeds = Math.round(
      (baseSodium * activityMultipliers[activityLevel as keyof typeof activityMultipliers] * 
       climateMultipliers[climate as keyof typeof climateMultipliers]) - baseSodium
    );

    const targetSodium = baseSodium;
    const maxSodium = Math.min(baseSodium + exerciseNeeds, 4000); // Plafond sécurité

    // Évaluation rétention d'eau
    let waterRetention = '';
    if (currentSodiumNum > 3000) {
      waterRetention = 'Rétention probable (>3g/jour)';
    } else if (currentSodiumNum > 2300) {
      waterRetention = 'Rétention possible (>2.3g/jour)';
    } else if (currentSodiumNum < 1000) {
      waterRetention = 'Risque de déshydratation (<1g/jour)';
    } else {
      waterRetention = 'Niveau optimal';
    }

    // Recommandations d'aliments selon objectif
    let recommendations = [...sodiumSources];
    
    if (goal === 'definition' || bloodPressure === 'high') {
      // Mettre en avant les sources cachées à éviter
      recommendations = recommendations
        .sort((a, b) => b.sodium - a.sodium)
        .slice(0, 6);
    } else {
      // Sources communes à modérer
      recommendations = recommendations
        .filter(item => item.sodium < 2000)
        .slice(0, 6);
    }

    setResults({
      targetSodium,
      minSodium,
      maxSodium,
      exerciseNeeds,
      waterRetention,
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
          <h3 className="text-2xl font-bold mb-6">Profil et conditions</h3>
          
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
              <label htmlFor="weight">Poids (kg)</label>
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
          </div>

          <div className="input-group-custom">
            <label htmlFor="bloodPressure">Pression artérielle</label>
            <select
              id="bloodPressure"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {bloodPressureTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="activityLevel">Niveau d'activité</label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="climate">Climat/environnement</label>
            <select
              id="climate"
              name="climate"
              value={formData.climate}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {climates.map(climate => (
                <option key={climate.value} value={climate.value}>
                  {climate.label}
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
            <label htmlFor="currentSodium">Sodium actuel (mg/jour)</label>
            <input
              type="number"
              id="currentSodium"
              name="currentSodium"
              value={formData.currentSodium}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 3000"
              min="500"
              max="8000"
            />
            <small className="text-muted-foreground">
              Moyenne française : 3400mg (homme), 2700mg (femme)
            </small>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Recommandations sodium</h3>
          
          {results.targetSodium > 0 ? (
            <div className="space-y-6">
              {/* Targets */}
              <div className="grid gap-4">
                <div className="result-card bg-gradient-success">
                  <div className="result-value">{results.targetSodium}mg</div>
                  <div className="result-label">Objectif quotidien</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="result-card">
                    <div className="result-value text-lg">{results.minSodium}mg</div>
                    <div className="result-label text-sm">Minimum vital</div>
                  </div>
                  <div className="result-card">
                    <div className="result-value text-lg">{results.maxSodium}mg</div>
                    <div className="result-label text-sm">Maximum sécurité</div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className={`bg-card border rounded-lg p-4 ${
                results.waterRetention.includes('probable') || results.waterRetention.includes('déshydratation') 
                  ? 'border-orange-200 bg-orange-50' 
                  : 'border-green-200 bg-green-50'
              }`}>
                <h4 className="font-semibold mb-2 flex items-center">
                  <i className="fas fa-tint mr-2"></i>
                  Statut rétention d'eau
                </h4>
                <div className="text-lg font-medium">{results.waterRetention}</div>
                {results.exerciseNeeds > 0 && (
                  <p className="text-sm mt-2">
                    Besoins sport/climat : +{results.exerciseNeeds}mg
                  </p>
                )}
              </div>

              {/* Food Sources */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2 text-orange-600"></i>
                  Sources principales à surveiller
                </h4>
                <div className="space-y-3">
                  {results.recommendations.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{item.category}</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          item.sodium > 1000 
                            ? 'bg-red-100 text-red-800' 
                            : item.sodium > 500 
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.sodium}mg
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{item.serving}</div>
                      <div className="text-sm text-blue-600 font-medium">{item.tips}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Stratégies de réduction
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Cuisine maison :</strong> Contrôle total du sodium ajouté</li>
                  <li>• <strong>Épices/herbes :</strong> Remplacer sel par aromates naturels</li>
                  <li>• <strong>Potassium :</strong> Bananes, épinards pour équilibre Na/K</li>
                  <li>• <strong>Lecture étiquettes :</strong> &lt;400mg/100g = acceptable</li>
                </ul>
              </div>

              {/* Warnings */}
              {formData.bloodPressure === 'high' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-red-800 flex items-center">
                    <i className="fas fa-heart mr-2"></i>
                    Attention médicale
                  </h4>
                  <p className="text-sm text-red-700">
                    Hypertension détectée. Consultez votre médecin pour un suivi personnalisé 
                    et respectez ses recommandations sodium.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-balance-scale text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos informations pour voir les recommandations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SodiumCalculator;
