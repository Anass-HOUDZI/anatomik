
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const VitaminsCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    weight: '',
    activityLevel: 'moderate',
    sunExposure: 'limited',
    diet: 'omnivore',
    smoking: 'no',
    stress: 'moderate',
    season: 'autumn'
  });

  const [results, setResults] = useState({
    vitaminNeeds: {} as Record<string, {current: number, target: number, unit: string, status: string}>,
    deficiencyRisk: [] as Array<{vitamin: string, risk: string, symptoms: string[], sources: string[]}>,
    recommendations: [] as Array<{vitamin: string, dosage: string, timing: string, notes: string}>
  });

  const vitamins = {
    'D': { name: 'Vitamine D', baseNeed: 15, unit: 'μg', sportMultiplier: 1.5 },
    'B12': { name: 'Vitamine B12', baseNeed: 2.4, unit: 'μg', sportMultiplier: 1.2 },
    'C': { name: 'Vitamine C', baseNeed: 90, unit: 'mg', sportMultiplier: 1.8 },
    'B9': { name: 'Folates (B9)', baseNeed: 400, unit: 'μg', sportMultiplier: 1.3 },
    'E': { name: 'Vitamine E', baseNeed: 15, unit: 'mg', sportMultiplier: 1.4 },
    'B6': { name: 'Vitamine B6', baseNeed: 1.3, unit: 'mg', sportMultiplier: 1.5 },
    'B1': { name: 'Thiamine (B1)', baseNeed: 1.2, unit: 'mg', sportMultiplier: 1.6 },
    'B2': { name: 'Riboflavine (B2)', baseNeed: 1.3, unit: 'mg', sportMultiplier: 1.4 }
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sédentaire' },
    { value: 'light', label: 'Léger (1-3x/sem)' },
    { value: 'moderate', label: 'Modéré (3-5x/sem)' },
    { value: 'active', label: 'Actif (6-7x/sem)' },
    { value: 'very_active', label: 'Très actif (2x/jour)' }
  ];

  const sunExposureOptions = [
    { value: 'minimal', label: 'Minimal (bureau/intérieur)' },
    { value: 'limited', label: 'Limité (sorties courtes)' },
    { value: 'moderate', label: 'Modéré (1h/jour dehors)' },
    { value: 'high', label: 'Élevé (activités extérieures)' }
  ];

  const dietOptions = [
    { value: 'omnivore', label: 'Omnivore équilibré' },
    { value: 'vegetarian', label: 'Végétarien' },
    { value: 'vegan', label: 'Végétalien/Vegan' },
    { value: 'processed', label: 'Beaucoup de transformés' },
    { value: 'raw', label: 'Alimentation vivante' }
  ];

  const seasonOptions = [
    { value: 'winter', label: 'Hiver (oct-mars)' },
    { value: 'summer', label: 'Été (avril-sept)' },
    { value: 'autumn', label: 'Automne' },
    { value: 'spring', label: 'Printemps' }
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        age: profile.demographics.age?.toString() || '',
        gender: profile.demographics.gender || 'M',
        weight: profile.demographics.weight?.toString() || '',
        activityLevel: profile.demographics.activityLevel || 'moderate'
      }));
    }
  }, []);

  useEffect(() => {
    calculateVitaminNeeds();
  }, [formData]);

  const calculateVitaminNeeds = () => {
    const { age, gender, weight, activityLevel, sunExposure, diet, smoking, stress, season } = formData;
    
    if (!age || !weight) return;

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);

    // Multiplicateurs d'activité
    const activityMultipliers = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.3,
      active: 1.5,
      very_active: 1.8
    };

    const activityMult = activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    const vitaminNeeds: Record<string, {current: number, target: number, unit: string, status: string}> = {};
    const deficiencyRisk: Array<{vitamin: string, risk: string, symptoms: string[], sources: string[]}> = [];
    const recommendations: Array<{vitamin: string, dosage: string, timing: string, notes: string}> = [];

    // Calcul pour chaque vitamine
    Object.entries(vitamins).forEach(([key, vitamin]) => {
      let need = vitamin.baseNeed;
      
      // Ajustements de base
      if (gender === 'F' && ['C', 'E', 'B6'].includes(key)) {
        need *= 0.9; // Besoins légèrement inférieurs pour femmes
      }
      
      if (ageNum > 50 && ['D', 'B12', 'B6'].includes(key)) {
        need *= 1.3; // Besoins augmentés avec l'âge
      }

      // Activité sportive
      need *= (vitamin.sportMultiplier - 1) * (activityMult - 1) + 1;

      // Ajustements spécifiques
      if (key === 'D') {
        // Vitamine D selon exposition solaire et saison
        const sunMultiplier = {
          minimal: 2.0,
          limited: 1.5,
          moderate: 1.2,
          high: 1.0
        };
        const seasonMultiplier = {
          winter: 1.8,
          autumn: 1.4,
          spring: 1.2,
          summer: 1.0
        };
        need *= sunMultiplier[sunExposure as keyof typeof sunMultiplier];
        need *= seasonMultiplier[season as keyof typeof seasonMultiplier];
      }

      if (key === 'C') {
        // Vitamine C selon stress et tabac
        if (smoking === 'yes') need *= 1.5;
        if (stress === 'high') need *= 1.3;
      }

      if (key === 'B12' && ['vegetarian', 'vegan'].includes(diet)) {
        need *= 1.5; // Besoins augmentés végétariens
      }

      // Estimation apports actuels selon régime
      let currentIntake = need * 0.7; // Base 70% des besoins
      
      switch (diet) {
        case 'omnivore':
          currentIntake = need * 0.85;
          break;
        case 'vegetarian':
          currentIntake = need * 0.75;
          if (key === 'B12') currentIntake = need * 0.3;
          break;
        case 'vegan':
          currentIntake = need * 0.70;
          if (['B12', 'D'].includes(key)) currentIntake = need * 0.2;
          break;
        case 'processed':
          currentIntake = need * 0.6;
          break;
      }

      // Statut
      let status = 'optimal';
      if (currentIntake < need * 0.7) status = 'déficient';
      else if (currentIntake < need * 0.9) status = 'insuffisant';

      vitaminNeeds[key] = {
        current: Math.round(currentIntake * 10) / 10,
        target: Math.round(need * 10) / 10,
        unit: vitamin.unit,
        status
      };

      // Risques de carences
      if (status !== 'optimal') {
        const symptoms: Record<string, string[]> = {
          'D': ['Fatigue', 'Faiblesse musculaire', 'Douleurs osseuses', 'Immunité affaiblie'],
          'B12': ['Fatigue extrême', 'Troubles cognitifs', 'Anémie', 'Fourmillements'],
          'C': ['Fatigue', 'Cicatrisation lente', 'Infections fréquentes', 'Saignements gingivaux'],
          'B9': ['Anémie', 'Fatigue', 'Troubles cognitifs', 'Dépression'],
          'E': ['Faiblesse musculaire', 'Troubles visuels', 'Immunité réduite'],
          'B6': ['Irritabilité', 'Dépression', 'Confusion', 'Anémie'],
          'B1': ['Fatigue', 'Troubles cardiaques', 'Troubles neurologiques'],
          'B2': ['Fissures coin bouche', 'Troubles visuels', 'Dermatite']
        };

        const sources: Record<string, string[]> = {
          'D': ['Poissons gras', 'Œufs', 'Champignons UV', 'Suppléments'],
          'B12': ['Viandes', 'Poissons', 'Œufs', 'Suppléments (végé)'],
          'C': ['Agrumes', 'Kiwi', 'Poivrons', 'Brocolis'],
          'B9': ['Légumes verts', 'Légumineuses', 'Foie', 'Céréales enrichies'],
          'E': ['Huiles végétales', 'Noix', 'Graines', 'Avocat'],
          'B6': ['Volaille', 'Poissons', 'Bananes', 'Pommes de terre'],
          'B1': ['Céréales complètes', 'Légumineuses', 'Porc', 'Graines'],
          'B2': ['Produits laitiers', 'Œufs', 'Légumes verts', 'Viandes']
        };

        deficiencyRisk.push({
          vitamin: vitamin.name,
          risk: status,
          symptoms: symptoms[key] || [],
          sources: sources[key] || []
        });
      }

      // Recommandations de supplémentation
      if (currentIntake < need * 0.8) {
        const deficit = need - currentIntake;
        let dosage = `${Math.round(deficit * 10) / 10} ${vitamin.unit}`;
        let timing = 'Avec repas';
        let notes = '';

        if (key === 'D') {
          timing = 'Avec repas gras';
          notes = 'Octobre à mars principalement';
        } else if (key === 'B12') {
          timing = 'À jeun ou avec repas';
          notes = 'Forme méthylcobalamine préférable';
        } else if (key === 'C') {
          timing = 'Répartir dans la journée';
          notes = 'Forme liposomale pour absorption';
        }

        recommendations.push({
          vitamin: vitamin.name,
          dosage,
          timing,
          notes
        });
      }
    });

    setResults({
      vitaminNeeds,
      deficiencyRisk,
      recommendations
    });
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
          <h3 className="text-2xl font-bold mb-6">Profil personnel</h3>
          
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
            <label htmlFor="sunExposure">Exposition solaire</label>
            <select
              id="sunExposure"
              name="sunExposure"
              value={formData.sunExposure}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {sunExposureOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="diet">Type d'alimentation</label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {dietOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group-custom">
              <label htmlFor="smoking">Tabac</label>
              <select
                id="smoking"
                name="smoking"
                value={formData.smoking}
                onChange={handleInputChange}
                className="form-control-custom"
              >
                <option value="no">Non</option>
                <option value="yes">Oui</option>
              </select>
            </div>

            <div className="input-group-custom">
              <label htmlFor="stress">Niveau de stress</label>
              <select
                id="stress"
                name="stress"
                value={formData.stress}
                onChange={handleInputChange}
                className="form-control-custom"
              >
                <option value="low">Faible</option>
                <option value="moderate">Modéré</option>
                <option value="high">Élevé</option>
              </select>
            </div>
          </div>

          <div className="input-group-custom">
            <label htmlFor="season">Saison actuelle</label>
            <select
              id="season"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {seasonOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Statut vitaminique</h3>
          
          {Object.keys(results.vitaminNeeds).length > 0 ? (
            <div className="space-y-6">
              {/* Vitamin Status */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-prescription-bottle mr-2 text-green-600"></i>
                  Besoins vs apports actuels
                </h4>
                <div className="space-y-3">
                  {Object.entries(results.vitaminNeeds).map(([key, data]) => (
                    <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{vitamins[key as keyof typeof vitamins].name}</span>
                        <div className={`text-sm ${
                          data.status === 'optimal' ? 'text-green-600' :
                          data.status === 'insuffisant' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {data.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {data.current} / {data.target} {data.unit}
                        </div>
                        <div className={`text-sm font-medium ${
                          data.current >= data.target * 0.9 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round((data.current / data.target) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deficiency Risks */}
              {results.deficiencyRisk.length > 0 && (
                <div className="bg-card border border-custom rounded-lg p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2 text-orange-600"></i>
                    Risques de carences
                  </h4>
                  <div className="space-y-4">
                    {results.deficiencyRisk.map((risk, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <div className="font-medium text-orange-800">{risk.vitamin}</div>
                        <div className="text-sm text-orange-700 mb-2">
                          Risque: {risk.risk}
                        </div>
                        <div className="text-sm mb-2">
                          <strong>Symptômes:</strong> {risk.symptoms.join(', ')}
                        </div>
                        <div className="text-sm">
                          <strong>Sources:</strong> {risk.sources.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplementation */}
              {results.recommendations.length > 0 && (
                <div className="bg-card border border-custom rounded-lg p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <i className="fas fa-pills mr-2 text-blue-600"></i>
                    Supplémentation recommandée
                  </h4>
                  <div className="space-y-3">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{rec.vitamin}</span>
                          <span className="text-blue-600 font-medium">{rec.dosage}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          <strong>Prise:</strong> {rec.timing}
                        </div>
                        {rec.notes && (
                          <div className="text-sm text-blue-600">{rec.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Conseils généraux
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• <strong>Synergie:</strong> Associer vitamines C + E pour effet antioxydant</li>
                  <li>• <strong>Absorption:</strong> Vitamines liposolubles (A,D,E,K) avec graisses</li>
                  <li>• <strong>Timing:</strong> B-complexe le matin, magnésium le soir</li>
                  <li>• <strong>Qualité:</strong> Formes actives privilégiées (méthyl-B12, etc.)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-prescription-bottle text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos informations pour voir le statut vitaminique</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitaminsCalculator;
