import { useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getEnterpriseCategories, registerEnterpriseAgentBase64 } from "~/utils/api";

export default function RegisterPage() {
  const navigate = useNavigate(); // Hook pour la navigation
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
    
    // Ajouter l'agence à la liste
    setAgences([...agences, agenceInput]);
    
    // Réinitialiser le formulaire d'agence
    setAgenceInput({
      name: "",
      adresse: "",
      contact: "",
      temps_attente_moyen: 0,
      services: [],
    });
    
    // Réinitialiser aussi le serviceInput
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
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    // Validation de l'email
    const email = formData.get("email") as string;
    if (!email.includes("@") || !email.includes(".")) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }

    // Validation selon le mode choisi
    if (noAgency) {
      if (directServices.length === 0) {
        alert("Veuillez ajouter au moins un service");
        return;
      }
    } else {
      if (agences.length === 0) {
        alert("Veuillez ajouter au moins une agence avec ses services");
        return;
      }
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

      // Redirection vers une autre page

      // Dans forms.tsx, remplacez la partie navigate("/verify-email") par :
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
                setServiceInput({ name: "", description: "" });
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
                  disabled={!agenceFormValid}
                >
                  Ajouter cette agence
                </button>
              </div>
            </div>

            {/* Liste des agences ajoutées */}
            {agences.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Agences enregistrées ({agences.length})</h4>
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
                          <h6 className="font-medium text-sm">Services ({ag.services.length}):</h6>
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

            {agences.length === 0 && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Aucune agence ajoutée. Veuillez ajouter au moins une agence avec ses services.</span>
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
                <h4 className="font-medium">Services enregistrés ({directServices.length})</h4>
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
          className={`btn w-full mt-6 ${canSubmitForm() ? 'btn-primary' : 'btn-disabled'}`}
          disabled={!canSubmitForm()}
        >
          Créer mon entreprise
        </button>
      </form>
    </div>
  );
}