import { Building2, MapPin, Factory, Mail, FileText, TrendingDown, TrendingUp, Minus } from "lucide-react";

interface BusinessProfileSidebarProps {
  companyName: string;
  abn: string;
  contactEmail: string;
  industry: string;
  sites: string;
  logoUrl?: string;
  scenarioProgress?: {
    name: string;
    targetReduction: number;
    actualReduction: number;
    status: 'on-track' | 'off-track' | 'ahead';
  } | null;
}

const BusinessProfileSidebar = ({
  companyName,
  abn,
  contactEmail,
  industry,
  sites,
  logoUrl,
  scenarioProgress,
}: BusinessProfileSidebarProps) => {
  const hasAnyData = companyName || abn || contactEmail || industry || sites;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'on-track': return 'text-primary bg-primary/10';
      case 'off-track': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead': return <TrendingDown className="w-4 h-4" />;
      case 'on-track': return <Minus className="w-4 h-4" />;
      case 'off-track': return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <aside className="bg-card rounded-2xl border border-border p-6 h-fit lg:sticky lg:top-28 lg:min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        {logoUrl ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-white">
            <img src={logoUrl} alt="Company logo" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
        )}
        <div>
          <h2 className="font-display font-bold text-foreground">
            {companyName || "Your Company"}
          </h2>
          <p className="text-sm text-muted-foreground">Business Profile</p>
        </div>
      </div>

      {/* Scenario Progress Indicator */}
      {scenarioProgress && (
        <div className={`mb-4 p-3 rounded-lg ${getStatusColor(scenarioProgress.status)}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium uppercase tracking-wide">Scenario Progress</span>
            {getStatusIcon(scenarioProgress.status)}
          </div>
          <p className="text-sm font-medium truncate">{scenarioProgress.name}</p>
          <div className="mt-2 h-2 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-current rounded-full transition-all"
              style={{ width: `${Math.min(100, (scenarioProgress.actualReduction / scenarioProgress.targetReduction) * 100)}%` }}
            />
          </div>
          <p className="text-xs mt-1">
            {scenarioProgress.actualReduction.toFixed(1)}% of {scenarioProgress.targetReduction}% target
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">ABN</p>
            <p className="text-sm font-medium text-foreground">
              {abn || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
          <Mail className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Contact Email</p>
            <p className="text-sm font-medium text-foreground">
              {contactEmail || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
          <Factory className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Industry</p>
            <p className="text-sm font-medium text-foreground">
              {industry || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Number of Sites</p>
            <p className="text-sm font-medium text-foreground">
              {sites || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {!hasAnyData && (
        <p className="text-sm text-muted-foreground text-center py-4 mt-4">
          Complete the Information to help generate recommendations
        </p>
      )}
    </aside>
  );
};

export default BusinessProfileSidebar;
