
import React from "react";
import { Packet } from "../types/tcp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";

interface TCPPacketHistoryProps {
  packets: Packet[];
}

const TCPPacketHistory: React.FC<TCPPacketHistoryProps> = ({ packets }) => {
  // Function to determine badge color based on packet type
  const getPacketBadgeColor = (type: string) => {
    switch (type) {
      case 'SYN':
      case 'SYN-ACK':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ACK':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'FIN':
      case 'FIN-ACK':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'DATA':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Helper for direction icon
  const DirectionIcon = ({ from, to }: { from: string; to: string }) => {
    if (from === 'client' && to === 'server') {
      return <ArrowRight className="h-4 w-4 text-gray-500" />;
    } else {
      return <ArrowLeft className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format timestamp to user-friendly time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="font-medium mb-4 text-lg flex items-center">
        Historique des Paquets
        <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
          {packets.length} paquets
        </span>
      </h3>
      
      <ScrollArea className="h-[300px] w-full pr-4">
        <div className="space-y-2">
          {packets.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              Aucun paquet pour l'instant
            </div>
          ) : (
            packets.map((packet) => (
              <div 
                key={packet.id} 
                className="border rounded-md p-2 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium border",
                    getPacketBadgeColor(packet.type)
                  )}>
                    {packet.type}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium">
                      {packet.from === 'client' ? 'Client' : 'Server'}
                    </span>
                    <DirectionIcon from={packet.from} to={packet.to} />
                    <span className="text-xs font-medium">
                      {packet.to === 'client' ? 'Client' : 'Server'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {packet.data && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-[100px]">
                      {packet.data}
                    </span>
                  )}
                  
                  <div className="flex flex-col items-end text-[10px] text-gray-500">
                    <span>SEQ: {packet.sequence}</span>
                    <span>ACK: {packet.acknowledgment}</span>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    {formatTime(packet.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TCPPacketHistory;
