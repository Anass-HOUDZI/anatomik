
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      currentWeight = currentWeight * (1 - dropPercent / 100);
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
    <ResponsiveContainer className="w-full">
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
          Calculateur de Drop Sets
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Programme automatiquement votre série dégressive : poids, nombre de drops et estimation des répétitions.
        </p>
      </div>

      {!showResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Inputs Section */}
          <MobileCard className="bg-card border border-border">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-edit text-primary"></i>
                <h3 className="text-lg font-semibold text-foreground">Paramètres</h3>
              </div>
              <form
                className="space-y-3"
                onSubmit={e => {
                  e.preventDefault();
                  calculateDropSets();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="initialWeight" className="text-sm font-medium">
                    Poids de départ (kg)
                  </Label>
                  <Input
                    id="initialWeight"
                    type="number"
                    min={1}
                    max={500}
                    value={initialWeight}
                    onChange={e => setInitialWeight(Number(e.target.value))}
                    step={0.5}
                    className="h-8 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repsFirstSet" className="text-sm font-medium">
                    Nombre de répétitions première série
                  </Label>
                  <Input
                    id="repsFirstSet"
                    type="number"
                    min={1}
                    max={50}
                    value={repsFirstSet}
                    onChange={e => setRepsFirstSet(Number(e.target.value))}
                    step={1}
                    className="h-8 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Nombre de drops (réductions successives)
                  </Label>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[nbDrops]}
                    onValueChange={([v]) => setNbDrops(Number(v))}
                    className="h-1"
                  />
                  <div className="text-xs text-muted-foreground font-medium">
                    {nbDrops === 1 ? "1 drop" : `${nbDrops} drops`}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Pourcentage de réduction par drop (%)
                  </Label>
                  <Slider
                    min={10}
                    max={40}
                    step={1}
                    value={[dropPercent]}
                    onValueChange={([v]) => setDropPercent(Number(v))}
                    className="h-1"
                  />
                  <div className="text-xs text-muted-foreground font-medium">{`-${dropPercent}% à chaque drop`}</div>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <MobileButton className="w-full h-8 text-sm" type="submit">
                    Appliquer et Calculer
                  </MobileButton>
                </div>
              </form>
            </div>
          </MobileCard>

          {/* Empty Results Placeholder */}
          <MobileCard className="bg-card border border-border">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-calculator text-primary"></i>
                <h3 className="text-lg font-semibold text-foreground">Résultats</h3>
              </div>
              <div className="text-center py-6 text-muted-foreground">
                <i className="fas fa-calculator text-2xl mb-2"></i>
                <p className="text-sm">Remplissez les paramètres pour voir le plan Drop Set</p>
              </div>
            </div>
          </MobileCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Back to Inputs */}
          <MobileCard className="bg-card border border-border">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-edit text-primary"></i>
                <h3 className="text-lg font-semibold text-foreground">Paramètres</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poids initial:</span>
                  <span className="font-medium">{initialWeight}kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reps première série:</span>
                  <span className="font-medium">{repsFirstSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre de drops:</span>
                  <span className="font-medium">{nbDrops}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Réduction:</span>
                  <span className="font-medium">{dropPercent}%</span>
                </div>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <MobileButton variant="outline" onClick={handleReset} className="w-full h-8 text-sm">
                  Modifier les paramètres
                </MobileButton>
              </div>
            </div>
          </MobileCard>

          {/* Results Section */}
          <MobileCard className="bg-card border border-border">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-calculator text-primary"></i>
                <h3 className="text-lg font-semibold text-foreground">Plan Drop Set généré</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="py-2 px-2 text-center font-medium text-xs">Série</th>
                      <th className="py-2 px-2 text-center font-medium text-xs">Poids (kg)</th>
                      <th className="py-2 px-2 text-center font-medium text-xs">Rép.</th>
                      <th className="py-2 px-2 text-center font-medium text-xs">Repos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((step, idx) => (
                      <tr key={step.step} className={idx % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                        <td className="py-1 px-2 text-center font-medium text-xs">{step.step}</td>
                        <td className="py-1 px-2 text-center font-bold text-primary text-xs">{step.weight}</td>
                        <td className="py-1 px-2 text-center text-xs">{step.estimatedReps ?? "-"}</td>
                        <td className="py-1 px-2 text-center text-xs">
                          {idx === 0 ? "-" : "10-20s"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-2 bg-muted border border-border rounded-lg mt-3">
                <p className="text-xs text-muted-foreground">
                  <strong>💡 Astuce :</strong> Réduisez le poids sans repos (≤ 20s), jusqu'à l'échec technique.
                </p>
              </div>
            </div>
          </MobileCard>
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default DropSetsCalculator;
