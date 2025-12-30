import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-foreground">
              Carbon Emissions Calculator
            </span>
          </div>
          
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Carbon Emissions Calculator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
