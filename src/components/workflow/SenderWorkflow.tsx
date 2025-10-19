import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import documentWorkflowService, { DocumentRequest } from '@/services/documentWorkflowService';

interface SenderWorkflowProps {
  onComplete: (request: DocumentRequest) => void;
}

export const SenderWorkflow = ({ onComplete }: SenderWorkflowProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    sourceAddress: '',
    recipientName: '',
    recipientPhone: '',
    destinationAddress: '',
    documentType: '',
    documentDescription: ''
  });
  const [documentRequest, setDocumentRequest] = useState<DocumentRequest | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.senderName || !formData.senderPhone || !formData.sourceAddress ||
        !formData.recipientName || !formData.recipientPhone || !formData.destinationAddress ||
        !formData.documentType || !formData.documentDescription) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Create document request
      const request = documentWorkflowService.createDocumentRequest(
        {
          name: formData.senderName,
          phone: formData.senderPhone,
          sourceAddress: formData.sourceAddress
        },
        {
          name: formData.recipientName,
          phone: formData.recipientPhone,
          destinationAddress: formData.destinationAddress
        },
        {
          type: formData.documentType,
          description: formData.documentDescription
        }
      );

      setDocumentRequest(request);
      setStep('confirmation');
      
      toast({
        title: 'Success',
        description: 'Document request created successfully'
      });
      
      // Pass the request to parent component
      onComplete(request);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to create document request',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {step === 'form' ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('sender.workflow.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">{t('sender.workflow.senderName')}</Label>
                  <Input
                    id="senderName"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    placeholder={t('sender.workflow.senderNamePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderPhone">{t('sender.workflow.senderPhone')}</Label>
                  <Input
                    id="senderPhone"
                    name="senderPhone"
                    value={formData.senderPhone}
                    onChange={handleInputChange}
                    placeholder={t('sender.workflow.senderPhonePlaceholder')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sourceAddress">{t('sender.workflow.sourceAddress')}</Label>
                <Input
                  id="sourceAddress"
                  name="sourceAddress"
                  value={formData.sourceAddress}
                  onChange={handleInputChange}
                  placeholder={t('sender.workflow.sourceAddressPlaceholder')}
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium mb-4">{t('sender.workflow.recipientInfo')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">{t('sender.workflow.recipientName')}</Label>
                    <Input
                      id="recipientName"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      placeholder={t('sender.workflow.recipientNamePlaceholder')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recipientPhone">{t('sender.workflow.recipientPhone')}</Label>
                    <Input
                      id="recipientPhone"
                      name="recipientPhone"
                      value={formData.recipientPhone}
                      onChange={handleInputChange}
                      placeholder={t('sender.workflow.recipientPhonePlaceholder')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="destinationAddress">{t('sender.workflow.destinationAddress')}</Label>
                  <Input
                    id="destinationAddress"
                    name="destinationAddress"
                    value={formData.destinationAddress}
                    onChange={handleInputChange}
                    placeholder={t('sender.workflow.destinationAddressPlaceholder')}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium mb-4">{t('sender.workflow.documentInfo')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="documentType">{t('sender.workflow.documentType')}</Label>
                  <Input
                    id="documentType"
                    name="documentType"
                    value={formData.documentType}
                    onChange={handleInputChange}
                    placeholder={t('sender.workflow.documentTypePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="documentDescription">{t('sender.workflow.documentDescription')}</Label>
                  <textarea
                    id="documentDescription"
                    name="documentDescription"
                    value={formData.documentDescription}
                    onChange={handleInputChange}
                    placeholder={t('sender.workflow.documentDescriptionPlaceholder')}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6">
                {t('sender.workflow.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('sender.workflow.confirmationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>{t('sender.workflow.confirmationMessage')}</p>
            
            {documentRequest && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-medium">{t('sender.workflow.uniqueCode')}:</span>
                  <span className="font-mono">{documentRequest.uniqueCode}</span>
                  
                  <span className="font-medium">{t('sender.workflow.deliveryCode')}:</span>
                  <span className="font-mono">{documentRequest.deliveryCode}</span>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{t('sender.workflow.instructionsTitle')}</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>{t('sender.workflow.instruction1')}</li>
                <li>{t('sender.workflow.instruction2')}</li>
                <li>{t('sender.workflow.instruction3')}</li>
              </ul>
            </div>
            
            <Button onClick={() => setStep('form')} variant="outline">
              {t('actions.back')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};