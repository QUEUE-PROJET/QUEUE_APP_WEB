// Types pour les rapports - correspondant aux schémas Pydantic du backend

export interface StatistiquesGlobales {
  total_entreprises: number;
  entreprises_actives: number;
  entreprises_en_attente: number;
  entreprises_acceptees: number;
  entreprises_rejetees: number;
  total_utilisateurs: number;
  total_clients: number;
  total_agents_entreprise: number;
  total_employes: number;
  total_tickets: number;
  total_agences: number;
  total_services: number;
}

export interface EntreprisePerformance {
  entreprise_id: string;
  nom_entreprise: string;
  categorie: string;
  total_tickets: number;
  tickets_traites: number;
  tickets_en_attente: number;
  tickets_annules: number;
  temps_moyen_traitement: number | null;
  temps_moyen_formate: string;
  taux_resolution: number;
  nombre_agences: number;
  nombre_employes: number;
}

export interface CroissanceParPeriode {
  periode: string;
  nouvelles_entreprises: number;
  nouveaux_utilisateurs: number;
  nouveaux_tickets: number;
}

export interface RepartitionParCategorie {
  categorie: string;
  nombre_entreprises: number;
  pourcentage: number;
  couleur: string;
}

export interface StatistiquesParPays {
  pays: string;
  nombre_entreprises: number;
  nombre_utilisateurs: number;
  nombre_tickets: number;
}

export interface RapportAdministrateur {
  periode_debut: string;
  periode_fin: string;
  statistiques_globales: StatistiquesGlobales;
  top_entreprises: EntreprisePerformance[];
  croissance_mensuelle: CroissanceParPeriode[];
  repartition_categories: RepartitionParCategorie[];
  statistiques_par_pays: StatistiquesParPays[];
}

export interface PerformanceService {
  service_id: string;
  nom_service: string;
  agence_nom: string;
  total_tickets: number;
  tickets_traites: number;
  tickets_en_attente: number;
  tickets_annules: number;
  temps_moyen_traitement: number | null;
  temps_moyen_formate: string;
  taux_resolution: number;
}

export interface PerformanceEmploye {
  employe_id: string;
  nom_employe: string;
  email: string;
  agence_nom: string;
  tickets_traites: number;
  temps_moyen_traitement: number | null;
  temps_moyen_formate: string;
  derniere_activite: string | null;
}

export interface FluxAffluenteHeure {
  heure: number;
  nombre_tickets: number;
}

export interface FluxAffluenteJour {
  jour_semaine: string;
  nombre_tickets: number;
}

export interface ComparaisonPeriode {
  periode_actuelle: string;
  periode_precedente: string;
  tickets_actuel: number;
  tickets_precedent: number;
  evolution_pourcentage: number;
  temps_traitement_actuel: number | null;
  temps_traitement_precedent: number | null;
  evolution_temps_pourcentage: number | null;
}

export interface RapportEntreprise {
  entreprise_id: string;
  nom_entreprise: string;
  periode_debut: string;
  periode_fin: string;
  performance_globale: EntreprisePerformance;
  performance_services: PerformanceService[];
  performance_employes: PerformanceEmploye[];
  flux_affluence_heures: FluxAffluenteHeure[];
  flux_affluence_jours: FluxAffluenteJour[];
  comparaison_periode: ComparaisonPeriode | null;
}

export interface FiltresRapport {
  date_debut: string;
  date_fin: string;
  entreprise_id?: string;
  agence_id?: string;
  service_id?: string;
  categorie_entreprise?: string;
  pays?: string;
}
