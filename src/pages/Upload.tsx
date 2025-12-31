import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Settings, Leaf as LeafIcon, DollarSign, Lightbulb, Sparkles, Loader2, ArrowRight, Upload as UploadIcon, ImagePlus, X, Target, Eye } from "lucide-react";
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
import EmissionsSummaryCards from "@/components/EmissionsSummaryCards";
import { useAuth } from "@/hooks/useAuth";
import { useEmissions } from "@/hooks/useEmissions";
import { useScenarios } from "@/hooks/useScenarios";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Recommendation {
  title: string;
  description: string;
  potentialSavings: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

interface BusinessProfile {
  // Essential Info
  firstName: string;
  companyName: string;
  abn: string;
  contactEmail: string;
  industry: string;
  employees: string;
  sites: string;
  businessType: string;
  logoUrl: string;
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
  "Agriculture",
  "Energy & Utilities",
  "Financial Services",
  "Information Technology",
  "Mining & Resources",
  "Transport & Logistics",
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
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { latestEmissions, getCategoryData } = useEmissions(user?.id);
  const { scenarios } = useScenarios(user?.id);
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Get the active scenario for progress tracking
  const activeScenario = scenarios.find(s => s.is_active) ?? scenarios[0];

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [profile, setProfile] = useState<BusinessProfile>({
    firstName: "",
    companyName: "",
    abn: "",
    contactEmail: "",
    industry: "",
    employees: "",
    sites: "",
    businessType: "",
    logoUrl: "",
    buildingType: "",
    operatingHours: "",
    energySources: "",
    fleetSize: "",
    fleetType: "",
    initiatives: [],
    target: "",
    budgetAppetite: "",
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Load existing profile from Supabase or create from pending signup data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        // First, check if there's pending profile data from signup
        const pendingProfileStr = localStorage.getItem('pendingProfile');
        if (pendingProfileStr) {
          const pendingProfile = JSON.parse(pendingProfileStr);

          // Try to create the profile
          const { error: insertError } = await supabase
            .from("business_profiles")
            .upsert({
              user_id: user.id,
              company_name: pendingProfile.company_name,
              abn: pendingProfile.abn,
              contact_email: pendingProfile.contact_email,
              industry: pendingProfile.industry,
              num_sites: pendingProfile.num_sites,
            }, { onConflict: 'user_id' });

          if (!insertError) {
            // Clear the pending data
            localStorage.removeItem('pendingProfile');
            toast({
              title: "Profile created!",
              description: "Your business profile has been saved.",
            });
          } else {
            console.error("Error saving pending profile:", insertError);
          }
        }

        // Now load the profile
        const { data, error } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned
          console.error("Error loading profile:", error);
          return;
        }

        if (data) {
          // Parse initiatives from string if needed
          let initiatives: string[] = [];
          if (data.sustainability_initiatives) {
            try {
              initiatives = JSON.parse(data.sustainability_initiatives);
            } catch {
              initiatives = data.sustainability_initiatives.split(",").map((s: string) => s.trim());
            }
          }

          setProfile({
            firstName: data.first_name || "",
            companyName: data.company_name || "",
            abn: data.abn || "",
            contactEmail: data.contact_email || "",
            industry: data.industry || "",
            employees: data.num_employees?.toString() || "",
            sites: data.num_sites?.toString() || "",
            businessType: data.business_type || "",
            logoUrl: data.logo_url || "",
            buildingType: data.building_type || "",
            operatingHours: data.operating_hours || "",
            energySources: data.energy_sources || "",
            fleetSize: data.fleet_size || "",
            fleetType: data.fleet_type || "",
            initiatives: initiatives,
            target: data.sustainability_goal || "",
            budgetAppetite: data.budget_appetite || "",
          });

          // Set logo preview if exists
          if (data.logo_url) {
            setLogoPreview(data.logo_url);
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

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

  // Logo upload handler
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Logo must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setProfile(prev => ({ ...prev, logoUrl: "" }));
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // Generate insights based on profile and emissions data
  const generateInsights = () => {
    setIsGeneratingInsights(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const newRecommendations: Recommendation[] = [];

      // Get emissions data
      const categoryData = getCategoryData();
      const topEmitter = categoryData.length > 0
        ? categoryData.reduce((prev, current) => prev.value > current.value ? prev : current)
        : null;

      // Electricity-based recommendations
      if (topEmitter?.name === 'Electricity' || profile.energySources === 'Grid electricity only') {
        newRecommendations.push({
          title: "Switch to Renewable Energy",
          description: "Consider switching to a green energy provider or installing solar panels. Your electricity is your highest emission source.",
          potentialSavings: `Up to ${((latestEmissions?.electricity_emissions ?? 50) * 0.8).toFixed(1)}t CO2e/year`,
          priority: 'high',
          category: 'energy',
        });
      }

      // Building-based recommendations
      if (profile.buildingType === 'Leased' || profile.operatingHours === '24/7 operations') {
        newRecommendations.push({
          title: "Optimize HVAC Schedule",
          description: "Implement smart building controls to reduce heating and cooling outside of peak hours.",
          potentialSavings: "15-25% reduction in energy use",
          priority: 'medium',
          category: 'operations',
        });
      }

      // Fleet-based recommendations
      if (profile.fleetSize && profile.fleetSize !== "No vehicles" && profile.fleetType !== 'Electric') {
        newRecommendations.push({
          title: "Transition Fleet to EVs",
          description: `Consider transitioning your ${profile.fleetSize.toLowerCase()} to electric vehicles to reduce Scope 1 emissions.`,
          potentialSavings: `Up to ${((latestEmissions?.fuel_emissions ?? 20) * 0.9).toFixed(1)}t CO2e/year`,
          priority: profile.fleetSize.includes('Large') ? 'high' : 'medium',
          category: 'transport',
        });
      }

      // No sustainability initiatives
      if (profile.initiatives.includes('None yet') || profile.initiatives.length === 0) {
        newRecommendations.push({
          title: "Start a Recycling Program",
          description: "Implement comprehensive recycling across all sites to reduce waste-to-landfill emissions.",
          potentialSavings: `${((latestEmissions?.waste_emissions ?? 10) * 0.5).toFixed(1)}t CO2e/year`,
          priority: 'low',
          category: 'waste',
        });
      }

      // LED lighting for all
      newRecommendations.push({
        title: "LED Lighting Upgrade",
        description: "Replace all lighting with energy-efficient LED alternatives for immediate energy savings.",
        potentialSavings: "10-20% electricity reduction",
        priority: 'medium',
        category: 'energy',
      });

      // Budget-based recommendations
      if (profile.budgetAppetite === 'Looking for no-cost changes only') {
        newRecommendations.push({
          title: "Employee Awareness Campaign",
          description: "Launch a sustainability awareness program to encourage energy-saving behaviors at no cost.",
          potentialSavings: "5-10% overall reduction",
          priority: 'low',
          category: 'culture',
        });
      }

      // Water-based recommendations if water emissions exist
      if ((latestEmissions?.water_emissions ?? 0) > 0) {
        newRecommendations.push({
          title: "Water Efficiency Measures",
          description: "Install water-efficient fixtures and implement rainwater harvesting systems.",
          potentialSavings: `${((latestEmissions?.water_emissions ?? 5) * 0.3).toFixed(1)}t CO2e/year`,
          priority: 'low',
          category: 'water',
        });
      }

      setRecommendations(newRecommendations.slice(0, 5)); // Limit to 5 recommendations
      setIsGeneratingInsights(false);

      toast({
        title: "Insights Generated!",
        description: `${newRecommendations.length} recommendations tailored to your business.`,
      });
    }, 1500);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      let logoUrl = profile.logoUrl;

      // Upload logo if a new file was selected
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${user.id}/logo.${fileExt}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(fileName, logoFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Logo upload error:', uploadError);
          // Continue without logo if storage isn't set up
          toast({
            title: "Logo upload skipped",
            description: "Storage not configured. Profile saved without logo.",
          });
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('logos')
            .getPublicUrl(fileName);
          logoUrl = urlData.publicUrl;
        }
      }

      // Check if profile exists
      const { data: existing } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      // Note: first_name field requires adding column to Supabase
      // ALTER TABLE business_profiles ADD COLUMN first_name TEXT;
      const profileData: Record<string, unknown> = {
        user_id: user.id,
        company_name: profile.companyName,
        abn: profile.abn,
        contact_email: profile.contactEmail,
        industry: profile.industry,
        num_employees: profile.employees ? parseInt(profile.employees) : null,
        num_sites: profile.sites ? parseInt(profile.sites) : null,
        business_type: profile.businessType,
        logo_url: logoUrl,
        building_type: profile.buildingType,
        operating_hours: profile.operatingHours,
        energy_sources: profile.energySources,
        has_fleet: profile.fleetSize !== "No vehicles" && profile.fleetSize !== "",
        fleet_size: profile.fleetSize,
        fleet_type: profile.fleetType,
        sustainability_initiatives: JSON.stringify(profile.initiatives),
        sustainability_goal: profile.target,
        budget_appetite: profile.budgetAppetite,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (existing) {
        // Update existing profile
        const result = await supabase
          .from("business_profiles")
          .update(profileData)
          .eq("user_id", user.id);
        error = result.error;
      } else {
        // Insert new profile
        const result = await supabase
          .from("business_profiles")
          .insert(profileData);
        error = result.error;
      }

      if (error) {
        throw error;
      }

      // Update local state with the new logo URL
      if (logoUrl !== profile.logoUrl) {
        setProfile(prev => ({ ...prev, logoUrl }));
        setLogoFile(null); // Clear the file after successful upload
      }

      toast({
        title: "Profile saved!",
        description: "Your business profile has been updated.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToUpload = async () => {
    // Save profile first, then navigate
    await handleSaveProfile();
    navigate("/file-upload");
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-12 pt-28">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading profile...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 pt-28 max-w-5xl">
        <div className="space-y-6">
            {/* Personalized Greeting */}
            <div className="mb-2">
              <h1 className="text-2xl font-display font-bold text-foreground">
                Hi {profile.firstName || 'there'}, since you were last here...
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Review your profile and track your emissions reduction progress
              </p>
            </div>

            {/* News & Updates Panel */}
            <div className="bg-gradient-to-r from-stone-100 to-stone-50 dark:from-stone-800 dark:to-stone-700 rounded-2xl p-4 flex items-center gap-4 border border-stone-200 dark:border-stone-600">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Latest</span>
                </div>
                <p className="text-stone-700 dark:text-stone-200 text-sm">
                  NGERS reporting deadline approaching. Ensure your Q4 data is uploaded by February 28th for compliance.
                </p>
              </div>
              <div className="hidden sm:flex flex-col gap-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>2 data gaps detected</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>On track for Q1 target</span>
                </div>
              </div>
            </div>

            {/* Emissions Summary Cards */}
            <EmissionsSummaryCards
              totalEmissions={latestEmissions?.total_emissions ?? 0}
              scope1Emissions={latestEmissions?.scope1_total ?? 0}
              scope2Emissions={latestEmissions?.scope2_total ?? 0}
              scope3Emissions={latestEmissions?.scope3_total ?? 0}
            />

            {/* Milestone Progress Line */}
            {activeScenario && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Reduction Journey</h3>
                  <span className="text-primary font-bold">
                    {activeScenario.reduction_percentage?.toFixed(1) ?? 0}% Target
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="text-primary font-medium">
                      {Math.min(100, ((latestEmissions?.total_emissions ?? 0) > 0 ?
                        Math.max(0, ((activeScenario.baseline_emissions ?? 224) - (latestEmissions?.total_emissions ?? 0)) /
                        ((activeScenario.baseline_emissions ?? 224) - (activeScenario.target_emissions ?? 180)) * 100) : 0
                      )).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, ((latestEmissions?.total_emissions ?? 0) > 0 ?
                          Math.max(0, ((activeScenario.baseline_emissions ?? 224) - (latestEmissions?.total_emissions ?? 0)) /
                          ((activeScenario.baseline_emissions ?? 224) - (activeScenario.target_emissions ?? 180)) * 100) : 0
                        ))}%`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{(activeScenario.baseline_emissions ?? 224).toFixed(2)}t CO2e (Baseline)</span>
                    <span>{(latestEmissions?.total_emissions ?? 0).toFixed(2)}t CO2e (Current)</span>
                    <span>{(activeScenario.target_emissions ?? 180).toFixed(2)}t CO2e (Target)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Essential Info Section */}
            <section id="essential-info" className="bg-card rounded-2xl border border-border p-6 md:p-8">
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

              {/* Company Name with Logo */}
              <div className="flex items-start gap-4 mb-6 p-4 rounded-xl bg-muted/30 border border-border">
                <div
                  className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer flex items-center justify-center bg-white shrink-0 group"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {logoPreview || profile.logoUrl ? (
                    <>
                      <img
                        src={logoPreview || profile.logoUrl}
                        alt="Company logo"
                        className="w-full h-full object-contain"
                      />
                      {/* Show X only on hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLogo();
                        }}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </>
                  ) : (
                    <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoSelect}
                  className="hidden"
                />
                <div className="flex-1 space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={profile.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">Click the icon to upload your company logo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Your First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g., John"
                    value={profile.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abn">ABN</Label>
                  <Input
                    id="abn"
                    placeholder="e.g., 12 345 678 901"
                    value={profile.abn}
                    onChange={(e) => handleChange("abn", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Company Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@company.com"
                    value={profile.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
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

            {/* Active Scenario Section */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Active Scenario
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your current reduction plan from the Planner
                  </p>
                </div>
                <Link to="/reduction-planner">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Planner
                  </Button>
                </Link>
              </div>

              {activeScenario ? (
                <div className="space-y-4">
                  {/* Progress Indicator with Dynamic Color */}
                  {(() => {
                    const baseline = activeScenario.baseline_emissions ?? 224;
                    const target = activeScenario.target_emissions ?? 180;
                    const current = latestEmissions?.total_emissions ?? baseline;
                    const totalReduction = baseline - target;
                    const currentReduction = baseline - current;
                    const progressPercent = totalReduction > 0 ? Math.min(100, Math.max(0, (currentReduction / totalReduction) * 100)) : 0;

                    // Color transitions from red (0%) -> orange (33%) -> yellow (66%) -> green (100%)
                    const getProgressColor = (percent: number) => {
                      if (percent >= 75) return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' };
                      if (percent >= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' };
                      if (percent >= 25) return { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' };
                      return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
                    };

                    const colors = getProgressColor(progressPercent);

                    return (
                      <div className="p-4 rounded-xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">{activeScenario.name}</h3>
                            {activeScenario.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {activeScenario.description}
                              </p>
                            )}
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${colors.light} ${colors.text}`}>
                            {activeScenario.is_active ? 'Active' : 'Saved'}
                          </span>
                        </div>

                        {/* Progress Track with Moving Indicator */}
                        <div className="relative mb-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span>Baseline: {baseline.toFixed(1)}t</span>
                            <span className={`font-medium ${colors.text}`}>{progressPercent.toFixed(0)}% Complete</span>
                            <span>Target: {target.toFixed(1)}t</span>
                          </div>
                          <div className="h-4 bg-muted rounded-full overflow-hidden relative">
                            {/* Progress bar */}
                            <div
                              className={`h-full ${colors.bg} rounded-full transition-all duration-700 ease-out`}
                              style={{ width: `${progressPercent}%` }}
                            />
                            {/* Moving indicator dot */}
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${colors.bg} border-4 border-white shadow-lg transition-all duration-700 ease-out flex items-center justify-center`}
                              style={{ left: `calc(${progressPercent}% - 12px)` }}
                            >
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>Current: {current.toFixed(1)}t CO2e</span>
                            <span>Remaining: {Math.max(0, current - target).toFixed(1)}t to go</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Target Reduction</p>
                            <p className={`text-lg font-bold ${colors.text}`}>
                              {activeScenario.target_reduction ?? 20}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Target Year</p>
                            <p className="text-lg font-bold text-foreground">
                              {activeScenario.target_year ?? 2030}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <Link to="/reduction-planner" className="flex-1">
                      <Button variant="outline" className="w-full h-10">
                        Edit Scenario
                      </Button>
                    </Link>
                    <Link to="/dashboard" className="flex-1">
                      <Button className="w-full h-10 gradient-primary">
                        Track Progress
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-6 border border-dashed border-border text-center">
                  <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-medium text-foreground mb-2">No Active Scenario</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a reduction scenario in the Planner to track your sustainability goals.
                  </p>
                  <Link to="/reduction-planner">
                    <Button className="gradient-primary">
                      Create Scenario
                    </Button>
                  </Link>
                </div>
              )}
            </section>

            {/* Insights & Recommendations Section */}
            <section className="bg-card rounded-2xl border border-border p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground">
                    Insights & Recommendations
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    AI-powered suggestions to reduce your carbon footprint
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {recommendations.length === 0 ? (
                  /* Generate button when no recommendations */
                  <div className="bg-muted/30 rounded-xl p-6 border border-dashed border-border">
                    <div className="flex flex-col items-center justify-center text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Generate Insights
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-4">
                        Complete your business profile and upload emissions data to receive
                        personalised recommendations for reducing your carbon footprint.
                      </p>
                      <Button
                        className="gradient-primary"
                        onClick={generateInsights}
                        disabled={isGeneratingInsights}
                      >
                        {isGeneratingInsights ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Recommendations
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display recommendations */
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {recommendations.length} recommendations based on your profile
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateInsights}
                        disabled={isGeneratingInsights}
                      >
                        {isGeneratingInsights ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Refresh
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.map((rec, index) => {
                        const priorityColors = {
                          high: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                          medium: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
                          low: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
                        };
                        const priorityIconColors = {
                          high: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-400',
                          medium: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400',
                          low: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400',
                        };
                        return (
                          <div
                            key={index}
                            className={`rounded-xl p-4 border ${priorityColors[rec.priority]}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${priorityIconColors[rec.priority]}`}>
                                <Lightbulb className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                    rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                    rec.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                                    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  }`}>
                                    {rec.priority}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {rec.description}
                                </p>
                                <p className="text-sm font-medium text-primary mt-2">
                                  Potential savings: {rec.potentialSavings}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                onClick={handleSaveProfile}
                variant="outline"
                className="px-8 h-12"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
              <Button
                onClick={handleContinueToUpload}
                className="gradient-primary text-primary-foreground px-8 h-12"
                disabled={isSaving}
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                Continue to Upload Data
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
