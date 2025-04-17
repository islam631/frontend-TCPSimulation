
import { TCPConnection } from "../types/tcp";

// URL de base pour l'API - À modifier selon votre configuration backend
const API_BASE_URL = '/api';

// Interface pour les réponses API
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Service pour les appels API
export const apiService = {
  // Récupérer les exemples de scénarios TCP prédéfinis
  async getTCPScenarios(): Promise<ApiResponse<string[]>> {
    try {
      // Simulation d'appel API - À remplacer par une véritable implémentation
      // const response = await fetch(`${API_BASE_URL}/scenarios`);
      // return await response.json();
      
      // Données simulées pour le frontend
      return {
        data: [
          "Connexion TCP standard",
          "Connexion TCP avec perte de paquets",
          "Connexion TCP avec congestion réseau"
        ],
        status: 200
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des scénarios:", error);
      return {
        data: [],
        status: 500,
        message: "Erreur lors de la récupération des scénarios"
      };
    }
  },
  
  // Sauvegarder l'état d'une simulation TCP
  async saveTCPSimulation(simulation: TCPConnection): Promise<ApiResponse<{ id: string }>> {
    try {
      // Simulation d'appel API - À remplacer par une véritable implémentation
      // const response = await fetch(`${API_BASE_URL}/simulations`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(simulation),
      // });
      // return await response.json();
      
      // Réponse simulée
      return {
        data: { id: `sim_${Date.now()}` },
        status: 201,
        message: "Simulation sauvegardée avec succès"
      };
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la simulation:", error);
      return {
        data: { id: "" },
        status: 500,
        message: "Erreur lors de la sauvegarde de la simulation"
      };
    }
  },
  
  // Charger une simulation TCP existante
  async loadTCPSimulation(id: string): Promise<ApiResponse<TCPConnection | null>> {
    try {
      // Simulation d'appel API - À remplacer par une véritable implémentation
      // const response = await fetch(`${API_BASE_URL}/simulations/${id}`);
      // return await response.json();
      
      // Données simulées
      return {
        data: null, // Une vraie API retournerait une simulation complète
        status: 404,
        message: "Simulation non trouvée"
      };
    } catch (error) {
      console.error("Erreur lors du chargement de la simulation:", error);
      return {
        data: null,
        status: 500,
        message: "Erreur lors du chargement de la simulation"
      };
    }
  }
};
