import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const MeasurementsTracker = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [neck, setNeck] = useState('');
  const [shoulders, setShoulders] = useState('');
  const [chest, setChest] = useState('');
  const [biceps, setBiceps] = useState('');
  const [forearm, setForearm] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [thigh, setThigh] = useState('');
  const [calf, setCalf] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the submission logic here, e.g., store the data
    console.log({
      date,
      neck,
      shoulders,
      chest,
      biceps,
      forearm,
      waist,
      hips,
      thigh,
      calf,
    });
    // Reset the form after submission
    setDate(new Date());
    setNeck('');
    setShoulders('');
    setChest('');
    setBiceps('');
    setForearm('');
    setWaist('');
    setHips('');
    setThigh('');
    setCalf('');
  };

  return (
    <div className="calculator-container">
      <h2 className="text-2xl font-bold mb-2 text-[#111] drop-shadow-none" style={{textShadow: "none"}}>Tracker de Mensurations</h2>
      <p className="text-base mb-4 text-[#222] font-medium" style={{color:'#222', background:'none'}}>Mesurez vos circonférences et visualisez votre recomposition corporelle.</p>
      <Card>
        <CardHeader>
          <CardTitle>Entrez vos mensurations</CardTitle>
          <CardDescription>
            Enregistrez vos mesures corporelles pour suivre votre progression.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={format(date as Date, "PPP")}
                  >
                    {date ? format(date as Date, "PPP") : (
                      <span>Choisir une date</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="neck">Tour de cou (cm)</Label>
              <Input
                type="number"
                id="neck"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="shoulders">Largeur épaules (cm)</Label>
              <Input
                type="number"
                id="shoulders"
                value={shoulders}
                onChange={(e) => setShoulders(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="chest">Tour de poitrine (cm)</Label>
              <Input
                type="number"
                id="chest"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="biceps">Tour de biceps (cm)</Label>
              <Input
                type="number"
                id="biceps"
                value={biceps}
                onChange={(e) => setBiceps(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="forearm">Tour d'avant-bras (cm)</Label>
              <Input
                type="number"
                id="forearm"
                value={forearm}
                onChange={(e) => setForearm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="waist">Tour de taille (cm)</Label>
              <Input
                type="number"
                id="waist"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="hips">Tour de hanches (cm)</Label>
              <Input
                type="number"
                id="hips"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="thigh">Tour de cuisse (cm)</Label>
              <Input
                type="number"
                id="thigh"
                value={thigh}
                onChange={(e) => setThigh(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
              <Label htmlFor="calf">Tour de mollet (cm)</Label>
              <Input
                type="number"
                id="calf"
                value={calf}
                onChange={(e) => setCalf(e.target.value)}
              />
            </div>

            <Button type="submit">Enregistrer les mesures</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
export default MeasurementsTracker;
