import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Package } from 'lucide-react';
import documentWorkflowService, { DocumentRequest } from '@/services/documentWorkflowService';

interface RecipientWorkflowProps {
  onComplete: () => void;
}

export const RecipientWorkflow = ({ onComplete }: RecipientWorkflowProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<'lookup' | 'confirmation'>('lookup');
  const [requestId, setRequestId] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
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

    if (request.status !== 'delivered') {
      toast({
        title: t('common.error'),
        description: 'Document is not yet delivered',
        variant: 'destructive'
      });
      return;
    }

    setDocumentRequest(request);
    setStep('confirmation');
  };

  const handleConfirmDelivery = () => {
    if (!documentRequest || !confirmationCode) {
      toast({
        title: t('common.error'),
        description: 'Please enter the confirmation code',
        variant: 'destructive'
      });
      return;
    }

    const result = documentWorkflowService.confirmDelivery(documentRequest.id, confirmationCode);
    if (result) {
      toast({
        title: 'Success',
        description: 'Delivery confirmed successfully'
      });
      onComplete();
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid confirmation code',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {step === 'lookup' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('recipient.workflow.lookupTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestId">{t('recipient.workflow.requestId')}</Label>
              <Input
                id="requestId"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder={t('recipient.workflow.requestIdPlaceholder')}
              />
            </div>
            
            <Button onClick={handleLookup} className="w-full">
              {t('recipient.workflow.lookupButton')}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'confirmation' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2" />
              {t('recipient.workflow.confirmationTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">{t('recipient.workflow.deliveryArrived')}</h3>
              <p className="text-muted-foreground">{t('recipient.workflow.deliveryMessage')}</p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">{t('recipient.workflow.documentInfo')}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>{t('recipient.workflow.sender')}:</span>
                <span className="font-medium">{documentRequest.sender.name}</span>
                
                <span>{t('recipient.workflow.traveler')}:</span>
                <span className="font-medium">{documentRequest.recipient.name}</span>
                
                <span>{t('recipient.workflow.documentType')}:</span>
                <span className="font-medium">{documentRequest.document.type}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmationCode">{t('recipient.workflow.confirmationCode')}</Label>
              <Input
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder={t('recipient.workflow.confirmationCodePlaceholder')}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{t('recipient.workflow.confirmationInstructions')}</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>{t('recipient.workflow.instruction1')}</li>
                <li>{t('recipient.workflow.instruction2')}</li>
                <li>{t('recipient.workflow.instruction3')}</li>
              </ul>
            </div>
            
            <Button onClick={handleConfirmDelivery} className="w-full">
              {t('recipient.workflow.confirmDelivery')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};