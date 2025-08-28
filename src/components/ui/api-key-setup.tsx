import React, { useState } from 'react';
import { Key, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Label } from './label';
import { Badge } from './badge';
import { APIKeyManager } from '../../services/apis/nutritionAPIs';
import { useToast } from '../../hooks/use-toast';

interface APIKeySetupProps {
  onComplete?: () => void;
}

export const APIKeySetup: React.FC<APIKeySetupProps> = ({ onComplete }) => {
  const [usdaKey, setUsdaKey] = useState('');
  const [nutritionixKeys, setNutritionixKeys] = useState({ appId: '', appKey: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveKeys = async () => {
    setLoading(true);
    try {
      if (usdaKey.trim()) {
        APIKeyManager.setAPIKey('usda', usdaKey.trim());
      }
      
      if (nutritionixKeys.appId && nutritionixKeys.appKey) {
        APIKeyManager.setAPIKey('nutritionix', `${nutritionixKeys.appId}:${nutritionixKeys.appKey}`);
      }

      toast({
        title: 'Clés API sauvegardées',
        description: 'Vos clés API ont été enregistrées localement de manière sécurisée.',
      });

      onComplete?.();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de sauvegarder les clés API.',
      });
    } finally {
      setLoading(false);
    }
  };

  const hasValidKeys = APIKeyManager.hasValidKeys();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
          <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Configuration des API Nutritionnelles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pour accéder aux bases de données nutritionnelles complètes, configurez vos clés API. 
            Elles sont stockées localement et de manière sécurisée.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Sécurité et Confidentialité
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Vos clés API sont stockées uniquement dans votre navigateur (localStorage) et ne sont jamais envoyées à nos serveurs.
                Seules les APIs nutritionnelles officielles y ont accès pour récupérer les données alimentaires.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* USDA API */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  USDA Food Data Central
                  <Badge variant="secondary">Recommandé</Badge>
                </CardTitle>
                <CardDescription>
                  Base de données nutritionnelles américaine (gratuite)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usda-key">Clé API USDA</Label>
              <Input
                id="usda-key"
                type="password"
                placeholder="Votre clé API USDA..."
                value={usdaKey}
                onChange={(e) => setUsdaKey(e.target.value)}
              />
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Comment obtenir :</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Créez un compte sur <a href="https://fdc.nal.usda.gov/api-key-signup.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">USDA FDC</a></li>
                <li>Vérifiez votre email</li>
                <li>Copiez votre clé API ici</li>
              </ol>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="w-full"
            >
              <a 
                href="https://fdc.nal.usda.gov/api-key-signup.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Obtenir une clé USDA (gratuit)
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Nutritionix API */}
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                Nutritionix API
                <Badge variant="outline">Optionnel</Badge>
              </CardTitle>
              <CardDescription>
                Base étendue avec marques commerciales
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nutritionix-id">Application ID</Label>
                <Input
                  id="nutritionix-id"
                  type="text"
                  placeholder="Votre App ID..."
                  value={nutritionixKeys.appId}
                  onChange={(e) => setNutritionixKeys(prev => ({ ...prev, appId: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nutritionix-key">Application Key</Label>
                <Input
                  id="nutritionix-key"
                  type="password"
                  placeholder="Votre App Key..."
                  value={nutritionixKeys.appKey}
                  onChange={(e) => setNutritionixKeys(prev => ({ ...prev, appKey: e.target.value }))}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Comment obtenir :</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Inscrivez-vous sur <a href="https://developer.nutritionix.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Nutritionix</a></li>
                <li>Créez une application</li>
                <li>Copiez App ID et App Key</li>
              </ol>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="w-full"
            >
              <a 
                href="https://developer.nutritionix.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Créer un compte Nutritionix
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      {hasValidKeys && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-800 dark:text-green-200 font-medium">
                Clés API configurées - Accès complet aux bases nutritionnelles
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSaveKeys}
          disabled={loading || (!usdaKey.trim() && !nutritionixKeys.appId && !nutritionixKeys.appKey)}
          size="lg"
          className="min-w-48"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Sauvegarder les clés
            </>
          )}
        </Button>
      </div>

      {/* Continue without keys */}
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={onComplete}
          className="text-muted-foreground"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Continuer avec les données de démonstration
        </Button>
      </div>
    </div>
  );
};