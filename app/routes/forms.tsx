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



// app/routes/register.tsx
import { useState } from "react";
import { registerEnterpriseAgentBase64 } from "~/utils/api";

export default function RegisterPage() {
  const [logo, setLogo] = useState("");
  const [doc, setDoc] = useState("");
  const [carte, setCarte] = useState("");

  const [agences, setAgences] = useState<any[]>([]);
  const [agenceInput, setAgenceInput] = useState({
    name: "",
    adresse: "",
    contact: "",
    temps_attente_moyen: 0,
    services: [],
  });

  const [serviceInput, setServiceInput] = useState({ name: "", description: "" });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setState: (base64: string) => void) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setState(reader.result as string);
    reader.readAsDataURL(file);
  };

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
    setAgences([...agences, agenceInput]);
    setAgenceInput({
      name: "",
      adresse: "",
      contact: "",
      temps_attente_moyen: 0,
      services: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      entreprise_name: formData.get("entreprise_name"),
      entreprise_description: formData.get("entreprise_description"),
      entreprise_adress: formData.get("entreprise_adress"),
      entreprise_contact: formData.get("entreprise_contact"),
      entreprise_country: formData.get("entreprise_country"),
      entreprise_website: formData.get("entreprise_website"),
      entreprise_categorie: formData.get("entreprise_categorie"),
      entreprise_logo: logo,
      document_enregistrement: doc,
      carte_professionnelle: carte,
      agences,
    };

    console.log("📤 Payload envoyé :", payload);

    try {
      const result = await registerEnterpriseAgentBase64(payload);
      alert("Inscription réussie !");
      console.log("✅ Réponse du backend :", result);
    } catch (err: any) {
      alert("Erreur : " + err.message);
      console.error("❌ Erreur backend :", err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Inscription Entreprise</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Infos de l'utilisateur */}
        <input name="name" placeholder="Nom complet" className="input w-full" required />
        <input name="email" placeholder="Email" type="email" className="input w-full" required />

        {/* Infos de l'entreprise */}
        <input name="entreprise_name" placeholder="Nom entreprise" className="input w-full" required />
        <input name="entreprise_description" placeholder="Description" className="input w-full" />
        <input name="entreprise_adress" placeholder="Adresse" className="input w-full" />
        <input name="entreprise_contact" placeholder="Contact" className="input w-full" />
        <input name="entreprise_country" placeholder="Pays" className="input w-full" />
        <input name="entreprise_website" placeholder="Site web" className="input w-full" />
        <input name="entreprise_categorie" placeholder="Catégorie (ex: BANQUE)" className="input w-full" />

        {/* Upload fichiers */}
        <label>Logo entreprise</label>
        <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogo)} />
        <label>Document d'enregistrement</label>
        <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => handleFileChange(e, setDoc)} />
        <label>Carte professionnelle</label>
        <input type="file" accept=".pdf,.png,.jpg" onChange={(e) => handleFileChange(e, setCarte)} />

        {/* Ajout d'une agence */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold">Ajouter une agence</h3>
          <input placeholder="Nom agence" className="input w-full" value={agenceInput.name} onChange={(e) => setAgenceInput({ ...agenceInput, name: e.target.value })} />
          <input placeholder="Adresse" className="input w-full" value={agenceInput.adresse} onChange={(e) => setAgenceInput({ ...agenceInput, adresse: e.target.value })} />
          <input placeholder="Contact" className="input w-full" value={agenceInput.contact} onChange={(e) => setAgenceInput({ ...agenceInput, contact: e.target.value })} />
          <input type="number" placeholder="Temps d'attente moyen (en min)" className="input w-full" value={agenceInput.temps_attente_moyen} onChange={(e) => setAgenceInput({ ...agenceInput, temps_attente_moyen: parseInt(e.target.value) || 0 })} />

          {/* Services pour cette agence */}
          <div className="mt-3">
            <h4 className="font-medium">Ajouter un service</h4>
            <input placeholder="Nom du service" className="input" value={serviceInput.name} onChange={(e) => setServiceInput({ ...serviceInput, name: e.target.value })} />
            <input placeholder="Description" className="input" value={serviceInput.description} onChange={(e) => setServiceInput({ ...serviceInput, description: e.target.value })} />
            <button type="button" className="btn mt-1" onClick={handleAddService}>Ajouter service</button>

            <ul className="list-disc list-inside mt-2 text-sm">
              {agenceInput.services.map((srv: any, idx: number) => (
                <li key={idx}>{srv.name} - {srv.description}</li>
              ))}
            </ul>
          </div>

          <button type="button" className="btn mt-3" onClick={handleAddAgence}>Ajouter cette agence</button>

          {/* Liste des agences ajoutées */}
          <ul className="list-disc list-inside mt-4 text-sm text-gray-700">
            {agences.map((ag, idx) => (
              <li key={idx}>
                {ag.name} ({ag.contact}) - {ag.services.length} service(s)
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4">Créer mon entreprise</button>
      </form>
    </div>
  );
}
