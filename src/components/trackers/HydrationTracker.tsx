import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const HydrationTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000); // Default to 2000ml
  const [currentIntake, setCurrentIntake] = useState(0);
  const [newIntake, setNewIntake] = useState('');
  const [hydrationPercentage, setHydrationPercentage] = useState(0);

  useEffect(() => {
    // Update hydration percentage whenever currentIntake or dailyGoal changes
    setHydrationPercentage(Math.min(100, (currentIntake / dailyGoal) * 100));
  }, [currentIntake, dailyGoal]);

  const handleAddIntake = () => {
    const intake = parseInt(newIntake, 10);
    if (!isNaN(intake) && intake > 0) {
      setCurrentIntake(currentIntake + intake);
      setNewIntake(''); // Reset input field
    } else {
      alert("Please enter a valid positive number for intake.");
    }
  };

  const handleReset = () => {
    setCurrentIntake(0);
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const goal = parseInt(e.target.value, 10);
    if (!isNaN(goal) && goal > 0) {
      setDailyGoal(goal);
    } else {
      alert("Please enter a valid positive number for daily goal.");
    }
  };

  return (
    <div className="calculator-container">
      <h2 className="text-2xl font-bold mb-2 text-[#111] drop-shadow-none" style={{textShadow: "none"}}>Tracker d’Hydratation</h2>
      <p className="text-base mb-4 text-[#222] font-medium" style={{color:'#222', background:'none'}}>Consignez facilement votre apport hydrique journalier.</p>
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Hydration Tracker</CardTitle>
          <CardDescription>Track your daily water intake.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="daily-goal">Daily Goal (ml)</Label>
            <Input
              type="number"
              id="daily-goal"
              value={dailyGoal}
              onChange={handleGoalChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-intake">Add Intake (ml)</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                id="new-intake"
                placeholder="Enter amount"
                value={newIntake}
                onChange={(e) => setNewIntake(e.target.value)}
              />
              <Button onClick={handleAddIntake}>Add</Button>
            </div>
          </div>
          <div>
            <p>Current Intake: {currentIntake} ml</p>
            <p>Hydration: {hydrationPercentage.toFixed(1)}%</p>
          </div>
          <Button variant="secondary" onClick={handleReset}>Reset</Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default HydrationTracker;
