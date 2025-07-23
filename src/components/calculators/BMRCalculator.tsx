import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

const BMRCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    weight: '',
    height: '',
    activityLevel: '1.375'
  });
  
  const [results, setResults] = useState({
    bmr: 0,
    tdee: 0,
    maintenance: 0,
    bulk: 0,
    cut: 0
  });

  const activityLevels = [
    { value: '1.2', label: 'Sédentaire (pas d\'exercice)' },
    { value: '1.375', label: 'Légèrement actif (exercice léger 1-3j/semaine)' },
    { value: '1.55', label: 'Modérément actif (exercice modéré 3-5j/semaine)' },
    { value: '1.725', label: 'Très actif (exercice intense 6-7j/semaine)' },
    { value: '1.9', label: 'Extrêmement actif (travail physique + exercice)' }
  ];

  useEffect(() => {
    // Load user profile if exists
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        age: profile.demographics.age?.toString() || '',
        gender: profile.demographics.gender || 'M',
        weight: profile.demographics.weight?.toString() || '',
        height: profile.demographics.height?.toString() || '',
        activityLevel: profile.demographics.activityLevel || '1.375'
      }));
    }
  }, []);

  useEffect(() => {
    calculateBMR();
  }, [formData]);

  const calculateBMR = () => {
    const { age, gender, weight, height, activityLevel } = formData;
    
    if (!age || !weight || !height) {
      setResults({ bmr: 0, tdee: 0, maintenance: 0, bulk: 0, cut: 0 });
      return;
    }

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const activityNum = parseFloat(activityLevel);

    let bmr = 0;

    // Mifflin-St Jeor Equation
    if (gender === 'M') {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) + 5;
    } else {
      bmr = (10 * weightNum) + (6.25 * heightNum) - (5 * ageNum) - 161;
    }

    const tdee = bmr * activityNum;
    const maintenance = Math.round(tdee);
    const bulk = Math.round(tdee + (tdee * 0.15)); // +15% pour prise de masse
    const cut = Math.round(tdee - (tdee * 0.20)); // -20% pour sèche

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintenance,
      bulk,
      cut
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    const activityLevelMap: Record<string, 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'> = {
      '1.2': 'sedentary',
      '1.375': 'light',
      '1.55': 'moderate',
      '1.725': 'active',
      '1.9': 'very_active'
    };

    StorageManager.saveUserProfile({
      demographics: {
        age: parseFloat(formData.age),
        gender: formData.gender as 'M' | 'F',
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: activityLevelMap[formData.activityLevel] || 'moderate'
      }
    });
    
    // Show success message (you could use a toast here)
    alert('Profil sauvegardé avec succès !');
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Vos informations</h3>
          
          <div className="input-group-custom">
            <label htmlFor="age">Âge (années)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 25"
              min="15"
              max="100"
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
              min="30"
              max="200"
              step="0.1"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="height">Taille (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 175"
              min="120"
              max="220"
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

          <button
            onClick={saveProfile}
            className="btn-gradient-primary w-full py-3 rounded-lg font-semibold"
          >
            <i className="fas fa-save mr-2"></i>
            Sauvegarder le profil
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Vos résultats</h3>
          
          {results.bmr > 0 ? (
            <div className="space-y-4">
              <div className="result-card">
                <div className="result-value">{results.bmr}</div>
                <div className="result-label">BMR - Métabolisme de base</div>
                <small className="text-sm opacity-75 mt-2 block">
                  Calories brûlées au repos
                </small>
              </div>

              <div className="result-card bg-gradient-success">
                <div className="result-value">{results.maintenance}</div>
                <div className="result-label">TDEE - Maintien</div>
                <small className="text-sm opacity-75 mt-2 block">
                  Besoins quotidiens avec activité
                </small>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="result-card bg-gradient-secondary">
                  <div className="result-value text-2xl">{results.bulk}</div>
                  <div className="result-label text-base">Prise de masse</div>
                  <small className="text-xs opacity-75">+15%</small>
                </div>

                <div className="result-card bg-gradient-dark">
                  <div className="result-value text-2xl">{results.cut}</div>
                  <div className="result-label text-base">Sèche</div>
                  <small className="text-xs opacity-75">-20%</small>
                </div>
              </div>

              <div className="bg-card border border-custom rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <i className="fas fa-lightbulb text-warning mr-2"></i>
                  Conseils d'utilisation
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Maintenance :</strong> Pour stabiliser votre poids</li>
                  <li>• <strong>Prise de masse :</strong> Augmentation progressive, pesez-vous chaque semaine</li>
                  <li>• <strong>Sèche :</strong> Déficit contrôlé, ajustez selon les résultats</li>
                  <li>• <strong>Important :</strong> Ces valeurs sont des estimations, ajustez selon vos résultats</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-calculator text-4xl mb-4"></i>
              <p className="text-lg">Remplissez vos informations pour voir les résultats</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMRCalculator;
