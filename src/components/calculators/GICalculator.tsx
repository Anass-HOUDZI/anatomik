
import React, { useState } from 'react';

interface FoodGI {
  id: string;
  name: string;
  gi: number;
  category: string;
}

const GICalculator: React.FC = () => {
  const [selectedFoods, setSelectedFoods] = useState<Array<{ food: FoodGI; carbs: number }>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Base de données simplifiée d'aliments avec IG
  const foodDatabase: FoodGI[] = [
    // Céréales et féculents
    { id: '1', name: 'Riz blanc', gi: 70, category: 'cereales' },
    { id: '2', name: 'Riz complet', gi: 50, category: 'cereales' },
    { id: '3', name: 'Quinoa', gi: 35, category: 'cereales' },
    { id: '4', name: 'Avoine', gi: 40, category: 'cereales' },
    { id: '5', name: 'Pain blanc', gi: 85, category: 'cereales' },
    { id: '6', name: 'Pain complet', gi: 65, category: 'cereales' },
    { id: '7', name: 'Pâtes blanches', gi: 60, category: 'cereales' },
    { id: '8', name: 'Pâtes complètes', gi: 45, category: 'cereales' },
    
    // Légumineuses
    { id: '9', name: 'Lentilles', gi: 25, category: 'legumineuses' },
    { id: '10', name: 'Haricots rouges', gi: 30, category: 'legumineuses' },
    { id: '11', name: 'Pois chiches', gi: 35, category: 'legumineuses' },
    
    // Fruits
    { id: '12', name: 'Pomme', gi: 35, category: 'fruits' },
    { id: '13', name: 'Banane mûre', gi: 60, category: 'fruits' },
    { id: '14', name: 'Orange', gi: 40, category: 'fruits' },
    { id: '15', name: 'Pastèque', gi: 75, category: 'fruits' },
    { id: '16', name: 'Raisin', gi: 45, category: 'fruits' },
    
    // Légumes
    { id: '17', name: 'Pomme de terre', gi: 80, category: 'legumes' },
    { id: '18', name: 'Patate douce', gi: 55, category: 'legumes' },
    { id: '19', name: 'Carotte cuite', gi: 50, category: 'legumes' },
    { id: '20', name: 'Brocoli', gi: 15, category: 'legumes' },
    
    // Produits sucrés
    { id: '21', name: 'Glucose', gi: 100, category: 'sucres' },
    { id: '22', name: 'Miel', gi: 85, category: 'sucres' },
    { id: '23', name: 'Chocolat noir 70%', gi: 25, category: 'sucres' }
  ];

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFood = (food: FoodGI) => {
    setSelectedFoods(prev => [...prev, { food, carbs: 30 }]);
    setSearchTerm('');
  };

  const removeFood = (index: number) => {
    setSelectedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const updateCarbs = (index: number, carbs: number) => {
    setSelectedFoods(prev => prev.map((item, i) => 
      i === index ? { ...item, carbs } : item
    ));
  };

  // Calcul IG et CG du repas
  const calculateMealGI = () => {
    if (selectedFoods.length === 0) return { gi: 0, gl: 0 };
    
    const totalCarbs = selectedFoods.reduce((sum, item) => sum + item.carbs, 0);
    if (totalCarbs === 0) return { gi: 0, gl: 0 };
    
    const weightedGI = selectedFoods.reduce((sum, item) => {
      return sum + (item.food.gi * item.carbs);
    }, 0);
    
    const mealGI = weightedGI / totalCarbs;
    const mealGL = (mealGI * totalCarbs) / 100;
    
    return { gi: Math.round(mealGI), gl: Math.round(mealGL * 10) / 10 };
  };

  const { gi: mealGI, gl: mealGL } = calculateMealGI();

  const getGICategory = (gi: number) => {
    if (gi <= 35) return { label: 'Bas', color: 'text-green-600', bg: 'bg-green-100' };
    if (gi <= 50) return { label: 'Modéré', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Élevé', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getGLCategory = (gl: number) => {
    if (gl <= 10) return { label: 'Faible', color: 'text-green-600', bg: 'bg-green-100' };
    if (gl <= 20) return { label: 'Modérée', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { label: 'Élevée', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sélection des aliments */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Composition du repas</h3>
          
          {/* Recherche d'aliments */}
          <div className="input-group-custom">
            <label htmlFor="search">Rechercher un aliment</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-custom"
              placeholder="Ex: riz, pomme, pain..."
            />
          </div>

          {/* Résultats de recherche */}
          {searchTerm && (
            <div className="bg-card border border-custom rounded-lg max-h-60 overflow-y-auto">
              {filteredFoods.map(food => (
                <div
                  key={food.id}
                  className="p-3 border-b border-border last:border-b-0 hover:bg-accent cursor-pointer flex justify-between items-center"
                  onClick={() => addFood(food)}
                >
                  <div>
                    <span className="font-medium">{food.name}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getGICategory(food.gi).bg} ${getGICategory(food.gi).color}`}>
                      IG: {food.gi}
                    </span>
                  </div>
                  <i className="fas fa-plus text-primary"></i>
                </div>
              ))}
            </div>
          )}

          {/* Aliments sélectionnés */}
          <div className="space-y-3">
            <h4 className="font-semibold">Aliments du repas</h4>
            {selectedFoods.length === 0 ? (
              <p className="text-muted-foreground">Aucun aliment sélectionné</p>
            ) : (
              selectedFoods.map((item, index) => (
                <div key={index} className="bg-card border border-custom rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{item.food.name}</span>
                    <button
                      onClick={() => removeFood(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={item.carbs}
                      onChange={(e) => updateCarbs(index, parseFloat(e.target.value) || 0)}
                      className="form-control-custom w-20"
                      min="0"
                      step="5"
                    />
                    <span className="text-sm text-muted-foreground">g de glucides</span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getGICategory(item.food.gi).bg} ${getGICategory(item.food.gi).color}`}>
                      IG: {item.food.gi}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getGLCategory((item.food.gi * item.carbs) / 100).bg} ${getGLCategory((item.food.gi * item.carbs) / 100).color}`}>
                      CG: {Math.round((item.food.gi * item.carbs) / 10) / 10}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-6">Index glycémique du repas</h3>
          
          {selectedFoods.length > 0 ? (
            <div className="space-y-4">
              <div className="result-card bg-gradient-success">
                <div className="result-value">{mealGI}</div>
                <div className="result-label">Index Glycémique moyen</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${getGICategory(mealGI).bg} ${getGICategory(mealGI).color} mt-2`}>
                  {getGICategory(mealGI).label}
                </div>
              </div>

              <div className="result-card">
                <div className="result-value">{mealGL}</div>
                <div className="result-label">Charge Glycémique totale</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm ${getGLCategory(mealGL).bg} ${getGLCategory(mealGL).color} mt-2`}>
                  {getGLCategory(mealGL).label}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="result-card bg-gradient-secondary">
                  <div className="result-value text-2xl">{selectedFoods.reduce((sum, item) => sum + item.carbs, 0)}g</div>
                  <div className="result-label text-base">Glucides totaux</div>
                </div>

                <div className="result-card bg-gradient-dark">
                  <div className="result-value text-2xl">{selectedFoods.length}</div>
                  <div className="result-label text-base">Aliments</div>
                </div>
              </div>

              {/* Conseils selon IG/CG */}
              <div className="bg-card border border-custom rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center">
                  <i className="fas fa-lightbulb text-warning mr-2"></i>
                  Conseils d'utilisation
                </h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  {mealGI <= 35 ? (
                    <p>• <strong>IG bas :</strong> Idéal en période de repos ou sèche</p>
                  ) : mealGI <= 50 ? (
                    <p>• <strong>IG modéré :</strong> Bon compromis pour l'énergie stable</p>
                  ) : (
                    <p>• <strong>IG élevé :</strong> Parfait post-entraînement pour la récupération</p>
                  )}
                  
                  {mealGL <= 10 ? (
                    <p>• <strong>CG faible :</strong> Impact glycémique minimal</p>
                  ) : mealGL <= 20 ? (
                    <p>• <strong>CG modérée :</strong> Élévation glycémique contrôlée</p>
                  ) : (
                    <p>• <strong>CG élevée :</strong> Pic glycémique important</p>
                  )}
                  
                  <p>• <strong>Timing :</strong> Adapter selon l'objectif et l'activité</p>
                </div>
              </div>

              {/* Échelle de référence */}
              <div className="bg-card border border-custom rounded-lg p-4">
                <h4 className="font-semibold mb-3">Échelles de référence</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">Index Glycémique</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Bas</span>
                        <span className="text-green-600">≤ 35</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modéré</span>
                        <span className="text-orange-600">36-50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Élevé</span>
                        <span className="text-red-600">≥ 51</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Charge Glycémique</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Faible</span>
                        <span className="text-green-600">≤ 10</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Modérée</span>
                        <span className="text-orange-600">11-20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Élevée</span>
                        <span className="text-red-600">≥ 21</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <i className="fas fa-search text-4xl mb-4"></i>
              <p className="text-lg">Ajoutez des aliments pour calculer l'IG du repas</p>
              <p className="text-sm mt-2">Recherchez et sélectionnez les aliments de votre repas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GICalculator;
