import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EnergyEntry {
  date: string;
  morning: number;
  afternoon: number;
  evening: number;
  preWorkout: number;
  postWorkout: number;
  notes: string;
}

const energyLevels = [
  { value: 1, label: "1 - Très fatigué" },
  { value: 2, label: "2 - Fatigué" },
  { value: 3, label: "3 - Légèrement fatigué" },
  { value: 4, label: "4 - Neutre" },
  { value: 5, label: "5 - Légèrement énergique" },
  { value: 6, label: "6 - Énergique" },
  { value: 7, label: "7 - Très énergique" },
  { value: 8, label: "8 - Plein d'énergie" },
  { value: 9, label: "9 - Extrêmement énergique" },
  { value: 10, label: "10 - Débordant d'énergie" }
];

export default function EnergyTracker() {
  const { toast } = useToast();
  const [energyData, setEnergyData] = useState<EnergyEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<EnergyEntry>({
    date: new Date().toISOString().split('T')[0],
    morning: 5,
    afternoon: 5,
    evening: 5,
    preWorkout: 5,
    postWorkout: 5,
    notes: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('energyTracker');
    if (stored) {
      try {
        setEnergyData(JSON.parse(stored));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  const saveToStorage = (data: EnergyEntry[]) => {
    localStorage.setItem('energyTracker', JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingIndex = energyData.findIndex(entry => entry.date === currentEntry.date);
    let newData: EnergyEntry[];
    
    if (existingIndex >= 0) {
      newData = [...energyData];
      newData[existingIndex] = currentEntry;
      toast({
        title: "Données mises à jour",
        description: "Votre suivi d'énergie a été mis à jour pour cette date.",
      });
    } else {
      newData = [...energyData, currentEntry].sort((a, b) => a.date.localeCompare(b.date));
      toast({
        title: "Données enregistrées",
        description: "Votre suivi d'énergie a été enregistré.",
      });
    }
    
    setEnergyData(newData);
    saveToStorage(newData);
  };

  const getAverageEnergy = () => {
    if (energyData.length === 0) return 0;
    const total = energyData.reduce((sum, entry) => 
      sum + (entry.morning + entry.afternoon + entry.evening + entry.preWorkout + entry.postWorkout) / 5, 0
    );
    return (total / energyData.length).toFixed(1);
  };

  const getChartData = () => {
    return energyData.slice(-14).map(entry => ({
      date: new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      Matin: entry.morning,
      'Après-midi': entry.afternoon,
      Soir: entry.evening,
      'Pré-training': entry.preWorkout,
      'Post-training': entry.postWorkout,
      Moyenne: Number(((entry.morning + entry.afternoon + entry.evening + entry.preWorkout + entry.postWorkout) / 5).toFixed(1))
    }));
  };

  const getBestTimeToTrain = () => {
    if (energyData.length === 0) return "Données insuffisantes";
    
    const avgPreWorkout = energyData.reduce((sum, entry) => sum + entry.preWorkout, 0) / energyData.length;
    const avgMorning = energyData.reduce((sum, entry) => sum + entry.morning, 0) / energyData.length;
    const avgAfternoon = energyData.reduce((sum, entry) => sum + entry.afternoon, 0) / energyData.length;
    const avgEvening = energyData.reduce((sum, entry) => sum + entry.evening, 0) / energyData.length;
    
    const timeSlots = [
      { name: "Matin", avg: avgMorning },
      { name: "Après-midi", avg: avgAfternoon },
      { name: "Soir", avg: avgEvening }
    ];
    
    const bestTime = timeSlots.reduce((best, current) => 
      current.avg > best.avg ? current : best
    );
    
    return `${bestTime.name} (${bestTime.avg.toFixed(1)}/10)`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-bolt text-primary" />
            Tracker d'Énergie
          </CardTitle>
          <CardDescription>
            Suivez vos niveaux d'énergie à différents moments de la journée pour optimiser votre planning d'entraînement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
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
                  <Label>Énergie du matin</Label>
                  <Select
                    value={currentEntry.morning.toString()}
                    onValueChange={(value) => setCurrentEntry({...currentEntry, morning: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {energyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Énergie après-midi</Label>
                  <Select
                    value={currentEntry.afternoon.toString()}
                    onValueChange={(value) => setCurrentEntry({...currentEntry, afternoon: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {energyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Énergie du soir</Label>
                  <Select
                    value={currentEntry.evening.toString()}
                    onValueChange={(value) => setCurrentEntry({...currentEntry, evening: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {energyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Énergie pré-entraînement</Label>
                  <Select
                    value={currentEntry.preWorkout.toString()}
                    onValueChange={(value) => setCurrentEntry({...currentEntry, preWorkout: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {energyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Énergie post-entraînement</Label>
                  <Select
                    value={currentEntry.postWorkout.toString()}
                    onValueChange={(value) => setCurrentEntry({...currentEntry, postWorkout: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {energyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Input
                  id="notes"
                  placeholder="Facteurs influençant votre énergie aujourd'hui..."
                  value={currentEntry.notes}
                  onChange={(e) => setCurrentEntry({...currentEntry, notes: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              <i className="fas fa-save mr-2" />
              Enregistrer les données du jour
            </Button>
          </form>
        </CardContent>
      </Card>

      {energyData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{getAverageEnergy()}/10</div>
                <div className="text-sm text-muted-foreground">Énergie moyenne</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-lg font-semibold mb-2">{getBestTimeToTrain()}</div>
                <div className="text-sm text-muted-foreground">Meilleur moment pour s'entraîner</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{energyData.length}</div>
                <div className="text-sm text-muted-foreground">Jours suivis</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Évolution de l'énergie (14 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Matin" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="Après-midi" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="Soir" stroke="#ffc658" strokeWidth={2} />
                    <Line type="monotone" dataKey="Pré-training" stroke="#ff7300" strokeWidth={2} />
                    <Line type="monotone" dataKey="Post-training" stroke="#8dd1e1" strokeWidth={2} />
                    <Line type="monotone" dataKey="Moyenne" stroke="#ff0000" strokeWidth={3} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}