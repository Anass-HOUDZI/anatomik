
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";

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
  let score = 0;
  score += fatigue * 2.5;
  score += intensity * 1.6;
  score += highVolume ? 5 : 0;
  score += Math.max(0, (weeksSinceLastDeload - 3) * 2);

  if (score < 18) {
    return {
      need: false,
      message: "Votre niveau de fatigue et de surcharge progressive reste modéré. Un deload n'est probablement pas nécessaire, mais un monitoring rapproché est conseillé.",
      reduction: "",
      activities: "Continuez votre routine habituelle, privilégiez la qualité technique et le ressenti.",
      duration: "—",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    };
  } else if (score < 30) {
    return {
      need: true,
      message: "Votre charge accumulée suggère qu'un deload léger serait bénéfique pour relancer la progression.",
      reduction: "Réduction volume -40% OU intensité -20%",
      activities: "Séances plus courtes, travail technique, mobilité, cardio léger.",
      duration: "4 à 5 jours",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    };
  } else {
    return {
      need: true,
      message: "Votre score indique une accumulation importante de fatigue. Un deload complet est fortement recommandé pour prévenir la stagnation ou le surmenage.",
      reduction: "Réduction combinée : volume -50% ET intensité -30%",
      activities: "Technique, mobilité, sports doux (marche, yoga), récupération active.",
      duration: "5 à 7 jours",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    };
  }
}

const DeloadCalculator = () => {
  const [fatigue, setFatigue] = useState(6);
  const [weeksSinceLastDeload, setWeeksSinceLastDeload] = useState(4);
  const [intensity, setIntensity] = useState(8);
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
    <ResponsiveContainer className="w-full">
      <MobileCard className="w-full">
        <div className="p-4 md:p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Calculateur de Deload
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Déterminez si une semaine de décharge est recommandée pour optimiser récupération et progression, et obtenez vos consignes personnalisées.
            </p>
          </div>

          {!showResult ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Niveau de fatigue général (subjectif)</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[fatigue]}
                  onValueChange={([v]) => setFatigue(v)}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{fatigue}/10</div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Semaines écoulées depuis le dernier deload</Label>
                <Slider
                  min={1}
                  max={12}
                  step={1}
                  value={[weeksSinceLastDeload]}
                  onValueChange={([v]) => setWeeksSinceLastDeload(v)}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">
                  {weeksSinceLastDeload} semaine{weeksSinceLastDeload > 1 ? "s" : ""}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Intensité moyenne des séances (charge relative)</Label>
                <Slider
                  min={5}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{intensity}/10</div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Volume d'entraînement élevé sur les 3 dernières semaines ?</Label>
                <div className="flex gap-3 mt-2">
                  <MobileButton
                    type="button"
                    variant={highVolume ? "primary" : "outline"}
                    size="md"
                    onClick={() => setHighVolume(true)}
                    className="flex-1"
                  >
                    Oui
                  </MobileButton>
                  <MobileButton
                    type="button"
                    variant={!highVolume ? "primary" : "outline"}
                    size="md"
                    onClick={() => setHighVolume(false)}
                    className="flex-1"
                  >
                    Non
                  </MobileButton>
                </div>
              </div>
              
              <MobileButton type="submit" className="w-full mt-6" size="lg">
                Calculer ma recommandation de deload
              </MobileButton>
            </form>
          ) : (
            <div className="space-y-6">
              <div className={`p-6 rounded-lg ${result.bgColor}`}>
                <div className={`text-2xl font-bold text-center mb-3 ${result.textColor}`}>
                  {result.need ? "Deload Recommandé" : "Pas de deload nécessaire"}
                </div>
                <p className={`text-center ${result.textColor}`}>
                  {result.message}
                </p>
              </div>
              
              {result.need && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="text-sm">
                      <strong>Réduction recommandée :</strong> {result.reduction}
                    </div>
                    <div className="text-sm">
                      <strong>Durée idéale :</strong> {result.duration}
                    </div>
                    <div className="text-sm">
                      <strong>Activités suggérées :</strong> {result.activities}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Le deload facilite la surcompensation - profitez-en pour affiner la technique et écouter vos sensations.</li>
                      <li>• N'ayez pas peur de "lever le pied" quelques jours, les progrès s'accélèrent après un bon deload !</li>
                      <li>• Si la fatigue persiste après le deload, pensez à réévaluer volume et intensité dans votre prochain cycle.</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <MobileButton variant="secondary" onClick={handleReset} size="lg" className="w-full">
                Nouveau calcul
              </MobileButton>
            </div>
          )}
        </div>
      </MobileCard>
    </ResponsiveContainer>
  );
};

export default DeloadCalculator;
