
import React, { useEffect, useRef, useState } from "react";
import { Packet } from "../types/tcp";
import { cn } from "@/lib/utils";

interface TCPPacketProps {
  packet: Packet;
  onAnimationComplete?: () => void;
}

const TCPPacket: React.FC<TCPPacketProps> = ({ packet, onAnimationComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const packetRef = useRef<HTMLDivElement>(null);

  // Determine packet color based on type
  const getPacketColor = () => {
    switch (packet.type) {
      case 'SYN':
      case 'SYN-ACK':
        return 'bg-tcp-syn';
      case 'ACK':
        return 'bg-tcp-ack';
      case 'FIN':
      case 'FIN-ACK':
        return 'bg-tcp-fin';
      case 'DATA':
        return 'bg-tcp-data';
      default:
        return 'bg-gray-400';
    }
  };

  // Determine animation direction
  const getAnimation = () => {
    return packet.from === 'client' ? 'animate-slide-right' : 'animate-slide-left';
  };

  useEffect(() => {
    const animationEndHandler = () => {
      setIsAnimating(false);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    };

    const element = packetRef.current;
    if (element) {
      element.addEventListener('animationend', animationEndHandler);
      return () => {
        element.removeEventListener('animationend', animationEndHandler);
      };
    }
  }, [onAnimationComplete]);

  return (
    <div 
      ref={packetRef}
      className={cn(
        "absolute w-16 h-8 rounded-md flex items-center justify-center text-xs font-medium text-white shadow-md",
        getPacketColor(),
        isAnimating ? getAnimation() : "opacity-0 transition-opacity duration-500"
      )}
      style={{
        left: packet.from === 'client' ? '5%' : '95%',
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      {packet.type}
    </div>
  );
};

export default TCPPacket;
