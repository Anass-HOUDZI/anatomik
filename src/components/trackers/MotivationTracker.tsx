import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MotivationEntry {
  date: string;
  motivation: number;
  mood: number;
  stress: number;
  confidence: number;
  adherence: number;
  triggers: string[];
  notes: string;
}

const levels = [
  { value: 1, label: "1 - Très faible" },
  { value: 2, label: "2 - Faible" },
  { value: 3, label: "3 - Plutôt faible" },
  { value: 4, label: "4 - Neutre" },
  { value: 5, label: "5 - Moyen" },
  { value: 6, label: "6 - Plutôt bon" },
  { value: 7, label: "7 - Bon" },
  { value: 8, label: "8 - Très bon" },
  { value: 9, label: "9 - Excellent" },
  { value: 10, label: "10 - Parfait" }
];

const motivationTriggers = [
  "Résultats visibles",
  "Séance réussie",
  "Compliments",
  "Vêtements mieux ajustés",
  "Énergie élevée",
  "Nouveau record",
  "Ami d'entraînement",
  "Musique motivante",
  "Objectif proche",
  "Stress évacué"
];

const demotivationTriggers = [
  "Manque de temps",
  "Fatigue",
  "Stress travail",
  "Pas de résultats",
  "Blessure/douleur",
  "Météo",
  "Problèmes personnels",
  "Routine ennuyeuse",
  "Manque de sommeil",
  "Alimentation déséquilibrée"
];

export default function MotivationTracker() {
  const { toast } = useToast();
  const [motivationData, setMotivationData] = useState<MotivationEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<MotivationEntry>({
    date: new Date().toISOString().split('T')[0],
    motivation: 5,
    mood: 5,
    stress: 5,
    confidence: 5,
    adherence: 5,
    triggers: [],
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('motivationTracker');
    if (stored) {
      try {
        setMotivationData(JSON.parse(stored));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  const saveToStorage = (data: MotivationEntry[]) => {
    localStorage.setItem('motivationTracker', JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingIndex = motivationData.findIndex(entry => entry.date === currentEntry.date);
    let newData: MotivationEntry[];
    
    if (existingIndex >= 0) {
      newData = [...motivationData];
      newData[existingIndex] = currentEntry;
      toast({
        title: "Données mises à jour",
        description: "Votre suivi de motivation a été mis à jour pour cette date.",
      });
    } else {
      newData = [...motivationData, currentEntry].sort((a, b) => a.date.localeCompare(b.date));
      toast({
        title: "Données enregistrées",
        description: "Votre suivi de motivation a été enregistré.",
      });
    }
    
    setMotivationData(newData);
    saveToStorage(newData);
  };

  const toggleTrigger = (trigger: string) => {
    const newTriggers = currentEntry.triggers.includes(trigger)
      ? currentEntry.triggers.filter(t => t !== trigger)
      : [...currentEntry.triggers, trigger];
    setCurrentEntry({...currentEntry, triggers: newTriggers});
  };

  const getAverageScores = () => {
    if (motivationData.length === 0) return { motivation: 0, mood: 0, stress: 0, confidence: 0, adherence: 0 };
    
    const totals = motivationData.reduce((acc, entry) => ({
      motivation: acc.motivation + entry.motivation,
      mood: acc.mood + entry.mood,
      stress: acc.stress + entry.stress,
      confidence: acc.confidence + entry.confidence,
      adherence: acc.adherence + entry.adherence
    }), { motivation: 0, mood: 0, stress: 0, confidence: 0, adherence: 0 });

    return {
      motivation: (totals.motivation / motivationData.length).toFixed(1),
      mood: (totals.mood / motivationData.length).toFixed(1),
      stress: (totals.stress / motivationData.length).toFixed(1),
      confidence: (totals.confidence / motivationData.length).toFixed(1),
      adherence: (totals.adherence / motivationData.length).toFixed(1)
    };
  };

  const getChartData = () => {
    return motivationData.slice(-14).map(entry => ({
      date: new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      Motivation: entry.motivation,
      Humeur: entry.mood,
      Stress: 11 - entry.stress, // Inversé pour que moins de stress = mieux
      Confiance: entry.confidence,
      Adhérence: entry.adherence
    }));
  };

  const getMostCommonTriggers = () => {
    const triggerCounts: Record<string, number> = {};
    motivationData.forEach(entry => {
      entry.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });
    
    return Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));
  };

  const getMotivationStreak = () => {
    if (motivationData.length === 0) return 0;
    
    const sortedData = [...motivationData].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    
    for (const entry of sortedData) {
      if (entry.motivation >= 6) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const averages = getAverageScores();
  const commonTriggers = getMostCommonTriggers();
  const motivationStreak = getMotivationStreak();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-heart text-primary" />
            Tracker de Motivation
          </CardTitle>
          <CardDescription>
            Suivez votre motivation, humeur et facteurs d'influence pour maintenir votre engagement long terme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={currentEntry.date}
                onChange={(e) => setCurrentEntry({...currentEntry, date: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Niveau de motivation</Label>
                <Select
                  value={currentEntry.motivation.toString()}
                  onValueChange={(value) => setCurrentEntry({...currentEntry, motivation: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Humeur générale</Label>
                <Select
                  value={currentEntry.mood.toString()}
                  onValueChange={(value) => setCurrentEntry({...currentEntry, mood: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Niveau de stress</Label>
                <Select
                  value={currentEntry.stress.toString()}
                  onValueChange={(value) => setCurrentEntry({...currentEntry, stress: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Confiance en soi</Label>
                <Select
                  value={currentEntry.confidence.toString()}
                  onValueChange={(value) => setCurrentEntry({...currentEntry, confidence: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Adhérence programme</Label>
                <Select
                  value={currentEntry.adherence.toString()}
                  onValueChange={(value) => setCurrentEntry({...currentEntry, adherence: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Facteurs de motivation aujourd'hui</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {motivationTriggers.map(trigger => (
                  <Button
                    key={trigger}
                    type="button"
                    variant={currentEntry.triggers.includes(trigger) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTrigger(trigger)}
                    className="text-xs h-8"
                  >
                    {trigger}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Facteurs de démotivation aujourd'hui</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {demotivationTriggers.map(trigger => (
                  <Button
                    key={trigger}
                    type="button"
                    variant={currentEntry.triggers.includes(trigger) ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => toggleTrigger(trigger)}
                    className="text-xs h-8"
                  >
                    {trigger}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Réflexions sur votre motivation aujourd'hui..."
                value={currentEntry.notes}
                onChange={(e) => setCurrentEntry({...currentEntry, notes: e.target.value})}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              <i className="fas fa-save mr-2" />
              Enregistrer les données du jour
            </Button>
          </form>
        </CardContent>
      </Card>

      {motivationData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{averages.motivation}/10</div>
                <div className="text-sm text-muted-foreground">Motivation moyenne</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{motivationStreak}</div>
                <div className="text-sm text-muted-foreground">Jours de bonne motivation</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{averages.adherence}/10</div>
                <div className="text-sm text-muted-foreground">Adhérence moyenne</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{motivationData.length}</div>
                <div className="text-sm text-muted-foreground">Jours suivis</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution psychologique (14 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Motivation" stroke="#8884d8" strokeWidth={3} />
                    <Line type="monotone" dataKey="Humeur" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="Stress" stroke="#ffc658" strokeWidth={2} />
                    <Line type="monotone" dataKey="Confiance" stroke="#ff7300" strokeWidth={2} />
                    <Line type="monotone" dataKey="Adhérence" stroke="#8dd1e1" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {commonTriggers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vos principaux facteurs de motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonTriggers.map(({ trigger, count }, index) => (
                    <div key={trigger} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="font-medium">#{index + 1} {trigger}</span>
                      <span className="text-sm text-muted-foreground">{count} fois</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}