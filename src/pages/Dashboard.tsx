import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-semibold text-foreground">
              Carbon Emissions Dashboard
            </span>
          </div>
          
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Welcome to Your Dashboard
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            You've successfully signed in. This is where your carbon emissions calculator and tracking tools will live.
          </p>

          <div className="bg-accent/50 border border-border rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              🚧 Dashboard Coming Soon
            </h2>
            <p className="text-muted-foreground">
              The carbon emissions calculator and dashboard features are being built. 
              Let us know when you're ready to continue building!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
