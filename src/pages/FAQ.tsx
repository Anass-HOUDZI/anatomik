import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQProps {
  onBack: () => void;
}

const FAQ = ({ onBack }: FAQProps) => {
  const faqData = [
    {
      question: "Anatomik est-il vraiment gratuit ?",
      answer: "Oui, absolument ! Tous nos 60 outils sont et resteront toujours gratuits. Nous ne vendons aucun abonnement premium et n'imposons aucune limitation sur l'utilisation de nos calculateurs et trackers."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Toutes vos données restent sur votre appareil. Rien n'est envoyé vers nos serveurs. L'application fonctionne entièrement côté client, garantissant une confidentialité totale de vos informations personnelles."
    },
    {
      question: "Puis-je utiliser Anatomik hors ligne ?",
      answer: "Oui ! Après le premier chargement, l'application fonctionne entièrement hors ligne. Tous les calculs se font sur votre appareil, vous permettant d'utiliser tous les outils sans connexion internet."
    },
    {
      question: "Les formules utilisées sont-elles scientifiquement validées ?",
      answer: "Absolument. Tous nos calculateurs utilisent des formules reconnues et validées par la communauté scientifique : Harris-Benedict, Mifflin-St Jeor, Katch-McArdle, etc. Chaque outil inclut ses références scientifiques."
    },
    {
      question: "Comment puis-je sauvegarder mes données ?",
      answer: "Vos données sont automatiquement sauvegardées dans votre navigateur (localStorage). Pour les sauvegarder ailleurs, utilisez la fonction d'export disponible dans chaque tracker pour générer un fichier CSV."
    },
    {
      question: "Puis-je utiliser Anatomik sur mobile ?",
      answer: "Oui ! L'application est entièrement responsive et optimisée pour mobile. Vous pouvez même l'installer comme une app native sur votre téléphone via le navigateur."
    },
    {
      question: "Y a-t-il une limite au nombre de calculs ?",
      answer: "Aucune limite ! Utilisez tous les outils autant de fois que vous le souhaitez. Que ce soit 10 calculs par jour ou 100, il n'y a aucune restriction."
    },
    {
      question: "Comment signaler un bug ou suggérer une amélioration ?",
      answer: "Utilisez notre page Contact pour signaler tout problème ou suggérer des améliorations. Nous prenons tous les retours très au sérieux et répondons rapidement."
    },
    {
      question: "Les résultats peuvent-ils remplacer un avis médical ?",
      answer: "Non. Nos calculateurs sont des outils informatifs basés sur des formules scientifiques, mais ils ne remplacent pas l'avis d'un professionnel de santé. Consultez toujours un médecin pour des conseils personnalisés."
    },
    {
      question: "Puis-je utiliser Anatomik pour mes clients (coach) ?",
      answer: "Bien sûr ! Nos outils sont parfaits pour les coachs sportifs et nutritionnistes. Vous pouvez les utiliser librement avec vos clients sans aucune restriction commerciale."
    },
    {
      question: "Comment l'application se maintient-elle sans revenus ?",
      answer: "Anatomik est un projet passion créé pour démocratiser l'accès aux outils fitness. Les coûts sont minimaux grâce à l'architecture côté client, et le projet est maintenu par une équipe bénévole."
    },
    {
      question: "Puis-je contribuer au développement ?",
      answer: "Nous sommes ouverts aux contributions ! Contactez-nous via la page Contact si vous souhaitez contribuer au développement, à la traduction, ou apporter votre expertise scientifique."
    }
  ];

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
              Questions Fréquentes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trouvez rapidement les réponses aux questions les plus courantes sur Anatomik.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-6 bg-white/40 dark:bg-gray-900/40"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Still have questions */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Vous n'avez pas trouvé la réponse ?</h2>
            <p className="mb-6 opacity-90">
              Notre équipe est là pour vous aider ! N'hésitez pas à nous contacter.
            </p>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Nous Contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;