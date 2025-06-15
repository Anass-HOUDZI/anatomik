import React, { useState } from 'react';

const BMRCalculator = () => {
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [bmr, setBMR] = useState(0);
  const [dailyCalories, setDailyCalories] = useState(0);

  const calculateBMR = () => {
    let bmrValue;
    if (gender === 'male') {
      bmrValue = 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age));
    } else {
      bmrValue = 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age));
    }
    setBMR(bmrValue);

    let activityFactor = 1.2;
    switch (activityLevel) {
      case 'sedentary':
        activityFactor = 1.2;
        break;
      case 'lightlyActive':
        activityFactor = 1.375;
        break;
      case 'moderatelyActive':
        activityFactor = 1.55;
        break;
      case 'veryActive':
        activityFactor = 1.725;
        break;
      case 'extraActive':
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    setDailyCalories(bmrValue * activityFactor);
  };

  return (
    <div className="calculator-container">
      {/* Titre principal en noir, sans bandeau */}
      <h2 className="text-2xl font-bold mb-2 text-[#111] drop-shadow-none" style={{textShadow: "none"}}>Calculateur de Besoins Caloriques</h2>
      <p className="text-base mb-4 text-[#222] font-medium" style={{color:'#222', background:'none'}}>Calculez facilement votre métabolisme de base (BMR) et vos besoins caloriques journaliers selon votre profil.</p>
      {/* Formulaire et résultats */}
      <div className="input-group-custom">
        <label htmlFor="gender">Sexe:</label>
        <select id="gender" className="form-control-custom" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Homme</option>
          <option value="female">Femme</option>
        </select>
      </div>

      <div className="input-group-custom">
        <label htmlFor="weight">Poids (kg):</label>
        <input type="number" id="weight" className="form-control-custom" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>

      <div className="input-group-custom">
        <label htmlFor="height">Taille (cm):</label>
        <input type="number" id="height" className="form-control-custom" value={height} onChange={(e) => setHeight(e.target.value)} />
      </div>

      <div className="input-group-custom">
        <label htmlFor="age">Âge:</label>
        <input type="number" id="age" className="form-control-custom" value={age} onChange={(e) => setAge(e.target.value)} />
      </div>

      <div className="input-group-custom">
        <label htmlFor="activityLevel">Niveau d'activité:</label>
        <select id="activityLevel" className="form-control-custom" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
          <option value="sedentary">Sédentaire (peu ou pas d'exercice)</option>
          <option value="lightlyActive">Légèrement actif (exercice léger/sports 1 à 3 jours/semaine)</option>
          <option value="moderatelyActive">Modérément actif (exercice modéré/sports 3 à 5 jours/semaine)</option>
          <option value="veryActive">Très actif (exercice intense/sports 6 à 7 jours/semaine)</option>
          <option value="extraActive">Extrêmement actif (exercice très intense/sports et travail physique)</option>
        </select>
      </div>

      <button className="btn-gradient-primary" onClick={calculateBMR}>Calculer</button>

      {bmr > 0 && (
        <div className="result-card">
          <div className="result-value">{bmr.toFixed(0)} calories</div>
          <div className="result-label">Métabolisme de base (BMR)</div>
        </div>
      )}

      {dailyCalories > 0 && (
        <div className="result-card">
          <div className="result-value">{dailyCalories.toFixed(0)} calories</div>
          <div className="result-label">Calories journalières estimées</div>
        </div>
      )}
    </div>
  );
}
export default BMRCalculator;
