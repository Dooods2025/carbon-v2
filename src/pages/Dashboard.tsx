import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  MapPin,
  Zap,
  Flame,
  Fuel,
  GitCompare,
  Leaf,
  Factory,
  Building2,
  Globe,
  Eye,
  Download,
  Loader2,
  AlertCircle,
  Target,
  Calendar,
} from "lucide-react";
import { useScenarios } from "@/hooks/useScenarios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useEmissions } from "@/hooks/useEmissions";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Demo data for when no real data exists
const DEMO_CATEGORY_DATA = [
  { name: "Electricity", emissions: 98.32, fill: "#3b82f6" },
  { name: "Gas", emissions: 52.18, fill: "#f97316" },
  { name: "Flights", emissions: 28.45, fill: "#8b5cf6" },
  { name: "Water", emissions: 8.92, fill: "#06b6d4" },
  { name: "Waste", emissions: 18.76, fill: "#92400e" },
  { name: "Fuel", emissions: 17.53, fill: "#ef4444" },
];

const DEMO_SCOPE_DATA = {
  scope1: 85.42,
  scope2: 98.32,
  scope3: 40.42,
  total: 224.16,
};

const DEMO_YEARLY_DATA: Record<string, { total: number; scope1: number; scope2: number; scope3: number; categories: { name: string; emissions: number }[] }> = {
  "2025": {
    total: 232.50,
    scope1: 88.20,
    scope2: 102.15,
    scope3: 42.15,
    categories: [
      { name: "Electricity", emissions: 102.15 },
      { name: "Gas", emissions: 54.32 },
      { name: "Flights", emissions: 29.80 },
      { name: "Water", emissions: 9.25 },
      { name: "Waste", emissions: 19.48 },
      { name: "Fuel", emissions: 17.50 },
    ],
  },
  "2024": {
    total: 224.16,
    scope1: 85.42,
    scope2: 98.32,
    scope3: 40.42,
    categories: [
      { name: "Electricity", emissions: 98.32 },
      { name: "Gas", emissions: 52.18 },
      { name: "Flights", emissions: 28.45 },
      { name: "Water", emissions: 8.92 },
      { name: "Waste", emissions: 18.76 },
      { name: "Fuel", emissions: 17.53 },
    ],
  },
  "2023": {
    total: 213.02,
    scope1: 87.21,
    scope2: 90.45,
    scope3: 35.36,
    categories: [
      { name: "Electricity", emissions: 93.45 },
      { name: "Gas", emissions: 53.28 },
      { name: "Flights", emissions: 26.21 },
      { name: "Water", emissions: 9.05 },
      { name: "Waste", emissions: 19.38 },
      { name: "Fuel", emissions: 17.40 },
    ],
  },
  "2022": {
    total: 198.45,
    scope1: 82.15,
    scope2: 85.30,
    scope3: 31.00,
    categories: [
      { name: "Electricity", emissions: 88.12 },
      { name: "Gas", emissions: 49.85 },
      { name: "Flights", emissions: 22.18 },
      { name: "Water", emissions: 8.45 },
      { name: "Waste", emissions: 17.65 },
      { name: "Fuel", emissions: 16.95 },
    ],
  },
  "2021": {
    total: 185.32,
    scope1: 78.45,
    scope2: 80.12,
    scope3: 26.75,
    categories: [
      { name: "Electricity", emissions: 82.35 },
      { name: "Gas", emissions: 46.72 },
      { name: "Flights", emissions: 18.95 },
      { name: "Water", emissions: 7.85 },
      { name: "Waste", emissions: 16.20 },
      { name: "Fuel", emissions: 15.82 },
    ],
  },
  "2020": {
    total: 172.18,
    scope1: 74.32,
    scope2: 75.86,
    scope3: 22.00,
    categories: [
      { name: "Electricity", emissions: 78.45 },
      { name: "Gas", emissions: 44.18 },
      { name: "Flights", emissions: 12.50 },
      { name: "Water", emissions: 7.25 },
      { name: "Waste", emissions: 15.30 },
      { name: "Fuel", emissions: 14.50 },
    ],
  },
  "2019": {
    total: 195.82,
    scope1: 80.15,
    scope2: 82.67,
    scope3: 33.00,
    categories: [
      { name: "Electricity", emissions: 85.32 },
      { name: "Gas", emissions: 48.15 },
      { name: "Flights", emissions: 24.80 },
      { name: "Water", emissions: 8.05 },
      { name: "Waste", emissions: 17.00 },
      { name: "Fuel", emissions: 12.50 },
    ],
  },
  "2018": {
    total: 188.45,
    scope1: 77.82,
    scope2: 79.63,
    scope3: 31.00,
    categories: [
      { name: "Electricity", emissions: 82.15 },
      { name: "Gas", emissions: 46.50 },
      { name: "Flights", emissions: 23.20 },
      { name: "Water", emissions: 7.80 },
      { name: "Waste", emissions: 16.30 },
      { name: "Fuel", emissions: 12.50 },
    ],
  },
};

const Dashboard = () => {
  const [compareYear1, setCompareYear1] = useState("2024");
  const [compareYear2, setCompareYear2] = useState("2023");
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);

  // Get auth and emissions data from Supabase
  const { user, loading: authLoading } = useAuth();
  const {
    emissions,
    latestEmissions,
    isLoading: emissionsLoading,
    getCategoryData,
    getYearlyData,
  } = useEmissions(user?.id);

  // Get scenarios data
  const { scenarios, isLoading: scenariosLoading } = useScenarios(user?.id);
  const activeScenario = scenarios.find(s => s.is_active) ?? scenarios[0];

  // Determine if we're using real data or demo data
  const hasRealData = !!latestEmissions;
  const isLoading = authLoading || emissionsLoading;

  // Generate category data from Supabase or use demo
  const categoryData = useMemo(() => {
    if (!hasRealData) return DEMO_CATEGORY_DATA;

    const realData = getCategoryData();
    const colorMap: Record<string, string> = {
      'Electricity': '#3b82f6',
      'Gas': '#f97316',
      'Flights': '#8b5cf6',
      'Water': '#06b6d4',
      'Waste': '#92400e',
      'Fuel': '#ef4444',
    };

    return realData.map(item => ({
      name: item.name,
      emissions: item.value,
      fill: colorMap[item.name] || '#6b7280',
    }));
  }, [hasRealData, getCategoryData]);

  // Generate scope distribution data
  const distributionData = useMemo(() => {
    if (!hasRealData) {
      return [
        { name: "Scope 1", value: DEMO_SCOPE_DATA.scope1, color: "#f97316" },
        { name: "Scope 2", value: DEMO_SCOPE_DATA.scope2, color: "hsl(var(--primary))" },
        { name: "Scope 3", value: DEMO_SCOPE_DATA.scope3, color: "#8b5cf6" },
      ];
    }

    return [
      { name: "Scope 1", value: latestEmissions?.scope1_total ?? 0, color: "#f97316" },
      { name: "Scope 2", value: latestEmissions?.scope2_total ?? 0, color: "hsl(var(--primary))" },
      { name: "Scope 3", value: latestEmissions?.scope3_total ?? 0, color: "#8b5cf6" },
    ];
  }, [hasRealData, latestEmissions]);

  // Get total and scope values
  const totalEmissionsValue = hasRealData
    ? (latestEmissions?.total_emissions ?? 0)
    : DEMO_SCOPE_DATA.total;

  const scope1Value = hasRealData
    ? (latestEmissions?.scope1_total ?? 0)
    : DEMO_SCOPE_DATA.scope1;

  const scope2Value = hasRealData
    ? (latestEmissions?.scope2_total ?? 0)
    : DEMO_SCOPE_DATA.scope2;

  const scope3Value = hasRealData
    ? (latestEmissions?.scope3_total ?? 0)
    : DEMO_SCOPE_DATA.scope3;

  // Generate table data from category data
  const tableData = useMemo(() => {
    const total = categoryData.reduce((sum, cat) => sum + cat.emissions, 0);
    return categoryData.map(cat => ({
      category: cat.name,
      emissions: cat.emissions,
      percentage: total > 0 ? (cat.emissions / total) * 100 : 0,
      trend: Math.random() > 0.5 ? "up" as const : "down" as const,
      change: Math.round(Math.random() * 10 * 10) / 10,
    }));
  }, [categoryData]);

  const totalEmissions = tableData.reduce((sum, row) => sum + row.emissions, 0);

  // Previous reports from emissions data
  const previousReports = useMemo(() => {
    if (!emissions || emissions.length === 0) {
      return [
        { id: 1, title: "Q4 2024 Dashboard Report", period: "Oct - Dec 2024", emissions: "1,250.5 t CO2e", generated: "15/12/2024" },
        { id: 2, title: "Q3 2024 Dashboard Report", period: "Jul - Sep 2024", emissions: "1,180.3 t CO2e", generated: "30/09/2024" },
        { id: 3, title: "Q2 2024 Dashboard Report", period: "Apr - Jun 2024", emissions: "1,320.8 t CO2e", generated: "30/06/2024" },
      ];
    }

    return emissions.slice(0, 6).map((record, index) => ({
      id: index + 1,
      title: `${record.report_period || 'Report'} Dashboard Report`,
      period: record.period_start && record.period_end
        ? `${new Date(record.period_start).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })} - ${new Date(record.period_end).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}`
        : 'Period not specified',
      emissions: `${(record.total_emissions ?? 0).toFixed(1)} t CO2e`,
      generated: new Date(record.created_at).toLocaleDateString('en-AU'),
    }));
  }, [emissions]);

  // Site data (from site_breakdown JSON field if available)
  const siteData = useMemo(() => {
    if (!hasRealData || !latestEmissions?.site_breakdown) {
      return [
        { name: "Bibra Lake", emissions: 112.45, percentage: 50.2, trend: "up" as const, change: 3.1 },
        { name: "Kalgoorlie", emissions: 78.32, percentage: 34.9, trend: "down" as const, change: 1.8 },
        { name: "Australind", emissions: 33.39, percentage: 14.9, trend: "up" as const, change: 2.4 },
      ];
    }

    try {
      const breakdown = latestEmissions.site_breakdown as Record<string, number>;
      const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
      return Object.entries(breakdown).map(([name, siteEmissions]) => ({
        name,
        emissions: siteEmissions,
        percentage: total > 0 ? (siteEmissions / total) * 100 : 0,
        trend: Math.random() > 0.5 ? "up" as const : "down" as const,
        change: Math.round(Math.random() * 5 * 10) / 10,
      }));
    } catch {
      return [
        { name: "Main Site", emissions: totalEmissionsValue, percentage: 100, trend: "up" as const, change: 0 },
      ];
    }
  }, [hasRealData, latestEmissions, totalEmissionsValue]);

  // Top emission sources (derived from category data)
  const topSources = useMemo(() => {
    const sorted = [...categoryData].sort((a, b) => b.emissions - a.emissions).slice(0, 3);
    const iconMap: Record<string, { icon: typeof Zap; color: string; bgColor: string }> = {
      'Electricity': { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-100' },
      'Gas': { icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-100' },
      'Fuel': { icon: Fuel, color: 'text-red-500', bgColor: 'bg-red-100' },
      'Flights': { icon: Globe, color: 'text-purple-500', bgColor: 'bg-purple-100' },
      'Water': { icon: Factory, color: 'text-cyan-500', bgColor: 'bg-cyan-100' },
      'Waste': { icon: Factory, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    };

    return sorted.map(cat => ({
      name: cat.name,
      emissions: cat.emissions,
      icon: iconMap[cat.name]?.icon || Factory,
      color: iconMap[cat.name]?.color || 'text-gray-500',
      bgColor: iconMap[cat.name]?.bgColor || 'bg-gray-100',
    }));
  }, [categoryData]);

  // Year comparison data - use real data if available
  const yearlyData = useMemo(() => {
    const realYearlyData = getYearlyData();
    if (realYearlyData.length === 0) return DEMO_YEARLY_DATA;

    const converted: Record<string, { total: number; scope1: number; scope2: number; scope3: number; categories: { name: string; emissions: number }[] }> = {};

    realYearlyData.forEach(yearData => {
      converted[yearData.year] = {
        total: yearData.total,
        scope1: yearData.scope1,
        scope2: yearData.scope2,
        scope3: yearData.scope3,
        categories: DEMO_CATEGORY_DATA.map(cat => ({
          name: cat.name,
          emissions: cat.emissions * (yearData.total / DEMO_SCOPE_DATA.total),
        })),
      };
    });

    ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].forEach(year => {
      if (!converted[year]) {
        converted[year] = DEMO_YEARLY_DATA[year];
      }
    });

    return converted;
  }, [getYearlyData]);

  const year1Data = yearlyData[compareYear1] || DEMO_YEARLY_DATA["2024"];
  const year2Data = yearlyData[compareYear2] || DEMO_YEARLY_DATA["2023"];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const comparisonChartData = year1Data.categories.map((cat, index) => ({
    name: cat.name,
    [compareYear1]: cat.emissions,
    [compareYear2]: year2Data.categories[index]?.emissions ?? 0,
  }));

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading emissions data...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Demo data banner */}
        {!hasRealData && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Showing demo data. <Link to="/file-upload" className="underline font-medium">Upload your data</Link> to see your real emissions.
            </AlertDescription>
          </Alert>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and analyse your carbon emissions data
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="gradient-primary">
              <Link to="/file-upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </Link>
            </Button>
            <Dialog open={reportsDialogOpen} onOpenChange={setReportsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Dashboard Reports</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="previous" className="flex-1 overflow-hidden flex flex-col">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="previous">Previous Reports</TabsTrigger>
                    <TabsTrigger value="full">Full Report</TabsTrigger>
                  </TabsList>
                  <TabsContent value="previous" className="flex-1 overflow-y-auto mt-4 space-y-4">
                    {previousReports.map((report) => (
                      <div
                        key={report.id}
                        className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{report.title}</h4>
                            <p className="text-sm text-primary">
                              {report.period} • {report.emissions}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Generated: {report.generated}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                          <Button size="sm" className="gradient-primary">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="full" className="flex-1 overflow-y-auto mt-4">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">Full Dashboard Report</h4>
                          <p className="text-sm text-muted-foreground">
                            Complete emissions analysis for current period
                          </p>
                        </div>
                        <Button className="gradient-primary">
                          <Download className="h-4 w-4 mr-2" />
                          Download Full Report
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="font-medium text-foreground mb-2">Report Contents</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Executive Summary</li>
                            <li>• Total Emissions Overview</li>
                            <li>• Scope 1, 2 & 3 Breakdown</li>
                            <li>• Category Analysis</li>
                            <li>• Site Comparison</li>
                            <li>• Year-on-Year Trends</li>
                            <li>• Recommendations</li>
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">Total Emissions</p>
                            <p className="text-2xl font-bold text-foreground">{totalEmissionsValue.toFixed(2)} t CO2e</p>
                          </div>
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">Report Period</p>
                            <p className="text-2xl font-bold text-foreground">
                              {latestEmissions?.report_period || 'Q4 2024'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Emissions - Green filled card */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Emissions</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold">{totalEmissionsValue.toFixed(2)}</span>
                  <span className="text-lg font-medium">t CO2e</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm opacity-90">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5.2% vs last quarter</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Scope 1 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scope 1</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">{scope1Value.toFixed(2)}</span>
                  <span className="text-lg font-medium text-primary">t CO2e</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>-2.1% Direct emissions</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Factory className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Scope 2 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scope 2</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">{scope2Value.toFixed(2)}</span>
                  <span className="text-lg font-medium text-primary">t CO2e</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8.4% Indirect emissions</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Scope 3 */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scope 3</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">{scope3Value.toFixed(2)}</span>
                  <span className="text-lg font-medium text-primary">t CO2e</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>Value chain emissions</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Emissions by Category */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Emissions by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `${value}t`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)} t CO2e`, 'Emissions']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar
                      dataKey="emissions"
                      radius={[0, 4, 4, 0]}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Emissions Distribution */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Emissions Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(2)} t CO2e`, '']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emissions by Site & Top Sources Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Emissions by Site */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Emissions by Site
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteData.map((site) => (
                  <div key={site.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{site.name}</p>
                        <p className="text-sm text-muted-foreground">{site.percentage.toFixed(1)}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{site.emissions.toFixed(2)} t</p>
                      <div className={`flex items-center justify-end gap-1 text-xs ${site.trend === 'up' ? 'text-red-500' : 'text-green-600'}`}>
                        {site.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {site.trend === 'up' ? '+' : '-'}{site.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Three Emissions Sources */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Top Three Emissions Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSources.map((source, index) => {
                  const IconComponent = source.icon;
                  return (
                    <div key={source.name} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 rounded-lg ${source.bgColor} flex items-center justify-center`}>
                        <IconComponent className={`h-5 w-5 ${source.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{source.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{source.emissions.toFixed(2)} t CO2e</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Year Comparison Section */}
        <Card className="shadow-md hover:shadow-lg transition-shadow mb-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-primary" />
                Year-on-Year Comparison
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Compare</span>
                  <Select value={compareYear1} onValueChange={setCompareYear1}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2018">2018</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">vs</span>
                <Select value={compareYear2} onValueChange={setCompareYear2}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary Cards */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Summary Comparison</h4>

                {/* Total Emissions Comparison */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Emissions</span>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      calculateChange(year1Data.total, year2Data.total) > 0 ? 'text-red-500' : 'text-green-600'
                    }`}>
                      {calculateChange(year1Data.total, year2Data.total) > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(calculateChange(year1Data.total, year2Data.total)).toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">{year1Data.total.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground ml-1">t CO2e ({compareYear1})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg text-muted-foreground">{year2Data.total.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground ml-1">t CO2e ({compareYear2})</span>
                    </div>
                  </div>
                </div>

                {/* Scope Comparisons Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 text-xs font-medium text-muted-foreground">
                        <th className="p-3 text-left w-24">Scope</th>
                        <th className="p-3 text-center bg-primary/5">{compareYear1}</th>
                        <th className="w-[3px] bg-border"></th>
                        <th className="p-3 text-center">{compareYear2}</th>
                        <th className="p-3 text-center w-24">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Scope 1", key1: year1Data.scope1, key2: year2Data.scope1 },
                        { label: "Scope 2", key1: year1Data.scope2, key2: year2Data.scope2 },
                        { label: "Scope 3", key1: year1Data.scope3, key2: year2Data.scope3 },
                      ].map((scope, idx) => {
                        const change = calculateChange(scope.key1, scope.key2);
                        return (
                          <tr key={scope.label} className={idx % 2 === 0 ? 'bg-muted/20' : ''}>
                            <td className="p-3 font-medium text-foreground">{scope.label}</td>
                            <td className="p-3 text-center font-bold text-foreground bg-primary/5">{scope.key1.toFixed(2)} t</td>
                            <td className="bg-border"></td>
                            <td className="p-3 text-center text-muted-foreground">{scope.key2.toFixed(2)} t</td>
                            <td className="p-3">
                              <div className="flex items-center justify-center">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  change > 0
                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                }`}>
                                  {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  {Math.abs(change).toFixed(1)}%
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comparison Chart */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Category Comparison</h4>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickFormatter={(value) => `${value}t`}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value.toFixed(2)} t CO2e`, name]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey={compareYear1} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey={compareYear2} fill="hsl(var(--primary) / 0.4)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Emissions Breakdown Table */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Detailed Emissions Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                        Category
                        <ArrowUp className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground">
                        Total Emissions (t CO2e)
                        <ArrowDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-right">Percentage</TableHead>
                    <TableHead className="font-semibold text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={row.category} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                      <TableCell className="font-medium">{row.category}</TableCell>
                      <TableCell className="text-right">{row.emissions.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{row.percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.trend === 'up'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {row.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {row.change}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow className="bg-primary/10 font-bold border-t-2 border-primary/20">
                    <TableCell className="font-bold text-foreground">TOTAL</TableCell>
                    <TableCell className="text-right font-bold text-foreground">
                      {totalEmissions.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-foreground">100%</TableCell>
                    <TableCell className="text-right">—</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Current Reduction Scenario with Milestone Tracker */}
        <Card className="shadow-md hover:shadow-lg transition-shadow mt-8">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Current Reduction Scenario
              </CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link to="/reduction-planner">
                  Manage Scenarios
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeScenario ? (
              <div className="space-y-6">
                {/* Scenario Header */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Scenario</p>
                    <p className="text-lg font-semibold text-foreground">{activeScenario.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target Reduction</p>
                    <p className="text-2xl font-bold text-primary">
                      {activeScenario.reduction_percentage?.toFixed(1) ?? 0}%
                    </p>
                  </div>
                </div>

                {/* Reduction Journey Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Reduction Journey</span>
                    <span className="text-primary font-bold">
                      {Math.min(100, Math.max(0, ((activeScenario.baseline_emissions ?? 224) - (latestEmissions?.total_emissions ?? activeScenario.baseline_emissions ?? 224)) /
                        ((activeScenario.baseline_emissions ?? 224) - (activeScenario.target_emissions ?? 180)) * 100)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.max(0, ((activeScenario.baseline_emissions ?? 224) - (latestEmissions?.total_emissions ?? activeScenario.baseline_emissions ?? 224)) /
                            ((activeScenario.baseline_emissions ?? 224) - (activeScenario.target_emissions ?? 180)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{(activeScenario.baseline_emissions ?? 224).toFixed(2)}t CO2e (Baseline)</span>
                    <span>{(latestEmissions?.total_emissions ?? 0).toFixed(2)}t CO2e (Current)</span>
                    <span>{(activeScenario.target_emissions ?? 180).toFixed(2)}t CO2e (Target)</span>
                  </div>
                </div>

                {/* Reduction Milestones */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Reduction Milestones</h4>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                    {/* Milestone items */}
                    {[
                      { percent: 10, target: (activeScenario.baseline_emissions ?? 224) * 0.9, actions: ['LED upgrades', 'Recycling program'], date: '2025-06-15' },
                      { percent: 20, target: (activeScenario.baseline_emissions ?? 224) * 0.8, actions: ['Solar installation', 'EV fleet'], date: '2025-12-31' },
                      { percent: 30, target: (activeScenario.baseline_emissions ?? 224) * 0.7, actions: ['Energy audit', 'Green procurement'], date: '2026-06-30' },
                      { percent: 40, target: (activeScenario.baseline_emissions ?? 224) * 0.6, actions: ['Building optimisation', 'Carbon offset'], date: '2026-12-31' },
                    ].map((milestone, idx) => {
                      const currentEmissions = latestEmissions?.total_emissions ?? activeScenario.baseline_emissions ?? 224;
                      const achieved = currentEmissions <= milestone.target;
                      const progress = ((activeScenario.baseline_emissions ?? 224) - currentEmissions) / (activeScenario.baseline_emissions ?? 224) * 100;
                      const inProgress = !achieved && progress >= (milestone.percent - 10);

                      return (
                        <div key={milestone.percent} className="relative flex gap-4 pb-6 last:pb-0">
                          {/* Milestone dot */}
                          <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            achieved
                              ? 'bg-green-500 text-white'
                              : inProgress
                              ? 'bg-primary/20 border-2 border-primary animate-pulse'
                              : 'bg-muted border-2 border-border'
                          }`}>
                            {achieved && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          {/* Milestone content */}
                          <div className={`flex-1 p-4 rounded-xl border ${
                            achieved
                              ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                              : 'bg-card border-border'
                          }`}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h5 className="font-semibold text-foreground">{milestone.percent}% Reduction</h5>
                                <p className="text-sm text-muted-foreground">{milestone.target.toFixed(2)}t CO2e target</p>
                                <p className="text-xs text-muted-foreground mt-1">Target Date: {milestone.date}</p>
                                {achieved && <p className="text-xs text-green-600 font-medium mt-1">✓ Completed</p>}
                              </div>
                              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                achieved
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : inProgress
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {achieved ? 'Achieved' : inProgress ? 'In Progress' : 'Upcoming'}
                              </span>
                            </div>
                            <div className="mt-3">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Required Actions:</p>
                              <div className="flex flex-wrap gap-2">
                                {milestone.actions.map((action, actionIdx) => (
                                  <span
                                    key={actionIdx}
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      achieved
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                                  >
                                    {achieved && '✓ '}{action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No reduction scenario created yet. Create one to track your progress.
                </p>
                <Button asChild className="gradient-primary">
                  <Link to="/reduction-planner">Create Reduction Scenario</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
