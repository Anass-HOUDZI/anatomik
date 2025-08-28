import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Plus } from "lucide-react";
import { StorageManager } from "@/utils/StorageManager";
import { TrackingData, PerformanceEntry } from "@/types/tracking";
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
// ---- AJOUT Import explicites de recharts ----
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

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
    <div className="max-w-4xl mx-auto pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Inputs Section */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-edit text-primary"></i>
              <CardTitle className="text-lg">Paramètres</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Saisissez votre poids régulièrement pour visualiser votre progression.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form className="space-y-3" onSubmit={handleAddWeight}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="weight-input">Poids (kg)</label>
                <Input
                  id="weight-input"
                  type="number"
                  min={30}
                  max={250}
                  step="0.1"
                  placeholder="Ex : 73,5"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="h-8 text-sm"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date-input">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-8 pl-3 justify-start text-left font-normal text-sm"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
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
              
              <div className="border-t border-border pt-3">
                <Button type="submit" className="w-full h-8 text-sm">
                  <Plus className="mr-1 h-3 w-3" />
                  Appliquer et Ajouter
                </Button>
              </div>
            </form>
            {error && (<div className="text-destructive text-xs mt-2">{error}</div>)}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <i className="fas fa-calculator text-primary"></i>
              <CardTitle className="text-lg">Résultats</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Graphique */}
            {weightHistory.length > 1 && (
              <div className="mb-4 pb-2">
                <ChartContainer
                  config={{
                    poids: { label: "Poids (kg)", color: "var(--primary)" }
                  }}
                  className="h-40"
                >
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{fontSize: 10}} />
                      <YAxis
                        domain={['dataMin-2', 'dataMax+2']}
                        tickFormatter={v => `${v} kg`}
                        tick={{fontSize: 10}}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend content={<ChartLegend />} />
                      <Line type="monotone" dataKey="poids" stroke="var(--primary)" dot />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}

            {/* Liste des entrées */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Historique des pesées</h4>
              <ul className="space-y-1 max-h-48 overflow-auto">
                {weightHistory.length === 0 && (
                  <li className="text-xs text-muted-foreground">Aucune donnée enregistrée pour le moment.</li>
                )}
                {weightHistory
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((item, idx) => (
                  <li key={item.date + "_" + item.value + "_" + idx} className="flex items-center gap-2 border-b pb-1 text-xs">
                    <span className="flex-1">{format(new Date(item.date), "dd MMM yyyy", { locale: fr })}</span>
                    <span className="font-mono font-semibold">{item.value.toFixed(1)} kg</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeightTracker;
