
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Helper pour calcul score
function getRecoveryEstimate(data: {
  intensity: number;
  sleep: number;
  soreness: number;
  age: number;
  fatigue: number;
}) {
  // Barème pondéré : plus le score total est élevé, plus la récup est lente
  let score =
    data.intensity * 2 +
    (10 - data.sleep) * 1.7 +
    data.soreness * 2.3 +
    (data.age >= 40 ? 2 : 0) +
    data.fatigue * 2;

  if (score <= 17) {
    return {
      level: "Rapide",
      time: "8-20h",
      advice:
        "Votre récupération est optimale ! Une séance peut être programmée dans la journée ou le lendemain.",
      color: "text-green-600",
    };
  } else if (score < 28) {
    return {
      level: "Modérée",
      time: "20-36h",
      advice:
        "Pensez à surveiller votre récupération. Un délai d'au moins 1 journée entre les séances est conseillé.",
      color: "text-yellow-600",
    };
  } else {
    return {
      level: "Longue",
      time: "36-72h",
      advice:
        "Votre corps montre des signes de récupération lente. Accordez-vous au minimum 36h avant la prochaine séance ciblant le même groupe musculaire.",
      color: "text-red-600",
    };
  }
}

const RecoveryCalculator = () => {
  const [intensity, setIntensity] = useState(7); // effort séance précédente
  const [sleep, setSleep] = useState(7); // heures de sommeil (0-10)
  const [soreness, setSoreness] = useState(4); // courbatures (0-10)
  const [age, setAge] = useState(30);
  const [fatigue, setFatigue] = useState(4); // 0-10
  const [showResult, setShowResult] = useState(false);

  const result = getRecoveryEstimate({
    intensity,
    sleep,
    soreness,
    age,
    fatigue,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResult(true);
  }

  function handleReset() {
    setShowResult(false);
  }

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur de Récupération</CardTitle>
          <CardDescription>
            Estimez le temps optimal à respecter entre deux séances pour maximiser vos progrès et éviter le surmenage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showResult ? (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <Label>Intensité de la dernière séance</Label>
                <Slider
                  min={4}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{intensity}/10</div>
              </div>
              <div>
                <Label>Sommeil cette nuit (0 = très mauvais, 10 = excellent)</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[sleep]}
                  onValueChange={([v]) => setSleep(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{sleep}/10</div>
              </div>
              <div>
                <Label>Courbatures actuelles</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[soreness]}
                  onValueChange={([v]) => setSoreness(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{soreness}/10</div>
              </div>
              <div>
                <Label>Âge (plus de 40 ans ? La récupération peut être plus lente)</Label>
                <Slider
                  min={16}
                  max={80}
                  step={1}
                  value={[age]}
                  onValueChange={([v]) => setAge(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{age} ans</div>
              </div>
              <div>
                <Label>Fatigue générale ressentie</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[fatigue]}
                  onValueChange={([v]) => setFatigue(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{fatigue}/10</div>
              </div>
              <Button type="submit" className="w-full mt-2">
                Calculer mon temps de récupération
              </Button>
            </form>
          ) : (
            <div className="animate-fade-in">
              <div className={`text-2xl font-semibold mb-2 ${result.color}`}>
                Récupération : {result.level}
              </div>
              <div className="text-lg mb-4">
                Temps conseillé entre 2 séances :{" "}
                <span className="font-bold">{result.time}</span>
              </div>
              <div className="mb-2 p-3 bg-muted rounded text-sm text-muted-foreground">
                {result.advice}
              </div>
              <ul className="list-disc ml-6 text-xs text-muted-foreground mb-4">
                <li>Pensez à varier les groupes musculaires si récupération non optimale.</li>
                <li>L’hydratation et la nutrition accélèrent la récupération.</li>
                <li>Le sommeil reste le facteur n°1 pour récupérer vite.</li>
                <li>Surveillez le retour à une sensation de fraîcheur avant de (re)solliciter un groupe musculaire.</li>
              </ul>
              <Button variant="secondary" onClick={handleReset}>
                Nouveau calcul
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoveryCalculator;
