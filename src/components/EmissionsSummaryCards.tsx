import { Flame, Zap, BarChart3 } from "lucide-react";

interface EmissionsSummaryCardsProps {
  totalEmissions?: number;
  scope1Emissions?: number;
  scope2Emissions?: number;
}

const EmissionsSummaryCards = ({
  totalEmissions = 0,
  scope1Emissions = 0,
  scope2Emissions = 0,
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
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group flex items-center gap-4"
        >
          <div
            className={`w-14 h-14 rounded-xl ${card.bgColor} flex items-center justify-center shrink-0`}
          >
            <card.icon className={`w-7 h-7 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{card.title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {card.value.toFixed(2)} t
              </span>
              <span className="text-sm font-medium text-primary">{card.unit}</span>
            </div>
            {card.subtitle && (
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmissionsSummaryCards;
