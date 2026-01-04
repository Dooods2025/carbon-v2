import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Zap,
  Flame,
  Plane,
  Droplets,
  Trash2,
  Fuel,
  TreePine,
  Car,
  Home,
  TrendingDown,
  TrendingUp,
  Save,
  RotateCcw,
  Eye,
  Pencil,
  Trash,
  Target,
  Loader2,
  Building2,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  LineChart as LineChartIcon,
  Milestone,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useScenarios } from "@/hooks/useScenarios";
import { useEmissions } from "@/hooks/useEmissions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface Category {
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  currentEmissions: number;
  reduction: number;
}

const TIMELINE_TO_MONTHS: Record<string, number> = {
  "6 months": 6,
  "12 months": 12,
  "18 months": 18,
  "24 months": 24,
  "5 years": 60,
};

interface BusinessContext {
  industry: string;
  businessType: string;
  energySources: string;
  fleetSize: string;
  initiatives: string[];
  target: string;
  budgetAppetite: string;
}

const ReductionPlanner = () => {
  const { user } = useAuth();
  const { scenarios, isLoading, createScenario, deleteScenario } = useScenarios(user?.id);
  const { latestEmissions, emissions } = useEmissions(user?.id);
  const { toast } = useToast();

  const [scenarioName, setScenarioName] = useState("");
  const [timeline, setTimeline] = useState("12 months");
  const [isSaving, setIsSaving] = useState(false);
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());

  // Reduction milestones
  const reductionMilestones = [
    { id: 'energy-audit', label: 'Complete energy audit', impact: '5-10%', category: 'Electricity' },
    { id: 'led-upgrade', label: 'Upgrade to LED lighting', impact: '3-5%', category: 'Electricity' },
    { id: 'hvac-optimize', label: 'Optimize HVAC systems', impact: '10-15%', category: 'Electricity' },
    { id: 'solar-install', label: 'Install solar panels', impact: '20-30%', category: 'Electricity' },
    { id: 'fleet-electric', label: 'Transition fleet to EV', impact: '40-60%', category: 'Fuel' },
    { id: 'waste-reduction', label: 'Implement waste reduction program', impact: '15-25%', category: 'Waste' },
    { id: 'water-recycling', label: 'Install water recycling system', impact: '20-30%', category: 'Water' },
    { id: 'travel-policy', label: 'Implement virtual meeting policy', impact: '30-50%', category: 'Flights' },
  ];

  const toggleMilestone = (id: string) => {
    setCompletedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const [categories, setCategories] = useState<Category[]>([
    { name: "Electricity", icon: Zap, color: "text-blue-500", bgColor: "bg-blue-100", currentEmissions: 98.32, reduction: 0 },
    { name: "Gas", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-100", currentEmissions: 52.18, reduction: 0 },
    { name: "Flights", icon: Plane, color: "text-purple-500", bgColor: "bg-purple-100", currentEmissions: 28.45, reduction: 0 },
    { name: "Water", icon: Droplets, color: "text-cyan-500", bgColor: "bg-cyan-100", currentEmissions: 8.92, reduction: 0 },
    { name: "Waste", icon: Trash2, color: "text-amber-700", bgColor: "bg-amber-100", currentEmissions: 18.76, reduction: 0 },
    { name: "Fuel", icon: Fuel, color: "text-red-500", bgColor: "bg-red-100", currentEmissions: 17.53, reduction: 0 },
  ]);

  // Load business profile context
  useEffect(() => {
    const loadBusinessContext = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('business_profiles')
        .select('industry, business_type, energy_sources, fleet_size, sustainability_initiatives, sustainability_goal, budget_appetite')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        let initiatives: string[] = [];
        if (data.sustainability_initiatives) {
          try {
            initiatives = JSON.parse(data.sustainability_initiatives);
          } catch {
            initiatives = data.sustainability_initiatives.split(',').map((s: string) => s.trim());
          }
        }

        setBusinessContext({
          industry: data.industry || '',
          businessType: data.business_type || '',
          energySources: data.energy_sources || '',
          fleetSize: data.fleet_size || '',
          initiatives,
          target: data.sustainability_goal || '',
          budgetAppetite: data.budget_appetite || '',
        });
      }
    };

    loadBusinessContext();
  }, [user]);

  // Update categories with real emissions data if available
  useEffect(() => {
    if (latestEmissions) {
      setCategories([
        { name: "Electricity", icon: Zap, color: "text-blue-500", bgColor: "bg-blue-100", currentEmissions: latestEmissions.electricity_emissions ?? 98.32, reduction: 0 },
        { name: "Gas", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-100", currentEmissions: latestEmissions.gas_emissions ?? 52.18, reduction: 0 },
        { name: "Flights", icon: Plane, color: "text-purple-500", bgColor: "bg-purple-100", currentEmissions: latestEmissions.flights_emissions ?? 28.45, reduction: 0 },
        { name: "Water", icon: Droplets, color: "text-cyan-500", bgColor: "bg-cyan-100", currentEmissions: latestEmissions.water_emissions ?? 8.92, reduction: 0 },
        { name: "Waste", icon: Trash2, color: "text-amber-700", bgColor: "bg-amber-100", currentEmissions: latestEmissions.waste_emissions ?? 18.76, reduction: 0 },
        { name: "Fuel", icon: Fuel, color: "text-red-500", bgColor: "bg-red-100", currentEmissions: latestEmissions.fuel_emissions ?? 17.53, reduction: 0 },
      ]);
    }
  }, [latestEmissions]);

  // Get the active scenario for tracking
  const activeScenario = scenarios.find(s => s.is_active) ?? scenarios[0];

  // Calculate quarterly variance (comparing actual vs planned)
  const getQuarterlyVariance = () => {
    if (!activeScenario || !emissions || emissions.length < 2) return null;

    const currentQuarterEmissions = latestEmissions?.total_emissions ?? 0;
    const baselineEmissions = activeScenario.baseline_emissions ?? currentTotal;
    const targetReduction = activeScenario.reduction_percentage ?? 0;
    const expectedEmissions = baselineEmissions * (1 - targetReduction / 100);

    const variance = ((currentQuarterEmissions - expectedEmissions) / expectedEmissions) * 100;

    return {
      actual: currentQuarterEmissions,
      expected: expectedEmissions,
      variance,
      status: variance <= -5 ? 'ahead' : variance <= 5 ? 'on-track' : 'off-track',
    };
  };

  const quarterlyVariance = getQuarterlyVariance();

  const currentTotal = categories.reduce((sum, cat) => sum + cat.currentEmissions, 0);
  const targetTotal = categories.reduce((sum, cat) => sum + cat.currentEmissions * (1 - cat.reduction / 100), 0);
  const totalReduction = ((currentTotal - targetTotal) / currentTotal) * 100;

  const handleSliderChange = (index: number, value: number[]) => {
    const newCategories = [...categories];
    newCategories[index].reduction = value[0];
    setCategories(newCategories);
  };

  const handleReset = () => {
    setCategories(categories.map(cat => ({ ...cat, reduction: 0 })));
    setScenarioName("");
    setTimeline("12 months");
  };

  const handleSave = async () => {
    if (!scenarioName.trim()) return;
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to save scenarios",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Build reductions object
    const reductions: Record<string, number> = {};
    categories.forEach(cat => {
      reductions[cat.name.toLowerCase()] = cat.reduction;
    });

    const timelineMonths = TIMELINE_TO_MONTHS[timeline] || 12;
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + timelineMonths);

    try {
      await createScenario.mutateAsync({
        name: scenarioName,
        baseline_emissions: currentTotal,
        reductions,
        target_emissions: targetTotal,
        reduction_percentage: totalReduction,
        timeline_months: timelineMonths,
        target_date: targetDate.toISOString().split('T')[0],
      });

      toast({
        title: "Scenario saved!",
        description: `"${scenarioName}" has been saved successfully.`,
      });

      // Reset form
      setScenarioName("");
      setCategories(categories.map(cat => ({ ...cat, reduction: 0 })));
    } catch (error) {
      toast({
        title: "Error saving scenario",
        description: "Please try again later.",
        variant: "destructive",
      });
    }

    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteScenario.mutateAsync(id);
      toast({
        title: "Scenario deleted",
        description: "The scenario has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting scenario",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Chart data
  const comparisonData = categories.map(cat => ({
    name: cat.name,
    Current: cat.currentEmissions,
    Target: cat.currentEmissions * (1 - cat.reduction / 100),
  }));

  // Timeline data
  const getTimelineMonths = () => {
    switch (timeline) {
      case "6 months": return 6;
      case "12 months": return 12;
      case "18 months": return 18;
      case "24 months": return 24;
      case "5 years": return 60;
      default: return 12;
    }
  };

  const timelineData = Array.from({ length: Math.min(getTimelineMonths(), 12) }, (_, i) => {
    const months = getTimelineMonths();
    const step = months <= 12 ? 1 : Math.ceil(months / 12);
    const monthIndex = i * step;
    const progress = monthIndex / months;
    return {
      month: `M${monthIndex + 1}`,
      emissions: currentTotal - (currentTotal - targetTotal) * progress,
    };
  });

  // Quick wins - sorted by potential reduction
  const quickWins = [...categories]
    .map(cat => ({
      name: cat.name,
      potential: cat.currentEmissions * 0.3,
      percentage: ((cat.currentEmissions * 0.3) / currentTotal * 100),
    }))
    .sort((a, b) => b.potential - a.potential)
    .slice(0, 3);

  // Environmental equivalents
  const emissionsReduced = currentTotal - targetTotal;
  const treesEquivalent = Math.round(emissionsReduced * 45);
  const carsEquivalent = Math.round(emissionsReduced / 4.6);
  const homesEquivalent = Math.round(emissionsReduced / 7.5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Reduction Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Plan and compare emission reduction scenarios
          </p>
        </div>

        {/* Scenario Tracking Alert */}
        {activeScenario && quarterlyVariance && (
          <Alert className={`mb-6 ${
            quarterlyVariance.status === 'ahead' ? 'border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950' :
            quarterlyVariance.status === 'on-track' ? 'border-primary/30 bg-primary/5' :
            'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950'
          }`}>
            {quarterlyVariance.status === 'ahead' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : quarterlyVariance.status === 'on-track' ? (
              <Target className="h-4 w-4 text-primary" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={`${
              quarterlyVariance.status === 'ahead' ? 'text-green-800 dark:text-green-200' :
              quarterlyVariance.status === 'on-track' ? 'text-foreground' :
              'text-red-800 dark:text-red-200'
            }`}>
              <span className="font-medium">
                {quarterlyVariance.status === 'ahead' ? 'Ahead of target!' :
                 quarterlyVariance.status === 'on-track' ? 'On track' :
                 'Off track - Action needed'}
              </span>
              {" "}for scenario "{activeScenario.name}".
              Current: {quarterlyVariance.actual.toFixed(1)}t vs Expected: {quarterlyVariance.expected.toFixed(1)}t
              ({quarterlyVariance.variance > 0 ? '+' : ''}{quarterlyVariance.variance.toFixed(1)}% variance)
            </AlertDescription>
          </Alert>
        )}

        {/* Business Context Section */}
        {businessContext && (businessContext.industry || businessContext.target || businessContext.budgetAppetite) && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {businessContext.industry && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="font-medium text-foreground">{businessContext.industry}</p>
                  </div>
                )}
                {businessContext.energySources && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Energy Sources</p>
                    <p className="font-medium text-foreground">{businessContext.energySources}</p>
                  </div>
                )}
                {businessContext.target && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" /> Goal
                    </p>
                    <p className="font-medium text-primary">{businessContext.target}</p>
                  </div>
                )}
                {businessContext.budgetAppetite && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Budget
                    </p>
                    <p className="font-medium text-foreground">{businessContext.budgetAppetite}</p>
                  </div>
                )}
              </div>
              {businessContext.initiatives && businessContext.initiatives.length > 0 && !businessContext.initiatives.includes('None yet') && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Leaf className="h-3 w-3" /> Current Initiatives
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {businessContext.initiatives.map((initiative, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {initiative}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN - Controls */}
          <div className="space-y-6">
            {/* Scenario Name */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Scenario Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input
                    id="scenario-name"
                    placeholder="e.g., Net Zero 2030"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Timeline</Label>
                  <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="12 months">12 months</SelectItem>
                      <SelectItem value="18 months">18 months</SelectItem>
                      <SelectItem value="24 months">24 months</SelectItem>
                      <SelectItem value="5 years">5 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Category Sliders */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Category Reductions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  const targetValue = category.currentEmissions * (1 - category.reduction / 100);
                  return (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                            <IconComponent className={`h-4 w-4 ${category.color}`} />
                          </div>
                          <span className="font-medium text-foreground">{category.name}</span>
                        </div>
                        <span className="text-sm font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                          -{category.reduction}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-20">{category.currentEmissions.toFixed(2)}t</span>
                        <Slider
                          value={[category.reduction]}
                          onValueChange={(value) => handleSliderChange(index, value)}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium text-primary w-20 text-right">{targetValue.toFixed(2)}t</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                className="w-full gradient-primary"
                disabled={!scenarioName.trim() || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Scenario"}
              </Button>
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN - Results */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Reduction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Current</p>
                    <p className="text-2xl font-bold text-foreground">{currentTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">t CO2e</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-2xl font-bold text-primary">{targetTotal.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">t CO2e</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Reduction</p>
                    <p className="text-2xl font-bold text-green-600">{totalReduction.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">decrease</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
                    style={{ width: `${Math.min(totalReduction, 100)}%` }}
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {totalReduction > 0 ? `${(currentTotal - targetTotal).toFixed(2)}t reduction planned` : "Adjust sliders to plan reductions"}
                </p>
              </CardContent>
            </Card>

            {/* Impact Visualization */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Before vs After Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={70} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value: number) => `${value.toFixed(2)}t`}
                      />
                      <Legend />
                      <Bar dataKey="Current" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Target" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Timeline View */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-primary" />
                  Projected Timeline ({timeline})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value: number) => `${value.toFixed(2)}t CO2e`}
                      />
                      <Line type="monotone" dataKey="emissions" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Wins */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  Quick Wins (30% reduction potential)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickWins.map((win, index) => (
                    <div key={win.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-medium text-foreground">{win.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">{win.potential.toFixed(2)}t</span>
                        <span className="text-sm text-primary ml-2">({win.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact - Always show */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  This reduction is equivalent to:
                </CardTitle>
              </CardHeader>
              <CardContent>
                {emissionsReduced > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background rounded-xl">
                      <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{treesEquivalent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">trees planted</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-xl">
                      <Car className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{carsEquivalent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">cars off road/year</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-xl">
                      <Home className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{homesEquivalent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">homes powered</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">Adjust the category reduction sliders to see your environmental impact</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reduction Milestones */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Milestone className="h-5 w-5 text-primary" />
              Reduction Milestones
            </CardTitle>
            <p className="text-sm text-muted-foreground">Track your progress on key reduction initiatives</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reductionMilestones.map((milestone) => {
                const isCompleted = completedMilestones.has(milestone.id);
                const categoryData = categories.find(c => c.name === milestone.category);
                return (
                  <div
                    key={milestone.id}
                    onClick={() => toggleMilestone(milestone.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      isCompleted
                        ? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800'
                        : 'bg-muted/30 border border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <button
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground/50 hover:border-primary'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${isCompleted ? 'text-green-700 dark:text-green-300 line-through' : 'text-foreground'}`}>
                        {milestone.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {categoryData && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryData.bgColor} ${categoryData.color}`}>
                            {milestone.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Potential: {milestone.impact} reduction
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {completedMilestones.size} of {reductionMilestones.length} milestones completed
              </p>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${(completedMilestones.size / reductionMilestones.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Scenarios */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin" />
                <p>Loading scenarios...</p>
              </div>
            ) : scenarios.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No scenarios saved yet. Create your first reduction plan above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scenario Name</TableHead>
                      <TableHead className="text-right">Target Reduction</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenarios.map((scenario) => {
                      const timelineLabel = scenario.timeline_months
                        ? scenario.timeline_months >= 12
                          ? `${Math.round(scenario.timeline_months / 12)} year${scenario.timeline_months >= 24 ? 's' : ''}`
                          : `${scenario.timeline_months} months`
                        : 'N/A';
                      return (
                        <TableRow key={scenario.id}>
                          <TableCell className="font-medium">{scenario.name}</TableCell>
                          <TableCell className="text-right">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              -{scenario.reduction_percentage?.toFixed(0) ?? 0}%
                            </span>
                          </TableCell>
                          <TableCell>{timelineLabel}</TableCell>
                          <TableCell>{new Date(scenario.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(scenario.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReductionPlanner;
