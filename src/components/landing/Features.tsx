import { Calculator, LineChart, Lightbulb, FileText } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Calculate Emissions",
    description: "Input your activities and get accurate carbon footprint calculations based on verified emission factors.",
  },
  {
    icon: LineChart,
    title: "Track Over Time",
    description: "Monitor your emissions history with beautiful charts and visualizations. See your progress at a glance.",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description: "Receive personalized recommendations to reduce your carbon footprint based on your unique data.",
  },
  {
    icon: FileText,
    title: "Easy Reporting",
    description: "Generate professional reports for compliance, stakeholders, or personal records with one click.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything You Need to Go Green
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive toolkit helps you understand, track, and reduce your environmental impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
