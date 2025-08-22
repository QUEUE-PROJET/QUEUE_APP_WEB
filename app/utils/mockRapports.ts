// Données de test pour les rapports
import { RapportAdministrateur, RapportEntreprise } from "~/types/rapports";

export const mockRapportAdministrateur: RapportAdministrateur = {
  periode_debut: "2024-01-01",
  periode_fin: "2024-01-31",
  statistiques_globales: {
    total_entreprises: 150,
    entreprises_actives: 120,
    entreprises_en_attente: 25,
    entreprises_acceptees: 120,
    entreprises_rejetees: 5,
    total_utilisateurs: 2500,
    total_clients: 1800,
    total_agents_entreprise: 350,
    total_employes: 350,
    total_tickets: 8500,
    total_agences: 280,
    total_services: 650
  },
  top_entreprises: [
    {
      entreprise_id: "1",
      nom_entreprise: "Banque Centrale",
      categorie: "BANQUE",
      total_tickets: 1200,
      tickets_traites: 1150,
      tickets_en_attente: 30,
      tickets_annules: 20,
      temps_moyen_traitement: 25.5,
      temps_moyen_formate: "25min 30s",
      taux_resolution: 95.8,
      nombre_agences: 15,
      nombre_employes: 45
    },
    {
      entreprise_id: "2",
      nom_entreprise: "Hôpital Général",
      categorie: "SANTE",
      total_tickets: 980,
      tickets_traites: 920,
      tickets_en_attente: 45,
      tickets_annules: 15,
      temps_moyen_traitement: 18.2,
      temps_moyen_formate: "18min 12s",
      taux_resolution: 93.9,
      nombre_agences: 8,
      nombre_employes: 32
    },
    {
      entreprise_id: "3",
      nom_entreprise: "Télécom Plus",
      categorie: "TELECOMMUNICATIONS",
      total_tickets: 750,
      tickets_traites: 700,
      tickets_en_attente: 35,
      tickets_annules: 15,
      temps_moyen_traitement: 12.8,
      temps_moyen_formate: "12min 48s",
      taux_resolution: 93.3,
      nombre_agences: 12,
      nombre_employes: 28
    }
  ],
  croissance_mensuelle: [
    {
      periode: "2023-08",
      nouvelles_entreprises: 8,
      nouveaux_utilisateurs: 120,
      nouveaux_tickets: 1200
    },
    {
      periode: "2023-09",
      nouvelles_entreprises: 12,
      nouveaux_utilisateurs: 180,
      nouveaux_tickets: 1450
    },
    {
      periode: "2023-10",
      nouvelles_entreprises: 15,
      nouveaux_utilisateurs: 220,
      nouveaux_tickets: 1680
    },
    {
      periode: "2023-11",
      nouvelles_entreprises: 18,
      nouveaux_utilisateurs: 280,
      nouveaux_tickets: 1920
    },
    {
      periode: "2023-12",
      nouvelles_entreprises: 22,
      nouveaux_utilisateurs: 350,
      nouveaux_tickets: 2200
    },
    {
      periode: "2024-01",
      nouvelles_entreprises: 25,
      nouveaux_utilisateurs: 420,
      nouveaux_tickets: 2500
    }
  ],
  repartition_categories: [
    {
      categorie: "BANQUE",
      nombre_entreprises: 35,
      pourcentage: 29.2,
      couleur: "#00296b"
    },
    {
      categorie: "SANTE",
      nombre_entreprises: 28,
      pourcentage: 23.3,
      couleur: "#003f88"
    },
    {
      categorie: "TELECOMMUNICATIONS",
      nombre_entreprises: 22,
      pourcentage: 18.3,
      couleur: "#00509d"
    },
    {
      categorie: "GOUVERNEMENT",
      nombre_entreprises: 20,
      pourcentage: 16.7,
      couleur: "#fdc500"
    },
    {
      categorie: "AUTRE",
      nombre_entreprises: 15,
      pourcentage: 12.5,
      couleur: "#ffd500"
    }
  ],
  statistiques_par_pays: [
    {
      pays: "Cameroun",
      nombre_entreprises: 85,
      nombre_utilisateurs: 1500,
      nombre_tickets: 5200
    },
    {
      pays: "Sénégal",
      nombre_entreprises: 25,
      nombre_utilisateurs: 450,
      nombre_tickets: 1800
    },
    {
      pays: "Côte d'Ivoire",
      nombre_entreprises: 20,
      nombre_utilisateurs: 380,
      nombre_tickets: 1200
    },
    {
      pays: "Mali",
      nombre_entreprises: 12,
      nombre_utilisateurs: 120,
      nombre_tickets: 300
    },
    {
      pays: "Burkina Faso",
      nombre_entreprises: 8,
      nombre_utilisateurs: 50,
      nombre_tickets: 0
    }
  ]
};

export const mockRapportEntreprise: RapportEntreprise = {
  entreprise_id: "1",
  nom_entreprise: "Banque Centrale",
  periode_debut: "2024-01-01",
  periode_fin: "2024-01-31",
  performance_globale: {
    entreprise_id: "1",
    nom_entreprise: "Banque Centrale",
    categorie: "BANQUE",
    total_tickets: 1200,
    tickets_traites: 1150,
    tickets_en_attente: 30,
    tickets_annules: 20,
    temps_moyen_traitement: 25.5,
    temps_moyen_formate: "25min 30s",
    taux_resolution: 95.8,
    nombre_agences: 15,
    nombre_employes: 45
  },
  performance_services: [
    {
      service_id: "s1",
      nom_service: "Ouverture de compte",
      agence_nom: "Agence Centrale",
      total_tickets: 350,
      tickets_traites: 340,
      tickets_en_attente: 8,
      tickets_annules: 2,
      temps_moyen_traitement: 20.5,
      temps_moyen_formate: "20min 30s",
      taux_resolution: 97.1
    },
    {
      service_id: "s2",
      nom_service: "Prêt personnel",
      agence_nom: "Agence Nord",
      total_tickets: 280,
      tickets_traites: 265,
      tickets_en_attente: 10,
      tickets_annules: 5,
      temps_moyen_traitement: 35.2,
      temps_moyen_formate: "35min 12s",
      taux_resolution: 94.6
    },
    {
      service_id: "s3",
      nom_service: "Virement international",
      agence_nom: "Agence Centre",
      total_tickets: 180,
      tickets_traites: 175,
      tickets_en_attente: 3,
      tickets_annules: 2,
      temps_moyen_traitement: 15.8,
      temps_moyen_formate: "15min 48s",
      taux_resolution: 97.2
    }
  ],
  performance_employes: [
    {
      employe_id: "e1",
      nom_employe: "Marie Dubois",
      email: "marie.dubois@banque.com",
      agence_nom: "Agence Centrale",
      tickets_traites: 85,
      temps_moyen_traitement: 18.5,
      temps_moyen_formate: "18min 30s",
      derniere_activite: "2024-01-31"
    },
    {
      employe_id: "e2",
      nom_employe: "Jean Martin",
      email: "jean.martin@banque.com",
      agence_nom: "Agence Nord",
      tickets_traites: 75,
      temps_moyen_traitement: 22.8,
      temps_moyen_formate: "22min 48s",
      derniere_activite: "2024-01-30"
    },
    {
      employe_id: "e3",
      nom_employe: "Sophie Leroy",
      email: "sophie.leroy@banque.com",
      agence_nom: "Agence Centre",
      tickets_traites: 92,
      temps_moyen_traitement: 16.2,
      temps_moyen_formate: "16min 12s",
      derniere_activite: "2024-01-31"
    }
  ],
  flux_affluence_heures: [
    { heure: 0, nombre_tickets: 2 },
    { heure: 1, nombre_tickets: 1 },
    { heure: 2, nombre_tickets: 0 },
    { heure: 3, nombre_tickets: 0 },
    { heure: 4, nombre_tickets: 1 },
    { heure: 5, nombre_tickets: 3 },
    { heure: 6, nombre_tickets: 8 },
    { heure: 7, nombre_tickets: 25 },
    { heure: 8, nombre_tickets: 45 },
    { heure: 9, nombre_tickets: 65 },
    { heure: 10, nombre_tickets: 80 },
    { heure: 11, nombre_tickets: 75 },
    { heure: 12, nombre_tickets: 40 },
    { heure: 13, nombre_tickets: 35 },
    { heure: 14, nombre_tickets: 70 },
    { heure: 15, nombre_tickets: 85 },
    { heure: 16, nombre_tickets: 90 },
    { heure: 17, nombre_tickets: 60 },
    { heure: 18, nombre_tickets: 25 },
    { heure: 19, nombre_tickets: 15 },
    { heure: 20, nombre_tickets: 8 },
    { heure: 21, nombre_tickets: 5 },
    { heure: 22, nombre_tickets: 3 },
    { heure: 23, nombre_tickets: 2 }
  ],
  flux_affluence_jours: [
    { jour_semaine: "Lundi", nombre_tickets: 180 },
    { jour_semaine: "Mardi", nombre_tickets: 165 },
    { jour_semaine: "Mercredi", nombre_tickets: 195 },
    { jour_semaine: "Jeudi", nombre_tickets: 175 },
    { jour_semaine: "Vendredi", nombre_tickets: 220 },
    { jour_semaine: "Samedi", nombre_tickets: 85 },
    { jour_semaine: "Dimanche", nombre_tickets: 25 }
  ],
  comparaison_periode: {
    periode_actuelle: "2024-01-01 - 2024-01-31",
    periode_precedente: "2023-12-01 - 2023-12-31",
    tickets_actuel: 1200,
    tickets_precedent: 1050,
    evolution_pourcentage: 14.3,
    temps_traitement_actuel: 25.5,
    temps_traitement_precedent: 28.2,
    evolution_temps_pourcentage: -9.6
  }
};
