
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChartContainer } from "../ui/chart";
import { StorageManager } from "../../utils/StorageManager";
import type { DataPoint } from "../../types";

export default function BodyCompositionTracker() {
  const [bodyFat, setBodyFat] = useState<number>(0);
  const [unit, setUnit] = useState<"percent" | "kg">("percent");
  const [date, setDate] = useState(() => new Date().toISOString().substring(0,10));
  const [reload, setReload] = useState(false);

  // Récupération données
  const trackingData = StorageManager.getTrackingData();
  const weightArray = trackingData.weight || [];
  const bodyFatArray: DataPoint[] = trackingData.bodyFat || [];

  // Récupérer le poids du jour
  const todayWeight = useMemo(() => {
    if (!weightArray.length) return undefined;
    // poids le plus proche pour la date sélectionnée (ou dernier connu)
    const entry = weightArray.find(w => w.date.substring(0,10) === date) || weightArray[weightArray.length - 1];
    return entry?.value;
  }, [weightArray, date]);

  // Ajout d'une mesure masse grasse
  function handleAddBodyFat(e: React.FormEvent) {
    e.preventDefault();
    if (!bodyFat || bodyFat < 1) return;
    let value = bodyFat;
    if (unit === "kg" && todayWeight) {
      value = (bodyFat / todayWeight) * 100; // Conversion en %
    }
    const entry: DataPoint = {
      date,
      value: Number(value),
    };
    const updatedArray = [...bodyFatArray, entry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    StorageManager.saveTrackingData({
      ...trackingData,
      bodyFat: updatedArray
    });
    setBodyFat(0);
    setReload(prev => !prev);
  }

  // Préparation data pour chart : % masse grasse et masse maigre
  const chartBodyFat = bodyFatArray.slice(-10).map(point => ({
    x: point.date.substring(5,10),
    y: point.value
  }));
  const chartLean = chartBodyFat.map((pt, idx) => ({
    x: pt.x,
    y: todayWeight ? todayWeight * (1 - chartBodyFat[idx].y / 100) : undefined
  }));

  // Data du tableau
  const tableData = bodyFatArray
    .map(point => {
      // On estime la masse maigre sur la date
      const weightOnDate = weightArray.find(w => w.date.substring(0,10) === point.date.substring(0,10))?.value 
        ?? weightArray[weightArray.length - 1]?.value;
      return {
        date: point.date.substring(0,10),
        bodyFatPercent: point.value,
        bodyFatKg: weightOnDate ? (point.value/100) * weightOnDate : undefined,
        leanMassKg: weightOnDate ? weightOnDate - (point.value/100) * weightOnDate : undefined,
        weight: weightOnDate
      }
    })
    .sort((a,b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-xl p-6 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-user text-primary" /> Tracker de Composition Corporelle
      </h2>
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleAddBodyFat}>
        <Input
          type="number"
          min={1}
          step={0.1}
          placeholder={unit === "percent" ? "% Masse grasse" : "Masse grasse (kg)"}
          value={bodyFat || ""}
          onChange={e => setBodyFat(Number(e.target.value))}
        />
        <select className="border rounded px-3 py-2" value={unit} onChange={e => setUnit(e.target.value as "percent" | "kg")}>
          <option value="percent">% (masse grasse)</option>
          <option value="kg">kg (masse grasse)</option>
        </select>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <Button type="submit" className="bg-primary text-white">
          + Ajouter
        </Button>
      </form>
      {/* Graphe d'évolution */}
      {chartBodyFat.length > 0 && (
        <ChartContainer
          config={{
            "body fat %": { label: "Masse grasse %", color: "#EF4444" },
            "lean mass": { label: "Masse maigre (kg estimée)", color: "#3B82F6" }
          }}
          className="bg-muted p-2 mb-4"
        >
          <div className="w-full h-32 flex items-center justify-center text-sm text-muted-foreground">
            (Graphique simplifié. Support courbe avancée bientôt !)
          </div>
        </ChartContainer>
      )}
      {/* Tableau synthétique */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Poids (kg)</TableHead>
              <TableHead>% Masse grasse</TableHead>
              <TableHead>Masse grasse (kg)</TableHead>
              <TableHead>Masse maigre (kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucune donnée enregistrée pour l&#39;instant.
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((item, idx) => (
                <TableRow key={item.date + idx}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.weight ? item.weight.toFixed(1) : "?"}</TableCell>
                  <TableCell>{item.bodyFatPercent.toFixed(1)}</TableCell>
                  <TableCell>
                    {item.bodyFatKg ? item.bodyFatKg.toFixed(1) : "?"}
                  </TableCell>
                  <TableCell>
                    {item.leanMassKg ? item.leanMassKg.toFixed(1) : "?"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
