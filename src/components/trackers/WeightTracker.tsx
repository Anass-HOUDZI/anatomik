
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus } from "lucide-react";
import { StorageManager, TrackingData } from "@/utils/StorageManager";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const WeightTracker = () => {
  const [weightHistory, setWeightHistory] = useState<{ date: string, value: number }[]>([]);
  const [weight, setWeight] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement historique au démarrage
  useEffect(() => {
    const data: TrackingData = StorageManager.getTrackingData();
    setWeightHistory(Array.isArray(data.weight) ? [...data.weight].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : []);
  }, [adding]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const w = Number(weight.replace(",", "."));
    if (isNaN(w) || w < 30 || w > 250) {
      setError("Poids incorrect (30-250 kg)");
      return;
    }
    if (!date) {
      setError("Sélectionnez une date valide");
      return;
    }
    // Vérifie que la date n'est pas dans le futur
    if (date > new Date()) {
      setError("La date ne peut pas être dans le futur");
      return;
    }
    StorageManager.addWeightEntry(w, date.toISOString());
    setWeight("");
    setDate(new Date());
    setAdding(!adding); // Rafraîchi l'historique
  };

  // Données pour le graphique : dernier 60 jours max
  const chartData = weightHistory
    .slice(-60)
    .map(entry => ({
      date: format(new Date(entry.date), "dd/MM", { locale: fr }),
      poids: entry.value,
    }));

  return (
    <div className="max-w-xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Tracker de Poids Corporel</CardTitle>
          <CardDescription>
            Saisissez votre poids régulièrement pour visualiser votre progression. Vos données sont stockées 100% localement et confidentielles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-3 items-center mb-6" onSubmit={handleAddWeight}>
            <div className="flex-1 flex flex-col gap-2 w-full">
              <label className="text-sm text-muted-foreground" htmlFor="weight-input">Poids (kg)</label>
              <Input
                id="weight-input"
                type="number"
                min={30}
                max={250}
                step="0.1"
                placeholder="Ex : 73,5"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 w-full">
              <label className="text-sm text-muted-foreground" htmlFor="date-input">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full pl-3 justify-start text-left font-normal"
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date ? format(date, "dd MMM yyyy", { locale: fr }) : "Sélectionnez une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    locale={fr}
                    disabled={(d) => d > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="mt-6 md:mt-7 w-full md:w-auto" title="Ajouter">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </form>
          {error && (<div className="text-destructive text-sm mb-3">{error}</div>)}

          {/* Graphique */}
          {weightHistory.length > 1 && (
            <div className="my-6 pb-2">
              <ChartContainer
                config={{
                  poids: { label: "Poids (kg)", color: "var(--primary)" }
                }}
                className="h-48"
              >
                {({ ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid }) => (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={['dataMin-2', 'dataMax+2']}
                      tickFormatter={v => `${v} kg`}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend content={<ChartLegend />} />
                    <Line type="monotone" dataKey="poids" stroke="var(--primary)" dot />
                  </LineChart>
                )}
              </ChartContainer>
            </div>
          )}

          {/* Liste des entrées */}
          <h4 className="text-md font-semibold mb-2 mt-6">Historique des pesées</h4>
          <ul className="space-y-2 max-h-60 overflow-auto">
            {weightHistory.length === 0 && (
              <li className="text-sm text-muted-foreground">Aucune donnée enregistrée pour le moment.</li>
            )}
            {weightHistory
              .slice()
              .reverse()
              .map((item, idx) => (
              <li key={item.date + "_" + item.value + "_" + idx} className="flex items-center gap-4 border-b pb-1">
                <span className="flex-1">{format(new Date(item.date), "dd MMM yyyy", { locale: fr })}</span>
                <span className="font-mono font-semibold">{item.value.toFixed(1)} kg</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTracker;
