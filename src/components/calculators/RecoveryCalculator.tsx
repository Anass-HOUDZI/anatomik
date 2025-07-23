
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SimpleCard } from "@/components/ui/simple-card";
import { SimpleButton } from "@/components/ui/simple-button";

function getRecoveryEstimate(data: {
  intensity: number;
  sleep: number;
  soreness: number;
  age: number;
  fatigue: number;
}) {
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
      advice: "Votre récupération est optimale ! Une séance peut être programmée dans la journée ou le lendemain.",
      color: "text-green-600", 
      bgColor: "bg-green-50"
    };
  } else if (score < 28) {
    return {
      level: "Modérée",
      time: "20-36h",
      advice: "Pensez à surveiller votre récupération. Un délai d'au moins 1 journée entre les séances est conseillé.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    };
  } else {
    return {
      level: "Longue",
      time: "36-72h",
      advice: "Votre corps montre des signes de récupération lente. Accordez-vous au minimum 36h avant la prochaine séance ciblant le même groupe musculaire.",
      color: "text-red-600",
      bgColor: "bg-red-50"
    };
  }
}

const RecoveryCalculator = () => {
  const [intensity, setIntensity] = useState(7);
  const [sleep, setSleep] = useState(7);
  const [soreness, setSoreness] = useState(4);
  const [age, setAge] = useState(30);
  const [fatigue, setFatigue] = useState(4);
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
    <div className="w-full p-4">
      <SimpleCard>
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Calculateur de Récupération
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Estimez le temps optimal à respecter entre deux séances pour maximiser vos progrès et éviter le surmenage.
          </p>
        </div>

        {!showResult ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Intensité de la dernière séance</Label>
              <Slider
                min={4}
                max={10}
                step={1}
                value={[intensity]}
                onValueChange={([v]) => setIntensity(v)}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{intensity}/10</div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Qualité du sommeil (0 = très mauvais, 10 = excellent)</Label>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[sleep]}
                onValueChange={([v]) => setSleep(v)}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{sleep}/10</div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Courbatures actuelles</Label>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[soreness]}
                onValueChange={([v]) => setSoreness(v)}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{soreness}/10</div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Âge</Label>
              <Slider
                min={16}
                max={80}
                step={1}
                value={[age]}
                onValueChange={([v]) => setAge(v)}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{age} ans</div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm md:text-base font-medium">Fatigue générale ressentie</Label>
              <Slider
                min={0}
                max={10}
                step={1}
                value={[fatigue]}
                onValueChange={([v]) => setFatigue(v)}
                className="mt-2"
              />
              <div className="text-sm text-muted-foreground font-medium">{fatigue}/10</div>
            </div>

            <SimpleButton type="submit" className="w-full mt-6" size="lg">
              Calculer mon temps de récupération
            </SimpleButton>
          </form>
        ) : (
          <div className="space-y-6">
            <div className={`text-center p-6 rounded-lg ${result.bgColor}`}>
              <div className={`text-3xl font-bold mb-2 ${result.color}`}>
                Récupération : {result.level}
              </div>
              <div className="text-xl font-semibold mb-4">
                Temps conseillé : <span className="font-bold">{result.time}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium mb-2">{result.advice}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">💡 Conseils pour optimiser votre récupération :</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Variez les groupes musculaires si récupération non optimale</li>
                <li>• L'hydratation et la nutrition accélèrent la récupération</li>
                <li>• Le sommeil reste le facteur n°1 pour récupérer vite</li>
                <li>• Surveillez le retour à une sensation de fraîcheur</li>
              </ul>
            </div>

            <SimpleButton variant="secondary" onClick={handleReset} className="w-full" size="lg">
              Nouveau calcul
            </SimpleButton>
          </div>
        )}
      </SimpleCard>
    </div>
  );
};

export default RecoveryCalculator;
