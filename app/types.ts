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