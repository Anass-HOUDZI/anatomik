
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

// Groupes musculaires et exemples d'exercices
const muscleGroups = [
  { value: "pectoraux", label: "Pectoraux" },
  { value: "dos", label: "Dos" },
  { value: "jambes", label: "Jambes" },
  { value: "épaules", label: "Épaules" },
  { value: "bras", label: "Bras" },
  { value: "abdos", label: "Abdominaux" },
  { value: "fessiers", label: "Fessiers" },
];

const levels = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
];

const equipmentOptions = [
  { value: "none", label: "Aucun" },
  { value: "basic", label: "Basique (haltères/bandes)" },
  { value: "full", label: "Complet (salle)" },
];

// Banque d'exercices par muscle/niveau/matériel
const exercisesDB: Record<string, Record<string, Record<string, string[]>>> = {
  pectoraux: {
    beginner: {
      none: [
        "Pompes classiques",
        "Pompes murales",
        "Pompes inclinées sur banc"
      ],
      basic: [
        "Développé couché haltères",
        "Écarté haltères",
        "Pompes sur poignées"
      ],
      full: [
        "Développé couché barre",
        "Développé incliné barre ou haltères",
        "Dips entre deux barres"
      ]
    },
    intermediate: {
      none: [
        "Pompes avec tempo lent",
        "Pompes diamant",
        "Pompes déclinées"
      ],
      basic: [
        "Développé haltères unilatéral",
        "Pompes lestées avec sac à dos"
      ],
      full: [
        "Développé décliné barre",
        "Machine chest-press"
      ]
    },
    advanced: {
      none: [
        "Pompes surélevées pieds et mains",
        "Pompes explosifs groupés"
      ],
      basic: [
        "Pompes pliométriques avec haltère",
      ],
      full: [
        "Développé haltères sur ballon instable",
        "Dips lestés à la ceinture"
      ]
    }
  },
  dos: {
    beginner: {
      none: [
        "Superman au sol",
        "Rowing bouteille d'eau",
        "Pont fessier"
      ],
      basic: [
        "Rowing haltère un bras",
        "Tirage élastique assis"
      ],
      full: [
        "Tractions assistées à la poulie",
        "Rowing barre",
        "Tirage poulie haute"
      ]
    },
    intermediate: {
      none: [
        "Tractions australiennes",
        "Superman latéral"
      ],
      basic: [
        "Rowing haltère coude large",
        "Tirage vertical élastique"
      ],
      full: [
        "Tractions pronation",
        "Rowing T-bar"
      ]
    },
    advanced: {
      none: [
        "Tractions explosives",
        "Pull ups prise large"
      ],
      basic: [
        "Tractions lestées avec sac à dos"
      ],
      full: [
        "Rowing barre lourd",
        "Muscle-up à la barre"
      ]
    }
  },
  jambes: {
    beginner: {
      none: [
        "Squats au poids du corps",
        "Fentes sur place",
        "Montées de chaise"
      ],
      basic: [
        "Squat goblet avec haltère",
        "Soulevé terre jambes tendues haltères"
      ],
      full: [
        "Presse à cuisses",
        "Squat barre",
        "Leg curl allongé"
      ]
    },
    intermediate: {
      none: [
        "Squats sautés",
        "Bulgarian split squat"
      ],
      basic: [
        "Fentes marchées haltères",
        "Soulevé roumain unilatéral"
      ],
      full: [
        "Fentes avant barre",
        "Hack squat"
      ]
    },
    advanced: {
      none: [
        "Pistol squat assisté",
        "Squat sauté unijambiste"
      ],
      basic: [
        "Soulevé terre une jambe haltère"
      ],
      full: [
        "Back squat lourd",
        "Presse à cuisse unilatérale"
      ]
    }
  },
  épaules: {
    beginner: {
      none: [
        "Élévations frontales au poids du corps",
        "Cercles des bras"
      ],
      basic: [
        "Développé épaules haltères",
        "Élévations latérales haltères"
      ],
      full: [
        "Développé militaire barre",
        "Oiseau avec haltères sur banc incliné"
      ]
    },
    intermediate: {
      none: [
        "Pompes pike",
        "Pompes poirier support"
      ],
      basic: [
        "Développé Arnold haltères",
        "Oiseau sur banc plat"
      ],
      full: [
        "Développé militaire haltères assis",
        "Dips pour épaules"
      ]
    },
    advanced: {
      none: [
        "Pompes en poirier libres",
        "Handstand push up"
      ],
      basic: [
        "Développé épaules prise serrée haltères"
      ],
      full: [
        "Épaulé jeté barre",
        "Développé militaire lourd"
      ]
    }
  },
  bras: {
    beginner: {
      none: [
        "Dips banc",
        "Curl biceps bouteille",
        "Extensions triceps au sol"
      ],
      basic: [
        "Curl haltère",
        "Extensions triceps haltère"
      ],
      full: [
        "Curl barre",
        "Barre au front",
        "Tirage corde triceps"
      ]
    },
    intermediate: {
      none: [
        "Pompes serrées",
        "Dips entre deux chaises"
      ],
      basic: [
        "Curl marteau",
        "Kickback triceps haltère"
      ],
      full: [
        "Curl incliné haltère",
        "Extensions triceps poulie"
      ]
    },
    advanced: {
      none: [
        "Pompes tiger-bend",
        "Dips lestés"
      ],
      basic: [
        "Curl concentration"
      ],
      full: [
        "Curl lourd barre",
        "Extensions triceps lourdes poulie"
      ]
    }
  },
  abdos: {
    beginner: {
      none: [
        "Crunch au sol",
        "Planche ventrale genoux"
      ],
      basic: [
        "Enroulement jambe chaise",
        "Planche latérale sur genoux"
      ],
      full: [
        "Crunch machine",
        "Relevé de jambes suspendu"
      ]
    },
    intermediate: {
      none: [
        "Planche dynamique",
        "Crunch bicyclette"
      ],
      basic: [
        "Ab wheel rouleau",
        "Relevés jambes banc plat"
      ],
      full: [
        "Relevés jambes barre",
        "Planche lestée"
      ]
    },
    advanced: {
      none: [
        "Dragon flag débutant",
        "Planche sur un bras"
      ],
      basic: [
        "Relevé jambes lesté"
      ],
      full: [
        "Dragon flag complet",
        "Windshield wipers barre"
      ]
    }
  },
  fessiers: {
    beginner: {
      none: [
        "Pont fessier au sol",
        "Élévature de jambe quadrupédie"
      ],
      basic: [
        "Hip thrust haltère",
        "Abduction élastique"
      ],
      full: [
        "Hip thrust barre",
        "Presse à abduction"
      ]
    },
    intermediate: {
      none: [
        "Pont fessier une jambe",
      ],
      basic: [
        "Hip thrust unilatéral haltère"
      ],
      full: [
        "Kickback poulie",
        "Hip thrust lourd barre"
      ]
    },
    advanced: {
      none: [
        "Pont fessier explosif",
      ],
      basic: [
        "Abduction élastique intensifiée"
      ],
      full: [
        "Hip thrust lourd ceinture",
        "Presse à fessiers unilatérale"
      ]
    }
  }
};

export default function ExerciseGenerator() {
  const { toast } = useToast();
  const [muscle, setMuscle] = useState(muscleGroups[0].value);
  const [level, setLevel] = useState(levels[0].value);
  const [equipment, setEquipment] = useState(equipmentOptions[0].value);
  const [results, setResults] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const exos = exercisesDB[muscle]?.[level]?.[equipment] || [];
    setResults(exos);
    toast({
      title: "Exercices générés",
      description: `Voici ${exos.length} exercice(s) pour ${muscleGroups.find(m=>m.value===muscle)?.label}`,
    });
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-muted rounded-2xl p-8 shadow space-y-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-random text-primary" />
        Générateur d&apos;Exercices
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Groupe musculaire</label>
            <select
              className="w-full border rounded px-2 py-2"
              value={muscle}
              onChange={e => setMuscle(e.target.value)}
            >
              {muscleGroups.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Niveau</label>
            <select
              className="w-full border rounded px-2 py-2"
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              {levels.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Matériel</label>
            <select
              className="w-full border rounded px-2 py-2"
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
            >
              {equipmentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-white">
            Générer
          </Button>
        </div>
      </form>
      {results.length > 0 && (
        <Card className="p-6 mt-4">
          <h3 className="text-lg font-bold mb-2">
            Exercices&nbsp;: {muscleGroups.find(m=>m.value===muscle)?.label} – {levels.find(l=>l.value===level)?.label}, {equipmentOptions.find(e=>e.value===equipment)?.label}
          </h3>
          <ul className="list-disc ml-5 space-y-2 text-base">
            {results.map((exo, i) =>
              <li key={i}>{exo}</li>
            )}
          </ul>
        </Card>
      )}
    </div>
  );
}
