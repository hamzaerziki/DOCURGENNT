import documentWorkflowService, { DocumentRequest } from '../services/documentWorkflowService';

describe('DocumentWorkflowService', () => {
  beforeEach(() => {
    // Clear any existing requests
    (documentWorkflowService as any).requests = [];
    (documentWorkflowService as any).securityLogs = [];
  });

  test('should create a document request with unique codes', () => {
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

    expect(request).toBeDefined();
    expect(request.id).toBeTruthy();
    expect(request.uniqueCode).toMatch(/^DOC[A-Z0-9]{6}$/);
    expect(request.deliveryCode).toBeTruthy();
    expect(request.status).toBe('created');
  });

  test('should validate sender identity correctly', () => {
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

    // Valid code should return true
    expect(documentWorkflowService.validateSenderIdentity(request.id, request.uniqueCode)).toBe(true);
    
    // Invalid code should return false
    expect(documentWorkflowService.validateSenderIdentity(request.id, 'INVALID')).toBe(false);
  });

  test('should mark document as at relay point', () => {
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

    const updatedRequest = documentWorkflowService.markAtRelayPoint(request.id);
    
    expect(updatedRequest).toBeDefined();
    expect(updatedRequest?.status).toBe('at_relay_point');
  });

  test('should validate traveler identity', () => {
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

    // Valid traveler ID should return true
    expect(documentWorkflowService.validateTravelerIdentity(request.id, 'TRAVELER123')).toBe(true);
    
    // Empty traveler ID should return false
    expect(documentWorkflowService.validateTravelerIdentity(request.id, '')).toBe(false);
  });

  test('should hand document to traveler', () => {
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

    // First mark as at relay point
    documentWorkflowService.markAtRelayPoint(request.id);
    
    // Then hand to traveler
    const updatedRequest = documentWorkflowService.handToTraveler(request.id, 'TRAVELER123');
    
    expect(updatedRequest).toBeDefined();
    expect(updatedRequest?.status).toBe('with_traveler');
  });

  test('should validate delivery code', () => {
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

    // Valid delivery code should return true
    expect(documentWorkflowService.validateDeliveryCode(request.id, request.deliveryCode)).toBe(true);
    
    // Invalid delivery code should return false
    expect(documentWorkflowService.validateDeliveryCode(request.id, 'INVALID')).toBe(false);
  });

  test('should mark document as delivered', () => {
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

    // Move through the workflow steps
    documentWorkflowService.markAtRelayPoint(request.id);
    documentWorkflowService.handToTraveler(request.id, 'TRAVELER123');
    
    // Mark as delivered
    const updatedRequest = documentWorkflowService.markDelivered(request.id);
    
    expect(updatedRequest).toBeDefined();
    expect(updatedRequest?.status).toBe('delivered');
  });

  test('should confirm delivery', () => {
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

    // Move through the workflow steps
    documentWorkflowService.markAtRelayPoint(request.id);
    documentWorkflowService.handToTraveler(request.id, 'TRAVELER123');
    documentWorkflowService.markDelivered(request.id);
    
    // Confirm delivery
    const updatedRequest = documentWorkflowService.confirmDelivery(request.id, 'CONFIRM123');
    
    expect(updatedRequest).toBeDefined();
    expect(updatedRequest?.status).toBe('confirmed');
  });

  test('should log security events', () => {
    documentWorkflowService.logSecurityEvent('TEST_EVENT', 'test-id', 'Test security event');
    
    const logs = documentWorkflowService.getSecurityLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].action).toBe('TEST_EVENT');
    expect(logs[0].details).toBe('Test security event');
  });
});