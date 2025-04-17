
import { Packet, TCPState, TCPConnection, PacketType } from "../types/tcp";

export class TCPSimulationService {
  private connection: TCPConnection;
  private eventListeners: Map<string, ((connection: TCPConnection) => void)[]>;
  private packetEventListeners: Map<string, ((packet: Packet) => void)[]>;
  private simulationSpeed: number;
  private timeoutIds: NodeJS.Timeout[];

  constructor() {
    this.connection = this.getInitialConnection();
    this.eventListeners = new Map();
    this.packetEventListeners = new Map();
    this.simulationSpeed = 1000; // 1 second by default
    this.timeoutIds = [];
  }

  private getInitialConnection(): TCPConnection {
    return {
      clientState: 'CLOSED',
      serverState: 'LISTEN',
      packets: [],
      clientSequence: Math.floor(Math.random() * 1000),
      serverSequence: Math.floor(Math.random() * 1000),
      lastClientAck: 0,
      lastServerAck: 0,
      isActive: false
    };
  }

  public addEventListener(event: string, callback: (connection: TCPConnection) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  public addPacketListener(event: string, callback: (packet: Packet) => void): void {
    if (!this.packetEventListeners.has(event)) {
      this.packetEventListeners.set(event, []);
    }
    this.packetEventListeners.get(event)?.push(callback);
  }

  private emitEvent(event: string): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(this.connection));
  }

  private emitPacketEvent(event: string, packet: Packet): void {
    const listeners = this.packetEventListeners.get(event) || [];
    listeners.forEach(listener => listener(packet));
  }

  private addPacket(type: PacketType, from: 'client' | 'server', to: 'client' | 'server', data?: string): Packet {
    let sequence = from === 'client' ? this.connection.clientSequence : this.connection.serverSequence;
    let acknowledgment = from === 'client' ? this.connection.lastClientAck : this.connection.lastServerAck;

    const packet: Packet = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      from,
      to,
      data,
      sequence,
      acknowledgment,
      timestamp: Date.now()
    };

    this.connection.packets.push(packet);
    this.emitPacketEvent('packetSent', packet);
    
    // Update sequences and acknowledgements
    if (type.includes('SYN')) {
      if (from === 'client') {
        this.connection.clientSequence += 1;
      } else {
        this.connection.serverSequence += 1;
      }
    }
    
    if (type.includes('ACK')) {
      if (from === 'client') {
        this.connection.lastClientAck = this.connection.serverSequence;
      } else {
        this.connection.lastServerAck = this.connection.clientSequence;
      }
    }
    
    if (data) {
      if (from === 'client') {
        this.connection.clientSequence += data.length;
      } else {
        this.connection.serverSequence += data.length;
      }
    }

    return packet;
  }

  private updateState(entity: 'client' | 'server', newState: TCPState): void {
    if (entity === 'client') {
      this.connection.clientState = newState;
    } else {
      this.connection.serverState = newState;
    }
    this.emitEvent('stateChanged');
  }

  public startHandshake(): void {
    this.connection.isActive = true;
    this.emitEvent('simulationStarted');
    
    // Step 1: Client sends SYN
    this.updateState('client', 'SYN_SENT');
    this.addPacket('SYN', 'client', 'server');
    
    // Step 2: Server sends SYN-ACK
    const timeoutId1 = setTimeout(() => {
      this.updateState('server', 'SYN_RECEIVED');
      this.addPacket('SYN-ACK', 'server', 'client');
      
      // Step 3: Client sends ACK
      const timeoutId2 = setTimeout(() => {
        this.updateState('client', 'ESTABLISHED');
        this.updateState('server', 'ESTABLISHED');
        this.addPacket('ACK', 'client', 'server');
        this.emitEvent('connectionEstablished');
      }, this.simulationSpeed);
      
      this.timeoutIds.push(timeoutId2);
    }, this.simulationSpeed);
    
    this.timeoutIds.push(timeoutId1);
  }

  public sendData(from: 'client' | 'server', data: string): void {
    if (this.connection.clientState !== 'ESTABLISHED' || this.connection.serverState !== 'ESTABLISHED') {
      console.error("Cannot send data: connection not established");
      return;
    }
    
    // Send data packet
    this.addPacket('DATA', from, from === 'client' ? 'server' : 'client', data);
    
    // Simulate ACK after data
    const timeoutId = setTimeout(() => {
      this.addPacket('ACK', from === 'client' ? 'server' : 'client', from);
    }, this.simulationSpeed);
    
    this.timeoutIds.push(timeoutId);
  }

  public startTermination(initiator: 'client' | 'server'): void {
    if (this.connection.clientState !== 'ESTABLISHED' || this.connection.serverState !== 'ESTABLISHED') {
      console.error("Cannot terminate: connection not in ESTABLISHED state");
      return;
    }
    
    // Step 1: Initiator sends FIN
    if (initiator === 'client') {
      this.updateState('client', 'FIN_WAIT_1');
      this.addPacket('FIN', 'client', 'server');
      
      // Step 2: Server sends ACK
      const timeoutId1 = setTimeout(() => {
        this.updateState('server', 'CLOSE_WAIT');
        this.addPacket('ACK', 'server', 'client');
        this.updateState('client', 'FIN_WAIT_2');
        
        // Step 3: Server sends FIN
        const timeoutId2 = setTimeout(() => {
          this.updateState('server', 'LAST_ACK');
          this.addPacket('FIN', 'server', 'client');
          
          // Step 4: Client sends ACK
          const timeoutId3 = setTimeout(() => {
            this.updateState('client', 'TIME_WAIT');
            this.addPacket('ACK', 'client', 'server');
            
            // After TIME_WAIT (simplified)
            const timeoutId4 = setTimeout(() => {
              this.updateState('client', 'CLOSED');
              this.updateState('server', 'CLOSED');
              this.connection.isActive = false;
              this.emitEvent('connectionClosed');
            }, this.simulationSpeed * 2);
            
            this.timeoutIds.push(timeoutId4);
          }, this.simulationSpeed);
          
          this.timeoutIds.push(timeoutId3);
        }, this.simulationSpeed);
        
        this.timeoutIds.push(timeoutId2);
      }, this.simulationSpeed);
      
      this.timeoutIds.push(timeoutId1);
    } else {
      // Similar steps for server-initiated termination
      this.updateState('server', 'FIN_WAIT_1');
      this.addPacket('FIN', 'server', 'client');
      
      const timeoutId1 = setTimeout(() => {
        this.updateState('client', 'CLOSE_WAIT');
        this.addPacket('ACK', 'client', 'server');
        this.updateState('server', 'FIN_WAIT_2');
        
        const timeoutId2 = setTimeout(() => {
          this.updateState('client', 'LAST_ACK');
          this.addPacket('FIN', 'client', 'server');
          
          const timeoutId3 = setTimeout(() => {
            this.updateState('server', 'TIME_WAIT');
            this.addPacket('ACK', 'server', 'client');
            
            const timeoutId4 = setTimeout(() => {
              this.updateState('server', 'CLOSED');
              this.updateState('client', 'CLOSED');
              this.connection.isActive = false;
              this.emitEvent('connectionClosed');
            }, this.simulationSpeed * 2);
            
            this.timeoutIds.push(timeoutId4);
          }, this.simulationSpeed);
          
          this.timeoutIds.push(timeoutId3);
        }, this.simulationSpeed);
        
        this.timeoutIds.push(timeoutId2);
      }, this.simulationSpeed);
      
      this.timeoutIds.push(timeoutId1);
    }
  }

  public resetSimulation(): void {
    // Clear all pending timeouts
    this.timeoutIds.forEach(id => clearTimeout(id));
    this.timeoutIds = [];
    
    // Reset connection
    this.connection = this.getInitialConnection();
    this.emitEvent('simulationReset');
  }

  public setSimulationSpeed(speedMs: number): void {
    this.simulationSpeed = speedMs;
  }

  public getConnection(): TCPConnection {
    return { ...this.connection };
  }
}

export const tcpSimulation = new TCPSimulationService();
