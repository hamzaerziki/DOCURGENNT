import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, CheckCircle, QrCode, Shield, User } from 'lucide-react';
import documentWorkflowService, { DocumentRequest } from '@/services/documentWorkflowService';

interface TravelerWorkflowProps {
  onComplete: () => void;
  travelerId: string; // Added traveler ID for logging
}

export const TravelerWorkflow = ({ onComplete, travelerId }: TravelerWorkflowProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<'lookup' | 'collection' | 'delivery' | 'confirmation'>('lookup');
  const [requestId, setRequestId] = useState('');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [documentRequest, setDocumentRequest] = useState<DocumentRequest | null>(null);

  const handleLookup = () => {
    if (!requestId) {
      toast({
        title: t('common.error'),
        description: 'Please enter a request ID',
        variant: 'destructive'
      });
      return;
    }

    const request = documentWorkflowService.getDocumentRequest(requestId);
    if (!request) {
      toast({
        title: t('common.error'),
        description: 'Document request not found',
        variant: 'destructive'
      });
      return;
    }

    if (request.status !== 'with_traveler') {
      toast({
        title: t('common.error'),
        description: 'Document is not available for collection',
        variant: 'destructive'
      });
      return;
    }

    // Check if already completed
    if (documentWorkflowService.isDeliveryCompleted(requestId)) {
      toast({
        title: t('common.error'),
        description: 'This delivery has already been completed',
        variant: 'destructive'
      });
      return;
    }

    setDocumentRequest(request);
    setStep('collection');
  };

  const handleCollectDocument = () => {
    if (!documentRequest) {
      toast({
        title: t('common.error'),
        description: 'No document request found',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Document collected successfully'
    });
    
    setStep('delivery');
  };

  const handleDeliverDocument = () => {
    if (!documentRequest || !deliveryCode) {
      toast({
        title: t('common.error'),
        description: 'Please enter the delivery code',
        variant: 'destructive'
      });
      return;
    }

    // Validate the delivery code
    const isValid = documentWorkflowService.validateDeliveryCode(documentRequest.id, deliveryCode);
    if (isValid) {
      // Move to confirmation step
      setStep('confirmation');
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid delivery code',
        variant: 'destructive'
      });
    }
  };

  const handleConfirmDelivery = () => {
    if (!documentRequest || !deliveryCode || !travelerId) {
      toast({
        title: t('common.error'),
        description: 'Missing required information',
        variant: 'destructive'
      });
      return;
    }

    // Complete the delivery with the confirmation code
    const result = documentWorkflowService.completeDelivery(documentRequest.id, deliveryCode, travelerId);
    if (result) {
      toast({
        title: 'Success',
        description: 'Document delivery completed successfully'
      });
      onComplete();
    } else {
      toast({
        title: t('common.error'),
        description: 'Failed to complete document delivery. The code may be invalid or the delivery may already be completed.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {step === 'lookup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              {t('traveler.workflow.lookupTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestId">{t('traveler.workflow.requestId')}</Label>
              <Input
                id="requestId"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder={t('traveler.workflow.requestIdPlaceholder')}
              />
            </div>
            
            <Button onClick={handleLookup} className="w-full">
              {t('traveler.workflow.lookupButton')}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'collection' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              {t('traveler.workflow.collectionTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">{t('traveler.workflow.documentInfo')}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>{t('traveler.workflow.sender')}:</span>
                <span className="font-medium">{documentRequest.sender.name}</span>
                
                <span>{t('traveler.workflow.recipient')}:</span>
                <span className="font-medium">{documentRequest.recipient.name}</span>
                
                <span>{t('traveler.workflow.documentType')}:</span>
                <span className="font-medium">{documentRequest.document.type}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{t('traveler.workflow.collectionInstructions')}</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>{t('traveler.workflow.instruction1')}</li>
                <li>{t('traveler.workflow.instruction2')}</li>
                <li>{t('traveler.workflow.instruction3')}</li>
              </ul>
            </div>
            
            <Button onClick={handleCollectDocument} className="w-full">
              {t('traveler.workflow.collectDocument')}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'delivery' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('traveler.workflow.deliveryTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{t('traveler.workflow.deliveryReady')}</h3>
              <p className="text-muted-foreground">{t('traveler.workflow.deliveryMessage')}</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">{t('traveler.workflow.deliveryDetails')}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>{t('traveler.workflow.recipient')}:</span>
                <span className="font-medium">{documentRequest.recipient.name}</span>
                
                <span>{t('traveler.workflow.destination')}:</span>
                <span className="font-medium">{documentRequest.recipient.destinationAddress}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryCode" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t('traveler.workflow.deliveryCode')}
              </Label>
              <Input
                id="deliveryCode"
                value={deliveryCode}
                onChange={(e) => setDeliveryCode(e.target.value)}
                placeholder={t('traveler.workflow.deliveryCodePlaceholder')}
              />
              <p className="text-xs text-muted-foreground">
                Enter the code provided by the recipient to confirm delivery
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                {t('traveler.workflow.deliveryInstructions')}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>{t('traveler.workflow.deliveryInstruction1')}</li>
                <li>{t('traveler.workflow.deliveryInstruction2')}</li>
                <li>{t('traveler.workflow.deliveryInstruction3')}</li>
              </ul>
            </div>
            
            <Button onClick={handleDeliverDocument} className="w-full" disabled={!deliveryCode}>
              Validate Delivery Code
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'confirmation' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Confirm Delivery Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Delivery Code Validated</h3>
            <p className="text-muted-foreground">
              The recipient's code has been verified. Click below to finalize the delivery.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Delivery Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Document:</span>
                <span className="font-medium">{documentRequest.document.type}</span>
                
                <span>Recipient:</span>
                <span className="font-medium">{documentRequest.recipient.name}</span>
                
                <span>Code:</span>
                <span className="font-mono font-medium">{deliveryCode}</span>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Final Confirmation</h4>
              <p className="text-sm text-green-800">
                This action will permanently mark the delivery as completed and cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('delivery')} 
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirmDelivery} 
                className="flex-1"
              >
                Complete Delivery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};