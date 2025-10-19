import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Package, CheckCircle, Clock, Search, MapPin, User, Camera, Shield, QrCode, AlertTriangle, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interfaces
interface Shipment {
  id: string;
  trackingCode: string;
  senderName: string;
  travelerName: string;
  destination: string;
  status: 'pending_pickup' | 'in_transit' | 'delivered' | 'delivery_failed';
  receivedDate?: string;
  collectedDate?: string;
  documentType: string;
  travelerVerified?: boolean;
  travelerIdType?: 'cin' | 'passport';
  travelerIdNumber?: string;
  envelopeScannedOnPickup?: boolean;
  // Added audit trail
  auditTrail: ActivityLog[];
}

interface IdentityVerification {
  idType: 'cin' | 'passport';
  idNumber: string;
  idPhoto?: File;
  selfiePhoto?: File;
  verified: boolean;
}

interface ActivityLog {
  timestamp: string;
  activity: string;
  details?: string;
  status: 'success' | 'failure' | 'info';
}

// Mock Data
const mockShipments: Shipment[] = [
  { 
    id: "1", 
    trackingCode: "DOC001FR", 
    senderName: "Marie Dubois", 
    travelerName: "Ahmed Ben Ali", 
    destination: "Tunis, Tunisia", 
    status: "pending_pickup", 
    documentType: "Passport",
    auditTrail: [
      { timestamp: new Date().toISOString(), activity: "Document created", status: "info", details: "Request created by sender" }
    ]
  },
  { 
    id: "2", 
    trackingCode: "DOC002FR", 
    senderName: "Pierre Martin", 
    travelerName: "Fatima El Mansouri", 
    destination: "Casablanca, Morocco", 
    status: "in_transit", 
    documentType: "Birth Certificate", 
    receivedDate: "2024-01-14T14:20:00",
    auditTrail: [
      { timestamp: "2024-01-14T14:20:00", activity: "Envelope received from sender", status: "success", details: "Sender identity verified" },
      { timestamp: "2024-01-14T14:25:00", activity: "Document registered", status: "success", details: "Document accepted at relay point" }
    ]
  },
  { 
    id: "3", 
    trackingCode: "DOC003FR", 
    senderName: "Sophie Laurent", 
    travelerName: "Karim Bouzid", 
    destination: "Algiers, Algeria", 
    status: "delivered", 
    documentType: "University Diploma", 
    receivedDate: "2024-01-13T09:15:00", 
    collectedDate: "2024-01-13T16:45:00", 
    travelerVerified: true, 
    envelopeScannedOnPickup: true,
    auditTrail: [
      { timestamp: "2024-01-13T09:15:00", activity: "Envelope received from sender", status: "success", details: "Sender identity and code verified" },
      { timestamp: "2024-01-13T09:20:00", activity: "Document registered", status: "success", details: "Document accepted at relay point" },
      { timestamp: "2024-01-13T16:40:00", activity: "Traveler identity verified", details: "Passport: P123456789", status: "success" },
      { timestamp: "2024-01-13T16:44:00", activity: "Envelope scan validated", details: "Tracking Code: DOC003FR", status: "success" },
      { timestamp: "2024-01-13T16:45:00", activity: "Envelope handed to traveler", status: "success", details: "Document transferred to traveler" }
    ]
  },
  { 
    id: "4", 
    trackingCode: "DOC004FR", 
    senderName: "Julien Moreau", 
    travelerName: "Amina Traoré", 
    destination: "Dakar, Senegal", 
    status: "in_transit", 
    documentType: "Visa Application", 
    receivedDate: "2024-01-16T11:00:00", 
    travelerVerified: true,
    auditTrail: [
      { timestamp: "2024-01-16T11:00:00", activity: "Envelope received from sender", status: "success", details: "Sender identity and code verified" },
      { timestamp: "2024-01-16T11:05:00", activity: "Traveler identity verified", details: "CIN: AB123456", status: "success" }
    ]
  },
];

const mockActivityLog: { [key: string]: ActivityLog[] } = {
  "1": [],
  "2": [{ timestamp: "2024-01-14T14:20:00", activity: "Envelope received from sender", status: "success" }],
  "3": [
    { timestamp: "2024-01-13T09:15:00", activity: "Envelope received from sender", status: "success" },
    { timestamp: "2024-01-13T16:40:00", activity: "Traveler identity verified", details: "Passport: P123456789", status: "success" },
    { timestamp: "2024-01-13T16:44:00", activity: "Envelope scan validated", details: "Tracking Code: DOC003FR", status: "success" },
    { timestamp: "2024-01-13T16:45:00", activity: "Envelope handed to traveler", status: "success" },
  ],
  "4": [
    { timestamp: "2024-01-16T11:00:00", activity: "Envelope received from sender", status: "success" },
    { timestamp: "2024-01-16T11:05:00", activity: "Traveler identity verified", details: "CIN: AB123456", status: "success" },
  ]
};

export function RelayPointDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [activityLogs, setActivityLogs] = useState<{ [key: string]: ActivityLog[] }>(mockActivityLog);
  
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalState, setModalState] = useState<'identity' | 'scan' | 'log' | null>(null);

  const [identityVerification, setIdentityVerification] = useState<IdentityVerification>({ idType: 'cin', idNumber: '', verified: false });
  const [scannedCode, setScannedCode] = useState("");

  const filteredShipments = useMemo(() => shipments.filter(shipment =>
    Object.values(shipment).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [shipments, searchTerm]);

  const addActivityLog = (shipmentId: string, activity: string, status: 'success' | 'failure' | 'info', details?: string) => {
    setActivityLogs(prev => ({
      ...prev,
      [shipmentId]: [...(prev[shipmentId] || []), { timestamp: new Date().toISOString(), activity, status, details }]
    }));
    
    // Also add to the shipment's audit trail
    setShipments(prev => prev.map(shipment => {
      if (shipment.id === shipmentId) {
        return {
          ...shipment,
          auditTrail: [
            ...shipment.auditTrail,
            { timestamp: new Date().toISOString(), activity, status, details }
          ]
        };
      }
      return shipment;
    }));
  };

  const handleReceiveFromSender = (shipment: Shipment) => {
    addActivityLog(shipment.id, "Envelope received from sender", "success", `Tracking Code: ${shipment.trackingCode}`);
    setShipments(prev => prev.map(s => s.id === shipment.id ? { ...s, status: 'in_transit', receivedDate: new Date().toISOString() } : s));
    toast({ title: "Envelope Registered", description: "Envelope has been successfully registered on arrival." });
    setModalState(null);
  };

  const handleVerifyTravelerIdentity = () => {
    if (!selectedShipment || !identityVerification.idNumber) {
      toast({ title: "Verification Error", description: "Please enter the ID number.", variant: "destructive" });
      return;
    }
    addActivityLog(selectedShipment.id, "Traveler identity verified", "success", `${identityVerification.idType.toUpperCase()}: ${identityVerification.idNumber}`);
    setShipments(prev => prev.map(s => s.id === selectedShipment.id ? { ...s, travelerVerified: true, travelerIdType: identityVerification.idType, travelerIdNumber: identityVerification.idNumber } : s));
    toast({ title: "Identity Verified", description: "Traveler identity has been successfully verified." });
    setModalState(null);
    setIdentityVerification({ idType: 'cin', idNumber: '', verified: false });
  };

  const handleEnvelopeScan = () => {
    if (!selectedShipment) return;

    if (scannedCode === selectedShipment.trackingCode) {
      addActivityLog(selectedShipment.id, "Envelope scan validated", "success", `Scanned Code: ${scannedCode}`);
      toast({ title: "Scan Successful", description: "Envelope scan matches the record." });
      
      if (selectedShipment.status === 'pending_pickup') {
        handleReceiveFromSender(selectedShipment);
      } else if (selectedShipment.status === 'in_transit' && selectedShipment.travelerVerified) {
        setShipments(prev => prev.map(s => s.id === selectedShipment.id ? { ...s, envelopeScannedOnPickup: true } : s));
        handleHandToTraveler(selectedShipment.id, true);
      }
      setModalState(null);
    } else {
      addActivityLog(selectedShipment.id, "Envelope scan failed", "failure", `Scanned Code: ${scannedCode}`);
      toast({ title: "Scan Failed", description: "Scanned code does not match. Please try again.", variant: "destructive" });
    }
    setScannedCode("");
  };

  const handleHandToTraveler = (shipmentId: string, scanValidated: boolean) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;

    if (!shipment.travelerVerified) {
      toast({ title: "Verification Required", description: "Please verify traveler's identity first.", variant: "destructive" });
      return;
    }
    if (!scanValidated) {
      toast({ title: "Scan Required", description: "Please scan the envelope before handover.", variant: "destructive" });
      setSelectedShipment(shipment);
      setModalState('scan');
      return;
    }

    addActivityLog(shipmentId, "Envelope handed to traveler", "success");
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, status: 'delivered', collectedDate: new Date().toISOString() } : s));
    toast({ title: "Handover Complete", description: "Envelope has been successfully handed to the traveler." });
  };

  const openModal = (shipment: Shipment, modal: 'identity' | 'scan' | 'log') => {
    setSelectedShipment(shipment);
    setModalState(modal);
  };

  // UI Components
  const getStatusBadge = (status: Shipment['status']) => {
    const styles = {
      pending_pickup: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      delivery_failed: 'bg-red-100 text-red-800',
    };
    const icons = {
      pending_pickup: <Clock className="h-3 w-3" />,
      in_transit: <Package className="h-3 w-3" />,
      delivered: <CheckCircle className="h-3 w-3" />,
      delivery_failed: <AlertTriangle className="h-3 w-3" />,
    };
    return <Badge className={`flex items-center gap-1.5 ${styles[status]}`}>{icons[status]} {t(`relay.status.${status}`)}</Badge>;
  };

  const IdentityVerificationModal = () => (
    <Dialog open={modalState === 'identity'} onOpenChange={() => setModalState(null)}>
      <DialogContent>
        <DialogHeader><DialogTitle>Identity Verification - {selectedShipment?.travelerName}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Verify traveler's ID (CIN or Passport) against the delivery details.</p>
          <select value={identityVerification.idType} onChange={(e) => setIdentityVerification(prev => ({ ...prev, idType: e.target.value as 'cin' | 'passport' }))} className="w-full p-2 border rounded-md">
            <option value="cin">National ID (CIN)</option>
            <option value="passport">Passport</option>
          </select>
          <Input value={identityVerification.idNumber} onChange={(e) => setIdentityVerification(prev => ({ ...prev, idNumber: e.target.value }))} placeholder={`Enter ${identityVerification.idType.toUpperCase()} number`} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalState(null)}>Cancel</Button>
            <Button onClick={handleVerifyTravelerIdentity} disabled={!identityVerification.idNumber}><Shield className="w-4 h-4 mr-2" />Verify Identity</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EnvelopeScanModal = () => (
    <Dialog open={modalState === 'scan'} onOpenChange={() => setModalState(null)}>
      <DialogContent>
        <DialogHeader><DialogTitle>Scan Envelope QR/Barcode</DialogTitle></DialogHeader>
        <div className="space-y-4 text-center">
          <QrCode className="w-24 h-24 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Scan the QR/Barcode on the envelope. For demo, enter the tracking code below.</p>
          <Input value={scannedCode} onChange={(e) => setScannedCode(e.target.value)} placeholder="Enter Tracking Code (e.g., DOC001FR)" />
          <p className="text-xs text-muted-foreground">Expected: {selectedShipment?.trackingCode}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalState(null)}>Cancel</Button>
            <Button onClick={handleEnvelopeScan} disabled={!scannedCode}><QrCode className="w-4 h-4 mr-2" />Validate Scan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const AuditTrailModal = () => (
    <Dialog open={modalState === 'log'} onOpenChange={() => setModalState(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Activity Log - {selectedShipment?.trackingCode}</DialogTitle></DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Display the shipment's audit trail */}
          {selectedShipment?.auditTrail.map((log, i) => (
            <div key={i} className="flex items-start gap-3">
              <div>
                {log.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {log.status === 'failure' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {log.status === 'info' && <History className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{log.activity}</p>
                <p className="text-sm text-muted-foreground">{log.details}</p>
                <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
          
          {/* Display any additional activity logs */}
          {(activityLogs[selectedShipment?.id || ''] || []).map((log, i) => (
            <div key={`additional-${i}`} className="flex items-start gap-3">
              <div>
                {log.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {log.status === 'failure' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                {log.status === 'info' && <History className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{log.activity}</p>
                <p className="text-sm text-muted-foreground">{log.details}</p>
                <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><MapPin className="text-primary" /> {t('relay.title')}</h1>
        <p className="text-muted-foreground">{t('relay.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Stats Cards */}
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle><Search className="inline-block mr-2" />{t('relay.search.title')}</CardTitle></CardHeader>
        <CardContent>
          <Input placeholder={t('relay.search.placeholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-md" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2"><Package /> {shipment.trackingCode}</h3>
                  <p className="text-sm text-muted-foreground">{shipment.documentType}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(shipment.status)}
                  {shipment.travelerVerified && <Badge variant="secondary" className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> ID Verified</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div><p className="text-sm font-medium">Sender</p><p className="text-sm">{shipment.senderName}</p></div>
                <div><p className="text-sm font-medium">Traveler</p><p className="text-sm">{shipment.travelerName}</p></div>
                <div><p className="text-sm font-medium">Destination</p><p className="text-sm">{shipment.destination}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {shipment.status === 'pending_pickup' && (
                  <Button size="sm" onClick={() => openModal(shipment, 'scan')}><QrCode className="mr-2 h-4 w-4" />Register Arrival</Button>
                )}
                {shipment.status === 'in_transit' && !shipment.travelerVerified && (
                  <Button size="sm" variant="outline" onClick={() => openModal(shipment, 'identity')}><Shield className="mr-2 h-4 w-4" />Verify Traveler ID</Button>
                )}
                {shipment.status === 'in_transit' && shipment.travelerVerified && (
                  <Button size="sm" onClick={() => handleHandToTraveler(shipment.id, shipment.envelopeScannedOnPickup || false)}><Package className="mr-2 h-4 w-4" />Handover to Traveler</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => openModal(shipment, 'log')}><History className="mr-2 h-4 w-4" />View Log</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <IdentityVerificationModal />
      <EnvelopeScanModal />
      <AuditTrailModal />
    </div>
  );
}
