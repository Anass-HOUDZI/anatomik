import React, { useState, useEffect } from 'react';
import { MobileCalculatorLayout, MobileInputGroup, MobileResultCard, MobileGrid, MobileButton } from '../ui/mobile-calculator';
import '../../styles/mobile-responsive.css';

const OneRMCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: '',
    reps: '',
    exercise: 'squat'
  });

  const [results, setResults] = useState({
    oneRM: 0,
    percentages: {} as Record<string, number>,
    repRanges: {} as Record<string, { weight: number, reps: string }>
  });

  const exercises = [
    { value: 'squat', label: 'Squat', icon: 'fa-user-friends' },
    { value: 'bench', label: 'Développé couché', icon: 'fa-bed' },
    { value: 'deadlift', label: 'Soulevé de terre', icon: 'fa-weight-hanging' },
    { value: 'ohp', label: 'Développé militaire', icon: 'fa-hands' },
    { value: 'row', label: 'Rowing', icon: 'fa-arrows-alt-h' },
    { value: 'other', label: 'Autre exercice', icon: 'fa-dumbbell' }
  ];

  const formulas = [
    { name: 'Brzycki', formula: (w: number, r: number) => w / (1.0278 - 0.0278 * r) },
    { name: 'Epley', formula: (w: number, r: number) => w * (1 + r / 30) },
    { name: 'McGlothin', formula: (w: number, r: number) => 100 * w / (101.3 - 2.67123 * r) },
    { name: 'Lombardi', formula: (w: number, r: number) => w * Math.pow(r, 0.10) }
  ];

  const percentageRanges = [
    { percentage: 95, label: '95%', reps: '1-2', purpose: 'Force maximale' },
    { percentage: 90, label: '90%', reps: '2-4', purpose: 'Force' },
    { percentage: 85, label: '85%', reps: '4-6', purpose: 'Force/Puissance' },
    { percentage: 80, label: '80%', reps: '6-8', purpose: 'Hypertrophie/Force' },
    { percentage: 75, label: '75%', reps: '8-10', purpose: 'Hypertrophie' },
    { percentage: 70, label: '70%', reps: '10-12', purpose: 'Hypertrophie' },
    { percentage: 65, label: '65%', reps: '12-15', purpose: 'Endurance musculaire' },
    { percentage: 60, label: '60%', reps: '15+', purpose: 'Endurance' }
  ];

  useEffect(() => {
    calculate1RM();
  }, [formData]);

  const calculate1RM = () => {
    const weight = parseFloat(formData.weight);
    const reps = parseInt(formData.reps);

    if (!weight || !reps || weight <= 0 || reps <= 0 || reps > 20) {
      setResults({
        oneRM: 0,
        percentages: {},
        repRanges: {}
      });
      return;
    }

    // Calculate 1RM using multiple formulas and average them
    const oneRMValues = formulas.map(formula => formula.formula(weight, reps));
    const averageOneRM = oneRMValues.reduce((sum, val) => sum + val, 0) / oneRMValues.length;
    
    const oneRM = Math.round(averageOneRM * 10) / 10; // Round to 1 decimal

    // Calculate percentages
    const percentages: Record<string, number> = {};
    const repRanges: Record<string, { weight: number, reps: string }> = {};
    
    percentageRanges.forEach(range => {
      const weight = Math.round((oneRM * range.percentage / 100) * 2) / 2; // Round to nearest 0.5kg
      percentages[range.label] = weight;
      repRanges[range.label] = {
        weight,
        reps: range.reps
      };
    });

    setResults({
      oneRM,
      percentages,
      repRanges
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedExercise = exercises.find(ex => ex.value === formData.exercise);

  return (
    <MobileCalculatorLayout 
      title="Calculateur 1RM" 
      description="Estimez votre force maximale théorique sur un mouvement"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Input Form */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="mobile-subtitle lg:text-2xl font-bold text-gray-900 dark:text-white">Informations de performance</h3>
          
          <MobileInputGroup label="Exercice">
            <select
              id="exercise"
              name="exercise"
              value={formData.exercise}
              onChange={handleInputChange}
              className="mobile-select"
            >
              {exercises.map(exercise => (
                <option key={exercise.value} value={exercise.value}>
                  {exercise.label}
                </option>
              ))}
            </select>
          </MobileInputGroup>

          <MobileInputGroup label="Poids soulevé (kg)">
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="mobile-input-field"
              placeholder="Ex: 100"
              min="5"
              max="500"
              step="0.5"
            />
          </MobileInputGroup>

          <MobileInputGroup 
            label="Nombre de répétitions"
            helper="Pour une estimation précise, utilisez 1-12 répétitions"
          >
            <input
              type="number"
              id="reps"
              name="reps"
              value={formData.reps}
              onChange={handleInputChange}
              className="mobile-input-field"
              placeholder="Ex: 5"
              min="1"
              max="20"
            />
          </MobileInputGroup>

          {selectedExercise && (
            <div className="mobile-card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center">
                  <i className={`fas ${selectedExercise.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{selectedExercise.label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Exercice sélectionné</p>
                </div>
              </div>
            </div>
          )}

          <div className="mobile-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
              <i className="fas fa-info-circle text-blue-500 mr-2"></i>
              À propos du calcul
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Utilise 4 formules scientifiques (Brzycki, Epley, etc.)</li>
              <li>• Plus précis avec 1-8 répétitions</li>
              <li>• Estimation théorique, testez progressivement</li>
              <li>• Échauffement complet obligatoire</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <h3 className="mobile-subtitle lg:text-2xl font-bold text-gray-900 dark:text-white">Votre 1RM et charges d'entraînement</h3>
          
          {results.oneRM > 0 ? (
            <div className="space-y-4 lg:space-y-6">
              {/* 1RM Result */}
              <MobileResultCard
                value={`${results.oneRM}kg`}
                label="1RM Estimé"
                helper={`Basé sur ${formData.weight}kg × ${formData.reps} répétitions`}
                variant="primary"
                className="text-center"
              />

              {/* Training Percentages */}
              <div className="mobile-card border border-gray-200 dark:border-gray-700">
                <h4 className="mobile-subtitle lg:text-xl font-semibold mb-4 lg:mb-6 text-gray-900 dark:text-white">Charges d'entraînement recommandées</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  {percentageRanges.map((range, index) => (
                    <div
                      key={range.percentage}
                      className={`border border-custom rounded-lg p-4 transition-all hover:border-primary ${
                        range.percentage >= 80 ? 'bg-gradient-to-r from-primary/5 to-primary/10' :
                        range.percentage >= 70 ? 'bg-gradient-to-r from-secondary/5 to-secondary/10' :
                        'bg-gradient-to-r from-success/5 to-success/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {results.percentages[range.label]}kg
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          range.percentage >= 80 ? 'bg-primary text-white' :
                          range.percentage >= 70 ? 'bg-secondary text-white' :
                          'bg-success text-white'
                        }`}>
                          {range.label}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {range.reps} répétitions
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {range.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Programs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-card border border-custom rounded-lg p-4">
                  <h5 className="font-semibold text-primary mb-3 text-gray-900 dark:text-white">Force (1-5 reps)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">95%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['95%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">90%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['90%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">85%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['85%']}kg</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-custom rounded-lg p-4">
                  <h5 className="font-semibold text-secondary mb-3 text-gray-900 dark:text-white">Hypertrophie (6-12 reps)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">80%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['80%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">75%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['75%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">70%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['70%']}kg</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-custom rounded-lg p-4">
                  <h5 className="font-semibold text-success mb-3 text-gray-900 dark:text-white">Endurance (12+ reps)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">65%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['65%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white">60%</span>
                      <strong className="text-gray-900 dark:text-white">{results.percentages['60%']}kg</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="text-gray-900 dark:text-white">Échauffement</span>
                      <span className="text-gray-900 dark:text-white">40-50%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Warning */}
              <div className="mobile-card bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold mb-2 flex items-center text-orange-600 dark:text-orange-400">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Sécurité et Précautions
                </h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Ne tentez jamais un 1RM sans échauffement complet</li>
                  <li>• Utilisez toujours un spotteur pour les exercices dangereux</li>
                  <li>• Ces valeurs sont des estimations, progressez graduellement</li>
                  <li>• Testez votre vrai 1RM uniquement si vous êtes expérimenté</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12 text-gray-500 dark:text-gray-400">
              <i className="fas fa-weight-hanging text-3xl lg:text-4xl mb-4"></i>
              <p className="mobile-body lg:text-lg">Entrez votre performance pour calculer votre 1RM</p>
            </div>
          )}
        </div>
      </div>
    </MobileCalculatorLayout>
  );
};

export default OneRMCalculator;
