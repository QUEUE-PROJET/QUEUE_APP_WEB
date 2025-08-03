import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import Select from 'react-select';
import { countries } from "~/components/countries";
import { getEnterpriseCategories, registerEnterpriseAgentBase64 } from "~/utils/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState("");
  const [doc, setDoc] = useState("");
  const [carte, setCarte] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestion agences et services
  const [agences, setAgences] = useState<any[]>([]);
  const [agenceInput, setAgenceInput] = useState({
    name: "",
    adresse: "",
    contact: "",
    temps_attente_moyen: 0,
    services: [] as { name: string; description: string }[],
  });
  const [serviceInput, setServiceInput] = useState({ name: "", description: "" });

  // Services "directs" sans agences
  const [directServices, setDirectServices] = useState<{ name: string; description: string }[]>([]);

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
    const isValid = agenceInput.name.trim() !== "" && agenceInput.services.length > 0;
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

  const handleRemoveAgenceService = (agenceIndex: number, serviceIndex: number) => {
    const updatedAgences = [...agences];
    updatedAgences[agenceIndex].services = updatedAgences[agenceIndex].services.filter(
      (_, i) => i !== serviceIndex
    );
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

    const payload: any = {
      name: formData.get("name") as string,
      email: email,
      entreprise_name: formData.get("entreprise_name") as string,
      entreprise_description: formData.get("entreprise_description") as string,
      entreprise_adress: formData.get("entreprise_adress") as string,
      entreprise_contact: selectedCountry ? `${selectedCountry.phoneCode}${phoneNumber}` : phoneNumber,
      entreprise_country: selectedCountry?.name || "",
      entreprise_website: formData.get("entreprise_website") as string,
      entreprise_categorie: formData.get("entreprise_categorie") as string,
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

      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(payload.email)}`);
      }, 0);

    } catch (err: any) {
      let errorMessage = "Une erreur est survenue";
      if (err.response) {
        const apiError = await err.response.json();
        errorMessage = apiError.message || JSON.stringify(apiError);
      } else if (err.message) {
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
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f8ff 0%, #f8ffeb 50%, #e6f3ff 100%)" }}>
      {/* Header avec le logo */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl mr-3 shadow-sm flex items-center justify-center" style={{ backgroundColor: "#005DA0" }}>
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: "#005DA0" }}>Q-App</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* En-tête du formulaire */}
          <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(135deg, #005DA0 0%, #3395E8 100%)" }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Créez votre compte entreprise
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Rejoignez des milliers d'entreprises qui optimisent leurs files d'attente avec Q-App
            </p>
            <div className="w-24 h-1 mx-auto mt-6" style={{ backgroundColor: "#E8FF18" }}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {/* Section Informations personnelles */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: "#E8FF18" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#005DA0" />
                    <path d="M12 14C8.13401 14 5 17.134 5 21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21C19 17.134 15.866 14 12 14Z" fill="#005DA0" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "#005DA0" }}>Informations personnelles</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    name="name"
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email *
                  </label>
                  <input
                    name="email"
                    placeholder="votre@email.com"
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section Informations entreprise */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: "#005DA0" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21V19H20V7.5C20 6.67157 19.3284 6 18.5 6H17V4.5C17 3.67157 16.3284 3 15.5 3H8.5C7.67157 3 7 3.67157 7 4.5V6H5.5C4.67157 6 4 6.67157 4 7.5V19H3V21ZM9 5H15V6H9V5ZM6 8H18V19H16V13.5C16 12.6716 15.3284 12 14.5 12H9.5C8.67157 12 8 12.6716 8 13.5V19H6V8ZM10 14H14V19H10V14Z" fill="#E8FF18" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "#005DA0" }}>Informations entreprise</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    name="entreprise_name"
                    placeholder="Nom de votre entreprise"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie d'entreprise *
                  </label>
                  {loadingCategories ? (
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500">
                      Chargement des catégories...
                    </div>
                  ) : errorCategories ? (
                    <div className="w-full px-4 py-3 border-2 border-red-200 rounded-xl bg-red-50 text-red-600">
                      {errorCategories}
                    </div>
                  ) : (
                    <select
                      name="entreprise_categorie"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description de l'entreprise
                  </label>
                  <textarea
                    required
                    name="entreprise_description"
                    placeholder="Décrivez votre entreprise et ses activités"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    required
                    name="entreprise_adress"
                    placeholder="Adresse de l'entreprise"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pays *
                  </label>
                  <Select
                    options={countries.map(c => ({
                      value: c.code,
                      label: (
                        <div className="flex items-center">
                          <img src={c.flag} alt={c.name} className="w-6 h-4 mr-2" />
                          <span>{c.name} ({c.phoneCode})</span>
                        </div>
                      ),
                      country: c
                    }))}
                    onChange={(selected) => setSelectedCountry(selected?.country || null)}
                    placeholder="Sélectionnez un pays"
                    className="text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact *
                  </label>
                  <div className="flex">
                    <div className="w-1/3 mr-2">
                      <input
                        value={selectedCountry?.phoneCode || ""}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-700"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        name="entreprise_contact"
                        placeholder="Numéro de téléphone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    name="entreprise_website"
                    placeholder="https://votre-site.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section Documents */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: "#E8FF18" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L8.01 15H16V17H8V15.01ZM8 12.01L8.01 12H16V14H8V12.01ZM8 9.01L8.01 9H12V11H8V9.01Z" fill="#005DA0" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "#005DA0" }}>Documents </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo de l'entreprise
                  </label>
                  <div className="relative h-full">
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setLogo)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Document d'enregistrement
                  </label>
                  <div className="relative h-full">
                    <input
                      required
                      type="file"
                      accept=".pdf,.png,.jpg"
                      onChange={(e) => handleFileChange(e, setDoc)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Carte professionnelle
                  </label>
                  <div className="relative h-full">
                    <input
                      required
                      type="file"
                      accept=".pdf,.png,.jpg"
                      onChange={(e) => handleFileChange(e, setCarte)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Structure organisationnelle */}
            <div className="mb-12">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4" style={{ backgroundColor: "#005DA0" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H20V19ZM20 15H12V13H20V15ZM20 11H12V9H20V11Z" fill="#E8FF18" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold" style={{ color: "#005DA0" }}>Structure organisationnelle</h2>
              </div>

              {/* Toggle pour choisir le mode */}
              <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: "#f8fbff", border: "2px solid #E8FF18" }}>
                <div className="flex items-start space-x-4">
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
                      setServiceInput({ name: "", description: "" });
                    }}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 mt-1"
                  />
                  <div>
                    <label htmlFor="noAgency" className="block text-lg font-semibold text-gray-800 cursor-pointer">
                      Structure simplifiée
                    </label>
                    <p className="text-gray-600 mt-1">
                      Cochez cette case si vous n'avez pas d'agences multiples et souhaitez créer uniquement des services
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Agences */}
              {!noAgency && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-100">
                    <h3 className="text-xl font-bold mb-6" style={{ color: "#005DA0" }}>
                      Créer une nouvelle agence
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Nom de l'agence *
                        </label>
                        <input
                          placeholder="Nom de l'agence"
                          value={agenceInput.name}
                          onChange={(e) => setAgenceInput({ ...agenceInput, name: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Adresse
                        </label>
                        <input
                          placeholder="Adresse de l'agence"
                          value={agenceInput.adresse}
                          onChange={(e) => setAgenceInput({ ...agenceInput, adresse: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Contact
                        </label>
                        <input
                          placeholder="Contact de l'agence"
                          value={agenceInput.contact}
                          onChange={(e) => setAgenceInput({ ...agenceInput, contact: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Temps d'attente moyen (minutes)
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          min={0}
                          value={agenceInput.temps_attente_moyen}
                          onChange={(e) =>
                            setAgenceInput({ ...agenceInput, temps_attente_moyen: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white"
                        />
                      </div>
                    </div>

                    {/* Services pour cette agence */}
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-100">
                      <h4 className="text-lg font-semibold mb-4" style={{ color: "#005DA0" }}>
                        Services de cette agence
                      </h4>

                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input
                          placeholder="Nom du service *"
                          value={serviceInput.name}
                          onChange={(e) => setServiceInput({ ...serviceInput, name: e.target.value })}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                        />
                        <input
                          placeholder="Description du service"
                          value={serviceInput.description}
                          onChange={(e) => setServiceInput({ ...serviceInput, description: e.target.value })}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddService}
                          disabled={!serviceInput.name.trim()}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          style={{
                            backgroundColor: serviceInput.name.trim() ? "#E8FF18" : "#f3f4f6",
                            color: serviceInput.name.trim() ? "#005DA0" : "#9ca3af"
                          }}
                        >
                          Ajouter
                        </button>
                      </div>

                      {/* Liste des services de l'agence */}
                      <div className="space-y-3">
                        {agenceInput.services.length > 0 ? (
                          <div className="space-y-2">
                            <h5 className="font-medium text-gray-700">Services ajoutés :</h5>
                            {agenceInput.services.map((srv, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors">
                                <div>
                                  <span className="font-semibold text-gray-800">{srv.name}</span>
                                  {srv.description && <p className="text-sm text-gray-600 mt-1">{srv.description}</p>}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAgenceInput({
                                      ...agenceInput,
                                      services: agenceInput.services.filter((_, i) => i !== idx),
                                    });
                                  }}
                                  className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors duration-300 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 opacity-50">
                              <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                            </svg>
                            <p>Aucun service ajouté pour cette agence</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAgence}
                      disabled={!agenceFormValid}
                      className="w-full mt-6 px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                      style={{
                        backgroundColor: agenceFormValid ? "#005DA0" : "#f3f4f6",
                        color: agenceFormValid ? "white" : "#9ca3af"
                      }}
                    >
                      Ajouter cette agence
                    </button>
                  </div>

                  {/* Liste des agences créées */}
                  {agences.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold" style={{ color: "#005DA0" }}>
                        Agences enregistrées ({agences.length})
                      </h3>
                      <div className="grid gap-4">
                        {agences.map((ag, idx) => (
                          <div key={idx} className="bg-white p-6 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderColor: "#E8FF18" }}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-bold" style={{ color: "#005DA0" }}>{ag.name}</h4>
                                <div className="space-y-1 text-sm text-gray-600 mt-2">
                                  {ag.adresse && <p><span className="font-medium">Adresse:</span> {ag.adresse}</p>}
                                  {ag.contact && <p><span className="font-medium">Contact:</span> {ag.contact}</p>}
                                  <p><span className="font-medium">Temps d'attente moyen:</span> {ag.temps_attente_moyen} min</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveAgence(idx)}
                                className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors duration-300 flex items-center justify-center ml-4"
                              >
                                ×
                              </button>
                            </div>

                            <div className="border-t pt-4">
                              <h5 className="font-semibold text-gray-700 mb-3">Services ({ag.services.length}) :</h5>
                              <div className="grid gap-2">
                                {ag.services.map((srv, sIdx) => (
                                  <div key={sIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                      <span className="font-medium">{srv.name}</span>
                                      {srv.description && <p className="text-xs text-gray-600 mt-1">{srv.description}</p>}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAgenceService(idx, sIdx)}
                                      className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold transition-colors duration-300 flex items-center justify-center"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {agences.length === 0 && (
                    <div className="text-center py-12 px-6 rounded-2xl" style={{ backgroundColor: "#fff3cd", border: "2px solid #ffeaa7" }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 opacity-60">
                        <path d="M12 9V2L13.09 4.26L16 2L14.74 5.13L18 5.13L15.26 7.87L19 9L15.26 10.13L18 12.87L14.74 12.87L16 16L13.09 13.74L12 16V9Z" fill="#856404" />
                        <path d="M11 9V16L9.91 13.74L7 16L8.26 12.87L5 12.87L7.74 10.13L4 9L7.74 7.87L5 5.13L8.26 5.13L7 2L9.91 4.26L11 2V9Z" fill="#856404" />
                      </svg>
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Aucune agence configurée</h3>
                      <p className="text-yellow-700">Veuillez ajouter au moins une agence avec ses services pour continuer.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Mode Services directs */}
              {noAgency && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-8 rounded-2xl border-2" style={{ borderColor: "#E8FF18" }}>
                    <h3 className="text-xl font-bold mb-6" style={{ color: "#005DA0" }}>
                      Ajouter un service
                    </h3>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <input
                        placeholder="Nom du service *"
                        value={serviceInput.name}
                        onChange={(e) => setServiceInput({ ...serviceInput, name: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white"
                      />
                      <input
                        placeholder="Description du service"
                        value={serviceInput.description}
                        onChange={(e) => setServiceInput({ ...serviceInput, description: e.target.value })}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddDirectService}
                        disabled={!serviceInput.name.trim()}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                          backgroundColor: serviceInput.name.trim() ? "#005DA0" : "#f3f4f6",
                          color: serviceInput.name.trim() ? "white" : "#9ca3af"
                        }}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Liste des services directs */}
                  {directServices.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold" style={{ color: "#005DA0" }}>
                        Services enregistrés ({directServices.length})
                      </h3>
                      <div className="grid gap-3">
                        {directServices.map((srv, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-300" style={{ borderColor: "#E8FF18" }}>
                            <div>
                              <h4 className="font-semibold text-gray-800">{srv.name}</h4>
                              {srv.description && <p className="text-sm text-gray-600 mt-1">{srv.description}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDirectService(idx)}
                              className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors duration-300 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-6 rounded-2xl" style={{ backgroundColor: "#fff3cd", border: "2px solid #ffeaa7" }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 opacity-60">
                        <path d="M12 9V2L13.09 4.26L16 2L14.74 5.13L18 5.13L15.26 7.87L19 9L15.26 10.13L18 12.87L14.74 12.87L16 16L13.09 13.74L12 16V9Z" fill="#856404" />
                        <path d="M11 9V16L9.91 13.74L7 16L8.26 12.87L5 12.87L7.74 10.13L4 9L7.74 7.87L5 5.13L8.26 5.13L7 2L9.91 4.26L11 2V9Z" fill="#856404" />
                      </svg>
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">Aucun service configuré</h3>
                      <p className="text-yellow-700">Veuillez ajouter au moins un service pour continuer.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bouton de soumission */}
            <div className="text-center pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={!canSubmitForm() || isSubmitting}
                className="px-12 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl relative"
                style={{
                  backgroundColor: canSubmitForm() ? "#005DA0" : "#f3f4f6",
                  color: canSubmitForm() ? "white" : "#9ca3af"
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="opacity-0">Créer mon compte entreprise</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  </>
                ) : (
                  canSubmitForm() ? "Créer mon compte entreprise" : "Veuillez compléter la configuration"
                )}
              </button>

              {canSubmitForm() && (
                <p className="text-sm text-gray-600 mt-4">
                  En créant votre compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Vous avez déjà un compte ?
            <a href="/login" className="ml-2 font-semibold hover:underline transition-all duration-300" style={{ color: "#005DA0" }}>
              Connectez-vous ici
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}