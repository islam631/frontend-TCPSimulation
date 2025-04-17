
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RefreshCw, Send, X } from "lucide-react";
import { tcpSimulation } from "../services/TCPSimulationService";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface TCPControlsProps {
  isConnected: boolean;
  isActive: boolean;
  onSpeedChange: (speed: number) => void;
}

const TCPControls: React.FC<TCPControlsProps> = ({ 
  isConnected,
  isActive,
  onSpeedChange
}) => {
  const [speed, setSpeed] = useState(1000);
  const [message, setMessage] = useState("");

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  const handleStartHandshake = () => {
    tcpSimulation.startHandshake();
    toast.success("Démarrage du 3-way handshake");
  };

  const handleReset = () => {
    tcpSimulation.resetSimulation();
    toast.info("Simulation réinitialisée");
  };

  const handleSendData = (from: 'client' | 'server') => {
    if (message.trim()) {
      tcpSimulation.sendData(from, message.trim());
      toast.success(`Données envoyées depuis ${from === 'client' ? 'le client' : 'le serveur'}`);
      setMessage("");
    } else {
      toast.error("Veuillez entrer un message");
    }
  };

  const handleTerminate = (initiator: 'client' | 'server') => {
    tcpSimulation.startTermination(initiator);
    toast.info(`Fermeture de connexion initiée par ${initiator === 'client' ? 'le client' : 'le serveur'}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="font-medium mb-4 text-lg">Contrôles de Simulation</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button 
          onClick={handleStartHandshake} 
          disabled={isActive}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Play className="mr-2 h-4 w-4" />
          Démarrer
        </Button>
        
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="border-gray-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Vitesse de simulation:</span>
          <span className="text-sm font-medium">{speed} ms</span>
        </div>
        <Slider 
          value={[speed]} 
          min={200} 
          max={2000} 
          step={100} 
          onValueChange={handleSpeedChange} 
        />
      </div>

      {isConnected && (
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send">Envoyer des données</TabsTrigger>
            <TabsTrigger value="terminate">Fermer la connexion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-4">
            <Textarea
              placeholder="Entrez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none border-gray-200"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleSendData('client')} 
                disabled={!isConnected || !message.trim()}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="mr-2 h-4 w-4" />
                Envoyer depuis Client
              </Button>
              
              <Button 
                onClick={() => handleSendData('server')} 
                disabled={!isConnected || !message.trim()}
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="mr-2 h-4 w-4" />
                Envoyer depuis Serveur
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="terminate" className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">
              Sélectionnez qui initie la fermeture de la connexion:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleTerminate('client')} 
                disabled={!isConnected}
                variant="outline"
                className="border-red-200 text-red-500 hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Fermer depuis Client
              </Button>
              
              <Button 
                onClick={() => handleTerminate('server')} 
                disabled={!isConnected}
                variant="outline"
                className="border-red-200 text-red-500 hover:bg-red-50"
              >
                <X className="mr-2 h-4 w-4" />
                Fermer depuis Serveur
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TCPControls;
