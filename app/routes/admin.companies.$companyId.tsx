import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { ArrowLeft, Building2, Check, Download, ExternalLink, FileText, Globe, Phone, X } from "lucide-react";
import { useEffect, useState } from 'react'; // Ajout de l'import useEffect
import { Sidebar } from "~/components/SidebarAdmin";
import { requireAuth, requireRole } from "~/services/auth.server";
import { approveCompany, fetchCompanyDetails, rejectCompany } from "~/utils/api";

interface CompanyDetails {
  id: string;
  name: string;
  description: string;
  adress: string;
  contact: string;
  categorie: string;
  statutEntreprise: string;
  website: string;
  logo: string;
  document_enregistrement_filename: string;
  carte_professionnelle_filename: string;
  created_at: string;
  agences: any[];
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireRole(request, "ADMINISTRATEUR");
  const companyId = params.companyId; // Correction ici
  
  if (!companyId) {
    throw new Response("ID d'entreprise requis", { status: 400 });
  }

  try {
    const company = await fetchCompanyDetails(companyId);
    return json({ company });
  } catch (error) {
    console.error("Erreur lors du chargement des détails:", error);
    throw new Response("Entreprise non trouvée", { status: 404 });
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const responseLogin = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const  companyId  =  params.companyId;

  if (!companyId) {
    return json({ error: "ID d'entreprise manquant" }, { status: 400 });
  }

  try {
    if (intent === "approve") {
      await approveCompany(companyId, responseLogin.token);
      return redirect("/admin");
      
    } else if (intent === "reject") {
      await rejectCompany(companyId, responseLogin.token);
      return redirect("/admin");
    }
  } catch (error) {
    console.error("Erreur lors de l'action:", error);
    return json({ error: "Erreur lors de la requête" }, { status: 500 });
  }
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
    'ACCEPTEE': 'bg-green-100 text-green-800',
    'REJETEE': 'bg-red-100 text-red-800'
  };

  const labels: Record<string, string> = {
    'EN_ATTENTE': 'En attente',
    'ACCEPTEE': 'Acceptée',
    'REJETEE': 'Rejetée'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[status]}`}>
      {labels[status] || status}
    </span>
  );
}

function InfoCard({ icon: Icon, title, children }: {
  icon: React.ComponentType<any>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DocumentViewer({ url, filename }: {
  url: string;
  filename: string;
}) {
  if (!url) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Aucun document</p>
      </div>
    );
  }

  const isImage = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
  const isPdf = url.toLowerCase().includes('.pdf');

  return (
    <div className="space-y-2">
      {isImage ? (
        <img
          src={url}
          alt={filename}
          className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
        />
      ) : isPdf ? (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg border border-gray-200">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Document PDF</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <p className="text-gray-500">Format non supporté</p>
        </div>
      )}
      
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
      >
        <Download className="w-4 h-4 mr-1" />
        Télécharger
        <ExternalLink className="w-3 h-3 ml-1" />
      </a>
    </div>
  );
}

function ConfirmationModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  confirmText, 
  confirmColor = "bg-blue-600 hover:bg-blue-700",
  formId,
  isLoading = false
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: string;
  formId?: string;
  isLoading?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            form={formId}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${confirmColor} flex items-center justify-center disabled:opacity-50`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetails() {
  const { company } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Effet pour gérer les feedbacks après action
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "approved") {
      // Vous pouvez utiliser votre système de notification ici
      console.log("Entreprise approuvée avec succès");
    } else if (status === "rejected") {
      console.log("Entreprise rejetée avec succès");
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au tableau de bord
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <StatusBadge status={company.statutEntreprise} />
                    <span className="text-sm text-gray-500">
                      Créée le {new Date(company.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {company.statutEntreprise === "EN_ATTENTE" && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Valider l'entreprise
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter l'entreprise
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Forms pour les actions */}
          <Form method="post" id="approve-form"  onSubmit={() => {setIsSubmitting(true); setShowApproveModal(false);
  }}>
            <input type="hidden" name="intent" value="approve" />
          </Form>
          <Form method="post" id="reject-form"     onSubmit={() => {setIsSubmitting(true);setShowRejectModal(false);
  }}>
            <input type="hidden" name="intent" value="reject" />
          </Form>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <InfoCard icon={Building2} title="Informations générales">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900">{company.description || "—"}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <p className="text-gray-900">{company.categorie || "—"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre d'agences
                      </label>
                      <p className="text-gray-900">{company.agences?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Contact Information */}
              <InfoCard icon={Phone} title="Informations de contact">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <p className="text-gray-900">{company.adress || "—"}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <p className="text-gray-900">{company.contact || "—"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site web
                      </label>
                      {company.website ? (
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Visiter le site
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      ) : (
                        <p className="text-gray-900">—</p>
                      )}
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>

            {/* Right Column - Documents */}
            <div className="space-y-6">
              {/* Logo */}
              <InfoCard icon={Building2} title="Logo de l'entreprise">
                <DocumentViewer
                  url={company.logo}
                  filename="Logo"
                />
              </InfoCard>

              {/* Registration Document */}
              <InfoCard icon={FileText} title="Document d'enregistrement">
                <DocumentViewer
                  url={company.document_enregistrement_filename}
                  filename="Document d'enregistrement"
                />
              </InfoCard>

              {/* Professional Card */}
              <InfoCard icon={FileText} title="Carte professionnelle">
                <DocumentViewer
                  url={company.carte_professionnelle_filename}
                  filename="Carte professionnelle"
                />
              </InfoCard>
            </div>
          </div>

          {/* Confirmation Modals */}
          <ConfirmationModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            title="Valider l'entreprise"
            message={`Êtes-vous sûr de vouloir valider l'entreprise "${company.name}" ? Cette action permettra à l'entreprise d'accéder à la plateforme.`}
            confirmText="Valider"
            confirmColor="bg-green-600 hover:bg-green-700"
            formId="approve-form"
          />

          <ConfirmationModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Rejeter l'entreprise"
            message={`Êtes-vous sûr de vouloir rejeter l'entreprise "${company.name}" ? Cette action est irréversible.`}
            confirmText="Rejeter"
            confirmColor="bg-red-600 hover:bg-red-700"
            formId="reject-form"
          />
        </div>
      </div>
    </div>
  );
}