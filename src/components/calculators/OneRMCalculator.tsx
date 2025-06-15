
import React, { useState, useEffect } from 'react';

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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Informations de performance</h3>
          
          <div className="input-group-custom">
            <label htmlFor="exercise">Exercice</label>
            <select
              id="exercise"
              name="exercise"
              value={formData.exercise}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {exercises.map(exercise => (
                <option key={exercise.value} value={exercise.value}>
                  {exercise.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="weight">Poids soulevé (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 100"
              min="5"
              max="500"
              step="0.5"
            />
          </div>

          <div className="input-group-custom">
            <label htmlFor="reps">Nombre de répétitions</label>
            <input
              type="number"
              id="reps"
              name="reps"
              value={formData.reps}
              onChange={handleInputChange}
              className="form-control-custom"
              placeholder="Ex: 5"
              min="1"
              max="20"
            />
            <small className="text-muted-foreground mt-1 block">
              Pour une estimation précise, utilisez 1-12 répétitions
            </small>
          </div>

          {selectedExercise && (
            <div className="bg-card border border-custom rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary text-white flex items-center justify-center">
                  <i className={`fas ${selectedExercise.icon}`}></i>
                </div>
                <div>
                  <h4 className="font-semibold">{selectedExercise.label}</h4>
                  <p className="text-sm text-muted-foreground">Exercice sélectionné</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card border border-custom rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <i className="fas fa-info-circle text-info mr-2"></i>
              À propos du calcul
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Utilise 4 formules scientifiques (Brzycki, Epley, etc.)</li>
              <li>• Plus précis avec 1-8 répétitions</li>
              <li>• Estimation théorique, testez progressivement</li>
              <li>• Échauffement complet obligatoire</li>
            </ul>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold mb-6">Votre 1RM et charges d'entraînement</h3>
          
          {results.oneRM > 0 ? (
            <div className="space-y-6">
              {/* 1RM Result */}
              <div className="result-card bg-gradient-primary">
                <div className="result-value text-5xl">{results.oneRM}kg</div>
                <div className="result-label text-xl">1RM Estimé</div>
                <small className="text-sm opacity-75 mt-2 block">
                  Basé sur {formData.weight}kg × {formData.reps} répétitions
                </small>
              </div>

              {/* Training Percentages */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="text-xl font-semibold mb-6">Charges d'entraînement recommandées</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <span className="font-bold text-lg">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-custom rounded-lg p-4">
                  <h5 className="font-semibold text-primary mb-3">Force (1-5 reps)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>95%</span>
                      <strong>{results.percentages['95%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>90%</span>
                      <strong>{results.percentages['90%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>85%</span>
                      <strong>{results.percentages['85%']}kg</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-custom rounded-lg p-4">
                  <h5 className="font-semibold text-secondary mb-3">Hypertrophie (6-12 reps)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>80%</span>
                      <strong>{results.percentages['80%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>75%</span>
                      <strong>{results.percentages['75%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>70%</span>
                      <strong>{results.percentages['70%']}kg</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-custom rounded-lg p-4">
                  <h5 className="font-semibold text-success mb-3">Endurance (12+ reps)</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>65%</span>
                      <strong>{results.percentages['65%']}kg</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>60%</span>
                      <strong>{results.percentages['60%']}kg</strong>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Échauffement</span>
                      <span>40-50%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Warning */}
              <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-4">
                <h4 className="font-semibold text-warning mb-2 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Sécurité et Précautions
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Ne tentez jamais un 1RM sans échauffement complet</li>
                  <li>• Utilisez toujours un spotteur pour les exercices dangereux</li>
                  <li>• Ces valeurs sont des estimations, progressez graduellement</li>
                  <li>• Testez votre vrai 1RM uniquement si vous êtes expérimenté</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-weight-hanging text-4xl mb-4"></i>
              <p className="text-lg">Entrez votre performance pour calculer votre 1RM</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneRMCalculator;
