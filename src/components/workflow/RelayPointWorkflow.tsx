import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Camera, Shield, QrCode, CheckCircle, XCircle, User, Package } from 'lucide-react';
import documentWorkflowService, { DocumentRequest } from '@/services/documentWorkflowService';

interface RelayPointWorkflowProps {
  onComplete: () => void;
}

export const RelayPointWorkflow = ({ onComplete }: RelayPointWorkflowProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [step, setStep] = useState<'lookup' | 'sender_verification' | 'envelope_inspection' | 'register_acceptance' | 'wait_traveler' | 'traveler_arrival' | 'transfer_verification' | 'complete'>('lookup');
  const [requestId, setRequestId] = useState('');
  const [documentRequest, setDocumentRequest] = useState<DocumentRequest | null>(null);
  const [senderCode, setSenderCode] = useState('');
  const [travelerCode, setTravelerCode] = useState('');
  const [senderId, setSenderId] = useState('');
  const [travelerId, setTravelerId] = useState('');
  const [scannedCode, setScannedCode] = useState('');
  const [isSenderVerified, setIsSenderVerified] = useState(false);
  const [isSenderCodeVerified, setIsSenderCodeVerified] = useState(false);
  const [isEnvelopeInspected, setIsEnvelopeInspected] = useState(false);
  const [isDocumentRegistered, setIsDocumentRegistered] = useState(false);
  const [isTravelerVerified, setIsTravelerVerified] = useState(false);
  const [isTravelerCodeVerified, setIsTravelerCodeVerified] = useState(false);

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

    setDocumentRequest(request);
    setStep('sender_verification');
  };

  // Step 1: Verify sender's identity
  const handleSenderVerification = () => {
    if (!documentRequest || !senderId) {
      toast({
        title: t('common.error'),
        description: 'Please enter sender identification',
        variant: 'destructive'
      });
      return;
    }

    // In a real implementation, this would check against verified sender database
    // For demo, we'll just check that something was entered
    const isValid = senderId.length > 0;
    if (isValid) {
      setIsSenderVerified(true);
      toast({
        title: 'Success',
        description: 'Sender identity verified successfully'
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid sender identification',
        variant: 'destructive'
      });
    }
  };

  // Step 2: Verify sender's code
  const handleSenderCodeVerification = () => {
    if (!documentRequest || !senderCode) {
      toast({
        title: t('common.error'),
        description: 'Please enter the sender code',
        variant: 'destructive'
      });
      return;
    }

    const isValid = documentWorkflowService.validateSenderIdentity(documentRequest.id, senderCode);
    if (isValid) {
      setIsSenderCodeVerified(true);
      toast({
        title: 'Success',
        description: 'Sender code validated successfully'
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid sender code',
        variant: 'destructive'
      });
    }
  };

  // Step 3: Inspect envelope
  const handleEnvelopeInspection = () => {
    if (!documentRequest) {
      toast({
        title: t('common.error'),
        description: 'No document request found',
        variant: 'destructive'
      });
      return;
    }

    // In a real implementation, this would involve actual envelope inspection
    // For demo, we'll just mark it as inspected
    setIsEnvelopeInspected(true);
    toast({
      title: 'Success',
      description: 'Envelope inspection completed'
    });
  };

  // Step 4: Register acceptance
  const handleRegisterAcceptance = () => {
    if (!documentRequest) {
      toast({
        title: t('common.error'),
        description: 'No document request found',
        variant: 'destructive'
      });
      return;
    }

    const result = documentWorkflowService.markAtRelayPoint(documentRequest.id);
    if (result) {
      setIsDocumentRegistered(true);
      setStep('wait_traveler');
      toast({
        title: 'Success',
        description: 'Document registered at relay point'
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Failed to register document',
        variant: 'destructive'
      });
    }
  };

  // Step 6: Verify traveler code
  const handleTravelerCodeVerification = () => {
    if (!documentRequest || !travelerCode) {
      toast({
        title: t('common.error'),
        description: 'Please enter the traveler code',
        variant: 'destructive'
      });
      return;
    }

    // In a real implementation, this would validate the traveler's code
    // For demo, we'll just check that something was entered
    const isValid = travelerCode.length > 0;
    if (isValid) {
      setIsTravelerCodeVerified(true);
      toast({
        title: 'Success',
        description: 'Traveler code validated successfully'
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid traveler code',
        variant: 'destructive'
      });
    }
  };

  // Step 7: Verify traveler identity
  const handleTravelerIdentityVerification = () => {
    if (!documentRequest || !travelerId) {
      toast({
        title: t('common.error'),
        description: 'Please enter traveler identification',
        variant: 'destructive'
      });
      return;
    }

    const isValid = documentWorkflowService.validateTravelerIdentity(documentRequest.id, travelerId);
    if (isValid) {
      setIsTravelerVerified(true);
      toast({
        title: 'Success',
        description: 'Traveler identity validated successfully'
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid traveler identification',
        variant: 'destructive'
      });
    }
  };

  // Step 8: Scan/register envelope transfer to traveler
  const handleEnvelopeTransfer = () => {
    if (!documentRequest || !travelerId) {
      toast({
        title: t('common.error'),
        description: 'Traveler information is required',
        variant: 'destructive'
      });
      return;
    }

    const result = documentWorkflowService.handToTraveler(documentRequest.id, travelerId);
    if (result) {
      setStep('complete');
      toast({
        title: 'Success',
        description: 'Document transferred to traveler successfully'
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Failed to transfer document to traveler',
        variant: 'destructive'
      });
    }
  };

  // Reset and start over
  const handleReset = () => {
    setStep('lookup');
    setRequestId('');
    setDocumentRequest(null);
    setSenderCode('');
    setTravelerCode('');
    setSenderId('');
    setTravelerId('');
    setScannedCode('');
    setIsSenderVerified(false);
    setIsSenderCodeVerified(false);
    setIsEnvelopeInspected(false);
    setIsDocumentRegistered(false);
    setIsTravelerVerified(false);
    setIsTravelerCodeVerified(false);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Lookup */}
      {step === 'lookup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              {t('relay.workflow.lookupTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requestId">{t('relay.workflow.requestId')}</Label>
              <Input
                id="requestId"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder={t('relay.workflow.requestIdPlaceholder')}
              />
            </div>
            
            <Button onClick={handleLookup} className="w-full">
              {t('relay.workflow.lookupButton')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Sender Verification */}
      {step === 'sender_verification' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Sender Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Document Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Sender:</span>
                <span className="font-medium">{documentRequest.sender.name}</span>
                
                <span>Document Type:</span>
                <span className="font-medium">{documentRequest.document.type}</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Verify Sender Identity
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Confirm the sender's identity matches the system record.
              </p>
              <div className="space-y-2">
                <Label htmlFor="senderId">Sender Identification</Label>
                <Input
                  id="senderId"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  placeholder="Enter sender ID (e.g., passport, driver's license)"
                  disabled={isSenderVerified}
                />
                <Button 
                  onClick={handleSenderVerification} 
                  className="w-full"
                  disabled={isSenderVerified}
                >
                  {isSenderVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verified
                    </>
                  ) : (
                    'Verify Identity'
                  )}
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Verify Sender Code
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Confirm the sender's unique code for authenticity.
              </p>
              <div className="space-y-2">
                <Label htmlFor="senderCode">Unique Code</Label>
                <Input
                  id="senderCode"
                  value={senderCode}
                  onChange={(e) => setSenderCode(e.target.value)}
                  placeholder="Enter sender's unique code"
                  disabled={isSenderCodeVerified || !isSenderVerified}
                />
                <Button 
                  onClick={handleSenderCodeVerification} 
                  className="w-full"
                  disabled={isSenderCodeVerified || !isSenderVerified}
                >
                  {isSenderCodeVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Code Verified
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => setStep('envelope_inspection')} 
                className="flex-1"
                disabled={!isSenderVerified || !isSenderCodeVerified}
              >
                Next: Inspect Envelope
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Envelope Inspection */}
      {step === 'envelope_inspection' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Envelope Inspection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Document Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Sender:</span>
                <span className="font-medium">{documentRequest.sender.name}</span>
                
                <span>Document Type:</span>
                <span className="font-medium">{documentRequest.document.type}</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Inspect Envelope
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Confirm the envelope contains the document the sender claims to send.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="envelopeCheck1"
                    checked={isEnvelopeInspected}
                    onChange={(e) => setIsEnvelopeInspected(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="envelopeCheck1" className="text-sm">
                    Envelope is sealed and undamaged
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="envelopeCheck2"
                    checked={isEnvelopeInspected}
                    onChange={(e) => setIsEnvelopeInspected(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="envelopeCheck2" className="text-sm">
                    Contents match sender's description
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="envelopeCheck3"
                    checked={isEnvelopeInspected}
                    onChange={(e) => setIsEnvelopeInspected(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="envelopeCheck3" className="text-sm">
                    Weight and size are within acceptable limits
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('sender_verification')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep('register_acceptance')} 
                className="flex-1"
                disabled={!isEnvelopeInspected}
              >
                Next: Register Acceptance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Register Acceptance */}
      {step === 'register_acceptance' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Register Document Acceptance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Register Document Acceptance</h3>
            <p className="text-muted-foreground">
              Formally accept the envelope in the system and mark it as waiting for traveler pickup.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Document Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Sender:</span>
                <span className="font-medium">{documentRequest.sender.name}</span>
                
                <span>Status:</span>
                <span className="font-medium">Pending Traveler Pickup</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('envelope_inspection')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleRegisterAcceptance} 
                className="flex-1"
              >
                Register Acceptance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Wait for Traveler */}
      {step === 'wait_traveler' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Waiting for Traveler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <Clock className="w-16 h-16 text-blue-500 mx-auto" />
            <h3 className="text-xl font-semibold">Waiting for Traveler Arrival</h3>
            <p className="text-muted-foreground">
              Document is registered and waiting for the designated traveler to arrive.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Document Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Assigned Traveler:</span>
                <span className="font-medium">Pending</span>
                
                <span>Status:</span>
                <span className="font-medium">At Relay Point</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setStep('traveler_arrival')} 
              className="w-full"
            >
              Traveler Has Arrived
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Traveler Arrival */}
      {step === 'traveler_arrival' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Traveler Arrival
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Document Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Assigned Traveler:</span>
                <span className="font-medium">Pending</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Verify Traveler Code
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Check and verify the code provided by the traveler matches the transfer code.
              </p>
              <div className="space-y-2">
                <Label htmlFor="travelerCode">Traveler Code</Label>
                <Input
                  id="travelerCode"
                  value={travelerCode}
                  onChange={(e) => setTravelerCode(e.target.value)}
                  placeholder="Enter traveler's code"
                  disabled={isTravelerCodeVerified}
                />
                <Button 
                  onClick={handleTravelerCodeVerification} 
                  className="w-full"
                  disabled={isTravelerCodeVerified}
                >
                  {isTravelerCodeVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Code Verified
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Verify Traveler Identity
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Check the identity of the traveler to confirm it matches the assigned traveler.
              </p>
              <div className="space-y-2">
                <Label htmlFor="travelerId">Traveler Identification</Label>
                <Input
                  id="travelerId"
                  value={travelerId}
                  onChange={(e) => setTravelerId(e.target.value)}
                  placeholder="Enter traveler ID (e.g., passport, driver's license)"
                  disabled={isTravelerVerified || !isTravelerCodeVerified}
                />
                <Button 
                  onClick={handleTravelerIdentityVerification} 
                  className="w-full"
                  disabled={isTravelerVerified || !isTravelerCodeVerified}
                >
                  {isTravelerVerified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Identity Verified
                    </>
                  ) : (
                    'Verify Identity'
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('wait_traveler')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={() => setStep('transfer_verification')} 
                className="flex-1"
                disabled={!isTravelerVerified || !isTravelerCodeVerified}
              >
                Next: Transfer Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 7: Transfer Verification */}
      {step === 'transfer_verification' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Document Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <Package className="w-16 h-16 text-blue-500 mx-auto" />
            <h3 className="text-xl font-semibold">Transfer Document to Traveler</h3>
            <p className="text-muted-foreground">
              Scan/register the envelope transfer to the traveler in the system.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Transfer Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Traveler:</span>
                <span className="font-medium">{travelerId || 'Pending'}</span>
                
                <span>Status:</span>
                <span className="font-medium">Ready for Transfer</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Transfer Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside text-left">
                <li>Ensure traveler has provided valid identification</li>
                <li>Verify traveler has the correct transfer code</li>
                <li>Hand over the envelope to the traveler</li>
                <li>Confirm transfer in the system</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('traveler_arrival')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleEnvelopeTransfer} 
                className="flex-1"
              >
                Confirm Transfer to Traveler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 8: Complete */}
      {step === 'complete' && documentRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Transfer Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Document Transfer Successful</h3>
            <p className="text-muted-foreground">
              The envelope has been successfully transferred to the traveler.
            </p>
            
            <div className="bg-muted p-4 rounded-lg text-left">
              <h4 className="font-medium mb-2">Final Status</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Tracking ID:</span>
                <span className="font-medium">{documentRequest.id}</span>
                
                <span>Traveler:</span>
                <span className="font-medium">{travelerId}</span>
                
                <span>Status:</span>
                <span className="font-medium">With Traveler</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Process Another Document
              </Button>
              <Button onClick={onComplete} className="flex-1">
                Finish
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};