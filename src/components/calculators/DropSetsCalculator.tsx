import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";

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
    <ResponsiveContainer 
      className="max-w-2xl mx-auto pt-4 md:pt-6"
      mobileClassName="px-4"
      tabletClassName="px-6"
      desktopClassName="px-8"
    >
      <MobileCard className="w-full">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="text-xl md:text-2xl text-black">Calculateur de Drop Sets</CardTitle>
          <CardDescription className="text-sm md:text-base text-black leading-relaxed">
            Programme automatiquement votre série dégressive : poids, nombre de drops et estimation des répétitions.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {!showResults && (
            <form
              className="flex flex-col gap-4 md:gap-5"
              onSubmit={e => {
                e.preventDefault();
                calculateDropSets();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="initialWeight" className="text-sm md:text-base">Poids de départ (kg)</Label>
                <Input
                  id="initialWeight"
                  type="number"
                  min={1}
                  max={500}
                  value={initialWeight}
                  onChange={e => setInitialWeight(Number(e.target.value))}
                  step={0.5}
                  className="mobile-input text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repsFirstSet" className="text-sm md:text-base">Nombre de répétitions sur la première série</Label>
                <Input
                  id="repsFirstSet"
                  type="number"
                  min={1}
                  max={50}
                  value={repsFirstSet}
                  onChange={e => setRepsFirstSet(Number(e.target.value))}
                  step={1}
                  className="mobile-input text-base"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="nbDrops" className="text-sm md:text-base">Nombre de drops (réductions successives)</Label>
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

              <div className="space-y-3">
                <Label htmlFor="dropPercent" className="text-sm md:text-base">Pourcentage de réduction par drop (%)</Label>
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

              <MobileButton className="mt-4 md:mt-6 w-full" type="submit" size="lg">
                Calculer ma Drop Set
              </MobileButton>
            </form>
          )}

          {showResults && (
            <div className="pt-2">
              <h3 className="font-semibold mb-3 text-lg md:text-xl">Plan Drop Set généré</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-3 px-2 md:px-4 text-xs md:text-sm">Série</th>
                      <th className="py-3 px-2 md:px-4 text-xs md:text-sm">Poids (kg)</th>
                      <th className="py-3 px-2 md:px-4 text-xs md:text-sm">Rép. (estimées)</th>
                      <th className="py-3 px-2 md:px-4 text-xs md:text-sm">Repos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((step, idx) => (
                      <tr key={step.step} className={idx % 2 === 0 ? "bg-background" : "bg-muted"}>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-center text-sm">{step.step}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-center text-sm font-medium">{step.weight}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-center text-sm">{step.estimatedReps ?? "-"}</td>
                        <td className="py-2 md:py-3 px-2 md:px-4 text-center text-sm">
                          {idx === 0 ? "-" : "10-20 s"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="my-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                  <b>Astuce :</b> Pour une efficacité optimale, réduisez le poids sans repos (ou ≤ 20s), jusqu'à l'échec technique.
                </p>
              </div>
              <MobileButton variant="secondary" onClick={handleReset} size="lg" className="w-full">
                Nouvelle simulation
              </MobileButton>
            </div>
          )}
        </CardContent>
      </MobileCard>
    </ResponsiveContainer>
  );
};

export default DropSetsCalculator;
