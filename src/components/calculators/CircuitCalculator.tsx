
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

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
  const [stationNames, setStationNames] = useState<string[]>(
    Array(6).fill("")
  );
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

  // Afficher que tous les noms d'exercices sont remplis
  const stationFields = [];
  for (let i = 0; i < nbStations; i++) {
    stationFields.push(
      <div key={i} className="mb-2">
        <Label htmlFor={`station${i}`}>Station {i + 1}</Label>
        <Input
          id={`station${i}`}
          list="exoSuggestions"
          placeholder={defaultExos[i]}
          value={stationNames[i] || ""}
          onChange={(e) => handleStationNameChange(i, e.target.value)}
          className="mt-1"
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
    <div className="max-w-2xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur de Circuit Training</CardTitle>
          <CardDescription>
            Générez facilement votre circuit&nbsp;: sélectionnez les stations/exercices, le temps d'effort/repos et obtenez le planning détaillé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPlan ? (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <Label>Nombre de stations (exercices enchaînés)</Label>
                <Slider
                  min={2}
                  max={6}
                  step={1}
                  value={[nbStations]}
                  onValueChange={([v]) => setNbStations(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">
                  {nbStations} stations
                </div>
              </div>
              {/* Stations/exos */}
              {stationFields}
              <div>
                <Label>Nombre de tours (rounds complets)</Label>
                <Slider
                  min={1}
                  max={6}
                  step={1}
                  value={[nbTours]}
                  onValueChange={([v]) => setNbTours(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">
                  {nbTours} tours
                </div>
              </div>
              <div>
                <Label>Temps d'effort par station (secondes)</Label>
                <Slider
                  min={10}
                  max={90}
                  step={5}
                  value={[workTime]}
                  onValueChange={([v]) => setWorkTime(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">
                  {workTime} secondes
                </div>
              </div>
              <div>
                <Label>Repos entre stations (secondes)</Label>
                <Slider
                  min={5}
                  max={60}
                  step={5}
                  value={[restTime]}
                  onValueChange={([v]) => setRestTime(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">
                  {restTime} sec
                </div>
              </div>
              <div>
                <Label>Repos entre chaque tour (secondes)</Label>
                <Slider
                  min={30}
                  max={180}
                  step={10}
                  value={[betweenRoundRest]}
                  onValueChange={([v]) => setBetweenRoundRest(Number(v))}
                  className="mt-2"
                />
                <div className="text-sm text-muted-foreground">
                  {betweenRoundRest} sec par pause longue
                </div>
              </div>
              <Button type="submit" className="w-full mt-2">
                Générer mon Circuit
              </Button>
            </form>
          ) : (
            <div>
              <h3 className="font-semibold text-lg mb-3">Circuit Training généré</h3>
              <table className="w-full text-xs border mb-2">
                <thead>
                  <tr className="bg-muted">
                    <th className="py-2 px-2 text-center">Round</th>
                    {stationNames.slice(0, nbStations).map((name, idx) => (
                      <th
                        key={idx}
                        className="py-2 px-2 text-center min-w-[90px]"
                      >
                        {name || `Station ${idx + 1}`}
                      </th>
                    ))}
                    <th className="py-2 px-2 text-center">
                      Repos fin de tour
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: nbTours }, (_, roundIdx) => (
                    <tr className={roundIdx % 2 === 0 ? "bg-background" : "bg-muted"} key={roundIdx}>
                      <td className="py-1 px-2 text-center">
                        {roundIdx + 1}
                      </td>
                      {stationNames.slice(0, nbStations).map((_, i) => (
                        <td className="py-1 px-2 text-center" key={i}>
                          {workTime}s effort<br />
                          {i < nbStations - 1 ? (
                            <span className="text-muted-foreground">
                              {restTime}s repos
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      ))}
                      <td className="py-1 px-2 text-center">
                        {roundIdx === nbTours - 1 ? "-" : `${betweenRoundRest}s`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="my-3 text-xs bg-muted px-3 py-2 rounded">
                <div>
                  <b>Conseils Circuit Training :</b>
                  <ul className="list-disc ml-4 mt-1">
                    <li>
                      Alternez les groupes musculaires pour limiter la fatigue locale.
                    </li>
                    <li>
                      Privilégiez des mouvements fonctionnels pour maximiser l'effet cardio et global.
                    </li>
                    <li>
                      Hydratez-vous bien entre les rounds, et adaptez le temps d'effort selon votre niveau.
                    </li>
                  </ul>
                  <div className="mt-1">
                    <b>Structure :</b> Enchaînez chaque station <b>{workTime}s</b>, reposez-vous <b>{restTime}s</b> entre chaque, et <b>{betweenRoundRest}s</b> entre les rounds.
                  </div>
                </div>
              </div>
              <Button variant="secondary" onClick={handleReset}>
                Nouveau circuit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CircuitCalculator;

