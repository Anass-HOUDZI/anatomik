
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

type Meal = {
  name: string;
  foods: string[];
};

type DayPlan = {
  date: string;
  meals: Meal[];
};

const defaultMealNames = [
  "Petit-déjeuner",
  "Déjeuner",
  "Dîner",
  "Snack"
];

function getDefaultMeals(mealsPerDay: number, veget: boolean, vegan: boolean) {
  // Simple menu bank (à enrichir dans les prochaines versions)
  const omniChoices = [
    ["Oeufs, pain complet, banane"],
    ["Salade quinoa, poulet, légumes"],
    ["Pâtes bolo, parmesan, salade verte"],
    ["Yaourt nature, noix"],
  ];
  const vegetarianChoices = [
    ["Porridge flocons d'avoine, lait végétal, fruits"],
    ["Omelette, pommes de terre sautées, salade"],
    ["Curry tofu, riz basmati, brocolis"],
    ["Skyr, fruits rouges, amandes"],
  ];
  const veganChoices = [
    ["Tofu brouillé, pain complet, orange"],
    ["Buddha bowl lentilles, pois chiches, crudités"],
    ["Poêlée tempeh, riz complet, légumes verts"],
    ["Compote pomme-poire, oléagineux"],
  ];
  let bank = omniChoices;
  if (vegan) bank = veganChoices;
  else if (veget) bank = vegetarianChoices;
  // Build meals array
  return Array(mealsPerDay)
    .fill(0)
    .map((_, i) => ({
      name: defaultMealNames[i] || `Repas ${i + 1}`,
      foods: bank[i % bank.length],
    }));
}

export default function MealPlannerGenerator() {
  const { toast } = useToast();
  const [numDays, setNumDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [generated, setGenerated] = useState<DayPlan[] | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Génère le plan pour numDays à partir d'aujourd'hui
    const today = new Date();
    const days: DayPlan[] = [];
    for (let d = 0; d < numDays; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dayPlan: DayPlan = {
        date: date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" }),
        meals: getDefaultMeals(mealsPerDay, vegetarian, vegan)
      };
      days.push(dayPlan);
    }
    setGenerated(days);
    toast({
      title: "Planning généré !",
      description: `Planification sur ${numDays} jour(s) - ${mealsPerDay} repas/jour.`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-2xl p-8 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-calendar-week text-primary" />
        Planificateur de Repas Hebdomadaire
      </h2>
      <form className="space-y-4" onSubmit={handleGenerate}>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Jours à planifier :</label>
            <Input 
              type="number"
              min={1}
              max={14}
              value={numDays}
              onChange={e => setNumDays(Math.max(1, Math.min(14, Number(e.target.value))))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Repas / jour :</label>
            <select
              className="w-full border rounded px-2 py-2"
              value={mealsPerDay}
              onChange={e => setMealsPerDay(Number(e.target.value))}
            >
              {[2,3,4,5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={vegetarian}
              onChange={e => {
                setVegetarian(e.target.checked);
                if (e.target.checked) setVegan(false);
              }}
            />
            Végétarien
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={vegan}
              onChange={e => {
                setVegan(e.target.checked);
                if (e.target.checked) setVegetarian(false);
              }}
            />
            Végan
          </label>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-white">
            Générer la semaine
          </Button>
        </div>
      </form>
      {generated && (
        <Card className="p-4 mt-6">
          <h3 className="text-lg font-bold mb-4">Menu de la semaine</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="font-semibold p-2 border-b text-left">Jour</th>
                  {generated[0]?.meals.map((m,i) => (
                    <th key={i} className="font-semibold p-2 border-b text-left">{m.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generated.map((day, i) => (
                  <tr key={i} className="border-b">
                    <td className="font-semibold p-2">{day.date}</td>
                    {day.meals.map((meal, j) => (
                      <td key={j} className="p-2">
                        <ul className="list-disc list-inside space-y-1">
                          {meal.foods.map((f,k)=> <li key={k}>{f}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
