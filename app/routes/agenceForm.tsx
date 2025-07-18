import { Layout } from "~/components/Layout";
import { Form } from "@remix-run/react";
import { useState } from "react";

export default function NewAgence() {
  const [formData, setFormData] = useState({
    name: '',
    adresse: '',
    contact: '',
    entreprise_id: '',
    service_id: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Données du formulaire:', formData);
    // À remplacer par un appel API vers votre backend
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle agence</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Champ Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'agence
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Champ Adresse */}
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Champ Contact */}
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Champ Entreprise ID */}
              <div>
                <label htmlFor="entreprise_id" className="block text-sm font-medium text-gray-700 mb-2">
                  ID Entreprise
                </label>
                <input
                  type="text"
                  id="entreprise_id"
                  name="entreprise_id"
                  value={formData.entreprise_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/* Service */}
            <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                Service *
                </label>
                <select
                id="service"
                name="service"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
                >
                <option value="">Sélectionnez un service</option>
                <option value="Service client">Service client</option>
                <option value="Comptabilité">Comptabilité</option>
                <option value="Service technique">Service technique</option>
                <option value="Ressources humaines">Ressources humaines</option>
                </select>
            </div>

              
            </div>
            
            <div className="flex justify-start space-x-4">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-md font-medium"
              >
                Créer l'agence
              </button>
              
              <a
                href="/agences"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium"
              >
                Annuler
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}