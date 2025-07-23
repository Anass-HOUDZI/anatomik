
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ResponsiveContainer } from "@/components/ui/responsive-container";
import { MobileCard } from "@/components/ui/mobile-card";
import { MobileButton } from "@/components/ui/mobile-button";

const defaultExos = [
  "Pompes",
  "Squat",
  "Crunch abdos",
  "Fentes",
  "Gainage",
  "Burpees",
  "Tirage élastique",
  "Step-up",
  "Mountain climbers",
  "Dips sur banc",
];

const CircuitCalculator: React.FC = () => {
  const [nbStations, setNbStations] = useState(4);
  const [nbTours, setNbTours] = useState(3);
  const [workTime, setWorkTime] = useState(40);
  const [restTime, setRestTime] = useState(20);
  const [betweenRoundRest, setBetweenRoundRest] = useState(60);
  const [stationNames, setStationNames] = useState<string[]>(Array(6).fill(""));
  const [showPlan, setShowPlan] = useState(false);

  const handleStationNameChange = (i: number, val: string) => {
    const arr = [...stationNames];
    arr[i] = val;
    setStationNames(arr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPlan(true);
  };

  const handleReset = () => {
    setShowPlan(false);
    setNbStations(4);
    setNbTours(3);
    setWorkTime(40);
    setRestTime(20);
    setBetweenRoundRest(60);
    setStationNames(Array(6).fill(""));
  };

  const stationFields = [];
  for (let i = 0; i < nbStations; i++) {
    stationFields.push(
      <div key={i} className="space-y-2">
        <Label htmlFor={`station${i}`} className="text-sm md:text-base font-medium">
          Station {i + 1}
        </Label>
        <Input
          id={`station${i}`}
          list="exoSuggestions"
          placeholder={defaultExos[i]}
          value={stationNames[i] || ""}
          onChange={(e) => handleStationNameChange(i, e.target.value)}
          className="mobile-input"
          required
        />
        <datalist id="exoSuggestions">
          {defaultExos.map((exo) => (
            <option value={exo} key={exo} />
          ))}
        </datalist>
      </div>
    );
  }

  return (
    <ResponsiveContainer className="w-full">
      <MobileCard className="w-full">
        <div className="p-4 md:p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Calculateur de Circuit Training
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Générez facilement votre circuit : sélectionnez les stations/exercices, le temps d'effort/repos et obtenez le planning détaillé.
            </p>
          </div>

          {!showPlan ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Nombre de stations (exercices enchaînés)</Label>
                <Slider
                  min={2}
                  max={6}
                  step={1}
                  value={[nbStations]}
                  onValueChange={([v]) => setNbStations(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{nbStations} stations</div>
              </div>

              <div className="space-y-4">
                {stationFields}
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Nombre de tours (rounds complets)</Label>
                <Slider
                  min={1}
                  max={6}
                  step={1}
                  value={[nbTours]}
                  onValueChange={([v]) => setNbTours(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{nbTours} tours</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Temps d'effort par station (secondes)</Label>
                <Slider
                  min={10}
                  max={90}
                  step={5}
                  value={[workTime]}
                  onValueChange={([v]) => setWorkTime(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{workTime} secondes</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Repos entre stations (secondes)</Label>
                <Slider
                  min={5}
                  max={60}
                  step={5}
                  value={[restTime]}
                  onValueChange={([v]) => setRestTime(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{restTime} sec</div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm md:text-base font-medium">Repos entre chaque tour (secondes)</Label>
                <Slider
                  min={30}
                  max={180}
                  step={10}
                  value={[betweenRoundRest]}
                  onValueChange={([v]) => setBetweenRoundRest(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-gray-500 font-medium">{betweenRoundRest} sec par pause longue</div>
              </div>

              <MobileButton type="submit" className="w-full mt-6" size="lg">
                Générer mon Circuit
              </MobileButton>
            </form>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">Circuit Training généré</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-2 text-center font-semibold">Round</th>
                      {stationNames.slice(0, nbStations).map((name, idx) => (
                        <th key={idx} className="py-3 px-2 text-center font-semibold min-w-[90px]">
                          {name || `Station ${idx + 1}`}
                        </th>
                      ))}
                      <th className="py-3 px-2 text-center font-semibold">Repos fin de tour</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: nbTours }, (_, roundIdx) => (
                      <tr className={roundIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} key={roundIdx}>
                        <td className="py-2 px-2 text-center font-medium">{roundIdx + 1}</td>
                        {stationNames.slice(0, nbStations).map((_, i) => (
                          <td className="py-2 px-2 text-center" key={i}>
                            <div className="font-bold text-red-600">{workTime}s effort</div>
                            {i < nbStations - 1 ? (
                              <div className="text-blue-600 text-xs">{restTime}s repos</div>
                            ) : (
                              <div className="text-xs">-</div>
                            )}
                          </td>
                        ))}
                        <td className="py-2 px-2 text-center">
                          {roundIdx === nbTours - 1 ? "-" : `${betweenRoundRest}s`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800 mb-2">🏃‍♂️ Conseils Circuit Training :</div>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Alternez les groupes musculaires pour limiter la fatigue locale</li>
                  <li>• Privilégiez des mouvements fonctionnels pour maximiser l'effet cardio et global</li>
                  <li>• Hydratez-vous bien entre les rounds, et adaptez le temps d'effort selon votre niveau</li>
                </ul>
                <div className="mt-3 p-3 bg-white rounded">
                  <strong>Structure :</strong> Enchaînez chaque station <strong>{workTime}s</strong>, reposez-vous <strong>{restTime}s</strong> entre chaque, et <strong>{betweenRoundRest}s</strong> entre les rounds.
                </div>
              </div>

              <MobileButton variant="secondary" onClick={handleReset} className="w-full" size="lg">
                Nouveau circuit
              </MobileButton>
            </div>
          )}
        </div>
      </MobileCard>
    </ResponsiveContainer>
  );
};

export default CircuitCalculator;
