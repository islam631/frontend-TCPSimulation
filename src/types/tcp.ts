
export type TCPState = 
  | 'CLOSED' 
  | 'LISTEN'
  | 'SYN_SENT' 
  | 'SYN_RECEIVED'
  | 'ESTABLISHED'
  | 'FIN_WAIT_1'
  | 'FIN_WAIT_2'
  | 'CLOSING'
  | 'TIME_WAIT'
  | 'CLOSE_WAIT'
  | 'LAST_ACK';

export type PacketType = 'SYN' | 'ACK' | 'SYN-ACK' | 'FIN' | 'FIN-ACK' | 'DATA' | 'RST';

export interface Packet {
  id: string;
  type: PacketType;
  from: 'client' | 'server';
  to: 'client' | 'server';
  data?: string;
  sequence?: number;
  acknowledgment?: number;
  timestamp: number;
}

export interface TCPConnection {
  clientState: TCPState;
  serverState: TCPState;
  packets: Packet[];
  clientSequence: number;
  serverSequence: number;
  lastClientAck: number;
  lastServerAck: number;
  isActive: boolean;
}
