import { useState } from 'react';
import { Users, MapPin, Calendar, FileText, Check, X, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

interface Request {
  id: string;
  senderName: string;
  senderEmail: string;
  destinationCity: string;
  documentType: string;
  requestedDate: string;
  message: string;
  offeredPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  escrowStatus?: 'held' | 'released' | 'refunded' | 'none';
}

const mockRequests: Request[] = [
  {
    id: '1',
    senderName: 'Marie Dubois',
    senderEmail: 'marie.dubois@email.com',
    destinationCity: 'Casablanca',
    documentType: 'Passport copy',
    requestedDate: '2024-01-15',
    message: 'Bonjour, je dois envoyer une copie de passeport à ma famille. Merci beaucoup!',
    offeredPrice: 25,
    status: 'pending',
    createdAt: '2024-01-10',
    escrowStatus: 'none'
  },
  {
    id: '2',
    senderName: 'Pierre Martin',
    senderEmail: 'pierre.martin@email.com',
    destinationCity: 'Tunis',
    documentType: 'Birth certificate',
    requestedDate: '2024-01-18',
    message: 'I need to send a birth certificate urgently for administrative purposes.',
    offeredPrice: 30,
    status: 'pending',
    createdAt: '2024-01-12',
    escrowStatus: 'none'
  },
  {
    id: '3',
    senderName: 'Fatima Benali',
    senderEmail: 'fatima.benali@email.com',
    destinationCity: 'Algiers',
    documentType: 'University diploma',
    requestedDate: '2024-01-20',
    message: 'Diplôme universitaire pour dossier d\'emploi. Très important.',
    offeredPrice: 35,
    status: 'accepted',
    createdAt: '2024-01-08',
    escrowStatus: 'held'
  }
];

interface RequestsModalProps {
  trigger?: React.ReactNode;
}

export const RequestsModal = ({ trigger }: RequestsModalProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    ));
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    ));
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex-1">
            <Users className="w-4 h-4 mr-2" />
            View Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingRequests.length}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span>Delivery Requests</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          {selectedRequest ? (
            /* Request Details View */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedRequest(null)}
                >
                  ← Back to Requests
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Request Details</span>
                    <div className="flex items-center gap-2">
                      {selectedRequest.escrowStatus && (
                        <Badge variant={selectedRequest.escrowStatus === 'held' ? 'pending' : selectedRequest.escrowStatus === 'released' ? 'verified' : selectedRequest.escrowStatus === 'refunded' ? 'destructive' : 'outline'}>
                          Escrow: {selectedRequest.escrowStatus}
                        </Badge>
                      )}
                      <Badge variant={selectedRequest.status === 'pending' ? 'destructive' : selectedRequest.status === 'accepted' ? 'verified' : 'outline'}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sender Information */}
                  <div>
                    <h4 className="font-medium mb-3">Sender Information</h4>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Name:</span>
                        <span className="font-medium">{selectedRequest.senderName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="font-medium">{selectedRequest.senderEmail}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Request Date:</span>
                        <span className="font-medium">{format(new Date(selectedRequest.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div>
                    <h4 className="font-medium mb-3">Trip Details</h4>
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Destination: {selectedRequest.destinationCity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Requested Date: {format(new Date(selectedRequest.requestedDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>Document Type: {selectedRequest.documentType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <h4 className="font-medium mb-3">Sender's Message</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">{selectedRequest.message}</p>
                    </div>
                  </div>

                  {/* Pricing & Escrow */}
                  <div>
                    <h4 className="font-medium mb-3">Offer Details</h4>
                    <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Offered Price:</span>
                        <span className="text-xl font-bold text-success">€{selectedRequest.offeredPrice}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Shield className="w-4 h-4" />
                          Escrow Status
                        </span>
                        <Badge variant={selectedRequest.escrowStatus === 'held' ? 'pending' : selectedRequest.escrowStatus === 'released' ? 'verified' : selectedRequest.escrowStatus === 'refunded' ? 'destructive' : 'outline'}>
                          {selectedRequest.escrowStatus || 'none'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions for pending requests */}
                  {selectedRequest.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                      <Button
                        variant="outline"
                        className="flex-1 h-11"
                        onClick={() => {
                          handleRejectRequest(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject Request
                      </Button>
                      <Button
                        className="flex-1 h-11"
                        onClick={() => {
                          handleAcceptRequest(selectedRequest.id);
                          setSelectedRequest(null);
                        }}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
          <div className="space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  Pending Requests 
                  <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
                </h3>
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="border-warning/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{request.senderName}</h4>
                            <p className="text-sm text-muted-foreground">{request.senderEmail}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={request.escrowStatus === 'held' ? 'pending' : 'outline'}>
                              Escrow: {request.escrowStatus || 'none'}
                            </Badge>
                            <Badge variant="destructive">Pending</Badge>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>To {request.destinationCity}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{format(new Date(request.requestedDate), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FileText className="w-4 h-4 mr-2" />
                            <span>{request.documentType}</span>
                          </div>
                        </div>

                        <div className="bg-muted p-3 rounded-lg mb-4">
                          <p className="text-sm">{request.message}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Offered: </span>
                            <span className="font-medium text-success">€{request.offeredPrice}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRequest(request)}
                              className="flex-1 min-w-[80px]"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                              className="flex-1 min-w-[70px]"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptRequest(request.id)}
                              className="flex-1 min-w-[70px]"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Processed Requests */}
            {processedRequests.length > 0 && (
              <div>
                <Separator className="my-6" />
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {processedRequests.map((request) => (
                    <Card key={request.id} className="opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{request.senderName}</h4>
                            <p className="text-sm text-muted-foreground">{request.destinationCity} • {request.documentType}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={request.escrowStatus === 'released' ? 'verified' : request.escrowStatus === 'refunded' ? 'destructive' : 'outline'}>
                              Escrow: {request.escrowStatus || 'none'}
                            </Badge>
                            <Badge variant={request.status === 'accepted' ? 'verified' : 'outline'}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {format(new Date(request.createdAt), 'MMM d, yyyy')}
                          </span>
                          <span className="font-medium">€{request.offeredPrice}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {requests.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No requests yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Requests will appear here when senders choose your trips
                </p>
              </div>
            )}
          </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};