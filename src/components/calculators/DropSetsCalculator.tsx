
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const defaultDropPercent = 20;

interface DropSetResult {
  step: number;
  weight: number;
  estimatedReps: number | null;
}

const DropSetsCalculator: React.FC = () => {
  const [initialWeight, setInitialWeight] = useState<number>(60);
  const [nbDrops, setNbDrops] = useState<number>(2);
  const [dropPercent, setDropPercent] = useState<number>(defaultDropPercent);
  const [repsFirstSet, setRepsFirstSet] = useState<number>(10);
  const [showResults, setShowResults] = useState(false);

  const [results, setResults] = useState<DropSetResult[]>([]);

  // Calculer les charges des drops
  const calculateDropSets = () => {
    const output: DropSetResult[] = [];
    let currentWeight = initialWeight;
    let currentReps = repsFirstSet;

    for (let i = 0; i <= nbDrops; i++) {
      output.push({
        step: i + 1,
        weight: Math.round(currentWeight * 100) / 100,
        estimatedReps: i === 0 ? currentReps : currentReps > 2 ? Math.max(Math.floor(currentReps * 0.6), 1) : null,
      });
      // Pour les drops suivants, réduction du poids
      currentWeight = currentWeight * (1 - dropPercent / 100);
      // Optionnel: estimer que les reps chutent à ~60% de la série précédente
      currentReps = currentReps > 2 ? Math.max(Math.floor(currentReps * 0.6), 1) : 1;
    }
    setResults(output);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur de Drop Sets</CardTitle>
          <CardDescription>
            Programme automatiquement votre série dégressive : poids, nombre de drops et estimation des répétitions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showResults && (
            <form
              className="flex flex-col gap-5"
              onSubmit={e => {
                e.preventDefault();
                calculateDropSets();
              }}
            >
              <div>
                <Label htmlFor="initialWeight">Poids de départ (kg)</Label>
                <Input
                  id="initialWeight"
                  type="number"
                  min={1}
                  max={500}
                  value={initialWeight}
                  onChange={e => setInitialWeight(Number(e.target.value))}
                  step={0.5}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="repsFirstSet">Nombre de répétitions sur la première série</Label>
                <Input
                  id="repsFirstSet"
                  type="number"
                  min={1}
                  max={50}
                  value={repsFirstSet}
                  onChange={e => setRepsFirstSet(Number(e.target.value))}
                  step={1}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nbDrops">Nombre de drops (réductions successives)</Label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[nbDrops]}
                  onValueChange={([v]) => setNbDrops(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">{nbDrops === 1 ? "1 drop" : `${nbDrops} drops`}</div>
              </div>

              <div>
                <Label htmlFor="dropPercent">Pourcentage de réduction par drop (%)</Label>
                <Slider
                  min={10}
                  max={40}
                  step={1}
                  value={[dropPercent]}
                  onValueChange={([v]) => setDropPercent(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">{`-${dropPercent}% à chaque drop`}</div>
              </div>

              <Button className="mt-6 w-full" type="submit">
                Calculer ma Drop Set
              </Button>
            </form>
          )}

          {showResults && (
            <div className="pt-2">
              <h3 className="font-semibold mb-3">Plan Drop Set généré</h3>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-2 px-2">Série</th>
                    <th className="py-2 px-2">Poids (kg)</th>
                    <th className="py-2 px-2">Rép. (estimées)</th>
                    <th className="py-2 px-2">Repos</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((step, idx) => (
                    <tr key={step.step} className={idx % 2 === 0 ? "bg-background" : "bg-muted"}>
                      <td className="py-1 px-2 text-center">{step.step}</td>
                      <td className="py-1 px-2 text-center">{step.weight}</td>
                      <td className="py-1 px-2 text-center">{step.estimatedReps ?? "-"}</td>
                      <td className="py-1 px-2 text-center">
                        {idx === 0 ? "-" : "10-20 s"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-4 text-xs text-muted-foreground">
                <b>Astuce :</b> Pour une efficacité optimale, réduisez le poids sans repos (ou ≤ 20s), jusqu’à l’échec technique.
              </div>
              <Button variant="secondary" onClick={handleReset}>
                Nouvelle simulation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DropSetsCalculator;
