import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

const features = [
    "Gestion intelligente des files d'attente",
    "Notifications en temps réel", 
    "Analytics et statistiques détaillées",
    "Interface simple et intuitive"
  ];

  
export default function Index() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  

   useEffect(() => {
    setIsMounted(true);
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/assets/images/logo_Qapp.jpg" 
                alt="Q-App Logo" 
                className="w-10 h-10 rounded-xl mr-3 object-cover"
              />
              <span className="text-2xl font-bold text-blue-600">Q-App</span>
            </div>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Se connecter
              </Link>
              <Link 
                to="/forms" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-yellow-50 to-blue-100 py-20">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         <div className="mb-8">
            <img 
              src="/assets/images/logo_Qapp.jpg" 
              alt="Q-App Logo" 
              className="w-24 h-24 mx-auto rounded-3xl shadow-2xl border-4 border-white"
            />
          </div>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Q-App révolutionne la gestion des files d&apos;attente avec une solution moderne, 
            efficace et facile à utiliser pour votre entreprise.
          </p>

         {/* ✅ Rendu uniquement après montage pour éviter erreurs d'hydratation */}
          {isMounted && (
            <div className="h-8 mb-12">
              <p className="text-lg text-blue-600 font-medium animate-fade-in-up">
                <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full mr-2"></span>
                {features[currentFeature]}
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Commencer gratuitement
            </Link>
            
            <Link
              to="/login"
              className="border-2 border-yellow-400 bg-yellow-400 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 hover:border-yellow-500 transform hover:scale-105 transition-all duration-200"
            >
              Se connecter
            </Link>
          </div>

          {/* Demo/Screenshot placeholder */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-yellow-400 overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="bg-blue-600 px-4 py-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
                <span className="text-white text-sm ml-4 font-medium">Q-App Dashboard</span>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-yellow-50">
                <div className="flex items-center justify-center h-64 text-gray-600">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <div className="w-12 h-12 border-3 border-blue-600 rounded-lg"></div>
                    </div>
                    <p className="text-lg font-medium">Interface Q-App</p>
                    <p className="text-sm text-gray-500">Tableau de bord intuitif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Q-App ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour optimiser la gestion de vos files d&apos;attente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border-2 border-transparent hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-yellow-200 transition-all duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rapide & Efficace</h3>
              <p className="text-gray-600">
                Réduisez les temps d&apos;attente et améliorez l&apos;expérience client avec notre système optimisé.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl border-2 border-transparent hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-yellow-200 group-hover:to-blue-200 transition-all duration-300">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-plateforme</h3>
              <p className="text-gray-600">
                Accessible sur tous vos appareils, ordinateur, tablette ou smartphone.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl border-2 border-transparent hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-yellow-200 transition-all duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Avancés</h3>
              <p className="text-gray-600">
                Suivez vos performances en temps réel avec des rapports détaillés et des insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Entreprises satisfaites</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Files d&apos;attente gérées</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Temps de disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-yellow-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à optimiser vos files d&apos;attente ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Rejoignez des milliers d&apos;entreprises qui font confiance à Q-App
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inline-block"
            >
              Commencer maintenant - C&apos;est gratuit
            </Link>
            <Link
              to="/login"
              className="bg-yellow-400 text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transform hover:scale-105 transition-all duration-200 inline-block"
            >
              Démo gratuite
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
               <img 
                src="/assets/images/logo_Qapp.jpg" 
                alt="Q-App Logo" 
                className="w-10 h-10 rounded-xl mr-3 object-cover"
              />
              <span className="text-2xl font-bold text-white">Q-App</span>
            </div>
            <p className="mb-4 text-blue-100">
              La solution intelligente pour vos files d&apos;attente
            </p>
            <p className="text-sm text-blue-200">© 2025 Q-App. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      
    </main>
  );
}