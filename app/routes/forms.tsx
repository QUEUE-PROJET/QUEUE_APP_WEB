import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Select from "react-select";
import type { Country } from "~/components/countries";
import { countries } from "~/components/countries";
import {
    BuildingIcon,
    DevicesIcon,
    ShieldIcon,
    UsersIcon,
} from "~/components/Icons";
import {
    getEnterpriseCategories,
    registerEnterpriseAgentBase64,
} from "~/utils/api";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [logo, setLogo] = useState("");
    const [doc, setDoc] = useState("");
    const [carte, setCarte] = useState("");
    // Noms des fichiers sélectionnés (pour un feedback clair)
    const [logoFileName, setLogoFileName] = useState("");
    const [docFileName, setDocFileName] = useState("");
    const [carteFileName, setCarteFileName] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [errorCategories, setErrorCategories] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        null
    );
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Gestion agences et services
    type AgenceDraft = {
        name: string;
        adresse: string;
        contact: string;
        temps_attente_moyen: number;
        services: { name: string; description: string }[];
    };
    type DirectServiceDraft = { name: string; description: string };
    type StructureDraft = { services: DirectServiceDraft[] } | AgenceDraft[];
    const [agences, setAgences] = useState<AgenceDraft[]>([]);
    const [agenceInput, setAgenceInput] = useState({
        name: "",
        adresse: "",
        contact: "",
        temps_attente_moyen: 0,
        services: [] as { name: string; description: string }[],
    });
    const [serviceInput, setServiceInput] = useState({
        name: "",
        description: "",
    });

    // Services "directs" sans agences
    const [directServices, setDirectServices] = useState<
        { name: string; description: string }[]
    >([]);

    // Case à cocher pour choisir si on crée des agences ou uniquement des services
    const [noAgency, setNoAgency] = useState(false);

    // État pour suivre si le formulaire d'agence est valide
    const [agenceFormValid, setAgenceFormValid] = useState(false);

    // Charger les catégories au montage
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await getEnterpriseCategories();
                setCategories(data);
                setErrorCategories("");
            } catch (err) {
                console.error("Erreur lors du chargement des catégories:", err);
                setErrorCategories("Impossible de charger les catégories");
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    // Vérifier la validité du formulaire d'agence
    useEffect(() => {
        const isValid =
            agenceInput.name.trim() !== "" && agenceInput.services.length > 0;
        setAgenceFormValid(isValid);
    }, [agenceInput]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setState: (base64: string) => void
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setState(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Gestion des services pour agences
    const handleAddService = () => {
        if (!serviceInput.name.trim()) return;
        setAgenceInput({
            ...agenceInput,
            services: [...agenceInput.services, serviceInput],
        });
        setServiceInput({ name: "", description: "" });
    };

    const handleAddAgence = () => {
        if (!agenceFormValid) return;

        setAgences([...agences, agenceInput]);

        setAgenceInput({
            name: "",
            adresse: "",
            contact: "",
            temps_attente_moyen: 0,
            services: [],
        });

        setServiceInput({ name: "", description: "" });
    };

    // Gestion des services "directs" (sans agence)
    const handleAddDirectService = () => {
        if (!serviceInput.name.trim()) return;
        setDirectServices([...directServices, serviceInput]);
        setServiceInput({ name: "", description: "" });
    };

    const handleRemoveDirectService = (index: number) => {
        setDirectServices(directServices.filter((_, i) => i !== index));
    };

    const handleRemoveAgenceService = (
        agenceIndex: number,
        serviceIndex: number
    ) => {
        const updatedAgences = [...agences];
        updatedAgences[agenceIndex].services = updatedAgences[
            agenceIndex
        ].services.filter((_, i) => i !== serviceIndex);
        setAgences(updatedAgences);
    };

    const handleRemoveAgence = (index: number) => {
        setAgences(agences.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        // Validation de l'email
        const email = formData.get("email") as string;
        if (!email.includes("@") || !email.includes(".")) {
            alert("Veuillez entrer une adresse email valide");
            setIsSubmitting(false);
            return;
        }

        // Validation selon le mode choisi
        if (noAgency) {
            if (directServices.length === 0) {
                alert("Veuillez ajouter au moins un service");
                setIsSubmitting(false);
                return;
            }
        } else {
            if (agences.length === 0) {
                alert("Veuillez ajouter au moins une agence avec ses services");
                setIsSubmitting(false);
                return;
            }
        }

        const payload: {
            name: string;
            email: string;
            entreprise_name: string;
            entreprise_description: string;
            entreprise_adress: string;
            entreprise_contact: string;
            entreprise_country: string;
            entreprise_website: string;
            entreprise_categorie: string;
            entreprise_logo: string | null;
            document_enregistrement: string | null;
            carte_professionnelle: string | null;
            structure?: StructureDraft;
        } = {
            name: formData.get("name") as string,
            email: email,
            entreprise_name: formData.get("entreprise_name") as string,
            entreprise_description: formData.get(
                "entreprise_description"
            ) as string,
            entreprise_adress: formData.get("entreprise_adress") as string,
            entreprise_contact: selectedCountry
                ? `${selectedCountry.phoneCode}${phoneNumber}`
                : phoneNumber,
            entreprise_country: selectedCountry?.name || "",
            entreprise_website: formData.get("entreprise_website") as string,
            entreprise_categorie: formData.get(
                "entreprise_categorie"
            ) as string,
            entreprise_logo: logo || null,
            document_enregistrement: doc || null,
            carte_professionnelle: carte || null,
        };

        // Structure des données selon le mode choisi
        if (noAgency) {
            payload.structure = { services: directServices };
        } else {
            payload.structure = agences;
        }

        console.log("📤 Payload envoyé :", JSON.stringify(payload, null, 2));

        try {
            const result = await registerEnterpriseAgentBase64(payload);
            console.log("✅ Réponse du backend :", result);

            // Marquer la redirection comme en cours
            setIsRedirecting(true);

            // Réinitialisation complète du formulaire
            form.reset();
            setDirectServices([]);
            setAgences([]);
            setAgenceInput({
                name: "",
                adresse: "",
                contact: "",
                temps_attente_moyen: 0,
                services: [],
            });
            setServiceInput({ name: "", description: "" });
            setLogo("");
            setDoc("");
            setCarte("");
            setNoAgency(false);

            // Redirection immédiate
            navigate(
                `/verify-email?email=${encodeURIComponent(payload.email)}`
            );
        } catch (err: unknown) {
            let errorMessage = "Une erreur est survenue";
            const maybeResp = err as {
                response?: { json: () => Promise<unknown> };
            };
            if (maybeResp && maybeResp.response) {
                const apiError = await maybeResp.response.json();
                errorMessage = apiError.message || JSON.stringify(apiError);
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert("Erreur : " + errorMessage);
            console.error("❌ Erreur backend détaillée :", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fonction pour vérifier si le formulaire peut être soumis
    const canSubmitForm = () => {
        if (noAgency) {
            return directServices.length > 0;
        } else {
            return agences.length > 0;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
            {/* Overlay de redirection */}
            {isRedirecting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
                        <div className="animate-spin mx-auto mb-4 h-8 w-8 border-4 border-[#00509d] border-t-transparent rounded-full"></div>
                        <p className="text-lg font-semibold text-[#00296b]">Redirection vers la vérification email...</p>
                    </div>
                </div>
            )}
            
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
                                to="/"
                                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all duration-300"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 mr-2"
                                    aria-hidden="true"
                                >
                                    <path d="M9.707 16.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 10H20a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" />
                                </svg>
                                Accueil
                            </Link>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-900 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center hover:bg-blue-50"
                            >
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Contenu principal */}
            <div className="max-w-5xl mx-auto px-4 py-32">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* En-tête du formulaire */}
                    <div className="px-8 py-12 text-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 relative overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-400 rounded-full blur-2xl animate-pulse"></div>
                            <div className="absolute bottom-4 right-4 w-40 h-40 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        </div>

                        <div className="relative">
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                Créez votre compte
                                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                                    entreprise
                                </span>
                            </h1>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                                Rejoignez plus de 50,000 entreprises qui
                                optimisent leurs files d&apos;attente avec Q-App
                            </p>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full mt-8"></div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="p-8 md:p-12 space-y-12"
                    >
                        {/* Section Informations personnelles */}
                        <div className="group">
                            <div className="flex items-center mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mr-4 shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                    <UsersIcon className="w-7 h-7 text-blue-900" />
                                </div>
                                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                                    Informations personnelles
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="fullName"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Nom complet *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="fullName"
                                            name="name"
                                            placeholder="Votre nom complet"
                                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Adresse email *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            name="email"
                                            placeholder="votre@email.com"
                                            type="email"
                                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Informations entreprise */}
                        <div className="group">
                            <div className="flex items-center mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center mr-4 shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                    <BuildingIcon className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                                    Informations entreprise
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="entrepriseName"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        Nom de l&apos;entreprise *
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="entrepriseName"
                                            name="entreprise_name"
                                            placeholder="Nom de votre entreprise"
                                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                            required
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="entrepriseCategorie"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                        Catégorie d&apos;entreprise *
                                    </label>
                                    {loadingCategories ? (
                                        <div className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl bg-gray-100 text-gray-500 text-lg flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                                            Chargement des catégories...
                                        </div>
                                    ) : errorCategories ? (
                                        <div className="w-full px-6 py-4 border-2 border-red-200 rounded-2xl bg-red-50 text-red-600 text-lg flex items-center">
                                            <svg
                                                className="w-5 h-5 mr-3"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errorCategories}
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <select
                                                id="entrepriseCategorie"
                                                name="entreprise_categorie"
                                                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 appearance-none cursor-pointer shadow-sm focus:shadow-md"
                                                required
                                            >
                                                <option
                                                    value=""
                                                    className="text-gray-500"
                                                >
                                                    Sélectionnez une catégorie
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category}
                                                        value={category}
                                                        className="text-gray-800 py-2"
                                                    >
                                                        {category}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* Icône personnalisée de dropdown */}
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label
                                        htmlFor="entrepriseDescription"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Description de l&apos;entreprise
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="entrepriseDescription"
                                            required
                                            name="entreprise_description"
                                            placeholder="Décrivez votre entreprise et ses activités"
                                            rows={4}
                                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 resize-none text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                        />
                                        <div className="absolute top-4 left-4 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="entrepriseAddress"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Adresse
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="entrepriseAddress"
                                            required
                                            name="entreprise_adress"
                                            placeholder="Adresse de l'entreprise"
                                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="countrySelect"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Pays *
                                    </label>
                                    <Select
                                        inputId="countrySelect"
                                        options={countries.map((c) => ({
                                            value: c.code,
                                            label: (
                                                <div className="flex items-center py-1">
                                                    <img
                                                        src={c.flag}
                                                        alt={c.name}
                                                        className="w-6 h-4 mr-3 rounded-sm shadow-sm"
                                                    />
                                                    <span className="text-gray-800 font-medium">
                                                        {c.name}
                                                    </span>
                                                    <span className="text-gray-500 ml-2 text-sm">
                                                        ({c.phoneCode})
                                                    </span>
                                                </div>
                                            ),
                                            country: c,
                                        }))}
                                        onChange={(selected) =>
                                            setSelectedCountry(
                                                selected?.country || null
                                            )
                                        }
                                        placeholder={
                                            <div className="flex items-center text-gray-500">
                                                <svg
                                                    className="w-5 h-5 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Sélectionnez un pays
                                            </div>
                                        }
                                        className="text-left"
                                        classNamePrefix="react-select"
                                        isSearchable={true}
                                        styles={{
                                            control: (base, state) => ({
                                                ...base,
                                                minHeight: "60px",
                                                padding: "4px 8px",
                                                border: state.isFocused
                                                    ? "2px solid #3b82f6"
                                                    : "2px solid #e5e7eb",
                                                borderRadius: "16px",
                                                fontSize: "18px",
                                                backgroundColor: state.isFocused
                                                    ? "white"
                                                    : "#f9fafb",
                                                boxShadow: state.isFocused
                                                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                                    : "none",
                                                transition: "all 0.3s ease",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    borderColor: state.isFocused
                                                        ? "#3b82f6"
                                                        : "#d1d5db",
                                                    backgroundColor:
                                                        state.isFocused
                                                            ? "white"
                                                            : "#f3f4f6",
                                                },
                                            }),
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#9ca3af",
                                                fontSize: "18px",
                                                fontWeight: "500",
                                            }),
                                            input: (base) => ({
                                                ...base,
                                                color: "#111827", // gray-900
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                borderRadius: "16px",
                                                border: "2px solid #e5e7eb",
                                                boxShadow:
                                                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                                overflow: "hidden",
                                                zIndex: 50,
                                            }),
                                            menuList: (base) => ({
                                                ...base,
                                                padding: "8px",
                                                maxHeight: "300px",
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                padding: "12px 16px",
                                                borderRadius: "12px",
                                                margin: "2px 0",
                                                backgroundColor:
                                                    state.isSelected
                                                        ? "#3b82f6"
                                                        : state.isFocused
                                                        ? "#eff6ff"
                                                        : "transparent",
                                                color: state.isSelected
                                                    ? "white"
                                                    : "#374151",
                                                cursor: "pointer",
                                                fontSize: "16px",
                                                transition: "all 0.2s ease",
                                                "&:active": {
                                                    backgroundColor:
                                                        state.isSelected
                                                            ? "#2563eb"
                                                            : "#dbeafe",
                                                },
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                color: "#374151",
                                                fontSize: "18px",
                                            }),
                                            dropdownIndicator: (
                                                base,
                                                state
                                            ) => ({
                                                ...base,
                                                color: state.isFocused
                                                    ? "#3b82f6"
                                                    : "#9ca3af",
                                                transition: "all 0.3s ease",
                                                transform: state.selectProps
                                                    .menuIsOpen
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
                                            }),
                                            indicatorSeparator: () => ({
                                                display: "none",
                                            }),
                                        }}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="entrepriseContact"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        Contact *
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="w-1/3">
                                            <div className="relative">
                                                <input
                                                    value={
                                                        selectedCountry?.phoneCode ||
                                                        ""
                                                    }
                                                    readOnly
                                                    placeholder="+33"
                                                    className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl bg-gray-100 text-gray-700 text-lg text-center font-semibold"
                                                />
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                    <svg
                                                        className="w-5 h-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input
                                                    id="entrepriseContact"
                                                    name="entreprise_contact"
                                                    placeholder="Numéro de téléphone"
                                                    value={phoneNumber}
                                                    onChange={(e) =>
                                                        setPhoneNumber(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                                    required
                                                />
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                    <svg
                                                        className="w-5 h-5 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="entrepriseWebsite"
                                        className="text-sm font-bold text-gray-800 mb-3 flex items-center"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                                            />
                                        </svg>
                                        Site web
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="entrepriseWebsite"
                                            name="entreprise_website"
                                            placeholder="https://votre-site.com"
                                            required
                                            className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-lg text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                        />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <svg
                                                className="w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Documents */}
                        <div className="group">
                            <div className="flex items-center mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mr-4 shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                    <ShieldIcon className="w-7 h-7 text-blue-900" />
                                </div>
                                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                                    Documents
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="logoFile"
                                        className="block text-sm font-bold text-gray-800 mb-3"
                                    >
                                        Logo de l&apos;entreprise
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="logoFile"
                                            required
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleFileChange(e, setLogo);
                                                const f = e.target.files?.[0];
                                                setLogoFileName(
                                                    f ? f.name : ""
                                                );
                                            }}
                                            className={`w-full px-6 py-4 border-2 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors ${
                                                logoFileName
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200"
                                            }`}
                                        />
                                        <div className="mt-2 flex items-center text-sm text-gray-700">
                                            <svg
                                                className="w-4 h-4 mr-2 text-blue-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                            >
                                                <path d="M8 2a1 1 0 00-1 1v2H5a2 2 0 00-2 2v7a2 2 0 002 2h6a2 2 0 002-2v-2h2a1 1 0 001-1V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0012.586 3H11V3a1 1 0 00-1-1H8zM11 5h1.586L15 7.414V9h-4V5z" />
                                            </svg>
                                            <span
                                                className="truncate max-w-full"
                                                aria-live="polite"
                                            >
                                                {logoFileName
                                                    ? logoFileName
                                                    : "Aucun fichier sélectionné"}
                                            </span>
                                            {logoFileName && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                    Sélectionné
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="docFile"
                                        className="block text-sm font-bold text-gray-800 mb-3"
                                    >
                                        Document d&apos;enregistrement
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="docFile"
                                            required
                                            type="file"
                                            accept=".pdf,.png,.jpg"
                                            onChange={(e) => {
                                                handleFileChange(e, setDoc);
                                                const f = e.target.files?.[0];
                                                setDocFileName(f ? f.name : "");
                                            }}
                                            className={`w-full px-6 py-4 border-2 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors ${
                                                docFileName
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200"
                                            }`}
                                        />
                                        <div className="mt-2 flex items-center text-sm text-gray-700">
                                            <svg
                                                className="w-4 h-4 mr-2 text-blue-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                            >
                                                <path d="M8 2a1 1 0 00-1 1v2H5a2 2 0 00-2 2v7a2 2 0 002 2h6a2 2 0 002-2v-2h2a1 1 0 001-1V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0012.586 3H11V3a1 1 0 00-1-1H8zM11 5h1.586L15 7.414V9h-4V5z" />
                                            </svg>
                                            <span
                                                className="truncate max-w-full"
                                                aria-live="polite"
                                            >
                                                {docFileName
                                                    ? docFileName
                                                    : "Aucun fichier sélectionné"}
                                            </span>
                                            {docFileName && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                    Sélectionné
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="carteFile"
                                        className="block text-sm font-bold text-gray-800 mb-3"
                                    >
                                        Carte professionnelle
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="carteFile"
                                            required
                                            type="file"
                                            accept=".pdf,.png,.jpg"
                                            onChange={(e) => {
                                                handleFileChange(e, setCarte);
                                                const f = e.target.files?.[0];
                                                setCarteFileName(
                                                    f ? f.name : ""
                                                );
                                            }}
                                            className={`w-full px-6 py-4 border-2 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all duration-300 bg-gray-50 focus:bg-white hover:border-gray-300 text-gray-900 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors ${
                                                carteFileName
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200"
                                            }`}
                                        />
                                        <div className="mt-2 flex items-center text-sm text-gray-700">
                                            <svg
                                                className="w-4 h-4 mr-2 text-blue-600"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                aria-hidden="true"
                                            >
                                                <path d="M8 2a1 1 0 00-1 1v2H5a2 2 0 00-2 2v7a2 2 0 002 2h6a2 2 0 002-2v-2h2a1 1 0 001-1V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0012.586 3H11V3a1 1 0 00-1-1H8zM11 5h1.586L15 7.414V9h-4V5z" />
                                            </svg>
                                            <span
                                                className="truncate max-w-full"
                                                aria-live="polite"
                                            >
                                                {carteFileName
                                                    ? carteFileName
                                                    : "Aucun fichier sélectionné"}
                                            </span>
                                            {carteFileName && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                                    Sélectionné
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Structure organisationnelle */}
                        <div className="group">
                            <div className="flex items-center mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center mr-4 shadow-lg group-hover:rotate-3 transition-transform duration-500">
                                    <DevicesIcon className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                                    Structure organisationnelle
                                </h2>
                            </div>

                            {/* Toggle pour choisir le mode */}
                            {/* <div className="mb-10 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-yellow-50 border-2 border-yellow-400/30 shadow-lg">
                                <div className="flex items-start space-x-6">
                                    <input
                                        type="checkbox"
                                        id="noAgency"
                                        checked={noAgency}
                                        onChange={(e) => {
                                            setNoAgency(e.target.checked);
                                            if (e.target.checked) {
                                                setAgences([]);
                                                setAgenceInput({
                                                    name: "",
                                                    adresse: "",
                                                    contact: "",
                                                    temps_attente_moyen: 0,
                                                    services: [],
                                                });
                                            } else {
                                                setDirectServices([]);
                                            }
                                            setServiceInput({
                                                name: "",
                                                description: "",
                                            });
                                        }}
                                        className="w-6 h-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 mt-1 transition-all duration-300"
                                    />
                                    <div>
                                        <label
                                            htmlFor="noAgency"
                                            className="block text-xl font-bold text-gray-800 cursor-pointer mb-2"
                                        >
                                            Structure simplifiée
                                        </label>
                                        <p className="text-gray-700 leading-relaxed">
                                            Cochez cette case si vous n'avez pas
                                            d'agences multiples et souhaitez
                                            créer uniquement des services
                                        </p>
                                    </div>
                                </div>
                            </div> */}

                            {/* Mode Agences */}
                            {!noAgency && (
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-100">
                                        <h3 className="text-xl font-bold mb-6 text-[#005DA0]">
                                            Créer une nouvelle agence
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="agenceName"
                                                    className="block text-sm font-semibold text-gray-700"
                                                >
                                                    Nom de l&apos;agence *
                                                </label>
                                                <input
                                                    id="agenceName"
                                                    placeholder="Nom de l'agence"
                                                    value={agenceInput.name}
                                                    onChange={(e) =>
                                                        setAgenceInput({
                                                            ...agenceInput,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white text-gray-900 placeholder-gray-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="agenceAdresse"
                                                    className="block text-sm font-semibold text-gray-700"
                                                >
                                                    Adresse
                                                </label>
                                                <input
                                                    id="agenceAdresse"
                                                    placeholder="Adresse de l'agence"
                                                    value={agenceInput.adresse}
                                                    onChange={(e) =>
                                                        setAgenceInput({
                                                            ...agenceInput,
                                                            adresse:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white text-gray-900 placeholder-gray-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="agenceContact"
                                                    className="block text-sm font-semibold text-gray-700"
                                                >
                                                    Contact
                                                </label>
                                                <input
                                                    id="agenceContact"
                                                    placeholder="Contact de l'agence"
                                                    value={agenceInput.contact}
                                                    onChange={(e) =>
                                                        setAgenceInput({
                                                            ...agenceInput,
                                                            contact:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white text-gray-900 placeholder-gray-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="agenceWait"
                                                    className="block text-sm font-semibold text-gray-700"
                                                >
                                                    Temps d&apos;attente moyen
                                                    (minutes)
                                                </label>
                                                <input
                                                    id="agenceWait"
                                                    type="number"
                                                    placeholder="0"
                                                    min={0}
                                                    value={
                                                        agenceInput.temps_attente_moyen
                                                    }
                                                    onChange={(e) =>
                                                        setAgenceInput({
                                                            ...agenceInput,
                                                            temps_attente_moyen:
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white text-gray-900 placeholder-gray-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Services pour cette agence */}
                                        <div className="bg-white p-6 rounded-xl border-2 border-gray-100">
                                            <h4 className="text-lg font-semibold mb-4 text-[#005DA0]">
                                                Services de cette agence
                                            </h4>

                                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                                <input
                                                    placeholder="Nom du service *"
                                                    value={serviceInput.name}
                                                    onChange={(e) =>
                                                        setServiceInput({
                                                            ...serviceInput,
                                                            name: e.target
                                                                .value,
                                                        })
                                                    }
                                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                                                />
                                                <input
                                                    placeholder="Description du service"
                                                    value={
                                                        serviceInput.description
                                                    }
                                                    onChange={(e) =>
                                                        setServiceInput({
                                                            ...serviceInput,
                                                            description:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddService}
                                                    disabled={
                                                        !serviceInput.name.trim()
                                                    }
                                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                                                        serviceInput.name.trim()
                                                            ? "bg-[#E8FF18] text-[#005DA0]"
                                                            : "bg-gray-100 text-gray-400"
                                                    }`}
                                                >
                                                    Ajouter
                                                </button>
                                            </div>

                                            {/* Liste des services de l'agence */}
                                            <div className="space-y-3">
                                                {agenceInput.services.length >
                                                0 ? (
                                                    <div className="space-y-2">
                                                        <h5 className="font-medium text-gray-700">
                                                            Services ajoutés :
                                                        </h5>
                                                        {agenceInput.services.map(
                                                            (srv, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
                                                                >
                                                                    <div>
                                                                        <span className="font-semibold text-gray-800">
                                                                            {
                                                                                srv.name
                                                                            }
                                                                        </span>
                                                                        {srv.description && (
                                                                            <p className="text-sm text-gray-600 mt-1">
                                                                                {
                                                                                    srv.description
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setAgenceInput(
                                                                                {
                                                                                    ...agenceInput,
                                                                                    services:
                                                                                        agenceInput.services.filter(
                                                                                            (
                                                                                                _,
                                                                                                i
                                                                                            ) =>
                                                                                                i !==
                                                                                                idx
                                                                                        ),
                                                                                }
                                                                            );
                                                                        }}
                                                                        className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors duration-300 flex items-center justify-center"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <svg
                                                            width="48"
                                                            height="48"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mx-auto mb-3 opacity-50"
                                                        >
                                                            <path
                                                                d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                                                                fill="currentColor"
                                                            />
                                                        </svg>
                                                        <p>
                                                            Aucun service ajouté
                                                            pour cette agence
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddAgence}
                                            disabled={!agenceFormValid}
                                            className={`w-full mt-6 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl ${
                                                agenceFormValid
                                                    ? "bg-[#005DA0] text-white"
                                                    : "bg-gray-100 text-gray-400"
                                            }`}
                                        >
                                            Ajouter cette agence
                                        </button>
                                    </div>

                                    {/* Liste des agences créées */}
                                    {agences.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-[#005DA0]">
                                                Agences enregistrées (
                                                {agences.length})
                                            </h3>
                                            <div className="grid gap-4">
                                                {agences.map((ag, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-white p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 border-[#E8FF18]"
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-bold text-[#005DA0]">
                                                                    {ag.name}
                                                                </h4>
                                                                <div className="space-y-1 text-sm text-gray-600 mt-2">
                                                                    {ag.adresse && (
                                                                        <p>
                                                                            <span className="font-medium">
                                                                                Adresse:
                                                                            </span>{" "}
                                                                            {
                                                                                ag.adresse
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    {ag.contact && (
                                                                        <p>
                                                                            <span className="font-medium">
                                                                                Contact:
                                                                            </span>{" "}
                                                                            {
                                                                                ag.contact
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    <p>
                                                                        <span className="font-medium">
                                                                            Temps
                                                                            d&apos;attente
                                                                            moyen:
                                                                        </span>{" "}
                                                                        {
                                                                            ag.temps_attente_moyen
                                                                        }{" "}
                                                                        min
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveAgence(
                                                                        idx
                                                                    )
                                                                }
                                                                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors duration-300 flex items-center justify-center ml-4"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>

                                                        <div className="border-t pt-4">
                                                            <h5 className="font-semibold text-gray-700 mb-3">
                                                                Services (
                                                                {
                                                                    ag.services
                                                                        .length
                                                                }
                                                                ) :
                                                            </h5>
                                                            <div className="grid gap-2">
                                                                {ag.services.map(
                                                                    (
                                                                        srv,
                                                                        sIdx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                sIdx
                                                                            }
                                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                                        >
                                                                            <div>
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        srv.name
                                                                                    }
                                                                                </span>
                                                                                {srv.description && (
                                                                                    <p className="text-xs text-gray-600 mt-1">
                                                                                        {
                                                                                            srv.description
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleRemoveAgenceService(
                                                                                        idx,
                                                                                        sIdx
                                                                                    )
                                                                                }
                                                                                className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold transition-colors duration-300 flex items-center justify-center"
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {agences.length === 0 && (
                                        <div className="text-center py-12 px-6 rounded-2xl bg-[#fff3cd] border-2 border-[#ffeaa7]">
                                            <svg
                                                width="64"
                                                height="64"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="mx-auto mb-4 opacity-60"
                                            >
                                                <path
                                                    d="M12 9V2L13.09 4.26L16 2L14.74 5.13L18 5.13L15.26 7.87L19 9L15.26 10.13L18 12.87L14.74 12.87L16 16L13.09 13.74L12 16V9Z"
                                                    fill="#856404"
                                                />
                                                <path
                                                    d="M11 9V16L9.91 13.74L7 16L8.26 12.87L5 12.87L7.74 10.13L4 9L7.74 7.87L5 5.13L8.26 5.13L7 2L9.91 4.26L11 2V9Z"
                                                    fill="#856404"
                                                />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                                Aucune agence configurée
                                            </h3>
                                            <p className="text-yellow-700">
                                                Veuillez ajouter au moins une
                                                agence avec ses services pour
                                                continuer.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mode Services directs */}
                            {noAgency && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-2xl border-2 border-[#E8FF18]">
                                        <h3 className="text-xl font-bold mb-6 text-[#005DA0]">
                                            Ajouter un service
                                        </h3>

                                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                                            <input
                                                placeholder="Nom du service *"
                                                value={serviceInput.name}
                                                onChange={(e) =>
                                                    setServiceInput({
                                                        ...serviceInput,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white text-gray-900 placeholder-gray-500"
                                            />
                                            <input
                                                placeholder="Description du service"
                                                value={serviceInput.description}
                                                onChange={(e) =>
                                                    setServiceInput({
                                                        ...serviceInput,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white text-gray-900 placeholder-gray-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddDirectService}
                                                disabled={
                                                    !serviceInput.name.trim()
                                                }
                                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                                                    serviceInput.name.trim()
                                                        ? "bg-[#005DA0] text-white"
                                                        : "bg-gray-100 text-gray-400"
                                                }`}
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>

                                    {/* Liste des services directs */}
                                    {directServices.length > 0 ? (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold text-[#005DA0]">
                                                Services enregistrés (
                                                {directServices.length})
                                            </h3>
                                            <div className="grid gap-3">
                                                {directServices.map(
                                                    (srv, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center justify-between p-4 bg-white rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-300 border-[#E8FF18]"
                                                        >
                                                            <div>
                                                                <h4 className="font-semibold text-gray-800">
                                                                    {srv.name}
                                                                </h4>
                                                                {srv.description && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {
                                                                            srv.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveDirectService(
                                                                        idx
                                                                    )
                                                                }
                                                                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors duration-300 flex items-center justify-center"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 px-6 rounded-2xl bg-[#fff3cd] border-2 border-[#ffeaa7]">
                                            <svg
                                                width="64"
                                                height="64"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="mx-auto mb-4 opacity-60"
                                            >
                                                <path
                                                    d="M12 9V2L13.09 4.26L16 2L14.74 5.13L18 5.13L15.26 7.87L19 9L15.26 10.13L18 12.87L14.74 12.87L16 16L13.09 13.74L12 16V9Z"
                                                    fill="#856404"
                                                />
                                                <path
                                                    d="M11 9V16L9.91 13.74L7 16L8.26 12.87L5 12.87L7.74 10.13L4 9L7.74 7.87L5 5.13L8.26 5.13L7 2L9.91 4.26L11 2V9Z"
                                                    fill="#856404"
                                                />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                                Aucun service configuré
                                            </h3>
                                            <p className="text-yellow-700">
                                                Veuillez ajouter au moins un
                                                service pour continuer.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bouton de soumission */}
                        <div className="text-center pt-12 border-t-2 border-gray-100">
                            <div className="mb-8">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-4">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                                    <span className="text-sm font-semibold text-green-700">
                                        Prêt à révolutionner vos files
                                        d&apos;attente ?
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!canSubmitForm() || isSubmitting || isRedirecting}
                                className={`group relative px-16 py-5 rounded-2xl text-xl font-black transition-all duration-300 transform shadow-2xl ${
                                    canSubmitForm()
                                        ? "bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:scale-105 hover:shadow-blue-900/25"
                                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            >
                                {isSubmitting || isRedirecting ? (
                                    <>
                                        <span className="opacity-0">
                                            Créer mon compte entreprise
                                        </span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-white mr-3"></div>
                                            <span className="text-white font-bold">
                                                {isRedirecting ? "Redirection..." : "Création en cours..."}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <span>
                                            {canSubmitForm()
                                                ? "Créer mon compte entreprise"
                                                : "Veuillez compléter la configuration"}
                                        </span>
                                        {canSubmitForm() && (
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
                                        )}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            {canSubmitForm() && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        🛡️ En créant votre compte, vous acceptez
                                        nos conditions d&apos;utilisation et
                                        notre politique de confidentialité.
                                        <br />✅ Vos données sont sécurisées
                                        avec un chiffrement de niveau bancaire.
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
