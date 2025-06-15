
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// Fonction de scoring Deload
function getDeloadRecommendation({
  fatigue,
  weeksSinceLastDeload,
  intensity,
  highVolume,
}: {
  fatigue: number;
  weeksSinceLastDeload: number;
  intensity: number;
  highVolume: boolean;
}) {
  // Points attribués selon les réponses
  let score = 0;
  score += fatigue * 2.5; // fatigue a un poids important
  score += intensity * 1.6;
  score += highVolume ? 5 : 0;
  score += Math.max(0, (weeksSinceLastDeload - 3) * 2); // si >3 semaines, points bonus

  // Conseil et ajustements recommandés
  if (score < 18) {
    return {
      need: false,
      message: "Votre niveau de fatigue et de surcharge progressive reste modéré. Un deload n'est probablement pas nécessaire, mais un monitoring rapproché est conseillé.",
      reduction: "",
      activities: "Continuez votre routine habituelle, privilégiez la qualité technique et le ressenti.",
      duration: "—"
    };
  } else if (score < 30) {
    return {
      need: true,
      message: "Votre charge accumulée suggère qu'un deload léger serait bénéfique pour relancer la progression.",
      reduction: "Réduction volume -40% OU intensité -20%",
      activities: "Séances plus courtes, travail technique, mobilité, cardio léger.",
      duration: "4 à 5 jours"
    };
  } else {
    return {
      need: true,
      message: "Votre score indique une accumulation importante de fatigue. Un deload complet est fortement recommandé pour prévenir la stagnation ou le surmenage.",
      reduction: "Réduction combinée : volume -50% ET intensité -30%",
      activities: "Technique, mobilité, sports doux (marche, yoga), récupération active.",
      duration: "5 à 7 jours"
    };
  }
}

const DeloadCalculator = () => {
  const [fatigue, setFatigue] = useState(6); // fatigue générale 0-10
  const [weeksSinceLastDeload, setWeeksSinceLastDeload] = useState(4); // 1-12+
  const [intensity, setIntensity] = useState(8); // charge/intensité moyenne
  const [highVolume, setHighVolume] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const result = getDeloadRecommendation({
    fatigue,
    weeksSinceLastDeload,
    intensity,
    highVolume,
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
          <CardTitle>Calculateur de Deload</CardTitle>
          <CardDescription>
            Déterminez si une semaine de décharge est recommandée pour optimiser récupération et progression, et obtenez vos consignes personnalisées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showResult ? (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <Label>Niveau de fatigue général (subjectif)</Label>
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
              <div>
                <Label>Semaines écoulées depuis le dernier deload</Label>
                <Slider
                  min={1}
                  max={12}
                  step={1}
                  value={[weeksSinceLastDeload]}
                  onValueChange={([v]) => setWeeksSinceLastDeload(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{weeksSinceLastDeload} semaine{weeksSinceLastDeload > 1 ? "s" : ""}</div>
              </div>
              <div>
                <Label>Intensité moyenne des séances (charge relative)</Label>
                <Slider
                  min={5}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{intensity}/10</div>
              </div>
              <div>
                <Label>Volume d'entraînement élevé sur les 3 dernières semaines ?</Label>
                <div className="flex items-center gap-4 mt-2">
                  <button
                    type="button"
                    className={`px-3 py-2 rounded border ${highVolume ? "bg-primary text-white border-primary" : "bg-background border-muted text-foreground"} focus:outline-none`}
                    onClick={() => setHighVolume(true)}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded border ${!highVolume ? "bg-primary text-white border-primary" : "bg-background border-muted text-foreground"} focus:outline-none`}
                    onClick={() => setHighVolume(false)}
                  >
                    Non
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">
                Calculer ma recommandation de deload
              </Button>
            </form>
          ) : (
            <div className="animate-fade-in">
              <div className={`text-2xl font-semibold mb-2 ${result.need ? "text-yellow-700" : "text-green-700"}`}>
                {result.need ? "Deload Recommandé" : "Pas de deload nécessaire"}
              </div>
              <div className="text-lg mb-3">
                {result.message}
              </div>
              {result.need && (
                <>
                  <div className="mb-2 p-3 bg-muted rounded text-sm text-muted-foreground">
                    <div><b>Réduction recommandée :</b> {result.reduction}</div>
                    <div><b>Durée idéale :</b> {result.duration}</div>
                    <div><b>Activités suggérées :</b> {result.activities}</div>
                  </div>
                  <ul className="list-disc ml-6 text-xs text-muted-foreground mb-4">
                    <li>Le deload facilite la surcompensation - profitez-en pour affiner la technique et écouter vos sensations.</li>
                    <li>N'ayez pas peur de "lever le pied" quelques jours, les progrès s'accélèrent après un bon deload !</li>
                    <li>Si la fatigue persiste après le deload, pensez à réévaluer volume et intensité dans votre prochain cycle.</li>
                  </ul>
                </>
              )}
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

export default DeloadCalculator;
