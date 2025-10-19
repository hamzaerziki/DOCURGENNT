import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Landing } from "@/pages/Landing";
import { SenderDashboard } from "@/components/dashboard/SenderDashboard";
import { TravelerDashboard } from "@/components/dashboard/TravelerDashboard";
import { RecipientDashboard } from "@/components/dashboard/RecipientDashboard";
import { Schedule } from "@/pages/Schedule";
import { TripManagement } from "@/pages/TripManagement";
import RelayPoint from "@/pages/RelayPoint";
import NotFound from "./pages/NotFound";
import { SenderProfile } from "@/pages/SenderProfile";
import { Levels } from "@/pages/Levels";
import { SecureWorkflowDemo } from "@/pages/SecureWorkflowDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/dashboard/sender" element={<SenderDashboard />} />
            <Route path="/dashboard/traveler" element={<TravelerDashboard />} />
            <Route path="/dashboard/recipient" element={<RecipientDashboard />} />
            <Route path="/trip/:tripId" element={<TripManagement />} />
            <Route path="/relay-point" element={<RelayPoint />} />
            <Route path="/sender-profile" element={<SenderProfile />} />
            <Route path="/levels" element={<Levels />} />
            <Route path="/secure-workflow-demo" element={<SecureWorkflowDemo />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
