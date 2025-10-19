import { v4 as uuidv4 } from 'uuid';

// Types for our workflow
export interface DocumentRequest {
  id: string;
  sender: {
    name: string;
    phone: string;
    sourceAddress: string;
  };
  recipient: {
    name: string;
    phone: string;
    destinationAddress: string;
  };
  document: {
    type: string;
    description: string;
  };
  status: 'created' | 'at_relay_point' | 'with_traveler' | 'delivered' | 'confirmed' | 'completed';
  uniqueCode: string;
  deliveryCode: string;
  createdAt: Date;
  updatedAt: Date;
  // Added delivery steps tracking
  deliverySteps: DeliveryStep[];
  // Added completion tracking
  completedAt?: Date;
  completedBy?: string;
}

export interface DeliveryStep {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
}

export interface SecurityLog {
  id: string;
  timestamp: Date;
  action: string;
  userId?: string;
  ipAddress?: string;
  details?: string;
}

class DocumentWorkflowService {
  private requests: DocumentRequest[] = [];
  private securityLogs: SecurityLog[] = [];

  // Generate a unique code for the sender to pass to recipient
  generateUniqueCode(): string {
    return `DOC${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  // Generate a delivery code for traveler to recipient verification
  generateDeliveryCode(): string {
    return Math.random().toString().substring(2, 8);
  }

  // Create a new document request
  createDocumentRequest(senderData: {
    name: string;
    phone: string;
    sourceAddress: string;
  }, recipientData: {
    name: string;
    phone: string;
    destinationAddress: string;
  }, documentData: {
    type: string;
    description: string;
  }): DocumentRequest {
    // Initialize delivery steps
    const deliverySteps: DeliveryStep[] = [
      { id: 'collect_envelope', name: 'Collect Envelope', completed: false },
      { id: 'take_plane', name: 'Take Plane', completed: false },
      { id: 'landed', name: 'Landed', completed: false },
      { id: 'handled_envelope', name: 'Handled Envelope', completed: false }
    ];

    const request: DocumentRequest = {
      id: uuidv4(),
      sender: senderData,
      recipient: recipientData,
      document: documentData,
      status: 'created',
      uniqueCode: this.generateUniqueCode(),
      deliveryCode: this.generateDeliveryCode(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deliverySteps
    };

    this.requests.push(request);
    this.logSecurityEvent('DOCUMENT_REQUEST_CREATED', request.id, `Document request created for ${senderData.name}`);
    
    return request;
  }

  // Get a document request by ID
  getDocumentRequest(id: string): DocumentRequest | undefined {
    return this.requests.find(request => request.id === id);
  }

  // Update document status when it arrives at relay point
  markAtRelayPoint(requestId: string): DocumentRequest | null {
    const request = this.getDocumentRequest(requestId);
    if (!request) return null;

    request.status = 'at_relay_point';
    request.updatedAt = new Date();
    this.logSecurityEvent('DOCUMENT_AT_RELAY_POINT', requestId, `Document marked as at relay point`);
    
    return request;
  }

  // Validate sender identity at relay point
  validateSenderIdentity(requestId: string, code: string): boolean {
    const request = this.getDocumentRequest(requestId);
    if (!request) return false;

    const isValid = request.uniqueCode === code;
    this.logSecurityEvent(
      'SENDER_IDENTITY_VALIDATION', 
      requestId, 
      `Sender identity validation ${isValid ? 'successful' : 'failed'}`
    );
    
    return isValid;
  }

  // Validate traveler identity at relay point
  validateTravelerIdentity(requestId: string, travelerId: string): boolean {
    // In a real implementation, this would check against verified traveler database
    const isValid = travelerId.length > 0; // Simplified for demo
    this.logSecurityEvent(
      'TRAVELER_IDENTITY_VALIDATION', 
      requestId, 
      `Traveler identity validation ${isValid ? 'successful' : 'failed'}`
    );
    
    return isValid;
  }

  // Hand document to traveler
  handToTraveler(requestId: string, travelerId: string): DocumentRequest | null {
    const request = this.getDocumentRequest(requestId);
    if (!request || request.status !== 'at_relay_point') return null;

    const isTravelerValid = this.validateTravelerIdentity(requestId, travelerId);
    if (!isTravelerValid) return null;

    request.status = 'with_traveler';
    request.updatedAt = new Date();
    this.logSecurityEvent('DOCUMENT_HANDED_TO_TRAVELER', requestId, `Document handed to traveler ${travelerId}`);
    
    return request;
  }

  // Validate delivery code when traveler delivers to recipient
  validateDeliveryCode(requestId: string, code: string): boolean {
    const request = this.getDocumentRequest(requestId);
    if (!request) return false;

    const isValid = request.deliveryCode === code;
    this.logSecurityEvent(
      'DELIVERY_CODE_VALIDATION', 
      requestId, 
      `Delivery code validation ${isValid ? 'successful' : 'failed'}`
    );
    
    return isValid;
  }

  // Mark document as delivered to recipient
  markDelivered(requestId: string): DocumentRequest | null {
    const request = this.getDocumentRequest(requestId);
    if (!request || request.status !== 'with_traveler') return null;

    request.status = 'delivered';
    request.updatedAt = new Date();
    this.logSecurityEvent('DOCUMENT_DELIVERED', requestId, `Document marked as delivered to recipient`);
    
    return request;
  }

  // Complete delivery with recipient confirmation code
  completeDelivery(requestId: string, confirmationCode: string, travelerId: string): DocumentRequest | null {
    const request = this.getDocumentRequest(requestId);
    if (!request) return null;

    // Check if already completed
    if (request.status === 'completed') {
      this.logSecurityEvent('DELIVERY_ALREADY_COMPLETED', requestId, `Attempt to complete already completed delivery`);
      return null;
    }

    // Validate the confirmation code (this should be the deliveryCode provided by the sender)
    const isValid = request.deliveryCode === confirmationCode;
    this.logSecurityEvent(
      'DELIVERY_COMPLETION_VALIDATION', 
      requestId, 
      `Delivery completion validation ${isValid ? 'successful' : 'failed'}`
    );
    
    if (!isValid) {
      return null;
    }

    // Update status to completed
    request.status = 'completed';
    request.completedAt = new Date();
    request.completedBy = travelerId;
    request.updatedAt = new Date();
    
    this.logSecurityEvent('DELIVERY_COMPLETED', requestId, `Delivery completed by traveler ${travelerId}`);
    
    return request;
  }

  // Get completion status
  isDeliveryCompleted(requestId: string): boolean {
    const request = this.getDocumentRequest(requestId);
    return request ? request.status === 'completed' : false;
  }

  // Update delivery step status
  updateDeliveryStep(requestId: string, stepId: string, completed: boolean, userId?: string): DocumentRequest | null {
    const request = this.getDocumentRequest(requestId);
    if (!request) return null;

    const step = request.deliverySteps.find(s => s.id === stepId);
    if (!step) return null;

    step.completed = completed;
    if (completed) {
      step.completedAt = new Date();
      step.completedBy = userId;
    } else {
      step.completedAt = undefined;
      step.completedBy = undefined;
    }

    request.updatedAt = new Date();
    this.logSecurityEvent(
      'DELIVERY_STEP_UPDATED', 
      requestId, 
      `Delivery step '${step.name}' ${completed ? 'completed' : 'reset'} by ${userId || 'unknown user'}`
    );
    
    return request;
  }

  // Get all delivery steps for a request
  getDeliverySteps(requestId: string): DeliveryStep[] {
    const request = this.getDocumentRequest(requestId);
    return request ? request.deliverySteps : [];
  }

  // Check if all steps are completed
  areAllStepsCompleted(requestId: string): boolean {
    const request = this.getDocumentRequest(requestId);
    if (!request) return false;
    
    return request.deliverySteps.every(step => step.completed);
  }

  // Log security events
  logSecurityEvent(action: string, requestId?: string, details?: string): void {
    const log: SecurityLog = {
      id: uuidv4(),
      timestamp: new Date(),
      action,
      details: details || '',
    };

    this.securityLogs.push(log);
    console.log(`[SECURITY LOG] ${new Date().toISOString()} - ${action}: ${details || ''}`);
  }

  // Get security logs for auditing
  getSecurityLogs(): SecurityLog[] {
    return this.securityLogs;
  }
  
  // Get security logs for a specific request
  getSecurityLogsForRequest(requestId: string): SecurityLog[] {
    return this.securityLogs.filter(log => log.details?.includes(requestId));
  }
}

export default new DocumentWorkflowService();