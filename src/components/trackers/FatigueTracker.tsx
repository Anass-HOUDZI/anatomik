
import React, { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ChartContainer } from "../ui/chart";
import { StorageManager } from "../../utils/StorageManager";
import { useToast } from "../ui/use-toast";

// Type local (doit matcher StorageManager)
type FatigueEntry = {
  date: string;            // AAAA-MM-JJ
  fatigue: number;         // 1-10 subjectif (fatigue générale)
  soreness: number;        // 1-10 courbatures/tensions musculaires
  motivation: number;      // 1-10 motivation/sentiment d'énergie
  notes?: string;
};

// Récupère historique
function getFatigueHistory(): FatigueEntry[] {
  const trackingData = StorageManager.getTrackingData();
  return Array.isArray(trackingData.fatigue)
    ? trackingData.fatigue
    : [];
}

// Sauvegarde nouvelle entrée (remplace la même date)
function saveFatigueEntry(newEntry: FatigueEntry) {
  const trackingData = StorageManager.getTrackingData();
  let history: FatigueEntry[] = Array.isArray(trackingData.fatigue) ? [...trackingData.fatigue] : [];
  history = history.filter(e => e.date !== newEntry.date);
  history.push(newEntry);
  history.sort((a, b) => b.date.localeCompare(a.date));
  StorageManager.saveTrackingData({ ...trackingData, fatigue: history });
}

export default function FatigueTracker() {
  const { toast } = useToast();
  const todayStr = new Date().toISOString().slice(0,10);

  // Form state
  const [date, setDate] = useState(todayStr);
  const [fatigue, setFatigue] = useState(5);
  const [soreness, setSoreness] = useState(4);
  const [motivation, setMotivation] = useState(6);
  const [notes, setNotes] = useState("");
  const [reload, setReload] = useState(false);

  // Historique du plus récent au plus ancien
  const fatigueHistory = useMemo(() => {
    const arr = getFatigueHistory();
    return arr.slice().sort((a, b) => b.date.localeCompare(a.date));
  }, [reload]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Contrôles simples : minimum 1, max 10
    if ([fatigue, soreness, motivation].some(v => v < 1 || v > 10)) {
      toast({
        title: "Valeur incohérente",
        description: "Tous les scores doivent être entre 1 et 10.",
        variant: "destructive"
      });
      return;
    }
    const entry: FatigueEntry = {
      date,
      fatigue,
      soreness,
      motivation,
      notes: notes.trim() ? notes : undefined
    };
    saveFatigueEntry(entry);
    setReload(r => !r);
    toast({
      title: "Fatigue enregistrée",
      description: `Niveau ${fatigue}/10 | Courbatures ${soreness}/10 | Motivation ${motivation}/10`
    });
  }

  // Graph sur les 14 derniers jours
  const labels: string[] = [];
  const fatigueValues: number[] = [];
  const motivationValues: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().slice(0,10);
    const entry = fatigueHistory.find(e => e.date === dStr);
    labels.push(dStr.slice(5, 10));
    fatigueValues.push(entry ? entry.fatigue : 0);
    motivationValues.push(entry ? entry.motivation : 0);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-xl p-6 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-battery-quarter text-primary" /> Tracker de Fatigue
      </h2>
      <p className="text-muted-foreground mb-4">
        Auto-évaluez votre niveau de fatigue, courbatures et motivation au quotidien pour optimiser la récupération et prévenir le surmenage.
      </p>
      {/* Formulaire */}
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleSubmit}>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="md:w-[140px]"
        />
        <input
          type="number"
          min={1}
          max={10}
          value={fatigue}
          onChange={e => setFatigue(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          title="Fatigue (1-10)"
        />
        <input
          type="number"
          min={1}
          max={10}
          value={soreness}
          onChange={e => setSoreness(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          title="Courbatures (1-10)"
        />
        <input
          type="number"
          min={1}
          max={10}
          value={motivation}
          onChange={e => setMotivation(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1"
          title="Motivation (1-10)"
        />
        <Button type="submit" className="bg-primary text-white">
          + Ajouter
        </Button>
      </form>
      {/* Graphe simplifié */}
      <ChartContainer
        config={{
          "Fatigue": { label: "Fatigue (haut = fatigabilité)", color: "#fa5" },
          "Motivation": { label: "Motivation (haut = mieux)", color: "#58c776" }
        }}
        className="bg-muted p-2 mb-4"
      >
        <div className="w-full h-32 flex flex-col items-center justify-center text-sm text-muted-foreground">
          (Derniers jours&nbsp;
            {fatigueValues.map((d, i) =>
              d > 0
                ? <span key={i} className="mr-1">{d >= 7 ? "🥱" : "🙂"}</span>
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
              <TableHead>Fatigue</TableHead>
              <TableHead>Courbatures</TableHead>
              <TableHead>Motivation</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fatigueHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucune donnée enregistrée.
                </TableCell>
              </TableRow>
            ) : (
              fatigueHistory.map((item, idx) => (
                <TableRow key={item.date + idx}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.fatigue}/10</TableCell>
                  <TableCell>{item.soreness}/10</TableCell>
                  <TableCell>{item.motivation}/10</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.notes || "–"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Astuce : Un suivi régulier de la fatigue permet d’adapter l’entraînement et d’éviter le surmenage chronique.
      </p>
    </div>
  );
}
