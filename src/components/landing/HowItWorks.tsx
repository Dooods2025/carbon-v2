import { UserPlus, ClipboardList, Target } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description: "Sign up in seconds and set up your profile. Tell us about your business to get started.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Input Your Data",
    description: "Enter your energy usage, travel habits, and other activities. Our calculator does the rest.",
  },
  {
    icon: Target,
    step: "03",
    title: "Track & Reduce",
    description: "View your carbon footprint, track changes over time, and follow our tips to reduce emissions.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is easy. Follow these three simple steps to begin your sustainability journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="relative bg-card border border-border rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 relative z-10">
                  <step.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-semibold text-primary mb-2 block">
                  Step {step.step}
                </span>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
