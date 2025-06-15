import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";

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
    <ResponsiveContainer 
      className="max-w-2xl mx-auto pt-4 md:pt-6"
      mobileClassName="px-4"
      tabletClassName="px-6"
      desktopClassName="px-8"
    >
      <MobileCard className="w-full">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle className="text-xl md:text-2xl text-black">Calculateur de Deload</CardTitle>
          <CardDescription className="text-sm md:text-base text-black leading-relaxed">
            Déterminez si une semaine de décharge est recommandée pour optimiser récupération et progression, et obtenez vos consignes personnalisées.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {!showResult ? (
            <form className="flex flex-col gap-5 md:gap-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label className="text-sm md:text-base">Niveau de fatigue général (subjectif)</Label>
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
              
              <div className="space-y-3">
                <Label className="text-sm md:text-base">Semaines écoulées depuis le dernier deload</Label>
                <Slider
                  min={1}
                  max={12}
                  step={1}
                  value={[weeksSinceLastDeload]}
                  onValueChange={([v]) => setWeeksSinceLastDeload(v)}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground font-medium">
                  {weeksSinceLastDeload} semaine{weeksSinceLastDeload > 1 ? "s" : ""}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm md:text-base">Intensité moyenne des séances (charge relative)</Label>
                <Slider
                  min={5}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(v)}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground font-medium">{intensity}/10</div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm md:text-base">Volume d'entraînement élevé sur les 3 dernières semaines ?</Label>
                <div className="flex items-center gap-3 mt-2">
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
              
              <MobileButton type="submit" className="w-full mt-4" size="lg">
                Calculer ma recommandation de deload
              </MobileButton>
            </form>
          ) : (
            <div className="animate-fade-in space-y-4">
              <div className={`text-xl md:text-2xl font-semibold ${result.need ? "text-yellow-700" : "text-green-700"}`}>
                {result.need ? "Deload Recommandé" : "Pas de deload nécessaire"}
              </div>
              
              <div className="text-base md:text-lg leading-relaxed">
                {result.message}
              </div>
              
              {result.need && (
                <>
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="text-sm md:text-base">
                      <b>Réduction recommandée :</b> {result.reduction}
                    </div>
                    <div className="text-sm md:text-base">
                      <b>Durée idéale :</b> {result.duration}
                    </div>
                    <div className="text-sm md:text-base">
                      <b>Activités suggérées :</b> {result.activities}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <ul className="space-y-2 text-xs md:text-sm text-blue-800">
                      <li>• Le deload facilite la surcompensation - profitez-en pour affiner la technique et écouter vos sensations.</li>
                      <li>• N'ayez pas peur de "lever le pied" quelques jours, les progrès s'accélèrent après un bon deload !</li>
                      <li>• Si la fatigue persiste après le deload, pensez à réévaluer volume et intensité dans votre prochain cycle.</li>
                    </ul>
                  </div>
                </>
              )}
              
              <MobileButton variant="secondary" onClick={handleReset} size="lg" className="w-full">
                Nouveau calcul
              </MobileButton>
            </div>
          )}
        </CardContent>
      </MobileCard>
    </ResponsiveContainer>
  );
};

export default DeloadCalculator;
