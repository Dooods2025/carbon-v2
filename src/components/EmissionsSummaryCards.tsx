import { Flame, Zap, BarChart3, Globe } from "lucide-react";

interface EmissionsSummaryCardsProps {
  totalEmissions?: number;
  scope1Emissions?: number;
  scope2Emissions?: number;
  scope3Emissions?: number;
}

const EmissionsSummaryCards = ({
  totalEmissions = 0,
  scope1Emissions = 0,
  scope2Emissions = 0,
  scope3Emissions = 0,
}: EmissionsSummaryCardsProps) => {
  const cards = [
    {
      title: "Total Emissions",
      value: totalEmissions,
      unit: "CO2e",
      icon: BarChart3,
      bgColor: "bg-sky-100",
      iconColor: "text-sky-500",
    },
    {
      title: "Scope 1",
      value: scope1Emissions,
      unit: "CO2e",
      icon: Flame,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-400",
      subtitle: "Direct emissions",
    },
    {
      title: "Scope 2",
      value: scope2Emissions,
      unit: "CO2e",
      icon: Zap,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-500",
      subtitle: "Indirect emissions",
    },
    {
      title: "Scope 3",
      value: scope3Emissions,
      unit: "CO2e",
      icon: Globe,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-500",
      subtitle: "Value chain",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-xl p-3 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex items-center gap-3"
        >
          <div
            className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center shrink-0`}
          >
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{card.title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">
                {card.value.toFixed(1)}t
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmissionsSummaryCards;
