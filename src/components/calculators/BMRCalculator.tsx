import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';
import { MobileCalculatorLayout, MobileInputGroup, MobileResultCard, MobileGrid, MobileButton } from '../ui/mobile-calculator';
import '../../styles/mobile-responsive.css';

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
    <MobileCalculatorLayout 
      title="Calculateur BMR" 
      description="Calculez vos besoins caloriques quotidiens selon votre profil et objectifs"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Form */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="mobile-subtitle lg:text-2xl font-bold text-gray-900 dark:text-white">Vos informations</h3>
          
          <MobileInputGroup label="Âge (années)">
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mobile-input-field"
              placeholder="Ex: 25"
              min="15"
              max="100"
            />
          </MobileInputGroup>

          <MobileInputGroup label="Sexe">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mobile-select"
            >
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </MobileInputGroup>

          <MobileInputGroup label="Poids (kg)">
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="mobile-input-field"
              placeholder="Ex: 70"
              min="30"
              max="200"
              step="0.1"
            />
          </MobileInputGroup>

          <MobileInputGroup label="Taille (cm)">
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="mobile-input-field"
              placeholder="Ex: 175"
              min="120"
              max="220"
            />
          </MobileInputGroup>

          <MobileInputGroup label="Niveau d'activité">
            <select
              id="activityLevel"
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="mobile-select"
            >
              {activityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </MobileInputGroup>

          <MobileButton
            onClick={saveProfile}
            variant="primary"
            fullWidth
            className="mt-6"
          >
            <i className="fas fa-save mr-2"></i>
            Sauvegarder le profil
          </MobileButton>
        </div>

        {/* Results */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="mobile-subtitle lg:text-2xl font-bold text-gray-900 dark:text-white">Vos résultats</h3>
          
          {results.bmr > 0 ? (
            <div className="space-y-4">
              <MobileResultCard
                value={results.bmr}
                label="BMR - Métabolisme de base"
                helper="Calories brûlées au repos"
                variant="default"
              />

              <MobileResultCard
                value={results.maintenance}
                label="TDEE - Maintien"
                helper="Besoins quotidiens avec activité"
                variant="success"
              />

              <MobileGrid cols={2} className="gap-3 lg:gap-4">
                <MobileResultCard
                  value={results.bulk}
                  label="Prise de masse"
                  helper="+15%"
                  variant="primary"
                />

                <MobileResultCard
                  value={results.cut}
                  label="Sèche"
                  helper="-20%"
                  variant="warning"
                />
              </MobileGrid>

              <div className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  Conseils d'utilisation
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• <strong>Maintenance :</strong> Pour stabiliser votre poids</li>
                  <li>• <strong>Prise de masse :</strong> Augmentation progressive, pesez-vous chaque semaine</li>
                  <li>• <strong>Sèche :</strong> Déficit contrôlé, ajustez selon les résultats</li>
                  <li>• <strong>Important :</strong> Ces valeurs sont des estimations, ajustez selon vos résultats</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12 text-gray-500 dark:text-gray-400">
              <i className="fas fa-calculator text-3xl lg:text-4xl mb-4"></i>
              <p className="mobile-body lg:text-lg">Remplissez vos informations pour voir les résultats</p>
            </div>
          )}
        </div>
      </div>
    </MobileCalculatorLayout>
  );
};

export default BMRCalculator;
