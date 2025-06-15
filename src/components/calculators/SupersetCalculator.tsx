
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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

  // Conseils dynamiques
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
    <div className="max-w-2xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur de Superset</CardTitle>
          <CardDescription>
            Créez une superset intelligente&#8239;: combinez deux exercices à enchaîner pour maximiser l'efficacité (agoniste, antagoniste ou zone ciblée).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPlan ? (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="exA">Exercice 1</Label>
                <Input
                  id="exA"
                  list="exSuggestions"
                  placeholder="Choisissez ou écrivez…"
                  value={exA}
                  onChange={e => setExA(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="exB">Exercice 2</Label>
                <Input
                  id="exB"
                  list="exSuggestions"
                  placeholder="Choisissez ou écrivez…"
                  value={exB}
                  onChange={e => setExB(e.target.value)}
                  required
                  className="mt-1"
                />
                {/* Suggestions DataList */}
                <datalist id="exSuggestions">
                  {exerciseSuggestions.map(ex => (
                    <option value={ex} key={ex} />
                  ))}
                </datalist>
              </div>
              {conseil && <div className="text-xs bg-muted px-3 py-2 rounded mb-2">{conseil}</div>}

              <div>
                <Label>Nombre de cycles (tours)</Label>
                <Slider
                  min={1}
                  max={6}
                  step={1}
                  value={[cycles]}
                  onValueChange={([v]) => setCycles(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">{cycles} tours</div>
              </div>
              <div>
                <Label>Repos entre exercices (secondes)</Label>
                <Slider
                  min={0}
                  max={60}
                  step={5}
                  value={[restBetween]}
                  onValueChange={([v]) => setRestBetween(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">
                  {restBetween === 0 ? "Aucun repos (enchaînement optimal)" : `${restBetween} sec`}
                </div>
              </div>
              <div>
                <Label>Repos entre cycles (secondes)</Label>
                <Slider
                  min={30}
                  max={180}
                  step={10}
                  value={[restCycle]}
                  onValueChange={([v]) => setRestCycle(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">{restCycle} sec entre chaque tour</div>
              </div>
              <Button type="submit" className="w-full mt-2">Générer le Superset</Button>
            </form>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-3">Plan Superset généré</h3>
              <table className="w-full text-sm border mb-2">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-2 px-2 text-center">Cycle</th>
                    <th className="py-2 px-2 text-center">Exercice #1</th>
                    <th className="py-2 px-2 text-center">Exo #2</th>
                    <th className="py-2 px-2 text-center">Repos après ce tour</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: cycles }, (_, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted"}>
                      <td className="py-1 text-center">{idx + 1}</td>
                      <td className="py-1 text-center">{exA}</td>
                      <td className="py-1 text-center">{exB}</td>
                      <td className="py-1 text-center">
                        {idx === cycles - 1 ? "-" : `${restCycle} s`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-3 text-xs bg-muted px-3 py-2 rounded">
                <div>
                  <b>Rappel d'exécution :</b> Enchaînez <b>{exA}</b> puis <b>{exB}</b> sans (ou avec {restBetween} s) de repos.<br />
                  Reposez-vous <b>{restCycle} secondes</b> entre chaque tour. <br />
                  Idéal pour : gain de temps, métabolisme augmenté, effet pump majoré.
                </div>
                {conseil && <div className="mt-2">{conseil}</div>}
              </div>
              <Button variant="secondary" onClick={handleReset}>
                Nouvelle superset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupersetCalculator;
