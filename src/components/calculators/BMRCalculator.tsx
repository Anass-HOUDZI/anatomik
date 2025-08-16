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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Inputs Section */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-edit text-primary"></i>
            <h3 className="text-lg font-semibold text-foreground">Paramètres</h3>
          </div>
          <div className="space-y-3">
            <MobileInputGroup label="Âge (années)">
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="mobile-input-field h-8 text-sm"
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
                className="mobile-select h-8 text-sm"
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
                className="mobile-input-field h-8 text-sm"
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
                className="mobile-input-field h-8 text-sm"
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
                className="mobile-select h-8 text-sm"
              >
                {activityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </MobileInputGroup>
            
            <div className="border-t border-border pt-3 mt-4">
              <MobileButton
                onClick={saveProfile}
                variant="primary"
                fullWidth
                className="h-8 text-sm"
              >
                <i className="fas fa-save mr-1"></i>
                Appliquer et Sauvegarder
              </MobileButton>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fas fa-calculator text-primary"></i>
            <h3 className="text-lg font-semibold text-foreground">Résultats</h3>
          </div>
          {results.bmr > 0 ? (
            <div className="space-y-3">
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

              <MobileGrid cols={2} className="gap-2">
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

              <div className="bg-muted border border-border rounded-lg p-3 mt-3">
                <h4 className="font-medium mb-2 flex items-center text-foreground text-sm">
                  <i className="fas fa-lightbulb text-primary mr-1"></i>
                  Conseils d'utilisation
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>Maintenance :</strong> Pour stabiliser votre poids</li>
                  <li>• <strong>Prise de masse :</strong> Augmentation progressive</li>
                  <li>• <strong>Sèche :</strong> Déficit contrôlé, ajustez selon résultats</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <i className="fas fa-calculator text-2xl mb-2"></i>
              <p className="text-sm">Remplissez vos informations pour voir les résultats</p>
            </div>
          )}
        </div>
      </div>
    </MobileCalculatorLayout>
  );
};

export default BMRCalculator;
