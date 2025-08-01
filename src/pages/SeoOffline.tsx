
import React from 'react';
import { MobileLayout } from '@/components/ui/mobile-layout';
import { MobileHeader } from '@/components/ui/mobile-header';
import { MobileCard } from '@/components/ui/mobile-card';
import { ResponsiveContainer } from '@/components/ui/responsive-container';

const SeoOffline: React.FC = () => {
  return (
    <MobileLayout
      header={
        <MobileHeader 
          title="Anatomik"
          subtitle="Mode Offline"
        />
      }
    >
      <ResponsiveContainer className="py-8">
        <div className="space-y-6">
          <MobileCard className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">⚡</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Application Offline</h1>
            <p className="text-muted-foreground mb-4">
              Anatomik fonctionne entièrement hors ligne. Tous vos outils de musculation et nutrition sont disponibles sans connexion internet.
            </p>
          </MobileCard>

          <MobileCard>
            <h2 className="text-xl font-semibold mb-4">🎯 Fonctionnalités Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-green-600">📊 Calculateurs Nutritionnels</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Besoins caloriques (BMR/TDEE)</li>
                  <li>• Macronutriments optimaux</li>
                  <li>• Hydratation personnalisée</li>
                  <li>• Index glycémique</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-blue-600">🏋️ Calculateurs Training</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1RM et charges optimales</li>
                  <li>• Volume d'entraînement</li>
                  <li>• Progression personnalisée</li>
                  <li>• Temps de repos</li>
                </ul>
              </div>
            </div>
          </MobileCard>

          <MobileCard>
            <h2 className="text-xl font-semibold mb-4">📱 Optimisé Mobile</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm">Interface tactile native</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm">Gestes de navigation avancés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm">Safe areas (iPhone X+)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm">Performance optimisée</span>
              </div>
            </div>
          </MobileCard>

          <MobileCard>
            <h2 className="text-xl font-semibold mb-4">🚀 Installation PWA</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Installez Anatomik sur votre écran d'accueil pour une expérience app native complète.
            </p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p><strong>iPhone/iPad :</strong> Safari → Partager → "Sur l'écran d'accueil"</p>
              <p><strong>Android :</strong> Chrome → Menu → "Installer l'application"</p>
            </div>
          </MobileCard>
        </div>
      </ResponsiveContainer>
    </MobileLayout>
  );
};

export default SeoOffline;
