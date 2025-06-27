
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
      <MobileCard className="w-full">
        <div className="p-4 md:p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Calculateur de Drop Sets
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Programme automatiquement votre série dégressive : poids, nombre de drops et estimation des répétitions.
            </p>
          </div>

          {!showResults ? (
            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                calculateDropSets();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="initialWeight" className="text-sm md:text-base font-medium">
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
                  className="mobile-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repsFirstSet" className="text-sm md:text-base font-medium">
                  Nombre de répétitions sur la première série
                </Label>
                <Input
                  id="repsFirstSet"
                  type="number"
                  min={1}
                  max={50}
                  value={repsFirstSet}
                  onChange={e => setRepsFirstSet(Number(e.target.value))}
                  step={1}
                  className="mobile-input"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">
                  Nombre de drops (réductions successives)
                </Label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[nbDrops]}
                  onValueChange={([v]) => setNbDrops(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">
                  {nbDrops === 1 ? "1 drop" : `${nbDrops} drops`}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">
                  Pourcentage de réduction par drop (%)
                </Label>
                <Slider
                  min={10}
                  max={40}
                  step={1}
                  value={[dropPercent]}
                  onValueChange={([v]) => setDropPercent(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{`-${dropPercent}% à chaque drop`}</div>
              </div>

              <MobileButton className="w-full mt-6" type="submit" size="lg">
                Calculer ma Drop Set
              </MobileButton>
            </form>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center text-black">Plan Drop Set généré</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-2 text-center font-semibold">Série</th>
                      <th className="py-3 px-2 text-center font-semibold">Poids (kg)</th>
                      <th className="py-3 px-2 text-center font-semibold">Rép. (estimées)</th>
                      <th className="py-3 px-2 text-center font-semibold">Repos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((step, idx) => (
                      <tr key={step.step} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="py-2 px-2 text-center font-medium">{step.step}</td>
                        <td className="py-2 px-2 text-center font-bold text-blue-600">{step.weight}</td>
                        <td className="py-2 px-2 text-center">{step.estimatedReps ?? "-"}</td>
                        <td className="py-2 px-2 text-center text-sm">
                          {idx === 0 ? "-" : "10-20 s"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  <strong>💡 Astuce :</strong> Pour une efficacité optimale, réduisez le poids sans repos (ou ≤ 20s), jusqu'à l'échec technique.
                </p>
              </div>

              <MobileButton variant="secondary" onClick={handleReset} size="lg" className="w-full">
                Nouvelle simulation
              </MobileButton>
            </div>
          )}
        </div>
      </MobileCard>
    </ResponsiveContainer>
  );
};

export default DropSetsCalculator;
