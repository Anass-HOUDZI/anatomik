import { ArrowLeft, Mail, MessageSquare, Bug, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactProps {
  onBack: () => void;
}

const Contact = ({ onBack }: ContactProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-8 flex items-center gap-2 hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Nous sommes là pour vous aider ! Choisissez le moyen de contact qui vous convient le mieux.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Support */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Support Technique</CardTitle>
                    <CardDescription>Aide avec l'utilisation des outils</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Besoin d'aide pour utiliser un calculateur ou un tracker ? Notre équipe support est là pour vous accompagner.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contacter le Support
                </Button>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Feedback</CardTitle>
                    <CardDescription>Partagez vos suggestions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Une idée d'amélioration ? Un nouvel outil à suggérer ? Nous sommes à l'écoute de vos retours.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Envoyer un Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Bug Report */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <Bug className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle>Signaler un Bug</CardTitle>
                    <CardDescription>Problème technique rencontré</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Un calcul incorrect ? Un problème d'affichage ? Aidez-nous à améliorer Anatomik.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Signaler un Bug
                </Button>
              </CardContent>
            </Card>

            {/* Partnership */}
            <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/20 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Partenariats</CardTitle>
                    <CardDescription>Collaboration et projets</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Coach, nutritionniste, développeur ? Explorons ensemble les opportunités de collaboration.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Proposer un Partenariat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Link */}
          <div className="text-center">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Questions Fréquentes</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Consultez notre FAQ pour des réponses rapides aux questions les plus courantes.
              </p>
              <Button variant="outline" className="border-2">
                Voir la FAQ
              </Button>
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">⏱️ Temps de réponse moyen : 24h</h3>
            <p className="opacity-90">Nous nous engageons à répondre rapidement à toutes vos demandes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;