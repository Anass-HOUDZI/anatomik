import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChartContainer } from "../ui/chart";
import { StorageManager } from "../../utils/StorageManager";
import { useToast } from "../ui/use-toast";

/**
 * Calcul cible hydratation : valeur par défaut vers 35 ml/kg, ajustable plus tard.
 */
function getHydrationTarget(weight: number) {
  return Math.round(weight * 35); // en ml
}

export default function HydrationTracker() {
  const { toast } = useToast();
  const todayStr = new Date().toISOString().slice(0, 10);

  // Récupérer profil/données existantes
  const trackingData = StorageManager.getTrackingData();
  const userProfile = StorageManager.getUserProfile();
  const [date, setDate] = useState(todayStr);
  const [input, setInput] = useState<number | "">("");
  const [unit, setUnit] = useState<"ml" | "verre">("ml");
  const [reload, setReload] = useState(false);

  // Liste des entrées stockées
  const hydrationArray: Array<{ date: string; value: number; unit: string }> = useMemo(() => {
    // Migration des anciennes valeurs au besoin
    if (trackingData.hydration && Array.isArray(trackingData.hydration)) {
      return trackingData.hydration.map(e => ({
        date: e.date?.slice(0,10) || "",
        value: Number(e.value ?? 0),
        unit: e.unit ?? "ml"
      }));
    }
    return [];
  }, [reload, trackingData.hydration]);

  // Calcul cible hydratation utilisateur
  const weight = userProfile?.demographics?.weight || 70;
  const hydrationTarget = getHydrationTarget(weight);

  // Ajout d'une entrée hydratation
  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    if (!input || Number(input) <= 0) {
      toast({ title: "Valeur incorrecte", description: "Merci de saisir une quantité supérieure à zéro." });
      return;
    }
    // Conversion en ml si input = verres (1 verre = 250ml)
    let valueMl = unit === "ml" ? Number(input) : Number(input) * 250;

    // Vérifie si entrée déjà présente pour la date
    let updatedArray = hydrationArray.filter(e => e.date !== date);
    updatedArray.push({ date, value: valueMl, unit: "ml" });
    updatedArray = updatedArray.sort((a, b) => b.date.localeCompare(a.date));

    // Sauvegarde
    StorageManager.saveTrackingData({
      ...trackingData,
      hydration: updatedArray,
    });

    setInput("");
    setReload(v => !v);
    toast({
      title: "Hydratation enregistrée",
      description: `Consommation de ${valueMl} ml sauvegardée pour le ${date}.`
    });
  }

  // Préparation données graphiques - 14 derniers jours
  const labels = [];
  const values = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().slice(0,10);
    const entry = hydrationArray.find(e => e.date === dStr);
    labels.push(dStr.slice(5, 10));
    values.push(entry ? entry.value : 0);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-muted rounded-xl p-6 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-glass-water text-primary" /> Tracker d’Hydratation
      </h2>
      <p className="text-muted-foreground mb-4">
        Suivez au quotidien votre consommation d'eau et comparez-la à votre besoin recommandé (<span className="font-semibold">{hydrationTarget} ml</span> / jour).
      </p>
      {/* Formulaire input */}
      <form className="flex flex-col md:flex-row gap-4 mb-6" onSubmit={handleAddEntry}>
        <Input
          type="number"
          min={1}
          step={1}
          placeholder={unit === "ml" ? "Quantité (ml)" : "Nombre de verres"}
          value={input}
          onChange={e => setInput(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <select
          className="border rounded px-3 py-2"
          value={unit}
          onChange={e => setUnit(e.target.value as "ml" | "verre")}
        >
          <option value="ml">ml</option>
          <option value="verre">verres (250ml/unité)</option>
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

      {/* Graphe simplifié */}
      <ChartContainer
        config={{
          "Hydratation": { label: "Cons.H2O (ml)", color: "#3BB2F6" }
        }}
        className="bg-muted p-2 mb-4"
      >
        <div className="w-full h-32 flex flex-col items-center justify-center text-sm text-muted-foreground">
          (Prévisualisation : {values.map(v => v > 0 ? "💧" : "·").join(" ")} )
          <br />
          <span className="opacity-40">Graphique détaillé bientôt !</span>
        </div>
      </ChartContainer>

      {/* Tableau des entrées */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Consommation (ml)</TableHead>
              <TableHead>% objectif</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hydrationArray.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Aucune donnée enregistrée.
                </TableCell>
              </TableRow>
            ) : (
              hydrationArray.map((item, idx) => (
                <TableRow key={item.date + idx}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    {item.value ? `${item.value} ml` : "–"}
                  </TableCell>
                  <TableCell>
                    {hydrationTarget ? Math.round((item.value / hydrationTarget) * 100) : 0} %
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
