
import React, { useState, useEffect } from "react";
import TCPHost from "./TCPHost";
import TCPPacket from "./TCPPacket";
import TCPControls from "./TCPControls";
import TCPPacketHistory from "./TCPPacketHistory";
import TCPInfo from "./TCPInfo";
import { tcpSimulation } from "../services/TCPSimulationService";
import { Packet, TCPConnection } from "../types/tcp";
import { Card } from "@/components/ui/card";

const TCPSimulator: React.FC = () => {
  const [connection, setConnection] = useState<TCPConnection>(tcpSimulation.getConnection());
  const [visiblePackets, setVisiblePackets] = useState<Packet[]>([]);
  
  useEffect(() => {
    // Listen for connection state changes
    tcpSimulation.addEventListener('stateChanged', (updatedConnection) => {
      setConnection({ ...updatedConnection });
    });
    
    tcpSimulation.addEventListener('simulationStarted', (updatedConnection) => {
      setConnection({ ...updatedConnection });
    });
    
    tcpSimulation.addEventListener('connectionEstablished', (updatedConnection) => {
      setConnection({ ...updatedConnection });
    });
    
    tcpSimulation.addEventListener('connectionClosed', (updatedConnection) => {
      setConnection({ ...updatedConnection });
    });
    
    tcpSimulation.addEventListener('simulationReset', (updatedConnection) => {
      setConnection({ ...updatedConnection });
      setVisiblePackets([]);
    });
    
    // Listen for packet events
    tcpSimulation.addPacketListener('packetSent', (packet) => {
      setVisiblePackets(prev => [...prev, packet]);
      // Update connection state to get latest packets
      setConnection(tcpSimulation.getConnection());
    });
    
    return () => {
      // This would typically clean up event listeners, but our service doesn't support that yet
    };
  }, []);

  const handleSpeedChange = (speed: number) => {
    tcpSimulation.setSimulationSpeed(speed);
  };

  const handlePacketAnimationComplete = (packetId: string) => {
    setVisiblePackets(prev => prev.filter(p => p.id !== packetId));
  };

  const isConnected = connection.clientState === 'ESTABLISHED' && connection.serverState === 'ESTABLISHED';

  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto">
      <Card className="p-8 relative overflow-hidden border-none shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <TCPHost
            type="client"
            state={connection.clientState}
          />
          
          <div className="flex-1 relative h-1 bg-gray-200 mx-8">
            {/* Connection line */}
            <div className={`absolute inset-0 h-1 ${isConnected ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-500`}></div>
            
            {/* Packet animations */}
            {visiblePackets.map(packet => (
              <TCPPacket 
                key={packet.id} 
                packet={packet}
                onAnimationComplete={() => handlePacketAnimationComplete(packet.id)}
              />
            ))}
          </div>
          
          <TCPHost
            type="server"
            state={connection.serverState}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TCPControls 
            isConnected={isConnected}
            isActive={connection.isActive}
            onSpeedChange={handleSpeedChange}
          />
          
          <TCPPacketHistory packets={connection.packets} />
        </div>
      </Card>
      
      <TCPInfo />
    </div>
  );
};

export default TCPSimulator;
