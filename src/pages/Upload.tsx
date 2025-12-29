import { useState } from "react";
import { Building2, Settings, Leaf as LeafIcon, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AppHeader from "@/components/AppHeader";
import BusinessProfileSidebar from "@/components/BusinessProfileSidebar";
import EmissionsSummaryCards from "@/components/EmissionsSummaryCards";
interface BusinessProfile {
  // Essential Info
  companyName: string;
  industry: string;
  employees: string;
  sites: string;
  businessType: string;
  // Operational Details
  buildingType: string;
  operatingHours: string;
  energySources: string;
  fleetSize: string;
  fleetType: string;
  // Sustainability Context
  initiatives: string[];
  target: string;
  budgetAppetite: string;
}

const industries = [
  "Professional Services",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Healthcare",
  "Education",
  "Construction",
  "Technology",
  "Other",
];

const businessTypes = [
  "Office-based",
  "Production/Manufacturing",
  "Mixed operations",
  "Remote-first",
];

const buildingTypes = [
  "Own property",
  "Leased",
  "Shared office space",
];

const operatingHoursOptions = [
  "Standard business hours",
  "24/7 operations",
  "Shift work",
];

const energySourceOptions = [
  "Grid electricity only",
  "Some renewable energy",
  "Mostly renewable",
  "On-site solar/wind",
  "Gas heating",
];

const fleetSizeOptions = [
  "No vehicles",
  "Small fleet (<10 vehicles)",
  "Medium fleet (10-50)",
  "Large fleet (50+)",
];

const fleetTypeOptions = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Electric",
];

const initiativeOptions = [
  "None yet",
  "Recycling programs",
  "Energy efficiency measures",
  "Renewable energy",
  "Carbon offsetting",
];

const targetOptions = [
  "No formal target",
  "Reduce by X% in Y years",
  "Net zero by specific year",
  "Compliance with regulations",
];

const budgetOptions = [
  "Looking for no-cost changes only",
  "Small investments (<$10k)",
  "Medium investments ($10k-$100k)",
  "Large investments (>$100k)",
  "ROI-dependent",
];

const Upload = () => {
  const [profile, setProfile] = useState<BusinessProfile>({
    companyName: "",
    industry: "",
    employees: "",
    sites: "",
    businessType: "",
    buildingType: "",
    operatingHours: "",
    energySources: "",
    fleetSize: "",
    fleetType: "",
    initiatives: [],
    target: "",
    budgetAppetite: "",
  });

  const handleChange = (field: keyof BusinessProfile, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleInitiativeToggle = (initiative: string) => {
    setProfile((prev) => {
      const current = prev.initiatives;
      if (current.includes(initiative)) {
        return { ...prev, initiatives: current.filter((i) => i !== initiative) };
      }
      return { ...prev, initiatives: [...current, initiative] };
    });
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile);
    // TODO: Save to backend
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <BusinessProfileSidebar
            companyName={profile.companyName}
            industry={profile.industry}
            employees={profile.employees}
            sites={profile.sites}
            businessType={profile.businessType}
          />

          {/* Main Form */}
          <div className="space-y-8">
            {/* Emissions Summary Cards */}
            <EmissionsSummaryCards
              totalEmissions={0}
              scope1Emissions={0}
              scope2Emissions={0}
            />

            {/* Essential Info Section */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Essential Information
                  </h2>
                  <p className="text-sm text-muted-foreground">Basic company details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={profile.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Industry/Sector</Label>
                  <Select
                    value={profile.industry}
                    onValueChange={(value) => handleChange("industry", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input
                    id="employees"
                    placeholder="e.g., 50"
                    value={profile.employees}
                    onChange={(e) => handleChange("employees", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sites">Number of Sites/Locations</Label>
                  <Input
                    id="sites"
                    placeholder="e.g., 3"
                    value={profile.sites}
                    onChange={(e) => handleChange("sites", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Business Type</Label>
                  <Select
                    value={profile.businessType}
                    onValueChange={(value) => handleChange("businessType", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            {/* Operational Details Section */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Operational Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    How your business operates
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Building Type</Label>
                  <Select
                    value={profile.buildingType}
                    onValueChange={(value) => handleChange("buildingType", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Operating Hours</Label>
                  <Select
                    value={profile.operatingHours}
                    onValueChange={(value) => handleChange("operatingHours", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatingHoursOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Current Energy Sources</Label>
                  <Select
                    value={profile.energySources}
                    onValueChange={(value) => handleChange("energySources", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select energy source" />
                    </SelectTrigger>
                    <SelectContent>
                      {energySourceOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fleet Size</Label>
                  <Select
                    value={profile.fleetSize}
                    onValueChange={(value) => handleChange("fleetSize", value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select fleet size" />
                    </SelectTrigger>
                    <SelectContent>
                      {fleetSizeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {profile.fleetSize && profile.fleetSize !== "No vehicles" && (
                  <div className="space-y-2">
                    <Label>Fleet Type</Label>
                    <Select
                      value={profile.fleetType}
                      onValueChange={(value) => handleChange("fleetType", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select fleet type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fleetTypeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </section>

            {/* Sustainability Context Section */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LeafIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Sustainability Context
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your current sustainability journey
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Current Sustainability Initiatives</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {initiativeOptions.map((initiative) => (
                      <div
                        key={initiative}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                      >
                        <Checkbox
                          id={initiative}
                          checked={profile.initiatives.includes(initiative)}
                          onCheckedChange={() => handleInitiativeToggle(initiative)}
                        />
                        <label
                          htmlFor={initiative}
                          className="text-sm font-medium text-foreground cursor-pointer flex-1"
                        >
                          {initiative}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Target/Goals</Label>
                    <Select
                      value={profile.target}
                      onValueChange={(value) => handleChange("target", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Budget Appetite
                    </Label>
                    <Select
                      value={profile.budgetAppetite}
                      onValueChange={(value) => handleChange("budgetAppetite", value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                className="gradient-primary text-primary-foreground px-8 h-12"
              >
                Save Profile
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
