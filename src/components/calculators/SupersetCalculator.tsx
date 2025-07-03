
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SimpleCard } from "@/components/ui/simple-card";
import { SimpleButton } from "@/components/ui/simple-button";

const exerciseSuggestions = [
  "Développé couché (pectoraux)",
  "Tirage horizontal (dos)",
  "Curl biceps",
  "Extension triceps",
  "Squat",
  "Soulevé de terre jambes tendues",
  "Crunch abdos",
  "Gainage",
  "Fentes",
  "Mollets debout",
];

function isMuscleChainMatch(exA: string, exB: string) {
  const antagonists = [
    ["pectoraux", "dos"],
    ["biceps", "triceps"],
    ["quadriceps", "ischio-jambiers"],
    ["abdos", "lombaires"],
  ];
  let muscA = exA.split("(")[1]?.replace(")", "") || "";
  let muscB = exB.split("(")[1]?.replace(")", "") || "";
  return antagonists.some(pair => pair.includes(muscA) && pair.includes(muscB) && muscA !== muscB);
}

const SupersetCalculator: React.FC = () => {
  const [exA, setExA] = useState("");
  const [exB, setExB] = useState("");
  const [cycles, setCycles] = useState(3);
  const [restBetween, setRestBetween] = useState(20);
  const [restCycle, setRestCycle] = useState(90);
  const [showPlan, setShowPlan] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exA || !exB) return;
    setShowPlan(true);
  };

  const handleReset = () => {
    setShowPlan(false);
    setExA("");
    setExB("");
    setCycles(3);
    setRestBetween(20);
    setRestCycle(90);
  };

  let conseil = "";
  if (exA && exB) {
    if (isMuscleChainMatch(exA, exB)) {
      conseil = "👌 Combinaison antagoniste idéale : favorise l'équilibre musculaire et la récupération.";
    } else if (exA === exB) {
      conseil = "⚠️ Choisissez deux exercices différents pour un superset efficace.";
    } else {
      conseil = "✔️ Superset classique (agoniste/synergiste) pour intensifier le volume sur une zone.";
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <SimpleCard>
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Calculateur de Superset
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Créez une superset intelligente : combinez deux exercices à enchaîner pour maximiser l'efficacité.
          </p>
        </div>

        {!showPlan ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="exA" className="text-sm md:text-base font-medium">Exercice 1</Label>
              <Input
                id="exA"
                list="exSuggestions"
                placeholder="Choisissez ou écrivez…"
                value={exA}
                onChange={e => setExA(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exB" className="text-sm md:text-base font-medium">Exercice 2</Label>
              <Input
                id="exB"
                list="exSuggestions"
                placeholder="Choisissez ou écrivez…"
                value={exB}
                onChange={e => setExB(e.target.value)}
                required
              />
              <datalist id="exSuggestions">
                {exerciseSuggestions.map(ex => (
                  <option value={ex} key={ex} />
                ))}
              </datalist>
            </div>

            {conseil && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">{conseil}</p>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Nombre de cycles (tours)</Label>
              <Slider
                min={1}
                max={6}
                step={1}
                value={[cycles]}
                onValueChange={([v]) => setCycles(Number(v))}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{cycles} tours</div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Repos entre exercices (secondes)</Label>
              <Slider
                min={0}
                max={60}
                step={5}
                value={[restBetween]}
                onValueChange={([v]) => setRestBetween(Number(v))}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">
                {restBetween === 0 ? "Aucun repos (enchaînement optimal)" : `${restBetween} sec`}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Repos entre cycles (secondes)</Label>
              <Slider
                min={30}
                max={180}
                step={10}
                value={[restCycle]}
                onValueChange={([v]) => setRestCycle(Number(v))}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{restCycle} sec entre chaque tour</div>
            </div>

            <SimpleButton type="submit" className="w-full mt-6" size="lg">
              Générer le Superset
            </SimpleButton>
          </form>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-center text-foreground">Plan Superset généré</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-3 px-2 text-center font-semibold">Cycle</th>
                    <th className="py-3 px-2 text-center font-semibold">Exercice #1</th>
                    <th className="py-3 px-2 text-center font-semibold">Exo #2</th>
                    <th className="py-3 px-2 text-center font-semibold">Repos après ce tour</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: cycles }, (_, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="py-2 px-2 text-center font-medium">{idx + 1}</td>
                      <td className="py-2 px-2 text-center">{exA}</td>
                      <td className="py-2 px-2 text-center">{exB}</td>
                      <td className="py-2 px-2 text-center">
                        {idx === cycles - 1 ? "-" : `${restCycle} s`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-800 mb-2">
                🏃‍♂️ Rappel d'exécution :
              </div>
              <p className="text-sm text-green-700">
                Enchaînez <strong>{exA}</strong> puis <strong>{exB}</strong> avec {restBetween}s de repos.
                Reposez-vous <strong>{restCycle} secondes</strong> entre chaque tour.
              </p>
              {conseil && <p className="text-sm text-green-700 mt-2">{conseil}</p>}
            </div>

            <SimpleButton variant="secondary" onClick={handleReset} className="w-full" size="lg">
              Nouvelle superset
            </SimpleButton>
          </div>
        )}
      </SimpleCard>
    </div>
  );
};

export default SupersetCalculator;
