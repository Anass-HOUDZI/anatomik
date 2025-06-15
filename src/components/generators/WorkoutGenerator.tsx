
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select } from "../ui/select";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";

// Options statiques pour la première version
const levels = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];
const goals = [
  { value: "muscle", label: "Prise de muscle" },
  { value: "strength", label: "Force" },
  { value: "lose_fat", label: "Perte de graisse" },
  { value: "maintenance", label: "Maintien" },
];
const days = [2, 3, 4, 5, 6];
const equipmentOptions = [
  { value: "none", label: "Poids du corps uniquement" },
  { value: "basic", label: "Matériel de base (haltères, élastiques...)" },
  { value: "full_gym", label: "Salle complète" },
];

type Program = {
  title: string;
  split: string;
  sessions: Array<{
    day: string;
    focus: string;
    blocks: string[];
  }>;
};

function generateProgram(level: string, goal: string, dayCount: number, equip: string): Program {
  // Variante simple et statique : 3 modèles - minimal pour v1
  let split = "Full body";
  if (dayCount >= 4 && equip === "full_gym") split = "Split haut/bas";
  if (dayCount >= 5) split = "Push/Pull/Jambes";

  // Exemples génériques
  const sessions = Array.from({ length: dayCount }, (_, i) => ({
    day: `Jour ${i + 1}`,
    focus: split === "Full body" ? "Corps entier"
      : split === "Split haut/bas" ? (i % 2 === 0 ? "Haut du corps" : "Bas du corps")
      : i % 3 === 0 ? "Push (pectoraux/épaules/triceps)" : i % 3 === 1 ? "Pull (dos/biceps)" : "Jambes",
    blocks: [
      equip === "none"
        ? "Squats au poids du corps, Pompes, Fentes" 
        : equip === "basic"
          ? "Goblet Squat, Rowing haltère, Développé couché haltère"
          : split === "Push/Pull/Jambes"
            ? [
              i % 3 === 0 ? "Développé couché barre/pectoraux – 4x8-12" : "",
              i % 3 === 1 ? "Rowing barre/dos – 4x8-12" : "",
              i % 3 === 2 ? "Squat/Jambes – 4x8-12" : "",
            ].filter(Boolean).join(', ')
            : "Combiné machines + poids libres"
    ]
  }));

  return {
    title: `${split} - ${dayCount} séances/semaine`,
    split,
    sessions
  };
}

export default function WorkoutGenerator() {
  const { toast } = useToast();
  const [level, setLevel] = useState(levels[0].value);
  const [goal, setGoal] = useState(goals[0].value);
  const [daysPerWeek, setDaysPerWeek] = useState(days[1]);
  const [equipment, setEquipment] = useState(equipmentOptions[1].value);
  const [result, setResult] = useState<Program | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = generateProgram(level, goal, daysPerWeek, equipment);
    setResult(prog);
    toast({
      title: "Programme généré !",
      description: `Plan ${prog.title} : consulte tes séances ci-dessous.`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-2xl p-8 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-list-alt text-primary" />
        Générateur de Programmes d&apos;Entraînement
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1 font-medium">Niveau :</label>
          <select
            className="w-full border rounded px-2 py-2"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Objectif :</label>
          <select
            className="w-full border rounded px-2 py-2"
            value={goal}
            onChange={e => setGoal(e.target.value)}
          >
            {goals.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Séances / semaine :</label>
          <select
            className="w-full border rounded px-2 py-2"
            value={daysPerWeek}
            onChange={e => setDaysPerWeek(Number(e.target.value))}
          >
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 font-medium">Matériel disponible :</label>
          <select
            className="w-full border rounded px-2 py-2"
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
          >
            {equipmentOptions.map(eq => <option key={eq.value} value={eq.value}>{eq.label}</option>)}
          </select>
        </div>
        <div className="col-span-2 flex justify-end">
          <Button type="submit" className="bg-primary text-white">
            Générer le programme
          </Button>
        </div>
      </form>

      {result && (
        <Card className="p-6 mt-4 space-y-4">
          <h3 className="text-xl font-bold mb-2">{result.title}</h3>
          <div className="mb-1 text-sm text-muted-foreground">{result.split}</div>
          <div className="divide-y divide-border">
            {result.sessions.map((sess, idx) => (
              <div key={idx} className="py-3">
                <div className="font-semibold mb-1">{sess.day} <span className="ml-2 text-xs bg-accent px-2 py-1 rounded">{sess.focus}</span></div>
                <div className="text-sm">{sess.blocks}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
