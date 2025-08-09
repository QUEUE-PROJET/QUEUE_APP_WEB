export type UserRole = 
  | "ADMINISTRATEUR" 
  | "ENTREPRISE_AGENT"; 
  

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  email_verified: boolean;
  entreprise?: {
    id: string;
    name: string;
    statut: "EN_ATTENTE" | "ACCEPTEE" | "REJETEE";
  };
}


export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' |'warning' | 'error' | 'info';
    is_read: boolean;
    created_at: string;
    // autres champs selon votre API
}


// Interfaces pour les types Service et Agence
export interface Service {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  agence_id: string;
  entreprise_id?: string; // Ajouté pour correspondre à votre backend
  // Ajoutez d'autres champs si nécessaire
}

export interface Agence {
  id: string;
  name: string;
  adresse?: string;
  created_at: string;
  entreprise_id?: string;
  // Ajoutez d'autres champs si nécessaire
}