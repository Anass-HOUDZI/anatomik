
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const MineralsCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    weight: '',
    activityLevel: 'moderate',
    sweating: 'moderate',
    diet: 'omnivore',
    menstrual: 'regular',
    digestiveIssues: 'none'
  });

  const [results, setResults] = useState({
    mineralNeeds: {} as Record<string, {current: number, target: number, unit: string, status: string, absorption: number}>,
    interactions: [] as Array<{positive: string[], negative: string[], timing: string}>,
    recommendations: [] as Array<{mineral: string, dosage: string, form: string, timing: string, sources: string[]}>
  });

  const minerals = {
    'Fe': { name: 'Fer', baseNeed: 8, unit: 'mg', sportMultiplier: 1.6, femaleMultiplier: 2.2 },
    'Ca': { name: 'Calcium', baseNeed: 1000, unit: 'mg', sportMultiplier: 1.2, femaleMultiplier: 1.0 },
    'Mg': { name: 'Magnésium', baseNeed: 400, unit: 'mg', sportMultiplier: 1.5, femaleMultiplier: 0.9 },
    'Zn': { name: 'Zinc', baseNeed: 11, unit: 'mg', sportMultiplier: 1.4, femaleMultiplier: 0.7 },
    'Se': { name: 'Sélénium', baseNeed: 55, unit: 'μg', sportMultiplier: 1.3, femaleMultiplier: 1.0 },
    'Cr': { name: 'Chrome', baseNeed: 35, unit: 'μg', sportMultiplier: 1.4, femaleMultiplier: 0.7 },
    'Cu': { name: 'Cuivre', baseNeed: 900, unit: 'μg', sportMultiplier: 1.2, femaleMultiplier: 1.0 },
    'Mn': { name: 'Manganèse', baseNeed: 2.3, unit: 'mg', sportMultiplier: 1.3, femaleMultiplier: 0.8 }
  };

  const sweatingLevels = [
    { value: 'minimal', label: 'Minimal (bureau)' },
    { value: 'light', label: 'Léger' },
    { value: 'moderate', label: 'Modéré' },
    { value: 'heavy', label: 'Important' },
    { value: 'extreme', label: 'Extrême (sport intensif)' }
  ];

  const menstrualOptions = [
    { value: 'none', label: 'Aucune (ménopause/homme)' },
    { value: 'light', label: 'Règles légères' },
    { value: 'regular', label: 'Règles normales' },
    { value: 'heavy', label: 'Règles abondantes' }
  ];

  const digestiveOptions = [
    { value: 'none', label: 'Aucun problème' },
    { value: 'mild', label: 'Ballonnements occasionnels' },
    { value: 'ibs', label: 'Syndrome intestin irritable' },
    { value: 'crohn', label: 'Maladie inflammatoire' }
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
    calculateMineralNeeds();
  }, [formData]);

  const calculateMineralNeeds = () => {
    const { age, gender, weight, activityLevel, sweating, diet, menstrual, digestiveIssues } = formData;
    
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

    // Multiplicateurs sudation
    const sweatingMultipliers = {
      minimal: 1.0,
      light: 1.1,
      moderate: 1.2,
      heavy: 1.4,
      extreme: 1.6
    };

    const activityMult = activityMultipliers[activityLevel as keyof typeof activityMultipliers];
    const sweatingMult = sweatingMultipliers[sweating as keyof typeof sweatingMultipliers];

    const mineralNeeds: Record<string, {current: number, target: number, unit: string, status: string, absorption: number}> = {};
    const recommendations: Array<{mineral: string, dosage: string, form: string, timing: string, sources: string[]}> = [];

    // Calcul pour chaque minéral
    Object.entries(minerals).forEach(([key, mineral]) => {
      let need = mineral.baseNeed;
      
      // Ajustements de base
      if (gender === 'F') {
        need *= mineral.femaleMultiplier;
      }
      
      if (ageNum > 50 && ['Ca', 'Mg'].includes(key)) {
        need *= 1.2; // Besoins augmentés avec l'âge
      }

      // Activité sportive et sudation
      need *= mineral.sportMultiplier * (activityMult - 1) + 1;
      if (['Mg', 'Zn', 'Cr'].includes(key)) {
        need *= sweatingMult; // Pertes sudorales
      }

      // Ajustements spécifiques
      if (key === 'Fe') {
        // Fer selon menstruations et régime
        if (gender === 'F') {
          const menstrualMultipliers = {
            none: 0.5,
            light: 1.0,
            regular: 1.5,
            heavy: 2.0
          };
          need *= menstrualMultipliers[menstrual as keyof typeof menstrualMultipliers];
        }
        
        if (['vegetarian', 'vegan'].includes(diet)) {
          need *= 1.8; // Fer non-héminique moins absorbé
        }
      }

      if (key === 'Ca' && diet === 'vegan') {
        need *= 1.3; // Absorption réduite sources végétales
      }

      if (key === 'Zn' && diet === 'vegan') {
        need *= 1.5; // Phytates limitent absorption
      }

      // Estimation absorption selon facteurs
      let absorption = 0.25; // Base 25%
      
      switch (key) {
        case 'Fe':
          absorption = diet === 'omnivore' ? 0.18 : 0.10;
          if (digestiveIssues !== 'none') absorption *= 0.7;
          break;
        case 'Ca':
          absorption = 0.30;
          if (ageNum > 50) absorption *= 0.8;
          break;
        case 'Mg':
          absorption = 0.30;
          if (digestiveIssues !== 'none') absorption *= 0.6;
          break;
        case 'Zn':
          absorption = diet === 'omnivore' ? 0.20 : 0.15;
          break;
        default:
          absorption = 0.25;
      }

      // Estimation apports actuels selon régime
      let currentIntake = need * 0.7; // Base 70% des besoins
      
      switch (diet) {
        case 'omnivore':
          currentIntake = need * 0.80;
          break;
        case 'vegetarian':
          currentIntake = need * 0.75;
          if (key === 'Fe') currentIntake = need * 0.6;
          break;
        case 'vegan':
          currentIntake = need * 0.70;
          if (['Fe', 'Zn', 'Ca'].includes(key)) currentIntake = need * 0.5;
          break;
        case 'processed':
          currentIntake = need * 0.6;
          break;
      }

      // Ajustement problèmes digestifs
      if (digestiveIssues !== 'none') {
        currentIntake *= 0.8; // Absorption réduite
      }

      // Statut
      const effectiveIntake = currentIntake * absorption;
      const effectiveNeed = need * 0.25; // Besoin minimal absorbé
      
      let status = 'optimal';
      if (effectiveIntake < effectiveNeed * 0.7) status = 'déficient';
      else if (effectiveIntake < effectiveNeed * 0.9) status = 'insuffisant';

      mineralNeeds[key] = {
        current: Math.round(currentIntake * 10) / 10,
        target: Math.round(need * 10) / 10,
        unit: mineral.unit,
        status,
        absorption: Math.round(absorption * 100)
      };

      // Recommandations de supplémentation
      if (status !== 'optimal') {
        const deficit = need - currentIntake;
        const supplementDose = Math.round(deficit * 1.2 * 10) / 10; // +20% sécurité

        const forms: Record<string, string> = {
          'Fe': 'Bisglycinate (mieux toléré)',
          'Ca': 'Citrate ou malate',
          'Mg': 'Bisglycinate ou citrate',
          'Zn': 'Bisglycinate ou picolinate',
          'Se': 'Sélénométhionine',
          'Cr': 'Picolinate de chrome',
          'Cu': 'Bisglycinate',
          'Mn': 'Bisglycinate'
        };

        const timings: Record<string, string> = {
          'Fe': 'À jeun + vitamine C',
          'Ca': 'Répartir dans la journée',
          'Mg': 'Le soir (relaxant)',
          'Zn': 'À jeun (2h avant/après repas)',
          'Se': 'Avec repas',
          'Cr': 'Avec repas riches glucides',
          'Cu': 'Avec repas',
          'Mn': 'Avec repas'
        };

        const sources: Record<string, string[]> = {
          'Fe': ['Viande rouge', 'Boudin noir', 'Lentilles', 'Épinards'],
          'Ca': ['Produits laitiers', 'Sardines', 'Amandes', 'Brocolis'],
          'Mg': ['Chocolat noir', 'Noix', 'Légumes verts', 'Céréales complètes'],
          'Zn': ['Huîtres', 'Viande', 'Graines courge', 'Légumineuses'],
          'Se': ['Noix du Brésil', 'Poissons', 'Œufs', 'Champignons'],
          'Cr': ['Brocolis', 'Levure bière', 'Viandes', 'Céréales complètes'],
          'Cu': ['Foie', 'Fruits de mer', 'Noix', 'Chocolat'],
          'Mn': ['Thé', 'Noix', 'Céréales complètes', 'Légumes verts']
        };

        recommendations.push({
          mineral: mineral.name,
          dosage: `${supplementDose} ${mineral.unit}`,
          form: forms[key] || 'Forme chélatée',
          timing: timings[key] || 'Avec repas',
          sources: sources[key] || []
        });
      }
    });

    // Interactions minéraux
    const interactions = [
      {
        positive: ['Vitamine C + Fer', 'Vitamine D + Calcium', 'Magnésium + Calcium'],
        negative: ['Fer + Calcium', 'Zinc + Cuivre', 'Calcium + Magnésium (haute dose)'],
        timing: 'Espacer de 2h les minéraux antagonistes'
      }
    ];

    setResults({
      mineralNeeds,
      interactions,
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
          <h3 className="text-2xl font-bold mb-6">Profil et facteurs</h3>
          
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
            <label htmlFor="sweating">Niveau de sudation</label>
            <select
              id="sweating"
              name="sweating"
              value={formData.sweating}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {sweatingLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
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
              <option value="omnivore">Omnivore équilibré</option>
              <option value="vegetarian">Végétarien</option>
              <option value="vegan">Végétalien/Vegan</option>
              <option value="processed">Beaucoup de transformés</option>
            </select>
          </div>

          {formData.gender === 'F' && (
            <div className="input-group-custom">
              <label htmlFor="menstrual">Cycle menstruel</label>
              <select
                id="menstrual"
                name="menstrual"
                value={formData.menstrual}
                onChange={handleInputChange}
                className="form-control-custom"
              >
                {menstrualOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group-custom">
            <label htmlFor="digestiveIssues">Problèmes digestifs</label>
            <select
              id="digestiveIssues"
              name="digestiveIssues"
              value={formData.digestiveIssues}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {digestiveOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Statut minéral</h3>
          
          {Object.keys(results.mineralNeeds).length > 0 ? (
            <div className="space-y-6">
              {/* Mineral Status */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-gem mr-2 text-purple-600"></i>
                  Besoins et absorption
                </h4>
                <div className="space-y-3">
                  {Object.entries(results.mineralNeeds).map(([key, data]) => (
                    <div key={key} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{minerals[key as keyof typeof minerals].name}</span>
                          <div className={`text-sm ${
                            data.status === 'optimal' ? 'text-green-600' :
                            data.status === 'insuffisant' ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {data.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            {data.current} / {data.target} {data.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Absorption: {data.absorption}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <div className="bg-card border border-custom rounded-lg p-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <i className="fas fa-pills mr-2 text-blue-600"></i>
                    Supplémentation recommandée
                  </h4>
                  <div className="space-y-4">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{rec.mineral}</span>
                          <span className="text-blue-600 font-medium">{rec.dosage}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Forme:</strong> {rec.form}</div>
                          <div><strong>Prise:</strong> {rec.timing}</div>
                          <div><strong>Sources alimentaires:</strong> {rec.sources.join(', ')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactions */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-exchange-alt mr-2 text-orange-600"></i>
                  Interactions importantes
                </h4>
                {results.interactions.map((interaction, index) => (
                  <div key={index} className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-green-600 mb-1">Synergies positives:</div>
                      <div className="text-sm">{interaction.positive.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-600 mb-1">Antagonismes à éviter:</div>
                      <div className="text-sm">{interaction.negative.join(', ')}</div>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                      💡 {interaction.timing}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-purple-900 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Optimisation absorption
                </h4>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li>• <strong>Fer:</strong> Avec vitamine C, éviter thé/café (2h)</li>
                  <li>• <strong>Zinc:</strong> À jeun ou 2h après repas</li>
                  <li>• <strong>Magnésium:</strong> Le soir, favorise détente</li>
                  <li>• <strong>Calcium:</strong> Max 500mg par prise, répartir</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-gem text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos informations pour voir le statut minéral</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MineralsCalculator;
