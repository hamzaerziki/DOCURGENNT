import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import documentWorkflowService from '@/services/documentWorkflowService';

export const WorkflowDemo = () => {
  const { toast } = useToast();
  const [requestId, setRequestId] = useState('');
  const [senderCode, setSenderCode] = useState('');
  const [travelerId, setTravelerId] = useState('');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const handleCreateRequest = () => {
    try {
      const request = documentWorkflowService.createDocumentRequest(
        {
          name: 'John Doe',
          phone: '+1234567890',
          sourceAddress: '123 Main St, Paris'
        },
        {
          name: 'Jane Smith',
          phone: '+0987654321',
          destinationAddress: '456 Oak Ave, Casablanca'
        },
        {
          type: 'Passport',
          description: 'Copy of passport for visa application'
        }
      );
      
      setRequestId(request.id);
      setSenderCode(request.uniqueCode);
      setDeliveryCode(request.deliveryCode);
      
      toast({
        title: 'Success',
        description: 'Document request created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create document request',
        variant: 'destructive'
      });
    }
  };

  const handleValidateSender = () => {
    if (!requestId || !senderCode) {
      toast({
        title: 'Error',
        description: 'Please create a request first and enter the sender code',
        variant: 'destructive'
      });
      return;
    }

    const isValid = documentWorkflowService.validateSenderIdentity(requestId, senderCode);
    if (isValid) {
      documentWorkflowService.markAtRelayPoint(requestId);
      toast({
        title: 'Success',
        description: 'Sender validated and document marked at relay point'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Invalid sender code',
        variant: 'destructive'
      });
    }
  };

  const handleHandToTraveler = () => {
    if (!requestId || !travelerId) {
      toast({
        title: 'Error',
        description: 'Please enter a traveler ID',
        variant: 'destructive'
      });
      return;
    }

    const result = documentWorkflowService.handToTraveler(requestId, travelerId);
    if (result) {
      toast({
        title: 'Success',
        description: 'Document handed to traveler'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to hand document to traveler',
        variant: 'destructive'
      });
    }
  };

  const handleMarkDelivered = () => {
    if (!requestId || !deliveryCode) {
      toast({
        title: 'Error',
        description: 'Please enter the delivery code',
        variant: 'destructive'
      });
      return;
    }

    const isValid = documentWorkflowService.validateDeliveryCode(requestId, deliveryCode);
    if (isValid) {
      const result = documentWorkflowService.markDelivered(requestId);
      if (result) {
        toast({
          title: 'Success',
          description: 'Document marked as delivered'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to mark document as delivered',
          variant: 'destructive'
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'Invalid delivery code',
        variant: 'destructive'
      });
    }
  };

  const handleConfirmDelivery = () => {
    if (!requestId || !confirmationCode) {
      toast({
        title: 'Error',
        description: 'Please enter a confirmation code',
        variant: 'destructive'
      });
      return;
    }

    const result = documentWorkflowService.confirmDelivery(requestId, confirmationCode);
    if (result) {
      toast({
        title: 'Success',
        description: 'Delivery confirmed successfully'
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to confirm delivery',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Request ID</label>
            <input
              type="text"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Create request to generate ID"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sender Code</label>
            <input
              type="text"
              value={senderCode}
              onChange={(e) => setSenderCode(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Create request to generate code"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Traveler ID</label>
            <input
              type="text"
              value={travelerId}
              onChange={(e) => setTravelerId(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter traveler ID"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Code</label>
            <input
              type="text"
              value={deliveryCode}
              onChange={(e) => setDeliveryCode(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Create request to generate code"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirmation Code</label>
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter confirmation code"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <Button onClick={handleCreateRequest} className="text-xs">
            1. Create Request
          </Button>
          <Button onClick={handleValidateSender} className="text-xs">
            2. Validate Sender
          </Button>
          <Button onClick={handleHandToTraveler} className="text-xs">
            3. Hand to Traveler
          </Button>
          <Button onClick={handleMarkDelivered} className="text-xs">
            4. Mark Delivered
          </Button>
          <Button onClick={handleConfirmDelivery} className="text-xs">
            5. Confirm Delivery
          </Button>
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Security Logs</h3>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {documentWorkflowService.getSecurityLogs().length > 0 ? (
              <ul className="space-y-1">
                {documentWorkflowService.getSecurityLogs().map((log) => (
                  <li key={log.id} className="text-xs">
                    <span className="font-medium">{log.action}</span> - {log.details} 
                    <span className="text-muted-foreground ml-2">
                      ({new Date(log.timestamp).toLocaleTimeString()})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">No security events logged yet</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};