
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";

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

  useEffect(() => {
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

  const intervals = Array.from({ length: cycles }, (_, i) => ({
    index: i + 1,
    work: work,
    rest: i < cycles - 1 ? rest : 0,
  }));

  return (
    <ResponsiveContainer className="w-full">
      <MobileCard className="w-full">
        <div className="p-4 md:p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Calculateur HIIT
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Définissez votre protocole d'intervalles haute intensité et obtenez le planning précis avec conseils pros !
            </p>
          </div>

          {!showPlan ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label className="text-sm md:text-base font-medium">Protocole HIIT</Label>
                <select
                  className="w-full p-3 border rounded-lg mobile-input"
                  value={selectedIdx}
                  onChange={e => setSelectedIdx(Number(e.target.value))}
                >
                  {HIIT_PROTOCOLS.map((p, idx) => (
                    <option value={idx} key={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">{protocol.desc}</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">
                  Temps d'effort <span className="text-xs text-gray-500">/ intervalle</span>
                </Label>
                <Slider
                  min={10}
                  max={120}
                  step={5}
                  value={[work]}
                  onValueChange={([v]) => setWork(Number(v))}
                  className="mt-2"
                  disabled={protocol.name !== "Personnalisé"}
                />
                <div className="text-sm text-gray-500 font-medium">{work} secondes</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">
                  Temps de repos <span className="text-xs text-gray-500">/ intervalle</span>
                </Label>
                <Slider
                  min={5}
                  max={180}
                  step={5}
                  value={[rest]}
                  onValueChange={([v]) => setRest(Number(v))}
                  className="mt-2"
                  disabled={protocol.name !== "Personnalisé"}
                />
                <div className="text-sm text-gray-500 font-medium">{rest} secondes</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Nombre d'intervalles</Label>
                <Slider
                  min={3}
                  max={20}
                  step={1}
                  value={[cycles]}
                  onValueChange={([v]) => setCycles(Number(v))}
                  className="mt-2"
                  disabled={protocol.name !== "Personnalisé"}
                />
                <div className="text-sm text-gray-500 font-medium">{cycles} cycles</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Intensité perçue</Label>
                <Slider
                  min={5}
                  max={10}
                  step={1}
                  value={[intensity]}
                  onValueChange={([v]) => setIntensity(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{intensity}/10 (5 = modéré, 10 = max)</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <Label className="font-semibold text-blue-800">Durée totale estimée</Label>
                <div className="text-xl font-bold text-blue-600 mt-1">
                  {totalTime} sec ({totalMinutes} min)
                </div>
              </div>

              <MobileButton type="submit" className="w-full mt-6" size="lg">
                Générer mon HIIT
              </MobileButton>
            </form>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center text-black">Protocole HIIT Généré</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-2 text-center font-semibold">Cycle</th>
                      <th className="py-3 px-2 text-center font-semibold">Effort (sec)</th>
                      <th className="py-3 px-2 text-center font-semibold">Repos (sec)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intervals.map(iv => (
                      <tr className={iv.index % 2 === 0 ? "bg-white" : "bg-gray-50"} key={iv.index}>
                        <td className="py-2 px-2 text-center font-medium">{iv.index}</td>
                        <td className="py-2 px-2 text-center font-bold text-red-600">{iv.work}</td>
                        <td className="py-2 px-2 text-center text-blue-600">{iv.rest > 0 ? iv.rest : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800 mb-2">🏃‍♂️ Conseils HIIT :</div>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Échauffez-vous 5-10 min avant de commencer</li>
                    <li>• Adaptez l'intensité selon votre niveau, ciblez {intensity}/10</li>
                    <li>• HIIT se suffit à 2-3 séances/semaine pour des progrès significatifs</li>
                    <li>• Respectez une technique irréprochable même sur la fin</li>
                    <li>• Hydratez-vous bien et récupérez activement après l'effort</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="font-semibold text-blue-800">📊 Profil :</div>
                  <div className="text-blue-700">
                    {protocol.name} - Intensité cible : {intensity}/10
                  </div>
                  <div className="text-xl font-bold text-blue-600 mt-2">
                    Durée totale : {totalTime} sec ({totalMinutes} min)
                  </div>
                </div>
              </div>

              <MobileButton onClick={handleReset} variant="secondary" className="w-full" size="lg">
                Nouveau protocole
              </MobileButton>
            </div>
          )}
        </div>
      </MobileCard>
    </ResponsiveContainer>
  );
};

export default HIITCalculator;
