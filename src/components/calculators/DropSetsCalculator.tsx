
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const DropSetsCalculator = () => (
  <div className="max-w-2xl mx-auto pt-6">
    <Card>
      <CardHeader>
        <CardTitle>Calculateur de Drop Sets</CardTitle>
        <CardDescription>
          Séries dégressives automatisées pour maximiser les stimuli d’hypertrophie.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-center py-16">
          <i className="fas fa-tools text-5xl mb-4 text-primary"></i>
          <div className="mt-2 text-lg">En développement.<br />Fonctionnalités à venir prochainement !</div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default DropSetsCalculator;
