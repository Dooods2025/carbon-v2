import { Building2, MapPin, Factory, Mail, FileText } from "lucide-react";

interface BusinessProfileSidebarProps {
  companyName: string;
  abn: string;
  contactEmail: string;
  industry: string;
  sites: string;
}

const BusinessProfileSidebar = ({
  companyName,
  abn,
  contactEmail,
  industry,
  sites,
}: BusinessProfileSidebarProps) => {
  const hasAnyData = companyName || abn || contactEmail || industry || sites;

  return (
    <aside className="bg-card rounded-2xl border border-border p-6 h-fit sticky top-28 min-h-[500px]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-display font-bold text-foreground">
            {companyName || "Your Company"}
          </h2>
          <p className="text-sm text-muted-foreground">Business Profile</p>
        </div>
      </div>

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
          Complete the form to see your profile summary
        </p>
      )}
    </aside>
  );
};

export default BusinessProfileSidebar;
