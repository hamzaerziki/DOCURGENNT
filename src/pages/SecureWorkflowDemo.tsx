import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { SenderWorkflow } from '@/components/workflow/SenderWorkflow';
import { RelayPointWorkflow } from '@/components/workflow/RelayPointWorkflow';
import { TravelerWorkflow } from '@/components/workflow/TravelerWorkflow';
import { RecipientWorkflow } from '@/components/workflow/RecipientWorkflow';
import documentWorkflowService from '@/services/documentWorkflowService';

export const SecureWorkflowDemo = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('sender');

  const handleSenderComplete = () => {
    // In a real app, this would navigate to the next step or show a success message
    console.log('Sender workflow completed');
  };

  const handleRelayPointComplete = () => {
    // In a real app, this would navigate to the next step or show a success message
    console.log('Relay point workflow completed');
  };

  const handleTravelerComplete = () => {
    // In a real app, this would navigate to the next step or show a success message
    console.log('Traveler workflow completed');
  };

  const handleRecipientComplete = () => {
    // In a real app, this would navigate to the next step or show a success message
    console.log('Recipient workflow completed');
  };

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{t('secureWorkflow.title')}</h1>
          <p className="text-muted-foreground">{t('secureWorkflow.subtitle')}</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('secureWorkflow.workflowDemo')}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  // Clear all data for demo purposes
                  documentWorkflowService.logSecurityEvent('DEMO_RESET', undefined, 'Demo workflow reset');
                }}
              >
                {t('secureWorkflow.resetDemo')}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="sender">{t('secureWorkflow.sender')}</TabsTrigger>
                <TabsTrigger value="relay">{t('secureWorkflow.relayPoint')}</TabsTrigger>
                <TabsTrigger value="traveler">{t('secureWorkflow.traveler')}</TabsTrigger>
                <TabsTrigger value="recipient">{t('secureWorkflow.recipient')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sender">
                <SenderWorkflow onComplete={handleSenderComplete} />
              </TabsContent>
              
              <TabsContent value="relay">
                <RelayPointWorkflow onComplete={handleRelayPointComplete} />
              </TabsContent>
              
              <TabsContent value="traveler">
                <TravelerWorkflow onComplete={handleTravelerComplete} />
              </TabsContent>
              
              <TabsContent value="recipient">
                <RecipientWorkflow onComplete={handleRecipientComplete} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('secureWorkflow.securityLog')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto">
                {documentWorkflowService.getSecurityLogs().length > 0 ? (
                  <ul className="space-y-2">
                    {documentWorkflowService.getSecurityLogs().map((log) => (
                      <li key={log.id} className="text-sm border-b pb-2">
                        <div className="font-medium">{log.action}</div>
                        <div className="text-muted-foreground">{log.details}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {t('secureWorkflow.noLogs')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};