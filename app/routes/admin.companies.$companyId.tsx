import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate, useSearchParams, useNavigation } from "@remix-run/react";
import { ArrowLeft, Building2, Check, Download, ExternalLink, FileText, Globe, Phone, X, MapPin, Users, Clock, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from 'react';
import { Sidebar } from "~/components/SidebarAdmin";
import { requireAuth, requireRole } from "~/services/auth.server";
import { approveCompany, fetchCompanyDetails, rejectCompany } from "~/utils/api";
import "~/styles/companies-animations.css";

interface Service {
  id: string;
  name: string;
  description: string;
  created_at: string;
  agence_id: string;
}

interface Agence {
  id: string;
  name: string;
  adresse: string;
  contact: string;
  created_at: string;
  entreprise_id: string;
  temps_attente_moyen: number;
  services: Service[];
}

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
  agences: Agence[];
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
  const variants: Record<string, { bg: string; text: string; icon: React.ReactNode; borderColor: string }> = {
    'EN_ATTENTE': {
      bg: 'linear-gradient(135deg, #fdc500, #ffd500)',
      text: '#00296b',
      borderColor: '#fdc500',
      icon: <Clock className="w-3 h-3" />
    },
    'ACCEPTEE': {
      bg: 'linear-gradient(135deg, #22c55e, #16a34a)',
      text: '#ffffff',
      borderColor: '#22c55e',
      icon: <Check className="w-3 h-3" />
    },
    'REJETEE': {
      bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
      text: '#ffffff',
      borderColor: '#ef4444',
      icon: <X className="w-3 h-3" />
    }
  };

  const labels: Record<string, string> = {
    'EN_ATTENTE': 'En attente',
    'ACCEPTEE': 'Acceptée',
    'REJETEE': 'Rejetée'
  };

  const variant = variants[status];

  return (
    <span 
      className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 transition-all duration-200 hover:scale-105"
      style={{ 
        background: variant.bg,
        color: variant.text,
        borderColor: variant.borderColor
      }}
    >
      {variant.icon}
      <span>{labels[status] || status}</span>
    </span>
  );
}

function InfoCard({ icon: Icon, title, children, className = "" }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6 transition-all duration-300 hover:shadow-2xl ${className}`}>
      <div className="flex items-center mb-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #00296b, #003f88)' }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold" style={{ color: '#00296b' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function AgencyCard({ agence, index }: { agence: Agence; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 transition-all duration-300 hover:shadow-xl"
      style={{ 
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' }}
          >
            <Building2 className="w-6 h-6" style={{ color: '#00296b' }} />
          </div>
          <div>
            <h4 className="text-lg font-bold" style={{ color: '#00296b' }}>{agence.name}</h4>
            <p className="text-slate-600 text-sm flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {agence.adresse}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {agence.temps_attente_moyen} min
            </span>
          </div>
          <p className="text-xs text-slate-500">{agence.contact}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" style={{ color: '#fdc500' }} />
            <span className="text-sm font-medium text-slate-700">
              {agence.services.length} service{agence.services.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {agence.services.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, #00296b, #003f88)',
              color: 'white'
            }}
          >
            <span>{isExpanded ? 'Masquer' : 'Voir'} les services</span>
            {isExpanded ? 
              <ChevronUp className="w-4 h-4" /> : 
              <ChevronDown className="w-4 h-4" />
            }
          </button>
        )}
      </div>

      {/* Services List */}
      {isExpanded && agence.services.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          <h5 className="text-sm font-semibold mb-3" style={{ color: '#00296b' }}>
            Services disponibles :
          </h5>
          <div className="grid gap-3">
            {agence.services.map((service, serviceIndex) => (
              <div 
                key={service.id}
                className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl p-4 border border-slate-200/40"
                style={{ 
                  animationDelay: `${serviceIndex * 50}ms`,
                  animation: 'fadeInUp 0.4s ease-out forwards'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h6 className="font-semibold text-sm mb-1" style={{ color: '#00296b' }}>
                      {service.name}
                    </h6>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="ml-3">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #fdc500, #ffd500)' }}
                    >
                      <Star className="w-3 h-3 inline mr-1" />
                      Actif
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentViewer({ url, filename }: {
  url: string;
  filename: string;
}) {
  if (!url) {
    return (
      <div 
        className="flex items-center justify-center h-48 rounded-2xl border-2 border-dashed"
        style={{ 
          backgroundColor: '#f8fafc',
          borderColor: '#e2e8f0'
        }}
      >
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-500 font-medium">Aucun document</p>
        </div>
      </div>
    );
  }

  const isImage = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
  const isPdf = url.toLowerCase().includes('.pdf');

  return (
    <div className="space-y-4">
      {isImage ? (
        <div className="relative">
          <img
            src={url}
            alt={filename}
            className="w-full h-48 object-contain rounded-2xl border-2 shadow-lg transition-transform duration-200 hover:scale-105"
            style={{ 
              backgroundColor: '#f8fafc',
              borderColor: '#e2e8f0'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl pointer-events-none"></div>
        </div>
      ) : isPdf ? (
        <div 
          className="flex items-center justify-center h-48 rounded-2xl border-2 shadow-lg"
          style={{ 
            backgroundColor: '#f8fafc',
            borderColor: '#e2e8f0'
          }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="font-semibold" style={{ color: '#00296b' }}>Document PDF</p>
            <p className="text-xs text-slate-500 mt-1">Cliquez pour télécharger</p>
          </div>
        </div>
      ) : (
        <div 
          className="flex items-center justify-center h-48 rounded-2xl border-2"
          style={{ 
            backgroundColor: '#f8fafc',
            borderColor: '#e2e8f0'
          }}
        >
          <p className="text-slate-500 font-medium">Format non supporté</p>
        </div>
      )}
      
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 w-full justify-center"
        style={{ 
          background: 'linear-gradient(135deg, #fdc500, #ffd500)',
          color: '#00296b'
        }}
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger le document
        <ExternalLink className="w-3 h-3 ml-2" />
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-200/60">
        <div className="text-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #00296b, #003f88)' }}
          >
            {confirmText === "Valider" ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <X className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: '#00296b' }}>
            {title}
          </h3>
          <p className="text-slate-600 leading-relaxed">{message}</p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100/80 rounded-2xl hover:bg-slate-200/80 transition-all duration-200 disabled:opacity-50 hover:scale-105"
          >
            Annuler
          </button>
          <button
            type="submit"
            form={formId}
            className="px-6 py-3 text-sm font-bold text-white rounded-2xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 hover:scale-105 shadow-lg"
            style={{ 
              background: confirmText === "Valider" 
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
  const navigation = useNavigation();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Vérifier si une action est en cours
  const isSubmitting = navigation.state === "submitting";

  // Effet pour gérer les feedbacks après action
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "approved") {
      console.log("Entreprise approuvée avec succès");
    } else if (status === "rejected") {
      console.log("Entreprise rejetée avec succès");
    }
  }, [searchParams]);

  // Calculer les statistiques
  const totalServices = company.agences?.reduce((total, agence) => total + (agence.services?.length || 0), 0) || 0;
  const averageWaitTime = company.agences?.length 
    ? Math.round(company.agences.reduce((total, agence) => total + agence.temps_attente_moyen, 0) / company.agences.length)
    : 0;

  return (
    <div className="flex h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Sidebar />
      
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#fdc500', borderTopColor: 'transparent' }}></div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#00296b' }}>
                Traitement en cours...
              </h3>
              <p className="text-slate-600 text-sm">
                Mise à jour du statut de l&apos;entreprise
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link
                  to="/admin/companies"
                  className="inline-flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                  style={{ 
                    background: 'linear-gradient(135deg, #00296b, #003f88)',
                    color: 'white'
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux entreprises
                </Link>
                <div>
                  <h1 className="text-4xl font-bold mb-2" style={{ 
                    background: `linear-gradient(135deg, #00296b 0%, #003f88 50%, #00509d 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {company.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={company.statutEntreprise} />
                    <span className="text-sm text-slate-600 bg-white/60 px-3 py-1 rounded-full">
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
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Valider l&apos;entreprise
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter l&apos;entreprise
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Agences</p>
                  <p className="text-2xl font-bold" style={{ color: '#00296b' }}>
                    {company.agences?.length || 0}
                  </p>
                </div>
                <Building2 className="w-8 h-8" style={{ color: '#fdc500' }} />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Services</p>
                  <p className="text-2xl font-bold" style={{ color: '#00296b' }}>
                    {totalServices}
                  </p>
                </div>
                <Users className="w-8 h-8" style={{ color: '#fdc500' }} />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Attente moy.</p>
                  <p className="text-2xl font-bold" style={{ color: '#00296b' }}>
                    {averageWaitTime} min
                  </p>
                </div>
                <Clock className="w-8 h-8" style={{ color: '#fdc500' }} />
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Catégorie</p>
                  <p className="text-lg font-bold" style={{ color: '#00296b' }}>
                    {company.categorie}
                  </p>
                </div>
                <Star className="w-8 h-8" style={{ color: '#fdc500' }} />
              </div>
            </div>
          </div>

          {/* Forms pour les actions */}
          <Form method="post" id="approve-form" onSubmit={() => setShowApproveModal(false)}>
            <input type="hidden" name="intent" value="approve" />
          </Form>
          <Form method="post" id="reject-form" onSubmit={() => setShowRejectModal(false)}>
            <input type="hidden" name="intent" value="reject" />
          </Form>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Company Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <InfoCard icon={Building2} title="Informations générales">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: '#00296b' }}>
                      Description
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                      {company.description || "—"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: '#00296b' }}>
                        Catégorie
                      </div>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-xl">
                        {company.categorie || "—"}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: '#00296b' }}>
                        Nombre d&apos;agences
                      </div>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-xl">
                        {company.agences?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Contact Information */}
              <InfoCard icon={Phone} title="Informations de contact">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold mb-2" style={{ color: '#00296b' }}>
                      Adresse
                    </div>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">
                      {company.adress || "—"}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: '#00296b' }}>
                        Téléphone
                      </div>
                      <p className="text-slate-700 bg-slate-50 p-3 rounded-xl">
                        {company.contact || "—"}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-2" style={{ color: '#00296b' }}>
                        Site web
                      </div>
                      {company.website ? (
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                          style={{ 
                            background: 'linear-gradient(135deg, #00296b, #003f88)',
                            color: 'white'
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visiter le site
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </a>
                      ) : (
                        <p className="text-slate-700 bg-slate-50 p-3 rounded-xl">—</p>
                      )}
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Agences et Services */}
              {company.agences && company.agences.length > 0 && (
                <InfoCard icon={Building2} title={`Agences et Services (${company.agences.length})`}>
                  <div className="space-y-4">
                    {company.agences.map((agence, index) => (
                      <AgencyCard key={agence.id} agence={agence} index={index} />
                    ))}
                  </div>
                </InfoCard>
              )}
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
            isLoading={isSubmitting}
          />

          <ConfirmationModal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Rejeter l'entreprise"
            message={`Êtes-vous sûr de vouloir rejeter l'entreprise "${company.name}" ? Cette action est irréversible.`}
            confirmText="Rejeter"
            confirmColor="bg-red-600 hover:bg-red-700"
            formId="reject-form"
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}