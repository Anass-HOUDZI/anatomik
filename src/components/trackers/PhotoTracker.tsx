import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Camera, Calendar, GitCompare } from 'lucide-react';

interface PhotoEntry {
  id: string;
  date: string;
  angle: string;
  notes: string;
  weight?: number;
  bodyFat?: number;
  imageData?: string; // Base64 encoded image
}

const photoAngles = [
  { value: 'front', label: 'Face' },
  { value: 'side', label: 'Profil' },
  { value: 'back', label: 'Dos' },
  { value: 'front-flex', label: 'Face - Contracté' },
  { value: 'side-flex', label: 'Profil - Contracté' },
  { value: 'back-flex', label: 'Dos - Contracté' },
  { value: 'legs-front', label: 'Jambes face' },
  { value: 'legs-side', label: 'Jambes profil' }
];

export default function PhotoTracker() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<PhotoEntry[]>([]);
  const [newPhoto, setNewPhoto] = useState({
    date: new Date().toISOString().split('T')[0],
    angle: 'front',
    notes: '',
    weight: '',
    bodyFat: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('photoTracker');
    if (stored) {
      try {
        setPhotos(JSON.parse(stored));
      } catch (error) {
        console.error('Erreur lors du chargement des photos:', error);
      }
    }
  }, []);

  const saveToStorage = (data: PhotoEntry[]) => {
    localStorage.setItem('photoTracker', JSON.stringify(data));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "Veuillez choisir une image de moins de 5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      
      const photo: PhotoEntry = {
        id: Date.now().toString(),
        date: newPhoto.date,
        angle: newPhoto.angle,
        notes: newPhoto.notes,
        weight: newPhoto.weight ? parseFloat(newPhoto.weight) : undefined,
        bodyFat: newPhoto.bodyFat ? parseFloat(newPhoto.bodyFat) : undefined,
        imageData
      };

      const updatedPhotos = [...photos, photo].sort((a, b) => b.date.localeCompare(a.date));
      setPhotos(updatedPhotos);
      saveToStorage(updatedPhotos);

      // Réinitialiser le formulaire
      setNewPhoto({
        date: new Date().toISOString().split('T')[0],
        angle: 'front',
        notes: '',
        weight: '',
        bodyFat: ''
      });

      // Réinitialiser l'input file
      if (e.target) {
        e.target.value = '';
      }

      toast({
        title: "Photo ajoutée",
        description: "Votre photo de progression a été enregistrée.",
      });
    };

    reader.readAsDataURL(file);
  };

  const deletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    saveToStorage(updatedPhotos);
    
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null);
    }
    
    toast({
      title: "Photo supprimée",
      description: "La photo a été supprimée avec succès.",
    });
  };

  const toggleComparePhoto = (photo: PhotoEntry) => {
    if (comparePhotos.find(p => p.id === photo.id)) {
      setComparePhotos(comparePhotos.filter(p => p.id !== photo.id));
    } else if (comparePhotos.length < 2) {
      setComparePhotos([...comparePhotos, photo]);
    } else {
      toast({
        title: "Limite atteinte",
        description: "Vous ne pouvez comparer que 2 photos à la fois.",
        variant: "destructive"
      });
    }
  };

  const getPhotosByAngle = (angle: string) => {
    return photos.filter(photo => photo.angle === angle);
  };

  const getLatestPhotos = () => {
    const angleGroups: Record<string, PhotoEntry> = {};
    photos.forEach(photo => {
      if (!angleGroups[photo.angle] || photo.date > angleGroups[photo.angle].date) {
        angleGroups[photo.angle] = photo;
      }
    });
    return Object.values(angleGroups);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            Tracker de Photos de Progression
          </CardTitle>
          <CardDescription>
            Documentez votre évolution physique avec des photos standardisées. Toutes les photos sont stockées localement et privées.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newPhoto.date}
                  onChange={(e) => setNewPhoto({...newPhoto, date: e.target.value})}
                />
              </div>

              <div>
                <Label>Angle de prise de vue</Label>
                <Select
                  value={newPhoto.angle}
                  onValueChange={(value) => setNewPhoto({...newPhoto, angle: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {photoAngles.map(angle => (
                      <SelectItem key={angle.value} value={angle.value}>
                        {angle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="weight">Poids (kg) - optionnel</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 75.5"
                  value={newPhoto.weight}
                  onChange={(e) => setNewPhoto({...newPhoto, weight: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="bodyFat">% Graisse corporelle - optionnel</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 15.2"
                  value={newPhoto.bodyFat}
                  onChange={(e) => setNewPhoto({...newPhoto, bodyFat: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Conditions de prise, objectifs, ressentis..."
                value={newPhoto.notes}
                onChange={(e) => setNewPhoto({...newPhoto, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="photo">Sélectionner une photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Formats acceptés: JPG, PNG, WebP. Taille maximum: 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 items-center">
        <Button 
          variant={compareMode ? "default" : "outline"}
          onClick={() => {
            setCompareMode(!compareMode);
            setComparePhotos([]);
          }}
        >
          <GitCompare className="w-4 h-4 mr-2" />
          Mode Comparaison
        </Button>
        
        {compareMode && (
          <div className="text-sm text-muted-foreground">
            Sélectionnez 2 photos à comparer ({comparePhotos.length}/2)
          </div>
        )}
      </div>

      {compareMode && comparePhotos.length === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparaison de photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparePhotos.map((photo, index) => (
                <div key={photo.id} className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      Photo {index + 1} - {new Date(photo.date).toLocaleDateString('fr-FR')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {photoAngles.find(a => a.value === photo.angle)?.label}
                    </p>
                  </div>
                  {photo.imageData && (
                    <img
                      src={photo.imageData}
                      alt={`Photo ${photo.angle} du ${photo.date}`}
                      className="w-full h-80 object-cover rounded-lg border"
                    />
                  )}
                  <div className="text-sm space-y-1">
                    {photo.weight && <p>Poids: {photo.weight} kg</p>}
                    {photo.bodyFat && <p>% Graisse: {photo.bodyFat}%</p>}
                    {photo.notes && <p>Notes: {photo.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Galerie de progression ({photos.length} photos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="relative overflow-hidden rounded-lg border">
                    {photo.imageData && (
                      <img
                        src={photo.imageData}
                        alt={`Photo ${photo.angle} du ${photo.date}`}
                        className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center space-y-2">
                        <p className="text-sm font-medium">
                          {new Date(photo.date).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs">
                          {photoAngles.find(a => a.value === photo.angle)?.label}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2">
                      {compareMode && (
                        <Button
                          size="sm"
                          variant={comparePhotos.find(p => p.id === photo.id) ? "default" : "secondary"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComparePhoto(photo);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <GitCompare className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto(photo.id);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <p className="font-medium truncate">
                      {photoAngles.find(a => a.value === photo.angle)?.label}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(photo.date).toLocaleDateString('fr-FR')}
                    </p>
                    {photo.weight && (
                      <p className="text-muted-foreground text-xs">
                        {photo.weight} kg
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal pour afficher la photo sélectionnée */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl max-h-full overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {photoAngles.find(a => a.value === selectedPhoto.angle)?.label}
                  </h3>
                  <p className="text-muted-foreground">
                    {new Date(selectedPhoto.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPhoto(null)}
                >
                  Fermer
                </Button>
              </div>
              
              {selectedPhoto.imageData && (
                <img
                  src={selectedPhoto.imageData}
                  alt={`Photo ${selectedPhoto.angle} du ${selectedPhoto.date}`}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              )}
              
              {(selectedPhoto.weight || selectedPhoto.bodyFat || selectedPhoto.notes) && (
                <div className="mt-4 space-y-2 text-sm">
                  {selectedPhoto.weight && (
                    <p><strong>Poids:</strong> {selectedPhoto.weight} kg</p>
                  )}
                  {selectedPhoto.bodyFat && (
                    <p><strong>% Graisse corporelle:</strong> {selectedPhoto.bodyFat}%</p>
                  )}
                  {selectedPhoto.notes && (
                    <p><strong>Notes:</strong> {selectedPhoto.notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}