
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "../ui/chart";
import { StorageManager } from "../../utils/StorageManager";
import type { DataPoint } from "../../types";

// Liste d'exercices de base (à étendre)
const EXERCISES = [
  "Développé couché",
  "Squat",
  "Soulevé de terre",
  "Tractions",
  "Développé militaire",
];

type PerformanceEntry = {
  date: string;
  exercise: string;
  weight: number;
  reps: number;
};

export default function PerformanceTracker() {
  const [exercise, setExercise] = useState(EXERCISES[0]);
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [date, setDate] = useState(() => new Date().toISOString().substring(0,10));
  const [reload, setReload] = useState(false);

  // On récupère les données du storage
  const trackingData = StorageManager.getTrackingData();
  const performance: Record<string, DataPoint[]> = trackingData.performance || {};

  // Datas aplaties pour le tableau
  const tableData: PerformanceEntry[] = useMemo(() => {
    return Object.entries(performance)
      .flatMap(([exercise, arr]) =>
        arr.map(dp => ({
          exercise,
          date: dp.date.substring(0, 10),
          weight: dp.value,
          reps: dp.notes ? Number(dp.notes) : 0,
        }))
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [performance, reload]);

  // Ajout d'une perf
  function handleAddPerformance(e: React.FormEvent) {
    e.preventDefault();
    if (!weight || !reps) return;
    const entry: DataPoint = {
      date: date,
      value: weight,
      notes: reps.toString(),
    };
    // On clone l'objet pour éviter de muter directement storage
    const updatedPerf = { ...performance };
    if (!updatedPerf[exercise]) updatedPerf[exercise] = [];
    updatedPerf[exercise] = [...updatedPerf[exercise], entry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    StorageManager.saveTrackingData({
      ...trackingData,
      performance: updatedPerf as Record<string, import("@/types/tracking").PerformanceEntry[]>,
    });
    setWeight(0);
    setReps(0);
    setReload(!reload);
  }

  // Préparation data pour graphiques
  const chartSeries = Object.keys(performance).length > 0 ? Object.entries(performance).map(
    ([ex, arr]) => ({
      name: ex,
      data: arr.slice(-10).map(dp => ({
        x: dp.date.substring(5,10),
        y: dp.value,
        reps: dp.notes,
      }))
    })
  ) : [];

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-xl p-6 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-chart-bar text-primary" /> Tracker de Performance
      </h2>

      {/* Formulaire d'enregistrement */}
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleAddPerformance}>
        <select
          className="border rounded px-3 py-2 flex-1"
          value={exercise}
          onChange={e => setExercise(e.target.value)}
        >
          {EXERCISES.map(ex => <option key={ex} value={ex}>{ex}</option>)}
        </select>
        <Input
          type="number"
          min={1}
          step={0.5}
          placeholder="Poids (kg)"
          value={weight}
          onChange={e => setWeight(Number(e.target.value))}
        />
        <Input
          type="number"
          min={1}
          max={100}
          placeholder="Répétitions"
          value={reps}
          onChange={e => setReps(Number(e.target.value))}
        />
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <Button type="submit" className="bg-primary text-white">
          + Ajouter
        </Button>
      </form>

      {/* Graphe de progression (multi-exos si nécessaire) */}
      {chartSeries.length > 0 && (
        <ChartContainer
          config={Object.fromEntries(chartSeries.map(s => [
            s.name, { label: s.name, color: "#3B82F6" }
          ]))}
          className="bg-muted p-2 mb-4"
        >
          {/* Remplacer la fonction enfant par du JSX */}
          <div className="w-full h-32 flex items-center justify-center text-sm text-muted-foreground">
            Désolé, l'affichage graphique avancé sera ajouté bientôt&nbsp;!
          </div>
        </ChartContainer>
      )}

      {/* Tableau des performances */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Exercice</TableHead>
              <TableHead>Poids (kg)</TableHead>
              <TableHead>Répétitions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Aucune donnée enregistrée pour l&#39;instant.
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((item, idx) => (
                <TableRow key={item.exercise + item.date + idx}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.exercise}</TableCell>
                  <TableCell>{item.weight}</TableCell>
                  <TableCell>{item.reps}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
