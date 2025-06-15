
import React, { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ChartContainer } from "../ui/chart";
import { StorageManager } from "../../utils/StorageManager";
import { useToast } from "../ui/use-toast";

type SleepEntry = {
  date: string;        // AAAA-MM-JJ
  bedtime: string;     // HH:MM
  wakeup: string;      // HH:MM
  duration: number;    // heures décimal (calculé)
  quality: number;     // 1-10
  notes?: string;
};

// Utilisation d'une clé dédiée dans trackingData
function getSleepHistory(): SleepEntry[] {
  const trackingData = StorageManager.getTrackingData();
  return Array.isArray(trackingData.sleep)
    ? trackingData.sleep
    : [];
}

function saveSleepEntry(newEntry: SleepEntry) {
  const trackingData = StorageManager.getTrackingData();
  let history: SleepEntry[] = Array.isArray(trackingData.sleep) ? [...trackingData.sleep] : [];
  // Supprime l'entrée si déjà présente ce jour-là, et push la nouvelle
  history = history.filter(e => e.date !== newEntry.date);
  history.push(newEntry);
  history.sort((a, b) => b.date.localeCompare(a.date));
  StorageManager.saveTrackingData({ ...trackingData, sleep: history });
}

function calcSleepDuration(bedtime: string, wakeup: string) {
  // bedtime/wakeup: "HH:MM"
  const [h1, m1] = bedtime.split(":").map(Number);
  const [h2, m2] = wakeup.split(":").map(Number);
  let t1 = h1 * 60 + m1;
  let t2 = h2 * 60 + m2;
  if (t2 <= t1) t2 += 24 * 60; // Si lever < coucher, c'est lendemain
  const delta = t2 - t1;
  return Math.round((delta / 60) * 100) / 100;
}

export default function SleepTracker() {
  const { toast } = useToast();
  const todayStr = new Date().toISOString().slice(0,10);

  // Etat du formulaire
  const [date, setDate] = useState(todayStr);
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeup, setWakeup] = useState("07:00");
  const [quality, setQuality] = useState(7);
  const [notes, setNotes] = useState("");
  const [reload, setReload] = useState(false);

  // Historique sommeil (du plus récent au plus ancien)
  const sleepHistory = useMemo(() => {
    const arr = getSleepHistory();
    return arr.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [reload]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const duration = calcSleepDuration(bedtime, wakeup);
    if (isNaN(duration) || duration < 1.5 || duration > 16) {
      toast({
        title: "Durée incohérente",
        description: "Merci de vérifier vos horaires, la durée calculée semble incorrecte.",
        variant: "destructive"
      });
      return;
    }
    const entry: SleepEntry = {
      date,
      bedtime,
      wakeup,
      duration,
      quality,
      notes: notes.trim() ? notes : undefined
    };
    saveSleepEntry(entry);
    setReload(r => !r);
    toast({
      title: "Sommeil enregistré",
      description: `Nuit du ${date} sauvegardée (${duration} h, qualité ${quality}/10)`
    });
  }

  // Pour graphe sur 14 derniers jours
  const labels: string[] = [];
  const durations: number[] = [];
  const qualities: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().slice(0,10);
    const entry = sleepHistory.find(e => e.date === dStr);
    labels.push(dStr.slice(5, 10));
    durations.push(entry ? entry.duration : 0);
    qualities.push(entry ? entry.quality : 0);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-xl p-6 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-bed text-primary" /> Tracker de Sommeil
      </h2>
      <p className="text-muted-foreground mb-4">
        Suivez vos horaires de sommeil et la qualité ressentie pour améliorer récupération et performance.
      </p>
      {/* Formulaire saisie */}
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleSubmit}>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="md:w-[140px]"
        />
        <Input
          type="time"
          value={bedtime}
          onChange={e => setBedtime(e.target.value)}
          className="md:w-[120px]"
          min="16:00"
          max="04:00"
          step={60}
          placeholder="coucher"
        />
        <span className="flex items-center px-2">→</span>
        <Input
          type="time"
          value={wakeup}
          onChange={e => setWakeup(e.target.value)}
          className="md:w-[120px]"
          min="04:00"
          max="12:00"
          step={60}
          placeholder="lever"
        />
        <input
          type="number"
          min={1}
          max={10}
          value={quality}
          onChange={e => setQuality(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          title="qualité (1-10)"
        />
        <Button type="submit" className="bg-primary text-white">
          + Ajouter
        </Button>
      </form>
      {/* Graphe simplifié */}
      <ChartContainer
        config={{
          "Durée": { label: "Durée (h)", color: "#a7f" },
          "Qualité": { label: "Qualité/10", color: "#5bc27a" }
        }}
        className="bg-muted p-2 mb-4"
      >
        <div className="w-full h-32 flex flex-col items-center justify-center text-sm text-muted-foreground">
          (Prévisualisation : 
            {durations.map((d, i) =>
              d > 0
                ? <span key={i} className="mr-1">{d >= 7 ? "🌙" : "😴"}</span>
                : <span key={i} className="mr-1 opacity-40">·</span>
            )}
          )
          <br /><span className="opacity-40">Graphique détaillé bientôt !</span>
        </div>
      </ChartContainer>
      {/* Tableau historique */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Coucher</TableHead>
              <TableHead>Lever</TableHead>
              <TableHead>Durée (h)</TableHead>
              <TableHead>Qualité</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sleepHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucune donnée enregistrée.
                </TableCell>
              </TableRow>
            ) : (
              sleepHistory.map((item, idx) => (
                <TableRow key={item.date + idx}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.bedtime}</TableCell>
                  <TableCell>{item.wakeup}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.quality}/10</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.notes || "–"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Astuce : La durée idéale est entre 7h et 9h/nuit selon les recommandations scientifiques sportives.
      </p>
    </div>
  );
}
