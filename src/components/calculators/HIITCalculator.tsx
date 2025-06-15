
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const HIIT_PROTOCOLS = [
  {
    name: "Tabata (8x20/10)",
    work: 20,
    rest: 10,
    cycles: 8,
    total: 4,
    desc: "Protocole classique ultra-intense, durée totale 4 min.",
  },
  {
    name: "30:30 Intervalles",
    work: 30,
    rest: 30,
    cycles: 10,
    total: 10,
    desc: "Format cardio classique, intensité élevée/moyenne.",
  },
  {
    name: "1/2 Pyramide",
    work: 45,
    rest: 90,
    cycles: 7,
    total: 15.75,
    desc: "Pour HIIT avancé/endurance, ratios récup > effort.",
  },
  {
    name: "Personnalisé",
    work: 30,
    rest: 30,
    cycles: 8,
    total: null,
    desc: "Ajustez tous les paramètres ci-dessous !",
  },
];

const HIITCalculator = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const protocol = HIIT_PROTOCOLS[selectedIdx];
  const [work, setWork] = useState(protocol.work);
  const [rest, setRest] = useState(protocol.rest);
  const [cycles, setCycles] = useState(protocol.cycles);
  const [intensity, setIntensity] = useState(8);
  const [showPlan, setShowPlan] = useState(false);

  // Mettre à jour sliders si preset changé sauf en personnalisé
  React.useEffect(() => {
    if (protocol.name !== "Personnalisé") {
      setWork(protocol.work);
      setRest(protocol.rest);
      setCycles(protocol.cycles);
    }
  }, [selectedIdx]);

  const totalEffort = work * cycles;
  const totalRest = rest * (cycles - 1);
  const totalTime = totalEffort + totalRest;
  const totalMinutes = (totalTime / 60).toFixed(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowPlan(true);
  }

  function handleReset() {
    setShowPlan(false);
  }

  // Génère la table des intervalles
  const intervals = Array.from({ length: cycles }, (_, i) => ({
    index: i + 1,
    work: work,
    rest: i < cycles - 1 ? rest : 0,
  }));

  return (
    <div className="max-w-2xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur HIIT</CardTitle>
          <CardDescription>
            Définissez votre protocole d'intervalles haute intensité et obtenez le planning précis avec conseils pros !
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPlan ? (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <Label>Protocole HIIT</Label>
                <select
                  className="w-full mt-2 border rounded px-2 py-1"
                  value={selectedIdx}
                  onChange={e => setSelectedIdx(Number(e.target.value))}
                >
                  {HIIT_PROTOCOLS.map((p, idx) => (
                    <option value={idx} key={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-muted-foreground mt-1">{protocol.desc}</div>
              </div>
              <div>
                <Label>Temps d'effort <span className="text-xs text-muted-foreground">/ intervalle</span></Label>
                <Slider
                  min={10}
                  max={120}
                  step={5}
                  value={[work]}
                  onValueChange={([v]) => setWork(Number(v))}
                  className="mt-1"
                  disabled={protocol.name !== "Personnalisé"}
                />
                <div className="text-sm text-muted-foreground">{work} secondes</div>
              </div>
              <div>
                <Label>Temps de repos <span className="text-xs text-muted-foreground">/ intervalle</span></Label>
                <Slider
                  min={5}
                  max={180}
                  step={5}
                  value={[rest]}
                  onValueChange={([v]) => setRest(Number(v))}
                  className="mt-1"
                  disabled={protocol.name !== "Personnalisé"}
                />
                <div className="text-sm text-muted-foreground">{rest} secondes</div>
              </div>
              <div>
                <Label>Nombre d'intervalles</Label>
                <Slider
                  min={3}
                  max={20}
                  step={1}
                  value={[cycles]}
                  onValueChange={([v]) => setCycles(Number(v))}
                  className="mt-1"
                  disabled={protocol.name !== "Personnalisé"}
                />
                <div className="text-sm text-muted-foreground">{cycles} cycles</div>
              </div>
              <div>
                <Label>Intensité perçue</Label>
                <Slider
                  min={5}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(Number(v))}
                  className="mt-1"
                />
                <div className="text-sm text-muted-foreground">{intensity}/10 (5 = modéré, 10 = max)</div>
              </div>
              <div>
                <Label>Durée totale estimée</Label>
                <div className="font-semibold mt-1">{totalTime} sec ({totalMinutes} min)</div>
              </div>
              <Button type="submit" className="w-full mt-3">Générer mon HIIT</Button>
            </form>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-3">Protocole HIIT Généré</h3>
              <table className="w-full text-xs border mb-2">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-2 px-2 text-center">Cycle</th>
                    <th className="py-2 px-2 text-center">Effort (sec)</th>
                    <th className="py-2 px-2 text-center">Repos (sec)</th>
                  </tr>
                </thead>
                <tbody>
                  {intervals.map(iv => (
                    <tr className={iv.index % 2 === 0 ? "bg-background" : "bg-muted"} key={iv.index}>
                      <td className="py-1 px-2 text-center">{iv.index}</td>
                      <td className="py-1 px-2 text-center font-semibold text-primary">{iv.work}</td>
                      <td className="py-1 px-2 text-center">{iv.rest > 0 ? iv.rest : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-3 text-xs bg-muted px-3 py-2 rounded">
                <b>Conseils HIIT :</b>
                <ul className="list-disc ml-4 mt-1">
                  <li>Échauffez-vous 5-10 min avant de commencer.</li>
                  <li>Adaptez l’intensité selon votre niveau, ciblez {intensity}/10 sur l’échelle d’effort perçu.</li>
                  <li>HIIT se suffit à 2-3 séances/semaine pour des progrès significatifs.</li>
                  <li>Respectez une technique irréprochable même sur la fin.</li>
                  <li>Hydratez-vous bien et récupérez activement après l’effort.</li>
                </ul>
                <div className="mt-2">
                  <b>Durée totale :</b> <span className="font-semibold">{totalTime} sec ({totalMinutes} min)</span>
                  <br />
                  <b>Profil :</b> {protocol.name} - Intensité cible : {intensity}/10
                </div>
              </div>
              <Button onClick={handleReset} variant="secondary">Nouveau protocole</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HIITCalculator;
