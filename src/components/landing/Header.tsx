import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">
            CarbonTrack
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
