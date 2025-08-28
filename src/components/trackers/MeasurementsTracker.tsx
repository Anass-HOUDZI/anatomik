
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Ruler } from "lucide-react";
import { StorageManager } from "@/utils/StorageManager";
import { TrackingData } from "@/types/tracking";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";

const MEASUREMENTS = [
  { key: "bras", label: "Bras (cm)" },
  { key: "poitrine", label: "Poitrine (cm)" },
  { key: "taille", label: "Taille (cm)" },
  { key: "hanches", label: "Hanches (cm)" },
  { key: "cuisses", label: "Cuisses (cm)" }
  // Vous pouvez en ajouter d'autres si besoin : mollets, avant-bras, etc.
];

type Entry = {
  date: string; // ISO string
  value: number;
};

type MeasurementsPerZone = {
  [measureKey: string]: Entry[];
};

const MeasurementsTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [inputs, setInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(MEASUREMENTS.map(m => [m.key, ""]))
  );
  const [measurements, setMeasurements] = useState<MeasurementsPerZone>({});
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  // Charger historique au démarrage/refresh
  useEffect(() => {
    const data: TrackingData = StorageManager.getTrackingData();
    setMeasurements(data.measurements || {});
  }, [refresh]);

  const handleChange = (k: string, val: string) => {
    // autorise , comme séparateur décimal
    setInputs(inputs => ({
      ...inputs,
      [k]: val.replace(",", ".")
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedDate) {
      setError("Veuillez sélectionner une date.");
      return;
    }
    let atLeastOne = false;
    for (const key of MEASUREMENTS.map(m => m.key)) {
      const val = parseFloat(inputs[key]);
      if (!isNaN(val) && val > 20 && val < 300) {
        StorageManager.addMeasurementEntry(key, val, selectedDate.toISOString());
        atLeastOne = true;
      }
    }
    if (!atLeastOne) {
      setError("Saisissez au moins une valeur valide !");
      return;
    }
    // Clear inputs & refresh
    setInputs(Object.fromEntries(MEASUREMENTS.map(m => [m.key, ""])));
    setSelectedDate(new Date());
    setRefresh(v => !v);
  };

  // Préparer les données graphiques : affiche la timeline de la première zone avec au moins 2 valeurs (bras sinon poitrine…)
  const mainZoneKey =
    MEASUREMENTS.find(m => (measurements[m.key]?.length ?? 0) > 1)?.key || MEASUREMENTS[0].key;
  const chartData =
    (measurements[mainZoneKey] ?? [])
      .slice(-20)
      .map(entry => ({
        date: format(new Date(entry.date), "dd/MM", { locale: fr }),
        valeur: entry.value
      }));

  return (
    <div className="max-w-xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="inline-flex items-center gap-2">
              <Ruler className="w-6 h-6" />
              Tracker de Mensurations
            </span>
          </CardTitle>
          <CardDescription>
            Saisissez et suivez l’évolution de vos mensurations principales. Toutes vos données sont 100% privées et stockées uniquement sur votre appareil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulaire */}
          <form className="flex flex-col gap-4 mb-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {MEASUREMENTS.map(measure => (
                <div key={measure.key} className="flex flex-col gap-1">
                  <label htmlFor={`input-${measure.key}`} className="text-sm text-muted-foreground">{measure.label}</label>
                  <Input
                    id={`input-${measure.key}`}
                    type="number"
                    step="0.1"
                    min={20}
                    max={300}
                    value={inputs[measure.key]}
                    onChange={e => handleChange(measure.key, e.target.value)}
                    placeholder="Ex : 33.5"
                  />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="date-mesure" className="text-sm text-muted-foreground mr-2">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" type="button" className="pl-3 w-[190px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {selectedDate ? format(selectedDate, "dd MMM yyyy", { locale: fr }) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    locale={fr}
                    disabled={(d) => d > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="w-full md:w-auto mt-2" title="Ajouter ces mesures">
              Ajouter cette mesure
            </Button>
          </form>
          {error && <div className="text-destructive text-sm mb-3">{error}</div>}

          {/* Graphique évolution (première zone dispo) */}
          {(chartData.length > 1) && (
            <div className="my-4">
              <div className="mb-2 text-muted-foreground font-medium">
                Évolution ({MEASUREMENTS.find(m => m.key === mainZoneKey)?.label})
              </div>
              <ChartContainer
                config={{
                  valeur: { label: MEASUREMENTS.find(m => m.key === mainZoneKey)?.label || '', color: "var(--primary)" }
                }}
                className="h-48"
              >
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin-2', 'dataMax+2']} tickFormatter={v => `${v} cm`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend content={<ChartLegend />} />
                    <Line type="monotone" dataKey="valeur" stroke="var(--primary)" dot />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}

          {/* Historique par zone */}
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Historique des mensurations</h4>
            {MEASUREMENTS.map(measure => (
              <div key={measure.key} className="mb-4">
                <div className="font-semibold mb-1">{measure.label}</div>
                <ul className="space-y-1">
                  {(measurements[measure.key]?.length) ? (
                    [...measurements[measure.key]].reverse().map((item, idx) => (
                      <li key={item.date + "_" + item.value + "_" + idx} className="flex items-center gap-4 border-b pb-1">
                        <span className="flex-1">{format(new Date(item.date), "dd MMM yyyy", { locale: fr })}</span>
                        <span className="font-mono font-semibold">{item.value.toFixed(1)} cm</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">Pas encore de mesure enregistrée.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeasurementsTracker;
