import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our performance data
interface PerformanceData {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
  estimatedOneRepMax: number;
}

const PerformanceTracker = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [newExercise, setNewExercise] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newReps, setNewReps] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [exercises, setExercises] = useState<string[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('performanceData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPerformanceData(parsedData);
      
      // Extract unique exercises
      const uniqueExercises = Array.from(new Set(parsedData.map((item: PerformanceData) => item.exercise)));
      setExercises(uniqueExercises as string[]);
      
      // Set the first exercise as selected by default if available
      if (uniqueExercises.length > 0 && !selectedExercise) {
        setSelectedExercise(uniqueExercises[0] as string);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('performanceData', JSON.stringify(performanceData));
    
    // Update exercises list
    const uniqueExercises = Array.from(new Set(performanceData.map(item => item.exercise)));
    setExercises(uniqueExercises as string[]);
  }, [performanceData]);

  // Calculate estimated 1RM using Brzycki formula
  const calculateOneRepMax = (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    return weight * (36 / (37 - reps));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExercise || !newWeight || !newReps) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    const weight = parseFloat(newWeight);
    const reps = parseInt(newReps);
    
    if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
      alert('Veuillez entrer des valeurs numériques valides');
      return;
    }
    
    const newEntry: PerformanceData = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      exercise: newExercise,
      weight,
      reps,
      estimatedOneRepMax: calculateOneRepMax(weight, reps)
    };
    
    setPerformanceData([...performanceData, newEntry]);
    setNewWeight('');
    setNewReps('');
    
    // If this is a new exercise, select it
    if (!exercises.includes(newExercise)) {
      setSelectedExercise(newExercise);
    }
  };

  // Delete an entry
  const deleteEntry = (id: string) => {
    setPerformanceData(performanceData.filter(entry => entry.id !== id));
  };

  // Filter data for the selected exercise
  const filteredData = performanceData.filter(entry => entry.exercise === selectedExercise);
  
  // Sort by date
  const sortedData = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare chart data
  const chartData = {
    labels: sortedData.map(entry => entry.date),
    datasets: [
      {
        label: '1RM Estimé (kg)',
        data: sortedData.map(entry => entry.estimatedOneRepMax),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Progression de force - ${selectedExercise}`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Poids (kg)'
        }
      }
    }
  };

  return (
    <div className="calculator-container">
      <h2 className="text-2xl font-bold mb-2 text-[#111] drop-shadow-none" style={{textShadow: "none"}}>Tracker de Performance</h2>
      <p className="text-base mb-4 text-[#222] font-medium" style={{color:'#222', background:'none'}}>Suivez votre évolution de performance sur vos mouvements principaux.</p>
      
      {/* Form to add new performance data */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="input-group-custom">
            <label htmlFor="exercise" className="block text-sm font-medium text-gray-700">Exercice</label>
            <input
              type="text"
              id="exercise"
              list="exercise-list"
              className="form-control-custom w-full"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              placeholder="ex: Squat, Développé couché..."
            />
            <datalist id="exercise-list">
              {exercises.map(exercise => (
                <option key={exercise} value={exercise} />
              ))}
            </datalist>
          </div>
          
          <div className="input-group-custom">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Poids (kg)</label>
            <input
              type="number"
              id="weight"
              className="form-control-custom w-full"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="ex: 100"
              min="0"
              step="0.5"
            />
          </div>
          
          <div className="input-group-custom">
            <label htmlFor="reps" className="block text-sm font-medium text-gray-700">Répétitions</label>
            <input
              type="number"
              id="reps"
              className="form-control-custom w-full"
              value={newReps}
              onChange={(e) => setNewReps(e.target.value)}
              placeholder="ex: 5"
              min="1"
              max="36"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-primary text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            >
              Ajouter
            </button>
          </div>
        </div>
      </form>
      
      {/* Exercise selector */}
      {exercises.length > 0 && (
        <div className="mb-6">
          <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un exercice à visualiser:
          </label>
          <select
            id="exercise-select"
            className="form-control-custom w-full md:w-1/2"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            {exercises.map(exercise => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Chart */}
      {sortedData.length > 0 ? (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg mb-6">
          <p className="text-gray-500">
            {exercises.length > 0 
              ? "Aucune donnée disponible pour cet exercice. Ajoutez votre première performance!"
              : "Aucune donnée de performance enregistrée. Commencez par ajouter votre première performance!"}
          </p>
        </div>
      )}
      
      {/* Data table */}
      {sortedData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Poids (kg)</th>
                <th className="py-2 px-4 text-left">Répétitions</th>
                <th className="py-2 px-4 text-left">1RM Estimé</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-200">
                  <td className="py-2 px-4">{entry.date}</td>
                  <td className="py-2 px-4">{entry.weight} kg</td>
                  <td className="py-2 px-4">{entry.reps}</td>
                  <td className="py-2 px-4">{entry.estimatedOneRepMax.toFixed(1)} kg</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PerformanceTracker;
