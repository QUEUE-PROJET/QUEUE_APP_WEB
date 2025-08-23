// Utilitaires pour les rapports en temps réel
import { BASE_API_URL } from "~/utils/api";

export interface RapportWebSocketMessage {
  type: 'rapport_update' | 'rapport_generated' | 'error';
  data?: unknown;
  error?: string;
}

export class RapportWebSocket {
  private socket: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;

  constructor(
    private entrepriseId: string,
    private onMessage: (message: RapportWebSocketMessage) => void,
    private onError?: (error: Event) => void
  ) {}

  connect(): void {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const baseUrl = BASE_API_URL.replace(/^https?:\/\//, '');
      const socketUrl = `${wsProtocol}${baseUrl}/ws/rapports/${this.entrepriseId}`;
      
      this.socket = new WebSocket(socketUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connecté pour les rapports');
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event) => {
        try {
          const message: RapportWebSocketMessage = JSON.parse(event.data);
          this.onMessage(message);
        } catch (error) {
          console.error('Erreur lors du parsing du message WebSocket:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket fermé pour les rapports');
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('Erreur WebSocket rapports:', error);
        if (this.onError) {
          this.onError(error);
        }
      };
    } catch (error) {
      console.error('Erreur lors de la connexion WebSocket:', error);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
    }
  }

  requestRapportUpdate(dateDebut: string, dateFin: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        action: 'generate_rapport',
        date_debut: dateDebut,
        date_fin: dateFin
      }));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

// Hook React pour utiliser le WebSocket des rapports
export function useRapportWebSocket(
  entrepriseId: string | null,
  onRapportUpdate: (data: unknown) => void
) {
  let wsConnection: RapportWebSocket | null = null;

  const connect = () => {
    if (entrepriseId && typeof window !== 'undefined') {
      wsConnection = new RapportWebSocket(
        entrepriseId,
        (message) => {
          if (message.type === 'rapport_update' && message.data) {
            onRapportUpdate(message.data);
          }
        },
        (error) => {
          console.error('Erreur WebSocket:', error);
        }
      );
      wsConnection.connect();
    }
  };

  const disconnect = () => {
    if (wsConnection) {
      wsConnection.disconnect();
      wsConnection = null;
    }
  };

  const requestUpdate = (dateDebut: string, dateFin: string) => {
    if (wsConnection) {
      wsConnection.requestRapportUpdate(dateDebut, dateFin);
    }
  };

  return {
    connect,
    disconnect,
    requestUpdate
  };
}

// Utilitaire pour formater les données de rapport pour l'affichage
export function formatRapportData(rapport: any) {
  return {
    ...rapport,
    formattedDate: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}

// Utilitaire pour calculer les tendances
export function calculateTrend(current: number, previous: number): {
  percentage: number;
  direction: 'up' | 'down' | 'stable';
  color: string;
} {
  if (previous === 0) {
    return {
      percentage: current > 0 ? 100 : 0,
      direction: current > 0 ? 'up' : 'stable',
      color: current > 0 ? 'text-green-600' : 'text-gray-600'
    };
  }

  const percentage = ((current - previous) / previous) * 100;
  
  return {
    percentage: Math.abs(percentage),
    direction: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable',
    color: percentage > 0 ? 'text-green-600' : percentage < 0 ? 'text-red-600' : 'text-gray-600'
  };
}

// Utilitaire pour générer des couleurs pour les graphiques
export function generateChartColors(count: number): string[] {
  const baseColors = [
    '#00296b', '#003f88', '#00509d', '#fdc500', '#ffd500',
    '#2563eb', '#7c3aed', '#dc2626', '#059669', '#d97706'
  ];
  
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
}
