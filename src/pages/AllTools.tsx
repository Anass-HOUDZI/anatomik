import { ArrowLeft, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "../App";

// Import all tool configs
import nutritionalToolsConfig from "../components/tool-configs/nutritionalToolsConfig";
import trainingToolsConfig from "../components/tool-configs/trainingToolsConfig";
import trackingToolsConfig from "../components/tool-configs/trackingToolsConfig";
import generatorToolsConfig from "../components/tool-configs/generatorToolsConfig";

interface AllToolsProps {
  onBack: () => void;
  onToolSelect: (tool: Tool) => void;
}

const AllTools = ({ onBack, onToolSelect }: AllToolsProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Combine all tools
  const allTools = [
    ...nutritionalToolsConfig,
    ...trainingToolsConfig,
    ...trackingToolsConfig,
    ...generatorToolsConfig
  ];

  // Filter tools based on search term
  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'nutritional':
        return { name: 'Nutrition', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
      case 'training':
        return { name: 'Entraînement', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case 'tracking':
        return { name: 'Suivi', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' };
      case 'generators':
        return { name: 'Planificateurs', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' };
      default:
        return { name: category, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto mobile-container mobile-spacing py-4 sm:py-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-8 flex items-center gap-2 hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="mobile-title text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tous les Outils
            </h1>
            <p className="mobile-body text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Découvrez nos {allTools.length} outils gratuits pour optimiser votre entraînement et nutrition.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher un outil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 h-12 sm:h-11 text-base sm:text-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 mobile-input-field"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 px-4">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-blue-600">{nutritionalToolsConfig.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Nutrition</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-green-600">{trainingToolsConfig.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Entraînement</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-purple-600">{trackingToolsConfig.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Suivi</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-orange-600">{generatorToolsConfig.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Planificateurs</div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
            {filteredTools.map((tool) => {
              const categoryInfo = getCategoryInfo(tool.category);
              return (
                <Card
                  key={tool.id}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 cursor-pointer group relative"
                  onClick={() => onToolSelect(tool)}
                >
                  {/* Badge Disponible */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                      <Zap className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">DISPONIBLE</span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3 pr-32">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                          <i className={`fas ${tool.icon} text-blue-600`}></i>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge className={categoryInfo.color}>
                        {categoryInfo.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No results */}
          {filteredTools.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Aucun outil trouvé</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Aucun outil ne correspond à votre recherche "{searchTerm}".
              </p>
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="mt-4"
              >
                Effacer la recherche
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTools;