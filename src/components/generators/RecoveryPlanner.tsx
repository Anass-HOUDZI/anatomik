
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const STRETCHES = [
  { name: "Étirement ischio-jambiers", for: ["force", "hypertrophy", "cardio"], duration: 2, desc: "Tenez debout, inclinez-vous vers l'avant et gardez les jambes droites." },
  { name: "Twist allongé", for: ["force","hypertrophy"], duration: 2, desc: "Allongé sur le dos, croisez une jambe sur l'autre pour étirer le bas du dos." },
  { name: "Étirement quadriceps debout", for: ["cardio","hypertrophy"], duration: 1, desc: "Attrapez un pied vers la fesse, genou collé à l'autre jambe." },
  { name: "Child pose (yoga)", for: ["force", "hypertrophy", "cardio"], duration: 2, desc: "Assis sur les talons, bras tendus vers l'avant sur le sol." },
  { name: "Étirement pectoraux contre mur", for: ["force", "hypertrophy"], duration: 1, desc: "Placez votre bras contre un mur et tournez doucement le buste." },
];

const MOBILITY = [
  { name: "Cercle de hanches", duration: 1, desc: "Faites des mouvements circulaires avec les hanches." },
  { name: "Rotations de chevilles", duration: 1, desc: "Asseyez-vous et faites tourner chaque cheville dans les deux sens." },
  { name: "Rotation d’épaules", duration: 1, desc: "Bras tendus, dessinez des cercles amples avec les bras." },
];

const RELAX = [
  { name: "Respiration lente (3min)", desc: "Asseyez-vous, inspirez 4s, bloquez 2s, expirez 6s." },
  { name: "Self-massage rapide", desc: "Auto-massage sur les quadriceps, mollets ou épaules." },
  { name: "Cohérence cardiaque (5 min)", desc: "Inspirez 5s, expirez 5s, rythme régulier." }
];

const getRecoveryRoutine = (trainingType, fatigue, time) => {
  const routine = [];

  // Sélection d'étirements
  const selectedStretches = STRETCHES.filter(s => s.for.includes(trainingType)).slice(0, Math.max(2, Math.ceil(time/6)));
  selectedStretches.forEach(stretch => {
    routine.push({
      type: "Étirement",
      ...stretch
    });
  });

  // Ajout mobilité selon temps dispo
  if (time > 10) {
    MOBILITY.forEach(mob => {
      routine.push({ type: "Mobilité", ...mob });
    });
  } else if (time > 5) {
    routine.push({ type: "Mobilité", ...MOBILITY[0] });
  }

  // Ajout relaxation si fatigue ↑
  if (fatigue > 6 && time >= 5) {
    routine.push({ type: "Relaxation", ...RELAX[0] });
    routine.push({ type: "Relaxation", ...RELAX[2] });
  } else if (fatigue > 4) {
    routine.push({ type: "Relaxation", ...RELAX[1] });
  }

  return routine;
};

const RecoveryPlanner = () => {
  const { toast } = useToast();
  const [trainingType, setTrainingType] = useState<string>("");
  const [fatigue, setFatigue] = useState<number>(4);
  const [time, setTime] = useState<number>(10);
  const [results, setResults] = useState<any[]>([]);

  const handleGenerate = () => {
    if (!trainingType) {
      toast({
        title: "Sélectionnez le type d'entraînement",
        description: "Veuillez préciser le type d'effort à récupérer.",
        variant: "destructive"
      });
      return;
    }
    const routine = getRecoveryRoutine(trainingType, fatigue, time);
    setResults(routine);
    toast({
      title: "Routine générée !",
      description: `Vous avez une routine de récupération adaptée`
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <i className="fas fa-spa text-primary"></i>
            <span>Planificateur de Récupération</span>
          </CardTitle>
          <CardDescription>
            Obtenez une routine de récupération personnalisée : étirements, mobilité, relaxation selon votre besoin du jour.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Choix type entraînement */}
            <div>
              <Label>Type d'entraînement à récupérer</Label>
              <Select value={trainingType} onValueChange={setTrainingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="force">Force / Power</SelectItem>
                  <SelectItem value="hypertrophy">Hypertrophie</SelectItem>
                  <SelectItem value="cardio">Cardio / Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Niveau de fatigue */}
            <div>
              <Label>Niveau de fatigue ressenti</Label>
              <Slider 
                min={1}
                max={10}
                step={1}
                value={[fatigue]}
                onValueChange={(v) => setFatigue(v[0])}
              />
              <div className="flex justify-between text-xs mt-1 opacity-70">
                <span>Faible</span>
                <span>Élevée</span>
              </div>
            </div>
          </div>
          <div>
            <Label>Temps prévu pour la récupération (min)</Label>
            <Slider 
              min={5}
              max={30}
              step={1}
              value={[time]}
              onValueChange={(v) => setTime(v[0])}
              className="mb-2"
            />
            <div className="flex justify-between text-xs mt-1 opacity-70">
              <span>5 min</span>
              <span>30 min</span>
            </div>
          </div>
          <Button 
            className="w-full mt-3"
            onClick={handleGenerate}
            disabled={!trainingType}
          >
            <i className="fas fa-magic mr-2"></i>
            Générer la routine
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Routine recommandée ({time} min)</CardTitle>
            <CardDescription>
              Voici vos exercices et conseils pour aujourd'hui !
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-5">
              {results.map((step, idx) => (
                <li key={idx} className="border-l-4 pl-3 rounded bg-muted/50 pb-2 pt-2">
                  <div className="font-semibold mb-1">
                    {step.type} : {step.name}
                  </div>
                  {step.duration && (
                    <div className="text-xs text-muted-foreground mb-1">
                      {step.duration} min
                    </div>
                  )}
                  <div className="text-sm">{step.desc}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecoveryPlanner;
