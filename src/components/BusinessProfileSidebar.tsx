import { Building2, MapPin, Users, Briefcase, Factory } from "lucide-react";

interface BusinessProfileSidebarProps {
  companyName: string;
  industry: string;
  employees: string;
  sites: string;
  businessType: string;
}

const BusinessProfileSidebar = ({
  companyName,
  industry,
  employees,
  sites,
  businessType,
}: BusinessProfileSidebarProps) => {
  return (
    <aside className="bg-card rounded-2xl border border-border p-6 h-fit sticky top-28">
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
        {industry && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
            <Factory className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="text-sm font-medium text-foreground">{industry}</p>
            </div>
          </div>
        )}

        {employees && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Employees</p>
              <p className="text-sm font-medium text-foreground">{employees}</p>
            </div>
          </div>
        )}

        {sites && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
            <MapPin className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Sites/Locations</p>
              <p className="text-sm font-medium text-foreground">{sites}</p>
            </div>
          </div>
        )}

        {businessType && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
            <Briefcase className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Business Type</p>
              <p className="text-sm font-medium text-foreground">{businessType}</p>
            </div>
          </div>
        )}
      </div>

      {!companyName && !industry && !employees && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Complete the form to see your profile summary
        </p>
      )}
    </aside>
  );
};

export default BusinessProfileSidebar;
