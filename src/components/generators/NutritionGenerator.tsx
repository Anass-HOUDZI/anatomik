
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

/**
 * Générateur de menus simples : v1 = menu type selon calories + préférences
 */
const defaultPrefs = {
  vegetarian: false,
  vegan: false,
  allergies: "",
  mealsPerDay: 3,
};

type Menu = {
  calories: number;
  meals: {
    name: string;
    foods: string[];
    calories: number;
  }[];
  advice: string;
};

function generateMenu(
  calories: number,
  prefs: typeof defaultPrefs
): Menu {
  // Répartition macros simplifiée pour v1
  const macros = {
    protein: Math.round((calories * 0.25) / 4),
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.30) / 9),
  };

  // Exemples de repas de base (version simplifiée, on enrichira ensuite)
  const foodChoices = prefs.vegan
    ? [
        ["Porridge flocons avoine + lait d'avoine", "Banane", "Amandes"],
        ["Buddha bowl: quinoa, pois chiches, avocat", "Brocolis", "Huile olive"],
        ["Tofu sauté légumes + riz", "Yaourt soja nature", "Compote sans sucre"],
      ]
    : prefs.vegetarian
    ? [
        ["Oeufs brouillés", "Pain complet", "Tomates", "Fruits rouges"],
        ["Salade lentilles, feta, noix", "Carottes râpées", "Vinaigrette huile colza"],
        ["Curry tofu/légumes + riz basmati", "Fromage blanc", "Pomme"],
      ]
    : [
        ["Omelette 2 oeufs + jambon", "Toast complet", "Fruit", "Noix"],
        ["Poulet rôti", "Pâtes complètes", "Haricots verts", "Parmesan"],
        ["Cabillaud au four", "Pommes de terre vapeur", "Courgettes", "Yaourt nature"],
      ];

  // Allergen handling
  const allergyWarning = prefs.allergies
    ? `⚠️ Attention, vérifiez la présence possible d'allergènes : ${prefs.allergies}.`
    : "";

  const meals = Array(prefs.mealsPerDay)
    .fill(null)
    .map((_, idx) => ({
      name: ["Petit-déjeuner", "Déjeuner", "Dîner", "Snack"][idx] || `Repas ${idx + 1}`,
      foods: foodChoices[idx % foodChoices.length],
      calories: Math.round(calories / prefs.mealsPerDay),
    }));

  return {
    calories,
    meals,
    advice: [
      `Environ ${macros.protein}g protéines / ${macros.carbs}g glucides / ${macros.fat}g lipides à répartir sur la journée.`,
      allergyWarning,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export default function NutritionGenerator() {
  const { toast } = useToast();
  const [calories, setCalories] = useState(2200);
  const [prefs, setPrefs] = useState(defaultPrefs);
  const [result, setResult] = useState<Menu | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const menu = generateMenu(calories, prefs);
    setResult(menu);
    toast({
      title: "Menu généré !",
      description: `Plan de repas pour ${calories} kcal créé.`,
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-muted rounded-2xl p-8 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-utensils text-primary" />
        Générateur de Menus Nutritionnels
      </h2>
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Apport calorique (kcal/jour)
          </label>
          <Input
            type="number"
            min={1200}
            max={4500}
            value={calories}
            onChange={e => setCalories(Math.max(1200, Math.min(4500, Number(e.target.value))))}
          />
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.vegetarian}
              onChange={e =>
                setPrefs({ ...prefs, vegetarian: e.target.checked, vegan: e.target.checked ? false : prefs.vegan })
              }
            />
            Végétarien
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.vegan}
              onChange={e =>
                setPrefs({ ...prefs, vegan: e.target.checked, vegetarian: e.target.checked ? false : prefs.vegetarian })
              }
            />
            Végan
          </label>
        </div>
        <div>
          <label className="block text-sm mb-1">Allergies connues&nbsp;:</label>
          <Input
            placeholder="ex: gluten, lait, fruits à coque..."
            value={prefs.allergies}
            onChange={e => setPrefs({ ...prefs, allergies: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nombre de repas / jour :</label>
          <select
            className="w-full border rounded px-2 py-2"
            value={prefs.mealsPerDay}
            onChange={e => setPrefs({ ...prefs, mealsPerDay: Number(e.target.value) })}
          >
            {[3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-white">
            Générer le menu
          </Button>
        </div>
      </form>

      {result && (
        <Card className="p-6 mt-6 space-y-4">
          <h3 className="text-lg font-bold mb-2">Exemple de journée à {result.calories} kcal</h3>
          <div className="text-sm text-muted-foreground mb-2">{result.advice}</div>
          <div className="divide-y divide-border">
            {result.meals.map((meal, idx) => (
              <div key={idx} className="py-3">
                <div className="font-semibold mb-1">{meal.name} <span className="ml-2 text-xs bg-accent px-2 py-1 rounded">{meal.calories} kcal</span></div>
                <ul className="list-disc list-inside text-sm">
                  {meal.foods.map((food, i) => (
                    <li key={i}>{food}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
