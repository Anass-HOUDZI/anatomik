
import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/StorageManager';

interface Supplement {
  id: string;
  name: string;
  category: 'essential' | 'beneficial' | 'optional';
  description: string;
  dosage: string;
  timing: string;
  benefits: string[];
  interactions: string[];
  contraindications: string[];
  evidenceLevel: 'A' | 'B' | 'C';
  costEfficiency: number; // 1-5 scale
}

const SupplementsCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: '',
    goal: 'muscle_gain',
    diet: 'omnivore',
    budget: 'medium',
    experience: 'intermediate',
    health: [] as string[]
  });

  const [recommendations, setRecommendations] = useState<{
    essential: Supplement[];
    beneficial: Supplement[];
    optional: Supplement[];
    totalCost: number;
  }>({
    essential: [],
    beneficial: [],
    optional: [],
    totalCost: 0
  });

  const supplements: Supplement[] = [
    {
      id: 'creatine',
      name: 'Créatine monohydrate',
      category: 'essential',
      description: 'Augmente force, puissance et volume musculaire',
      dosage: '3-5g/jour',
      timing: 'Post-workout ou avec repas',
      benefits: ['Force +15%', 'Volume +8%', 'Récupération'],
      interactions: ['Caféine (légère diminution)'],
      contraindications: ['Problèmes rénaux'],
      evidenceLevel: 'A',
      costEfficiency: 5
    },
    {
      id: 'whey',
      name: 'Protéine Whey',
      category: 'beneficial',
      description: 'Protéine rapide pour synthèse musculaire',
      dosage: '25-30g/portion',
      timing: 'Post-workout + collations',
      benefits: ['Synthèse protéique', 'Récupération', 'Satiété'],
      interactions: [],
      contraindications: ['Intolérance lactose'],
      evidenceLevel: 'A',
      costEfficiency: 4
    },
    {
      id: 'vitamin_d',
      name: 'Vitamine D3',
      category: 'essential',
      description: 'Hormone régulatrice, souvent carencée',
      dosage: '2000-4000 UI/jour',
      timing: 'Avec repas gras',
      benefits: ['Immunité', 'Os', 'Testostérone', 'Force'],
      interactions: ['Calcium (synergie)'],
      contraindications: ['Hypercalcémie'],
      evidenceLevel: 'A',
      costEfficiency: 5
    },
    {
      id: 'omega3',
      name: 'Oméga-3 (EPA/DHA)',
      category: 'beneficial',
      description: 'Anti-inflammatoire, récupération',
      dosage: '2-3g/jour (EPA+DHA)',
      timing: 'Avec repas',
      benefits: ['Anti-inflammation', 'Récupération', 'Cognition'],
      interactions: ['Anticoagulants'],
      contraindications: ['Troubles coagulation'],
      evidenceLevel: 'A',
      costEfficiency: 4
    },
    {
      id: 'magnesium',
      name: 'Magnésium',
      category: 'beneficial',
      description: 'Minéral pour récupération et sommeil',
      dosage: '400-600mg/jour',
      timing: 'Soir, estomac vide',
      benefits: ['Sommeil', 'Récupération', 'Crampes'],
      interactions: ['Calcium (compétition)'],
      contraindications: ['Problèmes rénaux'],
      evidenceLevel: 'B',
      costEfficiency: 5
    },
    {
      id: 'caffeine',
      name: 'Caféine',
      category: 'beneficial',
      description: 'Stimulant pour performance',
      dosage: '3-6mg/kg (200-400mg)',
      timing: '30-45min pré-workout',
      benefits: ['Force +7%', 'Endurance', 'Focus'],
      interactions: ['Créatine (légère)', 'Stimulants'],
      contraindications: ['Hypertension', 'Anxiété'],
      evidenceLevel: 'A',
      costEfficiency: 5
    },
    {
      id: 'zinc',
      name: 'Zinc',
      category: 'optional',
      description: 'Minéral pour testostérone et immunité',
      dosage: '15-30mg/jour',
      timing: 'Estomac vide ou coucher',
      benefits: ['Testostérone', 'Immunité', 'Récupération'],
      interactions: ['Cuivre (compétition)', 'Fer'],
      contraindications: ['Surdosage toxique'],
      evidenceLevel: 'B',
      costEfficiency: 4
    },
    {
      id: 'bcaa',
      name: 'BCAA',
      category: 'optional',
      description: 'Acides aminés branchés',
      dosage: '10-15g',
      timing: 'Pendant workout ou jeûne',
      benefits: ['Anti-catabolisme', 'Endurance'],
      interactions: [],
      contraindications: ['Apport protéique suffisant'],
      evidenceLevel: 'C',
      costEfficiency: 2
    }
  ];

  const goals = [
    { value: 'muscle_gain', label: 'Prise de masse' },
    { value: 'fat_loss', label: 'Perte de graisse' },
    { value: 'performance', label: 'Performance' },
    { value: 'health', label: 'Santé générale' }
  ];

  const diets = [
    { value: 'omnivore', label: 'Omnivore' },
    { value: 'vegetarian', label: 'Végétarien' },
    { value: 'vegan', label: 'Végétalien' },
    { value: 'keto', label: 'Cétogène' }
  ];

  const budgets = [
    { value: 'low', label: 'Serré (<50€/mois)' },
    { value: 'medium', label: 'Modéré (50-100€/mois)' },
    { value: 'high', label: 'Élevé (>100€/mois)' }
  ];

  const healthConditions = [
    'Hypertension',
    'Diabète',
    'Problèmes rénaux',
    'Troubles digestifs',
    'Allergies',
    'Médication'
  ];

  useEffect(() => {
    const profile = StorageManager.getUserProfile();
    if (profile && profile.demographics) {
      setFormData(prev => ({
        ...prev,
        weight: profile.demographics.weight?.toString() || ''
      }));
    }
  }, []);

  useEffect(() => {
    calculateRecommendations();
  }, [formData]);

  const calculateRecommendations = () => {
    const { weight, goal, diet, budget, experience } = formData;
    
    if (!weight) return;

    const weightNum = parseFloat(weight);
    let filteredSupplements = [...supplements];

    // Filtrage selon régime alimentaire
    if (diet === 'vegan') {
      // Priorité B12, fer, zinc pour végans
      filteredSupplements = filteredSupplements.map(supp => {
        if (['vitamin_d', 'omega3', 'zinc'].includes(supp.id)) {
          return { ...supp, category: 'essential' as const };
        }
        return supp;
      });
    }

    // Filtrage selon objectif
    if (goal === 'fat_loss') {
      filteredSupplements = filteredSupplements.filter(supp => 
        !['bcaa'].includes(supp.id) // BCAA moins utiles en cutting avec apport protéique suffisant
      );
    }

    // Ajustement dosages selon poids
    filteredSupplements = filteredSupplements.map(supp => {
      let adjustedDosage = supp.dosage;
      if (supp.id === 'caffeine') {
        const caffeineDose = Math.round(weightNum * 4); // 4mg/kg
        adjustedDosage = `${Math.min(caffeineDose, 400)}mg/jour`;
      } else if (supp.id === 'whey') {
        const proteinNeeds = Math.round(weightNum * 0.4);
        adjustedDosage = `${proteinNeeds}g/portion`;
      }
      return { ...supp, dosage: adjustedDosage };
    });

    // Classement par catégorie et budget
    const essential = filteredSupplements.filter(s => s.category === 'essential');
    const beneficial = filteredSupplements.filter(s => s.category === 'beneficial');
    const optional = filteredSupplements.filter(s => s.category === 'optional');

    // Estimation coût mensuel (approximatif)
    const costs = {
      creatine: 15,
      whey: 45,
      vitamin_d: 8,
      omega3: 25,
      magnesium: 12,
      caffeine: 20,
      zinc: 10,
      bcaa: 35
    };

    const totalCost = [...essential, ...beneficial, ...optional]
      .reduce((sum, supp) => sum + (costs[supp.id as keyof typeof costs] || 0), 0);

    setRecommendations({
      essential,
      beneficial: budget === 'low' ? beneficial.slice(0, 2) : beneficial,
      optional: budget === 'high' ? optional : [],
      totalCost
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHealthChange = (condition: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      health: checked 
        ? [...prev.health, condition]
        : prev.health.filter(h => h !== condition)
    }));
  };

  const renderSupplementCard = (supplement: Supplement, categoryColor: string) => (
    <div key={supplement.id} className={`bg-card border border-custom rounded-lg p-4 ${categoryColor}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-lg">{supplement.name}</h4>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            supplement.evidenceLevel === 'A' ? 'bg-green-100 text-green-800' :
            supplement.evidenceLevel === 'B' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            Niveau {supplement.evidenceLevel}
          </span>
          <div className="flex">
            {[...Array(supplement.costEfficiency)].map((_, i) => (
              <i key={i} className="fas fa-euro-sign text-xs text-green-600"></i>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{supplement.description}</p>
      
      <div className="space-y-2 text-sm">
        <div><strong>Dosage :</strong> {supplement.dosage}</div>
        <div><strong>Timing :</strong> {supplement.timing}</div>
        
        <div>
          <strong>Bénéfices :</strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {supplement.benefits.map((benefit, index) => (
              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {benefit}
              </span>
            ))}
          </div>
        </div>
        
        {supplement.contraindications.length > 0 && (
          <div>
            <strong className="text-red-600">Attention :</strong>
            <span className="text-red-600 text-xs ml-1">
              {supplement.contraindications.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Profil utilisateur</h3>
          
          <div className="input-group-custom">
            <label htmlFor="weight">Poids corporel (kg)</label>
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
            <label htmlFor="diet">Régime alimentaire</label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {diets.map(diet => (
                <option key={diet.value} value={diet.value}>
                  {diet.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group-custom">
            <label htmlFor="budget">Budget mensuel</label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="form-control-custom"
            >
              {budgets.map(budget => (
                <option key={budget.value} value={budget.value}>
                  {budget.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium">Conditions de santé</label>
            {healthConditions.map(condition => (
              <label key={condition} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.health.includes(condition)}
                  onChange={(e) => handleHealthChange(condition, e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>

          <div className="bg-card border border-custom rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center">
              <i className="fas fa-euro-sign text-green-600 mr-2"></i>
              Coût estimé
            </h4>
            <div className="text-2xl font-bold text-green-600">{recommendations.totalCost}€/mois</div>
            <p className="text-sm text-muted-foreground">Basé sur vos sélections</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-bold">Recommandations personnalisées</h3>
          
          {/* Essential */}
          <div>
            <h4 className="text-xl font-semibold mb-4 flex items-center text-red-600">
              <i className="fas fa-star mr-2"></i>
              Essentiels (Priorité 1)
            </h4>
            <div className="grid gap-4">
              {recommendations.essential.map(supp => 
                renderSupplementCard(supp, 'border-red-200 bg-red-50')
              )}
            </div>
          </div>

          {/* Beneficial */}
          {recommendations.beneficial.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
                <i className="fas fa-thumbs-up mr-2"></i>
                Bénéfiques (Priorité 2)
              </h4>
              <div className="grid gap-4">
                {recommendations.beneficial.map(supp => 
                  renderSupplementCard(supp, 'border-orange-200 bg-orange-50')
                )}
              </div>
            </div>
          )}

          {/* Optional */}
          {recommendations.optional.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
                <i className="fas fa-plus-circle mr-2"></i>
                Optionnels (Priorité 3)
              </h4>
              <div className="grid gap-4">
                {recommendations.optional.map(supp => 
                  renderSupplementCard(supp, 'border-blue-200 bg-blue-50')
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="font-semibold mb-3 text-yellow-800 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Important à retenir
            </h4>
            <ul className="text-sm text-yellow-800 space-y-2">
              <li>• <strong>Alimentation d'abord :</strong> Les suppléments ne remplacent pas une nutrition équilibrée</li>
              <li>• <strong>Qualité :</strong> Choisir des marques testées par des tiers</li>
              <li>• <strong>Patience :</strong> Effets visibles après 4-8 semaines minimum</li>
              <li>• <strong>Médecin :</strong> Consulter en cas de traitement médical</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementsCalculator;
