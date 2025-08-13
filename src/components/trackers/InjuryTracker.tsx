import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Calendar, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InjuryEntry {
  id: string;
  date: string;
  type: string;
  location: string;
  severity: number;
  cause: string;
  activity: string;
  recoveryTime: number; // jours
  preventionMeasures: string[];
  notes: string;
  status: 'active' | 'recovered' | 'chronic';
  painLevel: number;
}

const injuryTypes = [
  'Muscle (déchirure)',
  'Tendon (tendinite)',
  'Ligament (entorse)',
  'Articulation',
  'Dos',
  'Épaule',
  'Genou',
  'Cheville',
  'Poignet',
  'Autre'
];

const injuryLocations = [
  'Épaule droite', 'Épaule gauche',
  'Coude droit', 'Coude gauche',
  'Poignet droit', 'Poignet gauche',
  'Bas du dos', 'Haut du dos',
  'Hanche droite', 'Hanche gauche',
  'Genou droit', 'Genou gauche',
  'Cheville droite', 'Cheville gauche',
  'Mollet droit', 'Mollet gauche',
  'Cuisse droite', 'Cuisse gauche',
  'Autre'
];

const severityLevels = [
  { value: 1, label: "1 - Très légère", color: "bg-green-100 text-green-800" },
  { value: 2, label: "2 - Légère", color: "bg-green-100 text-green-800" },
  { value: 3, label: "3 - Modérée", color: "bg-yellow-100 text-yellow-800" },
  { value: 4, label: "4 - Importante", color: "bg-orange-100 text-orange-800" },
  { value: 5, label: "5 - Sévère", color: "bg-red-100 text-red-800" }
];

const preventionMeasures = [
  'Échauffement prolongé',
  'Étirements spécifiques',
  'Renforcement musculaire',
  'Correction technique',
  'Réduction charges',
  'Matériel adapté',
  'Repos supplémentaire',
  'Massage/mobilité',
  'Consultation médicale'
];

export default function InjuryTracker() {
  const { toast } = useToast();
  const [injuries, setInjuries] = useState<InjuryEntry[]>([]);
  const [currentInjury, setCurrentInjury] = useState<Partial<InjuryEntry>>({
    date: new Date().toISOString().split('T')[0],
    type: '',
    location: '',
    severity: 1,
    cause: '',
    activity: '',
    recoveryTime: 0,
    preventionMeasures: [],
    notes: '',
    status: 'active',
    painLevel: 1
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('injuryTracker');
    if (stored) {
      try {
        setInjuries(JSON.parse(stored));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, []);

  const saveToStorage = (data: InjuryEntry[]) => {
    localStorage.setItem('injuryTracker', JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentInjury.type || !currentInjury.location) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au minimum le type et la localisation.",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      const updatedInjuries = injuries.map(injury => 
        injury.id === editingId ? { ...currentInjury, id: editingId } as InjuryEntry : injury
      );
      setInjuries(updatedInjuries);
      saveToStorage(updatedInjuries);
      setEditingId(null);
      
      toast({
        title: "Blessure mise à jour",
        description: "Les informations ont été mises à jour.",
      });
    } else {
      const newInjury: InjuryEntry = {
        ...currentInjury,
        id: Date.now().toString(),
      } as InjuryEntry;

      const updatedInjuries = [...injuries, newInjury].sort((a, b) => b.date.localeCompare(a.date));
      setInjuries(updatedInjuries);
      saveToStorage(updatedInjuries);
      
      toast({
        title: "Blessure enregistrée",
        description: "La blessure a été ajoutée à votre historique.",
      });
    }

    // Réinitialiser le formulaire
    setCurrentInjury({
      date: new Date().toISOString().split('T')[0],
      type: '',
      location: '',
      severity: 1,
      cause: '',
      activity: '',
      recoveryTime: 0,
      preventionMeasures: [],
      notes: '',
      status: 'active',
      painLevel: 1
    });
  };

  const editInjury = (injury: InjuryEntry) => {
    setCurrentInjury(injury);
    setEditingId(injury.id);
  };

  const deleteInjury = (injuryId: string) => {
    const updatedInjuries = injuries.filter(injury => injury.id !== injuryId);
    setInjuries(updatedInjuries);
    saveToStorage(updatedInjuries);
    
    toast({
      title: "Blessure supprimée",
      description: "La blessure a été supprimée de votre historique.",
    });
  };

  const togglePreventionMeasure = (measure: string) => {
    const current = currentInjury.preventionMeasures || [];
    const updated = current.includes(measure)
      ? current.filter(m => m !== measure)
      : [...current, measure];
    setCurrentInjury({...currentInjury, preventionMeasures: updated});
  };

  const getActiveInjuries = () => injuries.filter(injury => injury.status === 'active');
  const getRecoveredInjuries = () => injuries.filter(injury => injury.status === 'recovered');
  const getChronicInjuries = () => injuries.filter(injury => injury.status === 'chronic');

  const getMostCommonInjuryTypes = () => {
    const typeCounts: Record<string, number> = {};
    injuries.forEach(injury => {
      typeCounts[injury.type] = (typeCounts[injury.type] || 0) + 1;
    });
    
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  };

  const getMostCommonLocations = () => {
    const locationCounts: Record<string, number> = {};
    injuries.forEach(injury => {
      locationCounts[injury.location] = (locationCounts[injury.location] || 0) + 1;
    });
    
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  };

  const getAverageRecoveryTime = () => {
    const recoveredInjuries = getRecoveredInjuries();
    if (recoveredInjuries.length === 0) return 0;
    
    const total = recoveredInjuries.reduce((sum, injury) => sum + injury.recoveryTime, 0);
    return Math.round(total / recoveredInjuries.length);
  };

  const activeInjuries = getActiveInjuries();
  const commonTypes = getMostCommonInjuryTypes();
  const commonLocations = getMostCommonLocations();
  const avgRecoveryTime = getAverageRecoveryTime();

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Tracker de Blessures et Prévention
          </CardTitle>
          <CardDescription>
            Suivez vos blessures, identifiez les patterns et développez des stratégies de prévention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={currentInjury.date || ''}
                  onChange={(e) => setCurrentInjury({...currentInjury, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Type de blessure</Label>
                <Select
                  value={currentInjury.type || ''}
                  onValueChange={(value) => setCurrentInjury({...currentInjury, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {injuryTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Localisation</Label>
                <Select
                  value={currentInjury.location || ''}
                  onValueChange={(value) => setCurrentInjury({...currentInjury, location: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {injuryLocations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Sévérité</Label>
                <Select
                  value={currentInjury.severity?.toString() || '1'}
                  onValueChange={(value) => setCurrentInjury({...currentInjury, severity: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map(level => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Niveau de douleur (1-10)</Label>
                <Select
                  value={currentInjury.painLevel?.toString() || '1'}
                  onValueChange={(value) => setCurrentInjury({...currentInjury, painLevel: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        {level} - {level <= 3 ? 'Légère' : level <= 6 ? 'Modérée' : level <= 8 ? 'Forte' : 'Sévère'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Statut</Label>
                <Select
                  value={currentInjury.status || 'active'}
                  onValueChange={(value) => setCurrentInjury({...currentInjury, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="recovered">Guérie</SelectItem>
                    <SelectItem value="chronic">Chronique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cause">Cause probable</Label>
                <Input
                  id="cause"
                  placeholder="Ex: Mouvement brusque, surcharge..."
                  value={currentInjury.cause || ''}
                  onChange={(e) => setCurrentInjury({...currentInjury, cause: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="activity">Activité en cours</Label>
                <Input
                  id="activity"
                  placeholder="Ex: Squat, course, football..."
                  value={currentInjury.activity || ''}
                  onChange={(e) => setCurrentInjury({...currentInjury, activity: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="recoveryTime">Temps de récupération (jours)</Label>
                <Input
                  id="recoveryTime"
                  type="number"
                  min="0"
                  placeholder="0 si en cours"
                  value={currentInjury.recoveryTime || ''}
                  onChange={(e) => setCurrentInjury({...currentInjury, recoveryTime: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div>
              <Label>Mesures de prévention adoptées</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {preventionMeasures.map(measure => (
                  <Button
                    key={measure}
                    type="button"
                    variant={currentInjury.preventionMeasures?.includes(measure) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePreventionMeasure(measure)}
                    className="text-xs h-8"
                  >
                    {measure}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes détaillées</Label>
              <Textarea
                id="notes"
                placeholder="Circonstances, symptômes, traitement..."
                value={currentInjury.notes || ''}
                onChange={(e) => setCurrentInjury({...currentInjury, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                <i className="fas fa-save mr-2" />
                {editingId ? 'Mettre à jour' : 'Enregistrer'} la blessure
              </Button>
              
              {editingId && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setCurrentInjury({
                      date: new Date().toISOString().split('T')[0],
                      type: '',
                      location: '',
                      severity: 1,
                      cause: '',
                      activity: '',
                      recoveryTime: 0,
                      preventionMeasures: [],
                      notes: '',
                      status: 'active',
                      painLevel: 1
                    });
                  }}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {injuries.length > 0 && (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{activeInjuries.length}</div>
                <div className="text-sm text-muted-foreground">Blessures actives</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{getRecoveredInjuries().length}</div>
                <div className="text-sm text-muted-foreground">Blessures guéries</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{getChronicInjuries().length}</div>
                <div className="text-sm text-muted-foreground">Blessures chroniques</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{avgRecoveryTime}</div>
                <div className="text-sm text-muted-foreground">Jours récup. moyen</div>
              </CardContent>
            </Card>
          </div>

          {/* Blessures actives */}
          {activeInjuries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Blessures actives ({activeInjuries.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeInjuries.map((injury) => (
                    <div key={injury.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{injury.type} - {injury.location}</h3>
                            <Badge className={severityLevels.find(s => s.value === injury.severity)?.color}>
                              Sévérité {injury.severity}
                            </Badge>
                            {injury.painLevel > 5 && (
                              <Badge variant="destructive">
                                Douleur {injury.painLevel}/10
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(injury.date).toLocaleDateString('fr-FR')}
                            {injury.cause && ` • Cause: ${injury.cause}`}
                            {injury.activity && ` • Activité: ${injury.activity}`}
                          </p>
                          {injury.preventionMeasures.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Mesures prises:</p>
                              <div className="flex flex-wrap gap-1">
                                {injury.preventionMeasures.map(measure => (
                                  <Badge key={measure} variant="secondary" className="text-xs">
                                    {measure}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editInjury(injury)}
                          >
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteInjury(injury.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyses et patterns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonTypes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Types de blessures les plus fréquents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {commonTypes.map(({ type, count }, index) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">#{index + 1} {type}</span>
                        <span className="text-sm text-muted-foreground">{count} fois</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {commonLocations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Zones les plus touchées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {commonLocations.map(({ location, count }, index) => (
                      <div key={location} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">#{index + 1} {location}</span>
                        <span className="text-sm text-muted-foreground">{count} fois</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Historique complet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Historique complet ({injuries.length} blessures)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {injuries.map((injury) => (
                  <div key={injury.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{injury.type} - {injury.location}</span>
                          <Badge 
                            variant={injury.status === 'active' ? 'destructive' : 
                                   injury.status === 'recovered' ? 'default' : 'secondary'}
                          >
                            {injury.status === 'active' ? 'Active' : 
                             injury.status === 'recovered' ? 'Guérie' : 'Chronique'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(injury.date).toLocaleDateString('fr-FR')}
                          {injury.recoveryTime > 0 && ` • Récupération: ${injury.recoveryTime} jours`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editInjury(injury)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteInjury(injury.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}