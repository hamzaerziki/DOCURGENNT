import { useState } from 'react';
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Phone, Mail, QrCode, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { RatingModal } from '@/components/rating/RatingModal';

interface DeliveryRequest {
  id: string;
  trackingCode: string;
  senderName: string;
  travelerName: string;
  documentType: string;
  description: string;
  deliveryCode: string;
  status: 'pending' | 'in_transit' | 'arrived' | 'delivered' | 'confirmed';
  estimatedArrival: string;
  actualArrival?: string;
  deliveryAddress: string;
  specialInstructions?: string;
  urgency: 'normal' | 'urgent' | 'express';
  ratingSubmitted?: boolean;
}

const mockDeliveries: DeliveryRequest[] = [
  {
    id: '1',
    trackingCode: 'DOC001FR',
    senderName: 'Marie Dubois',
    travelerName: 'Ahmed Ben Ali',
    documentType: 'Passeport',
    description: 'Copie de passeport pour renouvellement',
    deliveryCode: '789456',
    status: 'arrived',
    estimatedArrival: '2024-01-15T16:00:00',
    actualArrival: '2024-01-15T15:45:00',
    deliveryAddress: '123 Rue Hassan II, Casablanca',
    specialInstructions: 'Appeler avant la livraison',
    urgency: 'urgent'
  },
  {
    id: '2',
    trackingCode: 'DOC002FR',
    senderName: 'Pierre Martin',
    travelerName: 'Fatima El Mansouri',
    documentType: 'Acte de naissance',
    description: 'Acte de naissance pour démarches administratives',
    deliveryCode: '123789',
    status: 'in_transit',
    estimatedArrival: '2024-01-16T14:00:00',
    deliveryAddress: '45 Avenue Mohammed V, Rabat',
    urgency: 'normal'
  }
];

export const RecipientDashboard = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [deliveryCode, setDeliveryCode] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [deliveryToRate, setDeliveryToRate] = useState<DeliveryRequest | null>(null);

  const handleConfirmDelivery = (deliveryId: string, code: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    
    if (!delivery) return;
    
    if (code !== delivery.deliveryCode) {
      toast({
        title: "Code incorrect",
        description: "Le code de livraison saisi ne correspond pas.",
        variant: "destructive"
      });
      return;
    }

    setDeliveries(prev => prev.map(d => 
      d.id === deliveryId 
        ? { ...d, status: 'confirmed' as const }
        : d
    ));

    toast({
      title: "Livraison confirmée",
      description: "Merci ! La livraison a été confirmée avec succès.",
    });

    setDeliveryCode('');
    setSelectedDelivery(null);

    // Open rating modal after confirmation
    const confirmedDelivery = deliveries.find(d => d.id === deliveryId);
    if (confirmedDelivery) {
      setDeliveryToRate(confirmedDelivery);
      setRatingModalOpen(true);
    }
  };

  const handleSubmitRating = async (ratingData: any) => {
    // Mock API call to submit rating
    console.log('Rating submitted:', ratingData);
    
    // Update delivery with rating submitted flag
    if (deliveryToRate) {
      setDeliveries(prev => prev.map(d => 
        d.id === deliveryToRate.id 
          ? { ...d, ratingSubmitted: true }
          : d
      ));
    }
    
    setDeliveryToRate(null);
    setRatingModalOpen(false);
  };

  const handleOpenRatingModal = (delivery: DeliveryRequest) => {
    setDeliveryToRate(delivery);
    setRatingModalOpen(true);
  };

  const getStatusColor = (status: DeliveryRequest['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_transit': return 'warning';
      case 'arrived': return 'verified';
      case 'delivered': return 'verified';
      case 'confirmed': return 'verified';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: DeliveryRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_transit': return <Package className="w-4 h-4" />;
      case 'arrived': return <MapPin className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: DeliveryRequest['urgency']) => {
    switch (urgency) {
      case 'express': return 'destructive';
      case 'urgent': return 'warning';
      case 'normal': return 'secondary';
      default: return 'secondary';
    }
  };

  const pendingDeliveries = deliveries.filter(d => ['arrived', 'delivered'].includes(d.status));
  const inTransitDeliveries = deliveries.filter(d => d.status === 'in_transit');
  const completedDeliveries = deliveries.filter(d => d.status === 'confirmed');

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de Bord Destinataire</h1>
              <p className="text-muted-foreground">Suivez et confirmez la réception de vos documents</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">En attente de confirmation</p>
                    <p className="text-2xl font-bold text-warning">{pendingDeliveries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">En transit</p>
                    <p className="text-2xl font-bold text-primary">{inTransitDeliveries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Livrés</p>
                    <p className="text-2xl font-bold text-success">{completedDeliveries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pending Deliveries - Need Confirmation */}
        {pendingDeliveries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-warning">
              ⚠️ Action Requise - Confirmez la réception
            </h2>
            <div className="space-y-4">
              {pendingDeliveries.map((delivery) => (
                <Card key={delivery.id} className="border-warning/20 bg-warning/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{delivery.documentType}</h3>
                          <p className="text-sm text-muted-foreground">Code: {delivery.trackingCode}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getStatusColor(delivery.status)}>
                              {delivery.status === 'arrived' ? 'Arrivé' : 'Livré'}
                            </Badge>
                            <Badge variant={getUrgencyColor(delivery.urgency)}>
                              {delivery.urgency}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Expéditeur:</p>
                        <p className="text-muted-foreground">{delivery.senderName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Voyageur:</p>
                        <p className="text-muted-foreground">{delivery.travelerName}</p>
                        {delivery.actualArrival && (
                          <p className="text-muted-foreground">
                            Arrivé: {new Date(delivery.actualArrival).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <QrCode className="w-5 h-5 text-primary" />
                        <span className="font-medium">Confirmation de livraison</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Le voyageur vous donnera un code à 6 chiffres. Saisissez-le ci-dessous pour confirmer la réception.
                      </p>
                      
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Code de livraison:</label>
                        <InputOTP
                          maxLength={6}
                          value={selectedDelivery === delivery.id ? deliveryCode : ''}
                          onChange={(val) => {
                            setDeliveryCode(val);
                            setSelectedDelivery(delivery.id);
                          }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" onClick={() => setSelectedDelivery(null)} className="flex-1">
                            Retour
                          </Button>
                          <Button 
                            onClick={() => handleConfirmDelivery(delivery.id, deliveryCode)}
                            disabled={deliveryCode.length !== 6 || selectedDelivery !== delivery.id}
                            className="w-full"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmer la réception
                          </Button>
                        </div>
                      </div>
                    </div>

                    {delivery.specialInstructions && (
                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <strong>Instructions spéciales:</strong> {delivery.specialInstructions}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* In Transit Deliveries */}
        {inTransitDeliveries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Documents en transit</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {inTransitDeliveries.map((delivery) => (
                <Card key={delivery.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{delivery.documentType}</h3>
                          <p className="text-sm text-muted-foreground">Code: {delivery.trackingCode}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(delivery.status)}>
                        En transit
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Arrivée estimée:</p>
                      <p className="text-muted-foreground">
                        {new Date(delivery.estimatedArrival).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Voyageur:</p>
                      <p className="text-muted-foreground">{delivery.travelerName}</p>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium">Adresse de livraison:</p>
                      <p className="text-muted-foreground">{delivery.deliveryAddress}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Deliveries */}
        {completedDeliveries.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Livraisons terminées</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedDeliveries.map((delivery) => (
                <Card key={delivery.id} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{delivery.documentType}</h3>
                          <p className="text-sm text-muted-foreground">Code: {delivery.trackingCode}</p>
                        </div>
                      </div>
                      <Badge variant="verified">
                        Confirmé
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">Expéditeur:</p>
                      <p className="text-muted-foreground">{delivery.senderName}</p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="font-medium">Voyageur:</p>
                      <p className="text-muted-foreground">{delivery.travelerName}</p>
                    </div>

                    {!delivery.ratingSubmitted && (
                      <div className="pt-2 border-t">
                        <Button 
                          onClick={() => handleOpenRatingModal(delivery)}
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Évaluer le voyageur
                        </Button>
                      </div>
                    )}

                    {delivery.ratingSubmitted && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>Évaluation envoyée</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Deliveries */}
        {deliveries.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Aucune livraison en cours</p>
              <p className="text-sm mt-2">Vos documents apparaîtront ici quand ils seront en route</p>
            </div>
          </Card>
        )}

        {/* Rating Modal */}
        {deliveryToRate && (
          <RatingModal
            isOpen={ratingModalOpen}
            onClose={() => {
              setRatingModalOpen(false);
              setDeliveryToRate(null);
            }}
            travelerName={deliveryToRate.travelerName}
            deliveryId={deliveryToRate.id}
            userType="recipient"
            onSubmitRating={handleSubmitRating}
          />
        )}
      </div>
    </div>
  );
};
