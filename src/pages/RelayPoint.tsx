import { RelayPointHeader } from "@/components/layout/RelayPointHeader";
import { RelayPointDashboard } from "@/components/relaypoint/RelayPointDashboard";

const RelayPoint = () => {
  return (
    <div className="min-h-screen bg-background">
      <RelayPointHeader />
      <RelayPointDashboard />
    </div>
  );
};

export default RelayPoint;