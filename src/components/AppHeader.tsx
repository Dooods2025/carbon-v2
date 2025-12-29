import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const AppHeader = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Reports", path: "/reports" },
    { label: "Upload", path: "/file-upload" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">
            Carbon Emissions Calculator
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className={cn(
                  location.pathname === item.path && "gradient-primary text-primary-foreground"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
