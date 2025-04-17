
import React from "react";
import { Computer, Server } from "lucide-react";
import { TCPState } from "../types/tcp";
import { cn } from "@/lib/utils";

interface TCPHostProps {
  type: 'client' | 'server';
  state: TCPState;
  className?: string;
}

const TCPHost: React.FC<TCPHostProps> = ({ type, state, className }) => {
  // Define colors based on state
  const getStateColor = () => {
    switch (state) {
      case 'CLOSED':
        return 'text-gray-400';
      case 'LISTEN':
        return 'text-blue-400';
      case 'SYN_SENT':
      case 'SYN_RECEIVED':
        return 'text-yellow-400';
      case 'ESTABLISHED':
        return 'text-green-500';
      case 'FIN_WAIT_1':
      case 'FIN_WAIT_2':
      case 'CLOSING':
      case 'TIME_WAIT':
      case 'CLOSE_WAIT':
      case 'LAST_ACK':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn(
        "w-20 h-20 rounded-lg flex items-center justify-center bg-gray-100 border-2",
        getStateColor()
      )}>
        {type === 'client' ? (
          <Computer size={40} className={getStateColor()} />
        ) : (
          <Server size={40} className={getStateColor()} />
        )}
      </div>
      <div className="mt-2 text-sm font-medium">{type === 'client' ? 'Client' : 'Server'}</div>
      <div className={cn("text-xs mt-1 px-2 py-1 rounded-full", getStateColor(), "bg-opacity-20 bg-current")}>
        {state}
      </div>
    </div>
  );
};

export default TCPHost;
