import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
    BuildingIcon,
    ChartIcon,
    ChatIcon,
    DevicesIcon,
    FacebookIcon,
    LightningIcon,
    LinkedInIcon,
    QueueIcon,
    RobotIcon,
    RocketIcon,
    ShieldIcon,
    SparkleIcon,
    SpeedIcon,
    StarIcon,
    TrendingUpIcon,
    TwitterIcon,
    UsersIcon,
    YouTubeIcon,
} from "../components/Icons";

const features = [
    "Gestion intelligente des files d'attente",
    "Notifications en temps réel",
    "Analytics et statistiques détaillées",
    "Interface simple et intuitive",
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

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans overflow-x-hidden">
            {/* Enhanced Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center group">
                            <div className="relative">
                                <img
                                    src="/assets/images/logo_Qapp.jpg"
                                    alt="Q-App Logo"
                                    className="w-14 h-14 rounded-2xl mr-4 object-cover shadow-lg ring-2 ring-yellow-400/30 group-hover:ring-yellow-400 transition-all duration-300"
                                />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                                Q-App
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-900 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center hover:bg-blue-50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                Se connecter
                            </Link>
                            <Link
                                to="/forms"
                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-yellow-400"
                            >
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Revolutionary Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-blue-800/10 to-blue-700/5"></div>
                <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

                <div
                    className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <div className="max-w-5xl mx-auto">
                        {/* Premium Badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/30 mb-8">
                            <SparkleIcon className="w-4 h-4 mr-2 text-yellow-600" />
                            <span className="text-sm font-medium text-blue-900">
                                Solution N°1 au Togo
                            </span>
                        </div>

                        {/* Hero Title */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                                Révolutionnez
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                vos files d&apos;attente
                            </span>
                        </h1>

                        {/* Hero Subtitle */}
                        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                            Q-App transforme votre gestion des files
                            d&apos;attente avec une technologie de pointe,
                            <span className="font-semibold text-blue-900">
                                {" "}
                                réduisant les temps d&apos;attente de 70%
                            </span>{" "}
                            et
                            <span className="font-semibold text-blue-900">
                                {" "}
                                augmentant la satisfaction client de 95%
                            </span>
                        </p>

                        {/* Feature Rotating Display */}
                        {isMounted && (
                            <div className="h-16 mb-12 flex items-center justify-center">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-yellow-400/20">
                                    <p className="text-lg font-semibold text-blue-900 flex items-center animate-fade-in-up">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mr-4 animate-pulse"></div>
                                        {features[currentFeature]}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* CTA Buttons - Enhanced */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                            <Link
                                to="/forms"
                                className="group relative px-10 py-5 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-900/25 flex items-center min-w-[280px] justify-center"
                            >
                                <span className="relative z-10">
                                    Démarrer gratuitement
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>

                            <Link
                                to="/login"
                                className="group border-2 border-yellow-400 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-10 py-5 rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300 flex items-center min-w-[280px] justify-center shadow-xl hover:shadow-yellow-400/25"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>Voir la démo</span>
                            </Link>
                        </div>

                        {/* Interactive Dashboard Preview */}
                        <div className="relative max-w-6xl mx-auto">
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-yellow-400/20 transform hover:scale-[1.02] transition-all duration-500">
                                {/* Dashboard Header */}
                                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                                        <div className="w-4 h-4 rounded-full bg-yellow-500/70"></div>
                                        <div className="w-4 h-4 rounded-full bg-yellow-600/50"></div>
                                    </div>
                                    <span className="text-white font-semibold">
                                        Q-App Dashboard Pro
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                        <span className="text-green-400 text-sm font-medium">
                                            Live
                                        </span>
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {/* Stat Cards */}
                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-900 to-blue-800 flex items-center justify-center">
                                                    <UsersIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-green-500 text-sm font-semibold">
                                                    +12%
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-blue-900 mb-1">
                                                2,847
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Clients servis aujourd&apos;hui
                                            </p>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
                                                    <LightningIcon className="w-6 h-6 text-blue-900" />
                                                </div>
                                                <span className="text-green-500 text-sm font-semibold">
                                                    -25%
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-blue-900 mb-1">
                                                3.2min
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Temps d&apos;attente moyen
                                            </p>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 flex items-center justify-center">
                                                    <ChartIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-green-500 text-sm font-semibold">
                                                    +18%
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-blue-900 mb-1">
                                                98.5%
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Satisfaction client
                                            </p>
                                        </div>
                                    </div>

                                    {/* Live Queue Preview */}
                                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-lg font-semibold text-blue-900">
                                                File d&apos;attente en direct
                                            </h4>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                                <span className="text-green-600 text-sm font-medium">
                                                    Temps réel
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-900 to-blue-800 text-white flex items-center justify-center text-sm font-bold">
                                                            {i}
                                                        </div>
                                                        <span className="font-medium text-blue-900">
                                                            Client #{1000 + i}
                                                        </span>
                                                    </div>
                                                    <span className="text-yellow-600 font-semibold">
                                                        {i * 2}min
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revolutionary Features Section */}
            <section className="py-32 bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/30 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-900/10 to-blue-800/5 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/10 to-blue-800/10 border border-blue-900/20 mb-6">
                            <RocketIcon className="w-4 h-4 mr-2 text-blue-900" />
                            <span className="text-sm font-semibold text-blue-900">
                                Fonctionnalités Premium
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black mb-8">
                            <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                                Pourquoi Q-App
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                domine le marché ?
                            </span>
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Une technologie de pointe qui redéfinit les
                            standards de l&apos;industrie avec des
                            fonctionnalités révolutionnaires
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        {/* Feature 1 - AI Powered */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-3xl p-8 h-full transform group-hover:scale-105 transition-all duration-500 border border-blue-100 shadow-xl">
                                {/* Icon */}
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500">
                                        <RobotIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-900">
                                            AI
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-blue-800 transition-colors">
                                    Intelligence Artificielle
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Prédiction intelligente des temps
                                    d&apos;attente, optimisation automatique des
                                    flux et recommandations personnalisées grâce
                                    à notre IA avancée.
                                </p>

                                {/* Feature highlights */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3"></div>
                                        Prédiction précise à 99.2%
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3"></div>
                                        Optimisation en temps réel
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3"></div>
                                        Machine Learning avancé
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Multi Platform */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-3xl p-8 h-full transform group-hover:scale-105 transition-all duration-500 border border-yellow-100 shadow-xl">
                                {/* Icon */}
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500">
                                        <DevicesIcon className="w-10 h-10 text-blue-900" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-white">
                                            ∞
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-blue-800 transition-colors">
                                    Écosystème Unifié
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Une expérience fluide sur tous vos appareils
                                    avec synchronisation cloud instantanée et
                                    interface adaptive responsive.
                                </p>

                                {/* Feature highlights */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full mr-3"></div>
                                        iOS, Android, Web, Desktop
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full mr-3"></div>
                                        Sync temps réel cross-platform
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full mr-3"></div>
                                        Interface adaptive PWA
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Advanced Analytics */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-700 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-3xl p-8 h-full transform group-hover:scale-105 transition-all duration-500 border border-blue-100 shadow-xl">
                                {/* Icon */}
                                <div className="relative mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500">
                                        <ChartIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-900">
                                            PRO
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-blue-900 mb-4 group-hover:text-blue-800 transition-colors">
                                    Analytics Avancés
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Tableaux de bord interactifs, rapports
                                    personnalisés et insights business pour
                                    optimiser vos performances en continu.
                                </p>

                                {/* Feature highlights */}
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3"></div>
                                        Dashboards interactifs 3D
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3"></div>
                                        Exports PDF automatisés
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3"></div>
                                        Prédictions comportementales
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Features Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Security Feature */}
                        <div className="group bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                                        <ShieldIcon className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            Sécurité Militaire
                                        </h3>
                                        <p className="text-blue-100">
                                            Chiffrement AES-256 & conformité
                                            RGPD
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                        SSL/TLS 1.3
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                        2FA intégré
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                        Audits réguliers
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                                        SOC 2 Type II
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Performance Feature */}
                        <div className="group bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-blue-900 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900/20 rounded-full blur-2xl"></div>
                            <div className="relative">
                                <div className="flex items-center mb-6">
                                    <div className="w-16 h-16 bg-blue-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                                        <LightningIcon className="w-8 h-8 text-blue-900" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            Performance Extrême
                                        </h3>
                                        <p className="text-blue-800">
                                            Latence &lt; 50ms &amp;
                                            disponibilité 99.99%
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-900 rounded-full mr-2"></div>
                                        CDN Global
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-900 rounded-full mr-2"></div>
                                        Cache Intelligent
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-900 rounded-full mr-2"></div>
                                        Load Balancing
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-900 rounded-full mr-2"></div>
                                        Auto-Scaling
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Revolutionary Stats Section */}
            <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-60 h-60 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <TrendingUpIcon className="w-4 h-4 mr-2 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">
                                Performance Exceptionnelle
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Des résultats qui parlent d&apos;eux-mêmes
                        </h2>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Plus de 50,000 entreprises nous font confiance pour
                            transformer leur expérience client
                        </p>
                    </div>

                    {/* Modern Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat 1 - Companies */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 transform group-hover:scale-[1.02] transition-all duration-500 hover:bg-white/20">
                                {/* Icon Container */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                        <BuildingIcon className="w-7 h-7 text-blue-900" />
                                    </div>
                                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Main Number */}
                                <div className="mb-4">
                                    <div className="text-3xl lg:text-4xl font-black text-white mb-1 group-hover:text-yellow-400 transition-colors">
                                        50K+
                                    </div>
                                    <div className="text-sm text-yellow-400 font-semibold uppercase tracking-wider">
                                        Entreprises
                                    </div>
                                </div>

                                {/* Subtitle */}
                                <div className="text-blue-200 text-sm font-medium">
                                    dans 45 pays
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                    <div className="w-4/5 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stat 2 - Queues */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 transform group-hover:scale-[1.02] transition-all duration-500 hover:bg-white/20">
                                {/* Icon Container */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                        <QueueIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Main Number */}
                                <div className="mb-4">
                                    <div className="text-3xl lg:text-4xl font-black text-white mb-1 group-hover:text-blue-300 transition-colors">
                                        2M+
                                    </div>
                                    <div className="text-sm text-blue-300 font-semibold uppercase tracking-wider">
                                        Files gérées
                                    </div>
                                </div>

                                {/* Subtitle */}
                                <div className="text-blue-200 text-sm font-medium">
                                    chaque mois
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                    <div className="w-5/6 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stat 3 - Speed */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 transform group-hover:scale-[1.02] transition-all duration-500 hover:bg-white/20">
                                {/* Icon Container */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                        <SpeedIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Main Number */}
                                <div className="mb-4">
                                    <div className="text-3xl lg:text-4xl font-black text-white mb-1 group-hover:text-green-300 transition-colors">
                                        -70%
                                    </div>
                                    <div className="text-sm text-green-300 font-semibold uppercase tracking-wider">
                                        Temps d&apos;attente
                                    </div>
                                </div>

                                {/* Subtitle */}
                                <div className="text-blue-200 text-sm font-medium">
                                    réduction moyenne
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                    <div className="w-3/4 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Stat 4 - Satisfaction */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-6 border border-white/30 transform group-hover:scale-[1.02] transition-all duration-500 hover:bg-white/20">
                                {/* Icon Container */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                        <StarIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Main Number */}
                                <div className="mb-4">
                                    <div className="text-3xl lg:text-4xl font-black text-white mb-1 group-hover:text-purple-300 transition-colors">
                                        99.8%
                                    </div>
                                    <div className="text-sm text-purple-300 font-semibold uppercase tracking-wider">
                                        Satisfaction
                                    </div>
                                </div>

                                {/* Subtitle */}
                                <div className="text-blue-200 text-sm font-medium">
                                    client moyenne
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-4 w-full bg-white/20 rounded-full h-1">
                                    <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center mt-16">
                        <p className="text-xl text-blue-100 mb-8">
                            Rejoignez l&apos;élite des entreprises qui
                            révolutionnent leur service client
                        </p>
                        <Link
                            to="/forms"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-2xl text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25"
                        >
                            <span>Rejoindre maintenant</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 ml-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Premium Testimonials Section */}
            <section className="py-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-yellow-50/30 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-900/5 to-blue-800/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-yellow-400/10 to-yellow-500/5 rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/30 mb-6">
                            <ChatIcon className="w-4 h-4 mr-2 text-yellow-600" />
                            <span className="text-sm font-semibold text-blue-900">
                                Témoignages Clients
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black mb-8">
                            <span className="bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
                                L&apos;élite nous fait
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                confiance
                            </span>
                        </h2>
                        <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Découvrez comment les leaders du marché transforment
                            leur expérience client avec Q-App
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                        {/* Testimonial 1 */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-3xl p-10 h-full border border-blue-100 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-xl font-bold text-blue-900">
                                        &ldquo;
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <div className="flex items-center mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl flex items-center justify-center mr-6 text-white text-2xl font-bold group-hover:rotate-6 transition-transform duration-500">
                                            MD
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-blue-900 mb-1">
                                                Marie Dubois
                                            </h4>
                                            <p className="text-gray-600 font-medium">
                                                Directrice Générale
                                            </p>
                                            <p className="text-yellow-600 text-sm font-semibold">
                                                Centre Commercial Riviera
                                            </p>
                                        </div>
                                    </div>
                                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                                        &ldquo;Q-App a révolutionné notre façon
                                        de gérer les files d&apos;attente. En 3
                                        mois, nous avons réduit les temps
                                        d&apos;attente de 65% et notre
                                        satisfaction client a bondi à 98%. Un
                                        ROI exceptionnel !&rdquo;
                                    </blockquote>
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-yellow-400 text-xl">
                                            ★★★★★
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium">
                                            Il y a 2 semaines
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white rounded-3xl p-10 h-full border border-yellow-100 shadow-2xl transform group-hover:scale-[1.02] transition-all duration-500">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-xl font-bold text-white">
                                        &ldquo;
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <div className="flex items-center mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-6 text-blue-900 text-2xl font-bold group-hover:rotate-6 transition-transform duration-500">
                                            TL
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-blue-900 mb-1">
                                                Thomas Laurent
                                            </h4>
                                            <p className="text-gray-600 font-medium">
                                                Directeur Médical
                                            </p>
                                            <p className="text-yellow-600 text-sm font-semibold">
                                                Clinique Saint-Michel
                                            </p>
                                        </div>
                                    </div>
                                    <blockquote className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                                        &ldquo;L&apos;implémentation de Q-App a
                                        été remarquable. Nos patients suivent
                                        leur attente en temps réel, notre équipe
                                        est plus organisée et nos processus
                                        optimisés. Une transformation digitale
                                        réussie !&rdquo;
                                    </blockquote>
                                    <div className="flex items-center justify-between">
                                        <div className="flex text-yellow-400 text-xl">
                                            ★★★★★
                                        </div>
                                        <div className="text-sm text-gray-500 font-medium">
                                            Il y a 1 semaine
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">
                                Ils nous font confiance
                            </h3>
                            <p className="text-gray-600">
                                Plus de 500 entreprises leaders utilisent Q-App
                                quotidiennement
                            </p>
                        </div>
                        <div className="flex items-center justify-center space-x-12 opacity-60">
                            {/* Logo placeholders */}
                            <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-600">
                                    LOGO
                                </span>
                            </div>
                            <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-600">
                                    LOGO
                                </span>
                            </div>
                            <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-600">
                                    LOGO
                                </span>
                            </div>
                            <div className="w-24 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-600">
                                    LOGO
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium CTA Section */}
            <section className="py-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-400 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent"></div>
                    <div className="absolute top-10 left-10 w-40 h-40 bg-blue-900/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-900/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    {/* Badge */}
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-900/20 backdrop-blur-sm border border-blue-900/30 mb-8">
                        <RocketIcon className="w-4 h-4 mr-2 text-blue-900" />
                        <span className="text-sm font-bold text-blue-900">
                            Offre Limitée - 30 jours gratuits
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="text-5xl md:text-6xl font-black text-blue-900 mb-8 leading-tight">
                        Prêt à révolutionner votre
                        <br />
                        <span className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                            expérience client ?
                        </span>
                    </h2>

                    <p className="text-xl text-blue-800 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                        Rejoignez plus de 50,000 entreprises qui transforment
                        leur service client avec Q-App. Commencez gratuitement
                        aujourd&apos;hui et découvrez la différence.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/register"
                            className="group relative px-12 py-6 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-900/25 flex items-center min-w-[300px] justify-center"
                        >
                            <span className="relative z-10">
                                Démarrer gratuitement
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        <Link
                            to="/login"
                            className="group px-12 py-6 bg-white/20 backdrop-blur-sm text-blue-900 rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-300 border-2 border-blue-900/30 flex items-center min-w-[300px] justify-center hover:bg-white/30"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            <span>Demander une démo</span>
                        </Link>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-12 flex items-center justify-center space-x-6 text-blue-800">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium">
                                Sans engagement
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium">
                                Support 24/7
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            <span className="text-sm font-medium">
                                Installation en 5min
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative">
                    {/* Main Footer Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                            {/* Brand Section */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center mb-8">
                                    <div className="relative">
                                        <img
                                            src="/assets/images/logo_Qapp.jpg"
                                            alt="Q-App Logo"
                                            className="w-16 h-16 rounded-2xl mr-4 object-cover border-2 border-yellow-400 shadow-lg"
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <div>
                                        <span className="text-3xl font-black text-white">
                                            Q-App
                                        </span>
                                        <div className="text-sm text-yellow-400 font-semibold">
                                            Premium Edition
                                        </div>
                                    </div>
                                </div>
                                <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-md">
                                    La solution intelligente nouvelle génération
                                    pour révolutionner vos files d&apos;attente
                                    et optimiser l&apos;expérience client.
                                </p>

                                {/* Social Links */}
                                <div className="flex space-x-4">
                                    <Link
                                        to="#"
                                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 transform hover:scale-110"
                                    >
                                        <FacebookIcon className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 transform hover:scale-110"
                                    >
                                        <TwitterIcon className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 transform hover:scale-110"
                                    >
                                        <LinkedInIcon className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 transform hover:scale-110"
                                    >
                                        <YouTubeIcon className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Solutions */}
                            <div>
                                <h4 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                                    Solutions
                                </h4>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            to="/enterprise"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Pour entreprises
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/retail"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Pour commerces
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/healthcare"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Pour centres médicaux
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/public"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Services publics
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Ressources */}
                            <div>
                                <h4 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                                    Ressources
                                </h4>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            to="/blog"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Blog & Actualités
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/help"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Centre d&apos;aide
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/tutorials"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Tutoriels vidéo
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/api"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Documentation API
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                                    Contact
                                </h4>
                                <ul className="space-y-4">
                                    <li>
                                        <Link
                                            to="/support"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Support Premium 24/7
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/sales"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Équipe commerciale
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/demo"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Demander une démo
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/partnership"
                                            className="text-blue-100 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center group"
                                        >
                                            <span className="w-1 h-1 bg-blue-300 rounded-full mr-3 group-hover:bg-yellow-400"></span>
                                            Partenariats
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter Section */}
                        <div className="mt-16 p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                            <div className="max-w-2xl mx-auto text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    Restez informé des dernières innovations
                                </h3>
                                <p className="text-blue-100 mb-6">
                                    Recevez nos insights exclusifs, études de
                                    cas et nouveautés produit
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="Votre email professionnel"
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-xl font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105">
                                        S&apos;abonner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/20 bg-blue-900/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-6 text-sm text-blue-200">
                                    <span>
                                        © 2025 Q-App. Tous droits réservés.
                                    </span>
                                    <Link
                                        to="/privacy"
                                        className="hover:text-white transition-colors"
                                    >
                                        Confidentialité
                                    </Link>
                                    <Link
                                        to="/terms"
                                        className="hover:text-white transition-colors"
                                    >
                                        CGU
                                    </Link>
                                    <Link
                                        to="/cookies"
                                        className="hover:text-white transition-colors"
                                    >
                                        Cookies
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-blue-200">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                        <span>Tous systèmes opérationnels</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ShieldIcon className="w-4 h-4 mr-2" />
                                        <span>Sécurisé SSL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
