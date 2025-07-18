// app/routes/register.tsx
import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";

// Types
interface PersonalInfo {
  name: string;
  email: string;
  password: string;
}

interface CompanyInfo {
  name: string;
  description: string;
  address: string;
  contact: string;
  country: string;
  website: string;
  category: string;
}

interface FileInfo {
  logo: File | null;
  registrationDoc: File | null;
  businessCard: File | null;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

interface Agency {
  id: string;
  name: string;
  address: string;
  contact: string;
  averageWaitTime: string;
  services: Service[];
}

interface FormData {
  personalInfo: PersonalInfo;
  companyInfo: CompanyInfo;
  files: FileInfo;
  agencies: Agency[];
}

const uploadHandler = unstable_createMemoryUploadHandler({
  maxPartSize: 5_000_000, // 5MB
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  
  // Ici vous pouvez traiter les données du formulaire
  // Par exemple, sauvegarder en base de données
  
  console.log("Données du formulaire reçues:", Object.fromEntries(formData));
  
  // Rediriger vers une page de succès
  return redirect("/success");
}

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    personalInfo: { name: "", email: "", password: "" },
    companyInfo: { name: "", description: "", address: "", contact: "", country: "", website: "", category: "" },
    files: { logo: null, registrationDoc: null, businessCard: null },
    agencies: []
  });

  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateCompanyInfo = (field: keyof CompanyInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [field]: value }
    }));
  };

  const updateFile = (field: keyof FileInfo, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [field]: file }
    }));
  };

  const addAgency = () => {
    const newAgency: Agency = {
      id: Date.now().toString(),
      name: "",
      address: "",
      contact: "",
      averageWaitTime: "",
      services: []
    };
    setFormData(prev => ({
      ...prev,
      agencies: [...prev.agencies, newAgency]
    }));
  };

  const removeAgency = (id: string) => {
    setFormData(prev => ({
      ...prev,
      agencies: prev.agencies.filter(agency => agency.id !== id)
    }));
  };

  const updateAgency = (id: string, field: keyof Omit<Agency, 'id' | 'services'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      agencies: prev.agencies.map(agency => 
        agency.id === id ? { ...agency, [field]: value } : agency
      )
    }));
  };

  const addService = (agencyId: string) => {
    const newService: Service = {
      id: Date.now().toString(),
      name: "",
      description: ""
    };
    setFormData(prev => ({
      ...prev,
      agencies: prev.agencies.map(agency => 
        agency.id === agencyId 
          ? { ...agency, services: [...agency.services, newService] }
          : agency
      )
    }));
  };

  const removeService = (agencyId: string, serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      agencies: prev.agencies.map(agency => 
        agency.id === agencyId 
          ? { ...agency, services: agency.services.filter(service => service.id !== serviceId) }
          : agency
      )
    }));
  };

  const updateService = (agencyId: string, serviceId: string, field: keyof Omit<Service, 'id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      agencies: prev.agencies.map(agency => 
        agency.id === agencyId 
          ? {
              ...agency,
              services: agency.services.map(service => 
                service.id === serviceId ? { ...service, [field]: value } : service
              )
            }
          : agency
      )
    }));
  };

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validation pour l'étape 1
  const isStep1Valid = () => {
    const { name, email, password } = formData.personalInfo;
    return name.trim() !== "" && email.trim() !== "" && password.trim() !== "";
  };

  // Validation pour l'étape 2 (website est optionnel)
  const isStep2Valid = () => {
    const { name, description, address, contact, country, category } = formData.companyInfo;
    return name.trim() !== "" && description.trim() !== "" && address.trim() !== "" && 
           contact.trim() !== "" && country.trim() !== "" && category.trim() !== "";
  };

  // Validation pour l'étape 3 (les fichiers sont optionnels)
  const isStep3Valid = () => {
    // L'étape 3 est toujours valide car tous les fichiers sont optionnels
    return true;
  };

  const canProceedToNext = () => {
  // Préparer les données pour la soumission finale
  const prepareFormDataForSubmission = () => {
    const submitData = new FormData();
    
    // Ajouter les informations personnelles
    submitData.append('personalInfo', JSON.stringify(formData.personalInfo));
    
    // Ajouter les informations de l'entreprise
    submitData.append('companyInfo', JSON.stringify(formData.companyInfo));
    
    // Ajouter les fichiers
    if (formData.files.logo) {
      submitData.append('logo', formData.files.logo);
    }
    if (formData.files.registrationDoc) {
      submitData.append('registrationDoc', formData.files.registrationDoc);
    }
    if (formData.files.businessCard) {
      submitData.append('businessCard', formData.files.businessCard);
    }
    
    // Ajouter les agences
    submitData.append('agencies', JSON.stringify(formData.agencies));
    
    return submitData;
  };
    switch(currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.personalInfo.password}
            onChange={(e) => updatePersonalInfo('password', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Informations entreprise</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Nom de l'entreprise <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyInfo.name}
            onChange={(e) => updateCompanyInfo('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.companyInfo.category}
            onChange={(e) => updateCompanyInfo('category', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="restaurant">Restaurant</option>
            <option value="banque">Banque</option>
            <option value="assurance">Assurance</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.companyInfo.description}
            onChange={(e) => updateCompanyInfo('description', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.companyInfo.address}
            onChange={(e) => updateCompanyInfo('address', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.companyInfo.contact}
            onChange={(e) => updateCompanyInfo('contact', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Pays <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.companyInfo.country}
            onChange={(e) => updateCompanyInfo('country', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Site web
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.companyInfo.website}
            onChange={(e) => updateCompanyInfo('website', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Gestion des fichiers</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            📷 Logo de l'entreprise
          </label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={(e) => updateFile('logo', e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label htmlFor="registrationDoc" className="block text-sm font-medium text-gray-700">
            📄 Document d'enregistrement
          </label>
          <input
            type="file"
            id="registrationDoc"
            name="registrationDoc"
            accept=".pdf,.doc,.docx"
            onChange={(e) => updateFile('registrationDoc', e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label htmlFor="businessCard" className="block text-sm font-medium text-gray-700">
            💳 Carte professionnelle
          </label>
          <input
            type="file"
            id="businessCard"
            name="businessCard"
            accept="image/*,.pdf"
            onChange={(e) => updateFile('businessCard', e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">Fichiers sélectionnés :</h3>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>Logo: {formData.files.logo?.name || "Aucun fichier"}</li>
          <li>Document d'enregistrement: {formData.files.registrationDoc?.name || "Aucun fichier"}</li>
          <li>Carte professionnelle: {formData.files.businessCard?.name || "Aucun fichier"}</li>
        </ul>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des agences</h2>
        <button
          type="button"
          onClick={addAgency}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          + Ajouter une agence
        </button>
      </div>

      {formData.agencies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune agence ajoutée. Cliquez sur "Ajouter une agence" pour commencer.
        </div>
      ) : (
        <div className="space-y-6">
          {formData.agencies.map((agency) => (
            <div key={agency.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Agence</h3>
                <button
                  type="button"
                  onClick={() => removeAgency(agency.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕ Supprimer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom de l'agence
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Agence Lomé"
                    value={agency.name}
                    onChange={(e) => updateAgency(agency.id, 'name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Adresse de l'agence"
                    value={agency.address}
                    onChange={(e) => updateAgency(agency.id, 'address', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Contact Agence"
                    value={agency.contact}
                    onChange={(e) => updateAgency(agency.id, 'contact', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Temps d'attente moyen
                  </label>
                  <input
                    type="text"
                    value={agency.averageWaitTime}
                    onChange={(e) => updateAgency(agency.id, 'averageWaitTime', e.target.value)}
                    placeholder="ex: 15 minutes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-medium text-gray-800">Services</h4>
                  <button
                    type="button"
                    onClick={() => addService(agency.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    + Ajouter un service
                  </button>
                </div>

                {agency.services.map((service) => (
                  <div key={service.id} className="bg-gray-50 p-3 rounded mb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(agency.id, service.id, 'name', e.target.value)}
                          placeholder="Nom du service"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={service.description}
                          onChange={(e) => updateService(agency.id, service.id, 'description', e.target.value)}
                          placeholder="Description du service"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeService(agency.id, service.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? 'bg-blue-600 text-white'
                : step < currentStep
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );

  return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        {renderStepIndicator()}
        
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-md font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Précédent
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className={`px-6 py-2 rounded-md font-medium ${
                !canProceedToNext()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Suivant
            </button>
          ) : (
            <Form method="post" encType="multipart/form-data">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
              </button>
            </Form>
          )}
        </div>
      </div>
  );
}