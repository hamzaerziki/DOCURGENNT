import { useState } from 'react';
import { Package2, MapPin, Clock, Euro, QrCode, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface DeliveryCommand {
  id: string;
  code: string;
  documentType: string;
  description: string;
  senderName: string;
  senderPhone: string;
  pickup: {
    location: string;
    address: string;
    timeWindow: string;
  };
  delivery: {
    city: string;
    country: string;
    requestedTime: string;
    specialInstructions?: string;
  };
  price: number;
  urgency: 'normal' | 'urgent' | 'express';
  status: 'available' | 'accepted' | 'collected' | 'in_transit' | 'delivered';
  matchScore: number;
}

const mockCommands: DeliveryCommand[] = [
  {
    id: '1',
    code: 'DR8H3K7M',
    documentType: 'Passport copy',
    description: 'Copie de passeport pour renouvellement',
    senderName: 'Marie Dubois',
    senderPhone: '+33 6 12 34 56 78',
    pickup: {
      location: 'Relay Point Châtelet',
      address: '1 Place du Châtelet, 75001 Paris',
      timeWindow: '09:00 - 19:00'
    },
    delivery: {
      city: 'Casablanca',
      country: 'Morocco',
      requestedTime: '2024-01-15 16:00',
      specialInstructions: 'Deliver to family member at address'
    },
    price: 25,
    urgency: 'urgent',
    status: 'available',
    matchScore: 95
  },
  {
    id: '2',
    code: 'DR9L4P2X',
    documentType: 'Birth certificate',
    description: 'Acte de naissance pour démarches administratives',
    senderName: 'Ahmed Benali',
    senderPhone: '+33 6 87 65 43 21',
    pickup: {
      location: 'Relay Point République',
      address: '15 Boulevard du Temple, 75003 Paris',
      timeWindow: '08:00 - 20:00'
    },
    delivery: {
      city: 'Casablanca',
      country: 'Morocco',
      requestedTime: '2024-01-15 14:00',
      specialInstructions: 'Call recipient before delivery'
    },
    price: 20,
    urgency: 'normal',
    status: 'available',
    matchScore: 88
  },
  {
    id: '3',
    code: 'DR5K8N9Q',
    documentType: 'Legal documents',
    description: 'Documents juridiques urgents',
    senderName: 'Sarah Martin',
    senderPhone: '+33 6 45 32 16 89',
    pickup: {
      location: 'Relay Point Bastille',
      address: '12 Rue de la Bastille, 75004 Paris',
      timeWindow: '10:00 - 18:00'
    },
    delivery: {
      city: 'Casablanca',
      country: 'Morocco',
      requestedTime: '2024-01-15 18:00',
    },
    price: 35,
    urgency: 'express',
    status: 'accepted',
    matchScore: 92
  }
];

export const CommandsDashboard = ({ 
  currentCity = "Paris", 
  tripDestination = "Casablanca",
  arrivalTime = "2024-01-15 15:30"
}: {
  currentCity?: string;
  tripDestination?: string;
  arrivalTime?: string;
}) => {
  const { toast } = useToast();
  const [commands, setCommands] = useState(mockCommands);
  const [selectedCommand, setSelectedCommand] = useState<string | null>(null);

  const handleAcceptCommand = (commandId: string) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId ? { ...cmd, status: 'accepted' as const } : cmd
    ));
    toast({
      title: "Command Accepted",
      description: "You can now collect this document from the Point de Relais.",
    });
  };

  const handleCollectCommand = (commandId: string) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId ? { ...cmd, status: 'collected' as const } : cmd
    ));
    toast({
      title: "Document Collected",
      description: "Document is now in your possession. Safe travels!",
    });
  };

  const handleMarkDelivered = (commandId: string) => {
    setCommands(prev => prev.map(cmd => 
      cmd.id === commandId ? { ...cmd, status: 'delivered' as const } : cmd
    ));
    toast({
      title: "Delivery Confirmed",
      description: "Great job! Your earnings have been added to your account.",
    });
  };

  const getStatusColor = (status: DeliveryCommand['status']) => {
    switch (status) {
      case 'available': return 'default';
      case 'accepted': return 'secondary';
      case 'collected': return 'warning';
      case 'in_transit': return 'warning';
      case 'delivered': return 'verified';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency: DeliveryCommand['urgency']) => {
    switch (urgency) {
      case 'express': return 'destructive';
      case 'urgent': return 'warning';
      case 'normal': return 'secondary';
      default: return 'secondary';
    }
  };

  const availableCommands = commands.filter(cmd => cmd.status === 'available');
  const acceptedCommands = commands.filter(cmd => ['accepted', 'collected', 'in_transit'].includes(cmd.status));
  const completedCommands = commands.filter(cmd => cmd.status === 'delivered');

  const totalEarnings = completedCommands.reduce((sum, cmd) => sum + cmd.price, 0);
  const potentialEarnings = acceptedCommands.reduce((sum, cmd) => sum + cmd.price, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-card p-6 rounded-lg shadow-card">
        <h2 className="text-2xl font-bold mb-2">Available Commands (CMDS)</h2>
        <p className="text-muted-foreground mb-4">
          Documents ready for pickup in {currentCity} → {tripDestination}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Available: {availableCommands.length}</span>
            </div>
          </div>
          <div className="bg-background/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Euro className="w-5 h-5 text-success" />
              <span className="font-medium">Potential: €{potentialEarnings}</span>
            </div>
          </div>
          <div className="bg-background/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-warning" />
              <span className="font-medium">Completed: {completedCommands.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Commands */}
      {availableCommands.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Available for Pickup</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availableCommands.map(command => (
              <Card key={command.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package2 className="w-5 h-5 text-primary" />
                      <span className="font-medium">{command.documentType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={command.urgency === 'express' ? 'destructive' : command.urgency === 'urgent' ? 'secondary' : 'outline'}>
                        {command.urgency}
                      </Badge>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success">€{command.price}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">From:</span>
                      <span>{command.senderName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {command.description}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{command.pickup.location}</div>
                        <div className="text-muted-foreground">{command.pickup.address}</div>
                        <div className="text-muted-foreground">Open: {command.pickup.timeWindow}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Deliver by: {new Date(command.delivery.requestedTime).toLocaleString()}</span>
                    </div>
                  </div>

                  {command.delivery.specialInstructions && (
                    <div className="bg-muted/30 p-3 rounded text-sm">
                      <strong>Special instructions:</strong> {command.delivery.specialInstructions}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">
                        {command.matchScore}% match with your trip
                      </span>
                    </div>
                    <Button onClick={() => handleAcceptCommand(command.id)} size="sm">
                      Accept Command
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Commands */}
      {acceptedCommands.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Active Commands</h3>
          <div className="space-y-4">
            {acceptedCommands.map(command => (
              <Card key={command.id} className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{command.documentType}</div>
                        <div className="text-sm text-muted-foreground">Code: {command.code}</div>
                        <Badge variant={command.status === 'delivered' ? 'verified' : command.status === 'available' ? 'secondary' : 'outline'} className="mt-1">
                          {command.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">€{command.price}</div>
                      <div className="text-sm text-muted-foreground">From: {command.senderName}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{command.pickup.location}</div>
                      <div className="text-muted-foreground">{command.pickup.address}</div>
                    </div>
                    
                    {command.status === 'accepted' && (
                      <Button onClick={() => handleCollectCommand(command.id)} size="sm">
                        Mark as Collected
                      </Button>
                    )}
                    
                    {command.status === 'collected' && (
                      <Button onClick={() => handleMarkDelivered(command.id)} size="sm" variant="outline">
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Commands Available */}
      {availableCommands.length === 0 && acceptedCommands.length === 0 && (
        <Card className="p-8 text-center">
          <Package2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Commands Available</h3>
          <p className="text-muted-foreground">
            No documents available for pickup in {currentCity} that match your {tripDestination} destination.
          </p>
        </Card>
      )}
    </div>
  );
};