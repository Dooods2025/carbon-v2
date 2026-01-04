import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ClipboardList, FileText, Headphones } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-sm text-accent-foreground mb-6 animate-fade-in">
            <Leaf className="w-4 h-4" />
            <span>Track your environmental impact</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Measure, Track & 
            <span className="text-primary"> Reduce</span> Your Carbon Footprint
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Understand your environmental impact with our powerful carbon emissions calculator. 
            Get actionable insights to make sustainable choices for a greener future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity px-8 py-6 text-lg">
                Start Calculating
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            { icon: ClipboardList, title: "Actionable Plans", subtitle: "Reduction Strategies" },
            { icon: FileText, title: "Ready-to-Share Reports", subtitle: "PDF Reports" },
            { icon: Headphones, title: "Expert Support", subtitle: "Talk to a WHS Consultant" },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="bg-accent rounded-2xl p-6 text-center shadow-sm animate-scale-in"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-bold text-foreground mb-1">{feature.title}</p>
              <p className="text-sm text-accent-foreground">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
