
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TCPInfo: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="font-medium mb-4 text-lg">Informations sur le protocole TCP</h3>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="handshake">
          <AccordionTrigger>3-Way Handshake</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-700">
              La poignée de main en trois temps (three-way handshake) est le processus utilisé par TCP pour établir une connexion entre deux hôtes:
            </p>
            <ol className="list-decimal pl-5 mt-2 text-sm space-y-1 text-gray-700">
              <li>Le client envoie un paquet SYN au serveur avec un numéro de séquence initial.</li>
              <li>Le serveur répond avec un paquet SYN-ACK, reconnaissant le SYN du client et incluant son propre numéro de séquence.</li>
              <li>Le client envoie un paquet ACK au serveur, confirmant la réception du SYN du serveur.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="connection-termination">
          <AccordionTrigger>Fermeture de connexion</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-700">
              La terminaison d'une connexion TCP implique généralement quatre étapes:
            </p>
            <ol className="list-decimal pl-5 mt-2 text-sm space-y-1 text-gray-700">
              <li>Un hôte envoie un paquet FIN.</li>
              <li>L'autre hôte envoie un ACK pour confirmer la réception du FIN.</li>
              <li>Le second hôte envoie son propre paquet FIN lorsqu'il est prêt à fermer.</li>
              <li>Le premier hôte envoie un ACK final, puis attend généralement un délai (état TIME_WAIT) avant de fermer complètement.</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tcp-states">
          <AccordionTrigger>États TCP</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-700">
              Un socket TCP peut se trouver dans différents états au cours de sa durée de vie:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-gray-700">
              <li><span className="font-medium">CLOSED</span> - Aucune connexion active</li>
              <li><span className="font-medium">LISTEN</span> - En attente de demandes de connexion</li>
              <li><span className="font-medium">SYN_SENT</span> - Attente d'une réponse à une demande de connexion</li>
              <li><span className="font-medium">SYN_RECEIVED</span> - Attente de confirmation après avoir reçu et envoyé une demande de connexion</li>
              <li><span className="font-medium">ESTABLISHED</span> - Connexion établie, données peuvent être échangées</li>
              <li><span className="font-medium">FIN_WAIT_1/2</span> - États intermédiaires pendant la fermeture</li>
              <li><span className="font-medium">TIME_WAIT</span> - Attente pour s'assurer que l'autre côté a reçu l'ACK final</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="reliability">
          <AccordionTrigger>Fiabilité et contrôle de flux</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-gray-700">
              TCP assure la fiabilité grâce à plusieurs mécanismes:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm space-y-1 text-gray-700">
              <li>Numéros de séquence pour ordonner les paquets</li>
              <li>Acquittements (ACKs) pour confirmer la réception</li>
              <li>Retransmission des paquets perdus</li>
              <li>Contrôle de flux via fenêtre glissante</li>
              <li>Contrôle de congestion pour adapter le débit à l'état du réseau</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TCPInfo;
