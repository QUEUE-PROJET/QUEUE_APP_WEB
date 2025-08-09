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
    <main className="min-h-screen bg-white font-sans">
      {/* Header/Navigation - Modernisé */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img
                src="/assets/images/logo_Qapp.jpg"
                alt="Q-App Logo"
                className="w-12 h-12 rounded-xl mr-3 object-cover shadow-sm"
              />
              <span className="text-2xl font-bold" style={{ color: "#005DA0" }}>Q-App</span>
            </div>
            <div className="flex space-x-5">
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#005DA0] px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Se connecter
              </Link>
              <Link
                to="/forms"
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                style={{ backgroundColor: "#E8FF18", color: "#005DA0" }}
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Redesigné */}
      <section className="py-28" style={{ background: "linear-gradient(135deg, #f0f8ff 0%, #f8ffeb 50%, #e6f3ff 100%)" }}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            <span style={{ color: "#005DA0" }}>Simplifiez</span> vos files d'attente<br/>
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(45deg, #005DA0, #3395E8)" }}>
              avec Q-App
            </span>
          </h1>

          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Q-App révolutionne la gestion des files d&apos;attente avec une solution moderne, 
            efficace et facile à utiliser pour votre entreprise.
          </p>

          {/* ✅ Rendu uniquement après montage pour éviter erreurs d'hydratation */}
          {isMounted && (
            <div className="h-12 mb-14">
              <p className="text-lg font-medium animate-fade-in-up flex items-center justify-center">
                <span className="inline-block w-7 h-7 rounded-full mr-3 shadow-inner" style={{ backgroundColor: "#E8FF18" }}></span>
                <span style={{ color: "#005DA0" }}>{features[currentFeature]}</span>
              </p>
            </div>
          )}

          {/* CTA Buttons - Améliorés */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link
              to="/forms"
              className="px-8 py-4 rounded-lg text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              style={{ backgroundColor: "#005DA0", color: "white" }}
            >
              <span>Commencer gratuitement</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              to="/login"
              className="border-2 px-8 py-4 rounded-lg text-lg font-semibold transform hover:scale-105 transition-all duration-300 flex items-center"
              style={{ borderColor: "#E8FF18", backgroundColor: "#E8FF18", color: "#005DA0" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Se connecter</span>
            </Link>
          </div>

          {/* Demo/Screenshot - Amélioré */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-102 transition-transform duration-500" style={{ border: "2px solid #E8FF18" }}>
              <div className="px-4 py-3 flex items-center space-x-2" style={{ backgroundColor: "#005DA0" }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E8FF18" }}></div>
                <div className="w-3 h-3 bg-white opacity-70 rounded-full"></div>
                <div className="w-3 h-3 bg-white opacity-40 rounded-full"></div>
                <span className="text-white text-sm ml-4 font-medium">Q-App Dashboard</span>
              </div>
              <div className="p-8" style={{ background: "linear-gradient(135deg, #f0f8ff 0%, #f8ffeb 50%, #e6f3ff 100%)" }}>
                <div className="flex items-center justify-center h-80 text-gray-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-6 w-full max-w-3xl px-8">
                      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                        <div className="w-10 h-10 rounded-lg mb-4" style={{ backgroundColor: "#005DA0" }}></div>
                        <div className="h-3 w-3/4 mb-2 rounded" style={{ backgroundColor: "#E8FF18" }}></div>
                        <div className="h-2 w-full mb-1 bg-gray-200 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                        <div className="w-10 h-10 rounded-lg mb-4" style={{ backgroundColor: "#E8FF18" }}></div>
                        <div className="h-3 w-3/4 mb-2 rounded" style={{ backgroundColor: "#005DA0" }}></div>
                        <div className="h-2 w-full mb-1 bg-gray-200 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                        <div className="w-10 h-10 rounded-lg mb-4" style={{ backgroundColor: "#005DA0" }}></div>
                        <div className="h-3 w-3/4 mb-2 rounded" style={{ backgroundColor: "#E8FF18" }}></div>
                        <div className="h-2 w-full mb-1 bg-gray-200 rounded"></div>
                        <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 text-center p-4">
                    <p className="text-lg font-medium" style={{ color: "#005DA0" }}>Interface Q-App</p>
                    <p className="text-sm text-gray-500">Tableau de bord intuitif et moderne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Amélioré */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span style={{ color: "#005DA0" }}>Pourquoi choisir</span> <span style={{ color: "#004A80" }}>Q-App</span> <span style={{ color: "#E8FF18" }}>?</span>
            </h2>
            <div className="w-24 h-1 mx-auto my-6" style={{ backgroundColor: "#E8FF18" }}></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour optimiser la gestion de vos files d&apos;attente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="rounded-2xl p-8 transition-all duration-300 group hover:shadow-xl" 
                 style={{ backgroundColor: "#f8fbff", borderLeft: "4px solid #005DA0" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                   style={{ backgroundColor: "#E8FF18" }}>
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: "#005DA0" }}>Rapide & Efficace</h3>
              <p className="text-gray-600 leading-relaxed">
                Réduisez les temps d&apos;attente et améliorez l&apos;expérience client avec notre système optimisé.
                Automatisez vos processus pour une efficacité maximale.
              </p>
            </div>
            
            <div className="rounded-2xl p-8 transition-all duration-300 group hover:shadow-xl" 
                 style={{ backgroundColor: "#f8fbff", borderLeft: "4px solid #E8FF18" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                   style={{ backgroundColor: "#005DA0" }}>
                <span className="text-3xl text-white">📱</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: "#005DA0" }}>Multi-plateforme</h3>
              <p className="text-gray-600 leading-relaxed">
                Accessible sur tous vos appareils, ordinateur, tablette ou smartphone.
                Une expérience fluide et cohérente sur toutes les plateformes.
              </p>
            </div>
            
            <div className="rounded-2xl p-8 transition-all duration-300 group hover:shadow-xl" 
                 style={{ backgroundColor: "#f8fbff", borderLeft: "4px solid #005DA0" }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                   style={{ backgroundColor: "#E8FF18" }}>
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4" style={{ color: "#005DA0" }}>Analytics Avancés</h3>
              <p className="text-gray-600 leading-relaxed">
                Suivez vos performances en temps réel avec des rapports détaillés et des insights.
                Prenez des décisions éclairées basées sur des données précises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Amélioré */}
      <section className="py-20" style={{ backgroundColor: "#005DA0" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-white">1000+</div>
              <div className="text-lg text-blue-100">Entreprises satisfaites</div>
              <div className="w-12 h-1 mx-auto mt-4" style={{ backgroundColor: "#E8FF18" }}></div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-white">50K+</div>
              <div className="text-lg text-blue-100">Files d&apos;attente gérées</div>
              <div className="w-12 h-1 mx-auto mt-4" style={{ backgroundColor: "#E8FF18" }}></div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-white">99.9%</div>
              <div className="text-lg text-blue-100">Temps de disponibilité</div>
              <div className="w-12 h-1 mx-auto mt-4" style={{ backgroundColor: "#E8FF18" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages - Nouvelle section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: "#005DA0" }}>Ce que nos clients disent</h2>
            <div className="w-24 h-1 mx-auto my-6" style={{ backgroundColor: "#E8FF18" }}></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez comment Q-App transforme l'expérience des entreprises
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full mr-4" style={{ backgroundColor: "#E8FF18" }}></div>
                <div>
                  <h4 className="text-xl font-semibold" style={{ color: "#005DA0" }}>Marie Dubois</h4>
                  <p className="text-gray-600">Directrice, Centre Commercial Riviera</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Q-App a révolutionné notre façon de gérer les files d'attente. Nos clients sont plus satisfaits et notre personnel est plus efficace. Un investissement qui a rapidement porté ses fruits."
              </p>
              <div className="flex mt-4">
                <span className="text-lg text-yellow-400">★★★★★</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full mr-4" style={{ backgroundColor: "#005DA0" }}></div>
                <div>
                  <h4 className="text-xl font-semibold" style={{ color: "#005DA0" }}>Thomas Laurent</h4>
                  <p className="text-gray-600">Gérant, Clinique Saint-Michel</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "L'implémentation de Q-App a été simple et l'impact immédiat. Nos patients apprécient de pouvoir suivre leur temps d'attente en temps réel. Notre organisation interne s'est également améliorée."
              </p>
              <div className="flex mt-4">
                <span className="text-lg text-yellow-400">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Amélioré */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #E8FF18 0%, #f8ffda 100%)" }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "#005DA0" }}>
            Prêt à optimiser vos files d&apos;attente ?
          </h2>
          <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            Rejoignez des milliers d&apos;entreprises qui font confiance à Q-App pour améliorer leur service client et leur efficacité
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="px-8 py-5 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              style={{ backgroundColor: "#005DA0", color: "white" }}
            >
              <span>Commencer maintenant - C&apos;est gratuit</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/login"
              className="px-8 py-5 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 border-2 flex items-center justify-center"
              style={{ borderColor: "#005DA0", color: "#005DA0" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Démo gratuite</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Amélioré */}
      <footer style={{ backgroundColor: "#005DA0" }} className="text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-6">
                <img
                  src="/assets/images/logo_Qapp.jpg"
                  alt="Q-App Logo"
                  className="w-12 h-12 rounded-xl mr-3 object-cover border-2"
                  style={{ borderColor: "#E8FF18" }}
                />
                <span className="text-2xl font-bold text-white">Q-App</span>
              </div>
              <p className="mb-4 text-blue-100 text-center md:text-left">
                La solution intelligente pour vos files d&apos;attente
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: "#E8FF18" }}>Solutions</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Pour entreprises</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pour commerces</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pour services publics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: "#E8FF18" }}>Ressources</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriels</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: "#E8FF18" }}>Contact</h4>
              <ul className="space-y-2 text-blue-100">
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ventes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Démo</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-400/30 mt-12 pt-8 text-center">
            <p className="text-sm text-blue-200">© 2025 Q-App. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}