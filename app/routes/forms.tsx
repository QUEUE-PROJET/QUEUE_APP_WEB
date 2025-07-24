// import {
//   json,
//   redirect,
//   unstable_createMemoryUploadHandler,
//   unstable_parseMultipartFormData,
//   type ActionFunctionArgs,
// } from "@remix-run/node";
// import {
//   Form,
//   useActionData,
//   useLoaderData,
//   useNavigation,
// } from "@remix-run/react";
// import { useState } from "react";
// import { getEnterpriseCategories, registerEnterpriseAgent } from "~/utils/api";

// export async function loader() {
//   try {
//     const categories = await getEnterpriseCategories();
//     return json({ 
//       ok: true,
//       categories 
//     });
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Erreur inconnue";
//     return json({ 
//       ok: false, 
//       message,
//       categories: ["BANQUE", "ASSURANCE", "RESTAURATION", "AUTRE"] // Fallback
//     });
//   }
// }

// interface PersonalInfo {
//   name: string;
//   email: string;
// }

// interface CompanyInfo {
//   name: string;
//   description: string;
//   address: string;
//   contact: string;
//   country: string;
//   website: string;
//   category: string;
// }

// interface FileInfo {
//   logo: File | null;
//   registrationDoc: File | null;
//   businessCard: File | null;
// }

// interface Service {
//   id: string;
//   name: string;
//   description: string;
// }

// interface Agency {
//   id: string;
//   name: string;
//   address: string;
//   contact: string;
//   averageWaitTime: string;
//   services: Service[];
// }

// interface FormDataType {
//   personalInfo: PersonalInfo;
//   companyInfo: CompanyInfo;
//   files: FileInfo;
//   agencies: Agency[];
// }

// const uploadHandler = unstable_createMemoryUploadHandler({
//   maxPartSize: 5_000_000,
// });

// export async function action({ request }: ActionFunctionArgs) {
//   const parsedForm = await unstable_parseMultipartFormData(request, uploadHandler);

//   const finalForm = new FormData();

//   let validCategories: string[] = [];
//   try {
//     validCategories = await getEnterpriseCategories();
//   } catch {
//     validCategories = ["BANQUE", "ASSURANCE", "RESTAURATION", "AUTRE"]; // Fallback
//   }


//   // Champs obligatoires
//   finalForm.append("name", parsedForm.get("name")?.toString() ?? "");
//   finalForm.append("email", parsedForm.get("email")?.toString() ?? "");

//   // Entreprise
//   finalForm.append("entreprise_name", parsedForm.get("entreprise_name")?.toString() ?? "");
//   finalForm.append("entreprise_description", parsedForm.get("entreprise_description")?.toString() ?? "");
//   finalForm.append("entreprise_adress", parsedForm.get("entreprise_adress")?.toString() ?? "");
//   finalForm.append("entreprise_contact", parsedForm.get("entreprise_contact")?.toString() ?? "");
//   finalForm.append("entreprise_country", parsedForm.get("entreprise_country")?.toString() ?? "");
//   finalForm.append("entreprise_website", parsedForm.get("entreprise_website")?.toString() ?? "");

//   // Correction de la catégorie
//   const categorie = parsedForm.get("entreprise_categorie")?.toString().toUpperCase() ?? "";
//    if (!validCategories.includes(categorie)) {
//     return json(
//       { error: `Catégorie entreprise invalide. Valeurs acceptées : ${validCategories.join(", ")}` },
//       { status: 400 }
//     );
//   }
//   finalForm.append("entreprise_categorie", categorie);

//   // Fichiers
//   const logo = parsedForm.get("entreprise_logo");
//   const doc = parsedForm.get("document_enregistrement");
//   const carte = parsedForm.get("carte_professionnelle");

//   if (logo instanceof File) finalForm.append("entreprise_logo", logo);
//   if (doc instanceof File) finalForm.append("document_enregistrement", doc);
//   if (carte instanceof File) finalForm.append("carte_professionnelle", carte);

//   // Agences
//   const agenciesData = parsedForm.get("agencies");
//   if (agenciesData) {
//     try {
//       const agencies = JSON.parse(agenciesData.toString());
//       agencies.forEach((agency: any, index: number) => {
//         finalForm.append(`agences[${index}][name]`, agency.name);
//         finalForm.append(`agences[${index}][adresse]`, agency.address);
//         finalForm.append(`agences[${index}][contact]`, agency.contact);
//         finalForm.append(`agences[${index}][temps_attente_moyen]`, agency.averageWaitTime);
        
//         agency.services.forEach((service: any, sIdx: number) => {
//           finalForm.append(`agences[${index}][services][${sIdx}][name]`, service.name);
//           finalForm.append(`agences[${index}][services][${sIdx}][description]`, service.description);
//         });
//       });
//     } catch (error) {
//       console.error("Erreur parsing agencies:", error);
//       throw new Error("Format des agences invalide");
//     }
//   }

//   try {
//     await registerEnterpriseAgent(finalForm);
//     return redirect("/dashboard");
//   } catch (error) {
//     console.error("Erreur lors de l'inscription:", error);
//     return json(
//       { error: error instanceof Error ? error.message : "Erreur inconnue" },
//       { status: 400 }
//     );
//   }
// }

// export default function RegisterForm() {
//   const loaderData = useLoaderData<typeof loader>();
//   const actionData = useActionData<{ error?: string }>();
//   const navigation = useNavigation();
//   const isSubmitting = navigation.state === "submitting";

//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<FormDataType>({
//     personalInfo: { name: "", email: "" },
//     companyInfo: {
//       name: "",
//       description: "",
//       address: "",
//       contact: "",
//       country: "",
//       website: "",
//       category: "",
//     },
//     files: { logo: null, registrationDoc: null, businessCard: null },
//     agencies: [],
//   });

//   // Fonctions de mise à jour
//   const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
//     setFormData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
//   };

//   const updateCompanyInfo = (field: keyof CompanyInfo, value: string) => {
//     setFormData(prev => ({ ...prev, companyInfo: { ...prev.companyInfo, [field]: value } }));
//   };

//   const updateFile = (field: keyof FileInfo, file: File | null) => {
//     setFormData(prev => ({ ...prev, files: { ...prev.files, [field]: file } }));
//   };

//   const addAgency = () => {
//     setFormData(prev => ({
//       ...prev,
//       agencies: [
//         ...prev.agencies,
//         {
//           id: Date.now().toString(),
//           name: "",
//           address: "",
//           contact: "",
//           averageWaitTime: "",
//           services: [],
//         },
//       ],
//     }));
//   };

//   const removeAgency = (id: string) => {
//     setFormData(prev => ({
//       ...prev,
//       agencies: prev.agencies.filter(agency => agency.id !== id),
//     }));
//   };

//   const updateAgency = (id: string, field: keyof Omit<Agency, "id" | "services">, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       agencies: prev.agencies.map(agency =>
//         agency.id === id ? { ...agency, [field]: value } : agency
//       ),
//     }));
//   };

//   const addService = (agencyId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       agencies: prev.agencies.map(agency =>
//         agency.id === agencyId
//           ? { ...agency, services: [...agency.services, {
//               id: Date.now().toString(),
//               name: "",
//               description: "",
//             }]}
//           : agency
//       ),
//     }));
//   };

//   const removeService = (agencyId: string, serviceId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       agencies: prev.agencies.map(agency =>
//         agency.id === agencyId
//           ? { ...agency, services: agency.services.filter(service => service.id !== serviceId) }
//           : agency
//       ),
//     }));
//   };

//   const updateService = (agencyId: string, serviceId: string, field: keyof Omit<Service, "id">, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       agencies: prev.agencies.map(agency =>
//         agency.id === agencyId
//           ? { ...agency, services: agency.services.map(service =>
//               service.id === serviceId ? { ...service, [field]: value } : service
//             )}
//           : agency
//       ),
//     }));
//   };

//   // Navigation et validation
//   const nextStep = (e?: React.MouseEvent) => {
//     e?.preventDefault();
//     if (currentStep < 4) setCurrentStep(currentStep + 1);
//   };

//   const prevStep = (e?: React.MouseEvent) => {
//     e?.preventDefault();
//     if (currentStep > 1) setCurrentStep(currentStep - 1);
//   };

//   const isStep1Valid = () => {
//     const { name, email } = formData.personalInfo;
//     return name.trim() !== "" && email.trim() !== "";
//   };

//   const isStep2Valid = () => {
//     const { name, description, address, contact, country, category } = formData.companyInfo;
//     return (
//       name.trim() !== "" &&
//       description.trim() !== "" &&
//       address.trim() !== "" &&
//       contact.trim() !== "" &&
//       country.trim() !== "" &&
//       category.trim() !== ""
//     );
//   };

//   const isStep3Valid = () => true;

//   const canProceedToNext = () => {
//     switch (currentStep) {
//       case 1: return isStep1Valid();
//       case 2: return isStep2Valid();
//       case 3: return isStep3Valid();
//       default: return true;
//     }
//   };

//   // Rendu des étapes
//   const renderStep1 = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//             Nom complet <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.personalInfo.name}
//             onChange={(e) => updatePersonalInfo("name", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.personalInfo.email}
//             onChange={(e) => updatePersonalInfo("email", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Informations entreprise</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="entreprise_name" className="block text-sm font-medium text-gray-700">
//             Nom de l'entreprise <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="entreprise_name"
//             name="entreprise_name"
//             value={formData.companyInfo.name}
//             onChange={(e) => updateCompanyInfo("name", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="entreprise_categorie" className="block text-sm font-medium text-gray-700">
//             Catégorie <span className="text-red-500">*</span>
//           </label>
//           <select
//             id="entreprise_categorie"
//             name="entreprise_categorie"
//             value={formData.companyInfo.category}
//             onChange={(e) => updateCompanyInfo("category", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           >
//             <option value="">Sélectionnez une catégorie</option>
//             {loaderData?.categories?.map((category: string) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="md:col-span-2">
//           <label htmlFor="entreprise_description" className="block text-sm font-medium text-gray-700">
//             Description <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             id="entreprise_description"
//             name="entreprise_description"
//             rows={3}
//             value={formData.companyInfo.description}
//             onChange={(e) => updateCompanyInfo("description", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="entreprise_adress" className="block text-sm font-medium text-gray-700">
//             Adresse <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="entreprise_adress"
//             name="entreprise_adress"
//             value={formData.companyInfo.address}
//             onChange={(e) => updateCompanyInfo("address", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="entreprise_contact" className="block text-sm font-medium text-gray-700">
//             Contact <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="entreprise_contact"
//             name="entreprise_contact"
//             value={formData.companyInfo.contact}
//             onChange={(e) => updateCompanyInfo("contact", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="entreprise_country" className="block text-sm font-medium text-gray-700">
//             Pays <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             id="entreprise_country"
//             name="entreprise_country"
//             value={formData.companyInfo.country}
//             onChange={(e) => updateCompanyInfo("country", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="entreprise_website" className="block text-sm font-medium text-gray-700">
//             Site web
//           </label>
//           <input
//             type="url"
//             id="entreprise_website"
//             name="entreprise_website"
//             value={formData.companyInfo.website}
//             onChange={(e) => updateCompanyInfo("website", e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-900">Gestion des fichiers</h2>
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="entreprise_logo" className="block text-sm font-medium text-gray-700">
//             Logo de l'entreprise
//           </label>
//           <input
//             type="file"
//             id="entreprise_logo"
//             name="entreprise_logo"
//             accept="image/*"
//             onChange={(e) => updateFile("logo", e.target.files?.[0] || null)}
//             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//         </div>
//         <div>
//           <label htmlFor="document_enregistrement" className="block text-sm font-medium text-gray-700">
//             Document d'enregistrement
//           </label>
//           <input
//             type="file"
//             id="document_enregistrement"
//             name="document_enregistrement"
//             accept=".pdf,.doc,.docx"
//             onChange={(e) => updateFile("registrationDoc", e.target.files?.[0] || null)}
//             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//         </div>
//         <div>
//           <label htmlFor="carte_professionnelle" className="block text-sm font-medium text-gray-700">
//             Carte professionnelle
//           </label>
//           <input
//             type="file"
//             id="carte_professionnelle"
//             name="carte_professionnelle"
//             accept="image/*,.pdf"
//             onChange={(e) => updateFile("businessCard", e.target.files?.[0] || null)}
//             className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep4 = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-900">Gestion des agences</h2>
//         <button
//           type="button"
//           onClick={addAgency}
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           + Ajouter une agence
//         </button>
//       </div>

//       {formData.agencies.length === 0 && (
//         <p className="text-gray-500">Aucune agence ajoutée pour le moment.</p>
//       )}

//       {formData.agencies.map((agency, agencyIndex) => (
//         <div key={agency.id} className="border rounded-md p-4 mb-4 bg-white shadow-sm">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold">
//               Agence #{agencyIndex + 1} : {agency.name || "(Sans nom)"}
//             </h3>
//             <button
//               type="button"
//               onClick={() => removeAgency(agency.id)}
//               className="text-red-600 hover:text-red-800"
//             >
//               Supprimer
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label htmlFor={`agency-name-${agency.id}`} className="block text-sm font-medium text-gray-700">
//                 Nom de l'agence
//               </label>
//               <input
//                 type="text"
//                 id={`agency-name-${agency.id}`}
//                 value={agency.name}
//                 onChange={(e) => updateAgency(agency.id, "name", e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor={`agency-address-${agency.id}`} className="block text-sm font-medium text-gray-700">
//                 Adresse
//               </label>
//               <input
//                 type="text"
//                 id={`agency-address-${agency.id}`}
//                 value={agency.address}
//                 onChange={(e) => updateAgency(agency.id, "address", e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor={`agency-contact-${agency.id}`} className="block text-sm font-medium text-gray-700">
//                 Contact
//               </label>
//               <input
//                 type="text"
//                 id={`agency-contact-${agency.id}`}
//                 value={agency.contact}
//                 onChange={(e) => updateAgency(agency.id, "contact", e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label htmlFor={`agency-wait-${agency.id}`} className="block text-sm font-medium text-gray-700">
//                 Temps d'attente moyen
//               </label>
//               <input
//                 type="text"
//                 id={`agency-wait-${agency.id}`}
//                 value={agency.averageWaitTime}
//                 onChange={(e) => updateAgency(agency.id, "averageWaitTime", e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           <div>
//             <h4 className="font-semibold mb-2">Services</h4>
//             {agency.services.length === 0 && (
//               <p className="text-gray-500 mb-2">Aucun service ajouté</p>
//             )}
//             {agency.services.map((service, serviceIndex) => (
//               <div key={service.id} className="border rounded-md p-2 mb-2 bg-gray-50">
//                 <div className="flex justify-between items-center mb-1">
//                   <h5 className="font-medium">
//                     Service #{serviceIndex + 1} : {service.name || "(Sans nom)"}
//                   </h5>
//                   <button
//                     type="button"
//                     onClick={() => removeService(agency.id, service.id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Supprimer
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                   <input
//                     type="text"
//                     placeholder="Nom du service"
//                     value={service.name}
//                     onChange={(e) => updateService(agency.id, service.id, "name", e.target.value)}
//                     className="rounded-md border border-gray-300 px-2 py-1"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Description"
//                     value={service.description}
//                     onChange={(e) => updateService(agency.id, service.id, "description", e.target.value)}
//                     className="rounded-md border border-gray-300 px-2 py-1"
//                   />
//                 </div>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => addService(agency.id)}
//               className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               + Ajouter un service
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-10">
//       <h1 className="text-3xl font-extrabold mb-8">Inscription entreprise / agent</h1>

//       {actionData?.error && (
//         <p className="mb-4 text-red-600 font-semibold">{actionData.error}</p>
//       )}

//       <Form method="post" encType="multipart/form-data" 
//       onSubmit={(e) => {
//         const form = e.currentTarget;
//         const formData = new FormData(form);

//     // 🕵️ Log toutes les données
//     for (const [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }
//   }}>
//         <input type="hidden" name="agencies" value={JSON.stringify(formData.agencies)} />
//         {currentStep === 1 && renderStep1()}
//         {currentStep === 2 && renderStep2()}
//         {currentStep === 3 && renderStep3()}
//         {currentStep === 4 && renderStep4()}

//         <div className="flex justify-between mt-8">
//           {currentStep > 1 && (
//             <button
//               type="button"
//               onClick={prevStep}
//               className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
//               disabled={isSubmitting}
//             >
//               Précédent
//             </button>
//           )}

//           {currentStep < 4 && (
//             <button
//               type="button"
//               onClick={nextStep}
//               className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//               disabled={!canProceedToNext() || isSubmitting}
//             >
//               Suivant
//             </button>
//           )}

//           {currentStep === 4 && (
//             <button
//               type="submit"
//               className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "En cours..." : "Valider l'inscription"}
//             </button>
//           )}
//         </div>
//       </Form>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getEnterpriseCategories, registerEnterpriseAgentBase64 } from "~/utils/api";

export default function RegisterPage() {
  const [logo, setLogo] = useState("");
  const [doc, setDoc] = useState("");
  const [carte, setCarte] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errorCategories, setErrorCategories] = useState("");

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
    if (!agenceInput.name.trim()) return;
    if (agenceInput.services.length === 0) {
      alert("Veuillez ajouter au moins un service à cette agence");
      return;
    }
    setAgences([...agences, agenceInput]);
    setAgenceInput({
      name: "",
      adresse: "",
      contact: "",
      temps_attente_moyen: 0,
      services: [],
    });
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
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    // Validation de l'email
    const email = formData.get("email") as string;
    if (!email.includes("@") || !email.includes(".")) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }

    if (noAgency && directServices.length === 0) {
      alert("Veuillez ajouter au moins un service");
      return;
    }

    if (!noAgency && agences.length === 0) {
      alert("Veuillez ajouter au moins une agence");
      return;
    }

    const payload: any = {
      name: formData.get("name") as string,
      email: email,
      entreprise_name: formData.get("entreprise_name") as string,
      entreprise_description: formData.get("entreprise_description") as string,
      entreprise_adress: formData.get("entreprise_adress") as string,
      entreprise_contact: formData.get("entreprise_contact") as string,
      entreprise_country: formData.get("entreprise_country") as string,
      entreprise_website: formData.get("entreprise_website") as string,
      entreprise_categorie: formData.get("entreprise_categorie") as string,
      entreprise_logo: logo || null,
      document_enregistrement: doc || null,
      carte_professionnelle: carte || null,
    };

    // Correction de la structure des données
    if (noAgency) {
      // Mode services directs - structure est un objet avec un tableau services
      payload.structure = { services: directServices };
    } else {
      // Mode avec agences - structure est un tableau d'agences
      payload.structure = agences.map((agence) => ({
        name: agence.name,
        adresse: agence.adresse,
        contact: agence.contact,
        temps_attente_moyen: agence.temps_attente_moyen,
        services: agence.services,
      }));
    }

    console.log("📤 Payload envoyé :", JSON.stringify(payload, null, 2));

    try {
      const result = await registerEnterpriseAgentBase64(payload);
      alert("Inscription réussie !");
      console.log("✅ Réponse du backend :", result);
      // Réinitialisation du formulaire
      form.reset();
      setDirectServices([]);
      setAgences([]);
      setLogo("");
      setDoc("");
      setCarte("");
    } catch (err: any) {
      // Meilleure gestion des erreurs
      let errorMessage = "Une erreur est survenue";
      if (err.response) {
        // Si l'erreur vient de l'API
        const apiError = await err.response.json();
        errorMessage = apiError.message || JSON.stringify(apiError);
      } else if (err.message) {
        errorMessage = err.message;
      }
      alert("Erreur : " + errorMessage);
      console.error("❌ Erreur backend détaillée :", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Inscription Entreprise</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Infos utilisateur */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom complet</span>
          </label>
          <input name="name" placeholder="Nom complet" className="input input-bordered w-full" required />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input name="email" placeholder="Email" type="email" className="input input-bordered w-full" required />
        </div>

        {/* Infos entreprise */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nom de l'entreprise</span>
          </label>
          <input name="entreprise_name" placeholder="Nom entreprise" className="input input-bordered w-full" required />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input name="entreprise_description" placeholder="Description" className="input input-bordered w-full" />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Adresse</span>
          </label>
          <input name="entreprise_adress" placeholder="Adresse" className="input input-bordered w-full" />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Contact</span>
          </label>
          <input name="entreprise_contact" placeholder="Contact" className="input input-bordered w-full" />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Pays</span>
          </label>
          <input name="entreprise_country" placeholder="Pays" className="input input-bordered w-full" />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Site web</span>
          </label>
          <input name="entreprise_website" placeholder="Site web" className="input input-bordered w-full" />
        </div>

        {/* Catégorie */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Catégorie d'entreprise</span>
          </label>
          {loadingCategories ? (
            <select className="select select-bordered w-full" disabled>
              <option>Chargement des catégories...</option>
            </select>
          ) : errorCategories ? (
            <div className="text-error">{errorCategories}</div>
          ) : (
            <select name="entreprise_categorie" className="select select-bordered w-full" required>
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Upload fichiers */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Logo entreprise</span>
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, setLogo)} 
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Document d'enregistrement</span>
          </label>
          <input 
            type="file" 
            accept=".pdf,.png,.jpg" 
            onChange={(e) => handleFileChange(e, setDoc)} 
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Carte professionnelle</span>
          </label>
          <input 
            type="file" 
            accept=".pdf,.png,.jpg" 
            onChange={(e) => handleFileChange(e, setCarte)} 
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Checkbox "Pas d'agence, seulement services" */}
        <div className="form-control mt-6">
          <label className="cursor-pointer label justify-start">
            <input
              type="checkbox"
              checked={noAgency}
              onChange={(e) => {
                setNoAgency(e.target.checked);
                // Réinitialiser les données de l'autre mode
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
              }}
              className="checkbox checkbox-primary mr-2"
            />
            <span className="label-text">Pas d'agence, créer uniquement des services</span>
          </label>
        </div>

        {/* SECTION AGENCES (cachée si noAgency est vrai) */}
        {!noAgency && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Gestion des agences</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Ajouter une agence</h4>
              <div className="space-y-3">
                <input
                  placeholder="Nom agence *"
                  className="input input-bordered w-full"
                  value={agenceInput.name}
                  onChange={(e) => setAgenceInput({ ...agenceInput, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Adresse"
                  className="input input-bordered w-full"
                  value={agenceInput.adresse}
                  onChange={(e) => setAgenceInput({ ...agenceInput, adresse: e.target.value })}
                />
                <input
                  placeholder="Contact"
                  className="input input-bordered w-full"
                  value={agenceInput.contact}
                  onChange={(e) => setAgenceInput({ ...agenceInput, contact: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Temps d'attente moyen (en min)"
                  className="input input-bordered w-full"
                  value={agenceInput.temps_attente_moyen}
                  onChange={(e) =>
                    setAgenceInput({ ...agenceInput, temps_attente_moyen: parseInt(e.target.value) || 0 })
                  }
                />

                {/* Services pour cette agence */}
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Services de cette agence</h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      placeholder="Nom du service *"
                      className="input input-bordered flex-1"
                      value={serviceInput.name}
                      onChange={(e) => setServiceInput({ ...serviceInput, name: e.target.value })}
                    />
                    <input
                      placeholder="Description"
                      className="input input-bordered flex-1"
                      value={serviceInput.description}
                      onChange={(e) => setServiceInput({ ...serviceInput, description: e.target.value })}
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleAddService}
                      disabled={!serviceInput.name.trim()}
                    >
                      Ajouter
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    {agenceInput.services.length > 0 ? (
                      <ul className="space-y-2">
                        {agenceInput.services.map((srv, idx) => (
                          <li key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span>
                              <strong>{srv.name}</strong>: {srv.description}
                            </span>
                            <button
                              type="button"
                              className="btn btn-xs btn-error"
                              onClick={() => {
                                setAgenceInput({
                                  ...agenceInput,
                                  services: agenceInput.services.filter((_, i) => i !== idx),
                                });
                              }}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm">Aucun service ajouté pour cette agence</p>
                    )}
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn btn-primary w-full mt-3"
                  onClick={handleAddAgence}
                  disabled={!agenceInput.name.trim() || agenceInput.services.length === 0}
                >
                  Ajouter cette agence
                </button>
              </div>
            </div>

            {/* Liste des agences ajoutées */}
            {agences.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Agences enregistrées</h4>
                <div className="space-y-3">
                  {agences.map((ag, idx) => (
                    <div key={idx} className="card bg-base-100 border">
                      <div className="card-body p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold">{ag.name}</h5>
                            <p className="text-sm">{ag.adresse}</p>
                            <p className="text-sm">Contact: {ag.contact}</p>
                            <p className="text-sm">Temps d'attente: {ag.temps_attente_moyen} min</p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-xs btn-error"
                            onClick={() => handleRemoveAgence(idx)}
                          >
                            Supprimer
                          </button>
                        </div>
                        
                        <div className="mt-2">
                          <h6 className="font-medium text-sm">Services:</h6>
                          <ul className="space-y-1 mt-1">
                            {ag.services.map((srv, sIdx) => (
                              <li key={sIdx} className="flex justify-between items-center text-sm">
                                <span>
                                  <strong>{srv.name}</strong>: {srv.description}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-xs btn-error"
                                  onClick={() => handleRemoveAgenceService(idx, sIdx)}
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION SERVICES DIRECTS (visible si noAgency est vrai) */}
        {noAgency && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Services de l'entreprise</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Ajouter un service</h4>
              <div className="flex gap-2 mb-3">
                <input
                  placeholder="Nom du service *"
                  className="input input-bordered flex-1"
                  value={serviceInput.name}
                  onChange={(e) => setServiceInput({ ...serviceInput, name: e.target.value })}
                />
                <input
                  placeholder="Description"
                  className="input input-bordered flex-1"
                  value={serviceInput.description}
                  onChange={(e) => setServiceInput({ ...serviceInput, description: e.target.value })}
                />
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddDirectService}
                  disabled={!serviceInput.name.trim()}
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Liste des services directs */}
            {directServices.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Services enregistrés</h4>
                <ul className="space-y-2">
                  {directServices.map((srv, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 bg-white border rounded">
                      <div>
                        <strong>{srv.name}</strong>
                        <p className="text-sm">{srv.description}</p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-xs btn-error"
                        onClick={() => handleRemoveDirectService(idx)}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Aucun service ajouté. Veuillez ajouter au moins un service.</span>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary w-full mt-6"
          disabled={
            noAgency 
              ? directServices.length === 0 
              : agences.length === 0
          }
        >
          Créer mon entreprise
        </button>
      </form>
    </div>
  );
}