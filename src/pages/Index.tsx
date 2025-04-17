
import React from "react";
import TCPSimulator from "@/components/TCPSimulator";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simulateur de Protocole TCP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualisez l'établissement de la connexion, l'échange de données et la fermeture 
            de connexion du protocole TCP de manière interactive.
          </p>
        </div>
        
        <TCPSimulator />

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            Ce simulateur vous permet de comprendre le fonctionnement du protocole TCP en visualisant
            ses différentes phases et états. Utilisez les contrôles pour interagir avec la simulation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
