
import React, { useState } from 'react';

const NutrientDensityCalculator: React.FC = () => {
  const [selectedFoods, setSelectedFoods] = useState<Array<{food: any, quantity: number}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState({
    totalScore: 0,
    averageScore: 0,
    totalCalories: 0,
    recommendations: [] as string[]
  });

  // Base de données d'aliments avec scores de densité nutritionnelle
  const foodDatabase = [
    // Légumes verts (scores élevés)
    { name: 'Épinards crus', calories: 23, density: 95, category: 'Légumes', serving: '100g', vitamins: 8, minerals: 7, antioxidants: 9 },
    { name: 'Chou kale', calories: 50, density: 92, category: 'Légumes', serving: '100g', vitamins: 9, minerals: 8, antioxidants: 9 },
    { name: 'Brocolis', calories: 34, density: 89, category: 'Légumes', serving: '100g', vitamins: 8, minerals: 6, antioxidants: 8 },
    { name: 'Roquette', calories: 25, density: 87, category: 'Légumes', serving: '100g', vitamins: 7, minerals: 6, antioxidants: 8 },
    
    // Fruits (scores moyens-élevés)
    { name: 'Myrtilles', calories: 57, density: 85, category: 'Fruits', serving: '100g', vitamins: 6, minerals: 4, antioxidants: 10 },
    { name: 'Kiwi', calories: 61, density: 82, category: 'Fruits', serving: '100g', vitamins: 9, minerals: 5, antioxidants: 8 },
    { name: 'Oranges', calories: 47, density: 78, category: 'Fruits', serving: '100g', vitamins: 8, minerals: 4, antioxidants: 7 },
    { name: 'Fraises', calories: 32, density: 80, category: 'Fruits', serving: '100g', vitamins: 7, minerals: 4, antioxidants: 8 },
    
    // Protéines animales
    { name: 'Saumon sauvage', calories: 208, density: 75, category: 'Poissons', serving: '100g', vitamins: 7, minerals: 6, antioxidants: 5 },
    { name: 'Sardines', calories: 208, density: 72, category: 'Poissons', serving: '100g', vitamins: 6, minerals: 8, antioxidants: 4 },
    { name: 'Œufs entiers', calories: 155, density: 68, category: 'Protéines', serving: '100g', vitamins: 8, minerals: 6, antioxidants: 3 },
    { name: 'Blanc de poulet', calories: 165, density: 45, category: 'Protéines', serving: '100g', vitamins: 4, minerals: 4, antioxidants: 1 },
    
    // Légumineuses et graines
    { name: 'Lentilles cuites', calories: 116, density: 70, category: 'Légumineuses', serving: '100g', vitamins: 6, minerals: 7, antioxidants: 6 },
    { name: 'Graines de chia', calories: 486, density: 65, category: 'Graines', serving: '30g', vitamins: 5, minerals: 8, antioxidants: 7 },
    { name: 'Amandes', calories: 579, density: 58, category: 'Noix', serving: '30g', vitamins: 6, minerals: 7, antioxidants: 6 },
    
    // Céréales
    { name: 'Quinoa cuit', calories: 120, density: 62, category: 'Céréales', serving: '100g', vitamins: 5, minerals: 6, antioxidants: 4 },
    { name: 'Avoine complète', calories: 389, density: 55, category: 'Céréales', serving: '100g', vitamins: 6, minerals: 6, antioxidants: 3 },
    { name: 'Riz blanc cuit', calories: 130, density: 25, category: 'Céréales', serving: '100g', vitamins: 2, minerals: 2, antioxidants: 1 },
    
    // Aliments transformés (scores faibles)
    { name: 'Pain blanc', calories: 265, density: 20, category: 'Transformés', serving: '100g', vitamins: 2, minerals: 2, antioxidants: 0 },
    { name: 'Chips de pommes de terre', calories: 536, density: 15, category: 'Transformés', serving: '100g', vitamins: 1, minerals: 2, antioxidants: 1 },
    { name: 'Soda cola', calories: 42, density: 5, category: 'Boissons', serving: '100ml', vitamins: 0, minerals: 0, antioxidants: 0 },
    { name: 'Bonbons', calories: 400, density: 8, category: 'Sucreries', serving: '100g', vitamins: 0, minerals: 0, antioxidants: 0 }
  ];

  const categories = ['Tous', 'Légumes', 'Fruits', 'Poissons', 'Protéines', 'Légumineuses', 'Graines', 'Noix', 'Céréales', 'Transformés'];
  
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredFoods = foodDatabase.filter(food => 
    (selectedCategory === 'Tous' || food.category === selectedCategory) &&
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFood = (food: any) => {
    setSelectedFoods(prev => {
      const existing = prev.find(item => item.food.name === food.name);
      if (existing) {
        return prev.map(item => 
          item.food.name === food.name 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
    calculateResults();
  };

  const removeFood = (foodName: string) => {
    setSelectedFoods(prev => prev.filter(item => item.food.name !== foodName));
    calculateResults();
  };

  const updateQuantity = (foodName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFood(foodName);
      return;
    }
    setSelectedFoods(prev => 
      prev.map(item => 
        item.food.name === foodName 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    calculateResults();
  };

  const calculateResults = () => {
    if (selectedFoods.length === 0) {
      setResults({ totalScore: 0, averageScore: 0, totalCalories: 0, recommendations: [] });
      return;
    }

    const totalCalories = selectedFoods.reduce((sum, item) => 
      sum + (item.food.calories * item.quantity * getServingMultiplier(item.food.serving)), 0
    );

    const weightedScore = selectedFoods.reduce((sum, item) => {
      const servingCalories = item.food.calories * item.quantity * getServingMultiplier(item.food.serving);
      return sum + (item.food.density * servingCalories);
    }, 0);

    const averageScore = weightedScore / totalCalories;

    // Recommandations basées sur le score
    const recommendations = [];
    if (averageScore < 30) {
      recommendations.push('Score faible : Ajoutez plus de légumes verts et fruits');
      recommendations.push('Réduisez les aliments transformés et sucrés');
    } else if (averageScore < 50) {
      recommendations.push('Score moyen : Augmentez la proportion de légumes et fruits');
      recommendations.push('Remplacez les céréales raffinées par des complètes');
    } else if (averageScore < 70) {
      recommendations.push('Bon score : Maintenez cette qualité alimentaire');
      recommendations.push('Ajoutez des sources d\'oméga-3 (poissons gras, graines)');
    } else {
      recommendations.push('Excellent score : Alimentation très dense en nutriments !');
      recommendations.push('Continuez sur cette voie pour une santé optimale');
    }

    setResults({
      totalScore: Math.round(weightedScore),
      averageScore: Math.round(averageScore),
      totalCalories: Math.round(totalCalories),
      recommendations
    });
  };

  const getServingMultiplier = (serving: string) => {
    if (serving.includes('30g')) return 0.3;
    if (serving.includes('100ml')) return 1;
    return 1; // 100g par défaut
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    if (score >= 30) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Selection */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Sélection d'aliments</h3>
          
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="input-group-custom">
              <label htmlFor="search">Rechercher un aliment</label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control-custom"
                placeholder="Ex: épinards, saumon..."
              />
            </div>

            <div className="input-group-custom">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-control-custom"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Food List */}
          <div className="bg-card border border-custom rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold mb-3">Aliments disponibles</h4>
            <div className="space-y-2">
              {filteredFoods.map((food, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded hover:bg-muted cursor-pointer"
                     onClick={() => addFood(food)}>
                  <div>
                    <span className="font-medium">{food.name}</span>
                    <div className="text-sm text-muted-foreground">
                      {food.calories} kcal/{food.serving} • Score: {food.density}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(food.density)}`}>
                    {food.density}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <div className="bg-card border border-custom rounded-lg p-4">
              <h4 className="font-semibold mb-3">Aliments sélectionnés</h4>
              <div className="space-y-2">
                {selectedFoods.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                    <div className="flex-1">
                      <span className="font-medium">{item.food.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(item.food.calories * item.quantity * getServingMultiplier(item.food.serving))} kcal
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.food.name, item.quantity - 1)}
                        className="w-6 h-6 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.food.name, item.quantity + 1)}
                        className="w-6 h-6 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFood(item.food.name)}
                        className="w-6 h-6 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Analyse nutritionnelle</h3>
          
          {selectedFoods.length > 0 ? (
            <div className="space-y-6">
              {/* Score Summary */}
              <div className="grid gap-4">
                <div className={`result-card ${getScoreColor(results.averageScore).replace('text-', 'bg-gradient-').replace('-600', '').replace('bg-', '').replace('-50', '')}`}>
                  <div className="result-value">{results.averageScore}</div>
                  <div className="result-label">Score de densité nutritionnelle</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="result-card">
                    <div className="result-value text-lg">{results.totalCalories}</div>
                    <div className="result-label text-sm">Calories totales</div>
                  </div>
                  <div className="result-card">
                    <div className="result-value text-lg">{selectedFoods.length}</div>
                    <div className="result-label text-sm">Aliments analysés</div>
                  </div>
                </div>
              </div>

              {/* Score Interpretation */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-star mr-2 text-yellow-600"></i>
                  Interprétation du score
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-green-50 rounded">
                    <span>Excellent (70-100)</span>
                    <span className="font-medium">Très dense en nutriments</span>
                  </div>
                  <div className="flex justify-between p-2 bg-yellow-50 rounded">
                    <span>Bon (50-69)</span>
                    <span className="font-medium">Densité satisfaisante</span>
                  </div>
                  <div className="flex justify-between p-2 bg-orange-50 rounded">
                    <span>Moyen (30-49)</span>
                    <span className="font-medium">À améliorer</span>
                  </div>
                  <div className="flex justify-between p-2 bg-red-50 rounded">
                    <span>Faible (&lt;30)</span>
                    <span className="font-medium">Très peu de nutriments</span>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-chart-pie mr-2 text-blue-600"></i>
                  Répartition par catégorie
                </h4>
                <div className="space-y-3">
                  {Array.from(new Set(selectedFoods.map(item => item.food.category))).map(category => {
                    const categoryFoods = selectedFoods.filter(item => item.food.category === category);
                    const categoryCalories = categoryFoods.reduce((sum, item) => 
                      sum + (item.food.calories * item.quantity * getServingMultiplier(item.food.serving)), 0
                    );
                    const percentage = Math.round((categoryCalories / results.totalCalories) * 100);
                    
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{Math.round(categoryCalories)} kcal</span>
                          <span className="text-sm text-muted-foreground">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Recommandations personnalisées
                </h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>

              {/* Top Nutrients */}
              <div className="bg-card border border-custom rounded-lg p-6">
                <h4 className="font-semibold mb-4 flex items-center">
                  <i className="fas fa-medal mr-2 text-gold-600"></i>
                  Top aliments de votre sélection
                </h4>
                <div className="space-y-2">
                  {selectedFoods
                    .sort((a, b) => b.food.density - a.food.density)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                        <span className="font-medium">{item.food.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(item.food.density)}`}>
                            {item.food.density}
                          </span>
                          <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-star text-4xl mb-4"></i>
              <p className="text-lg">Sélectionnez des aliments pour analyser leur densité nutritionnelle</p>
              <p className="text-sm mt-2">Cliquez sur les aliments de gauche pour les ajouter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutrientDensityCalculator;
