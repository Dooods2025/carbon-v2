import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLeadershipReports, openLeadershipReport } from "@/hooks/useLeadershipReports";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  Scale,
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
import {
  CATEGORY_KEYS,
  type CategoryName,
  aggregate,
  parseSelection,
  pctChange,
  periodOptions,
  previousRecords,
  previousTitle,
  quarterLabel,
  quarterlyTrend,
  recordsFor,
  selectionTitle,
  yearlyTotals,
} from "@/lib/emissionsPeriods";
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

// Shows a real % change vs the comparable earlier period, or a neutral note when there isn't one.
// More emissions = red (worse), fewer = green (better).
const ChangeNote = ({ change, label, fallback, inverse = false }: { change: number | null; label: string | null; fallback: string; inverse?: boolean }) => {
  if (change === null || label === null) {
    return <span className={inverse ? "opacity-90" : "text-muted-foreground"}>{fallback}</span>;
  }
  const up = change > 0;
  const colour = inverse ? "" : up ? "text-red-500" : "text-green-600";
  return (
    <span className={`flex items-center gap-1 ${colour}`}>
      {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      {up ? "+" : ""}{change.toFixed(1)}% {label}
    </span>
  );
};

const Dashboard = () => {
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);

  // Get auth and emissions data from Supabase
  const { user, loading: authLoading } = useAuth();
  const {
    emissions,
    latestEmissions,
    isLoading: emissionsLoading,
  } = useEmissions(user?.id);
  const { getReportHtml } = useLeadershipReports(user?.id);
  const navigate = useNavigate();

  // Open the saved leadership report for an upload (print = true opens the print / Save as PDF dialog).
  // Older uploads without a saved report go to the Reports page instead.
  const openReport = (recordId: string | undefined, print: boolean) => {
    const record = recordId ? emissions?.find((e) => e.id === recordId) : null;
    const html = getReportHtml(record);
    if (html && openLeadershipReport(html, print)) return;
    setReportsDialogOpen(false);
    navigate("/reports");
  };

  // Get scenarios data
  const { scenarios, isLoading: scenariosLoading } = useScenarios(user?.id);
  const activeScenario = scenarios.find(s => s.is_active) ?? scenarios[0];

  // Determine if we're using real data or demo data
  const hasRealData = !!latestEmissions;
  const isLoading = authLoading || emissionsLoading;

  // ---------------------------------------------------------------------------
  // Period selection: latest quarter by default, or any quarter, calendar year, or all periods
  // ---------------------------------------------------------------------------
  const options = useMemo(() => periodOptions(emissions), [emissions]);
  const latestQuarterValue = latestEmissions ? `q:${quarterLabel(latestEmissions)}` : "all";
  const [periodValue, setPeriodValue] = useState<string | null>(null);
  const activeValue = periodValue && options.some(o => o.value === periodValue) ? periodValue : latestQuarterValue;
  const selection = parseSelection(activeValue);

  const current = useMemo(() => aggregate(recordsFor(emissions, selection)), [emissions, activeValue]); // eslint-disable-line react-hooks/exhaustive-deps
  const previous = useMemo(() => {
    const recs = previousRecords(emissions, selection);
    return recs.length ? aggregate(recs) : null;
  }, [emissions, activeValue]); // eslint-disable-line react-hooks/exhaustive-deps
  const periodTitle = selectionTitle(selection);
  const compareLabel = previous ? `vs ${previousTitle(selection, previous.quarters)}` : null;
  // Comparing a partial year with a full year is misleading, so flag it
  const yearCoverageNote = selection.kind === "year" && current.records < 4
    ? `Covers ${current.records} of 4 quarters`
    : null;

  // Generate category data from Supabase or use demo
  const categoryData = useMemo(() => {
    if (!hasRealData) return DEMO_CATEGORY_DATA;
    return CATEGORY_KEYS.map(c => ({ name: c.name, emissions: current.categories[c.name], fill: c.color }));
  }, [hasRealData, current]);

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
      { name: "Scope 1", value: current.scope1, color: "#f97316" },
      { name: "Scope 2", value: current.scope2, color: "hsl(var(--primary))" },
      { name: "Scope 3", value: current.scope3, color: "#8b5cf6" },
    ];
  }, [hasRealData, current]);

  // Get total and scope values
  const totalEmissionsValue = hasRealData ? current.total : DEMO_SCOPE_DATA.total;
  const scope1Value = hasRealData ? current.scope1 : DEMO_SCOPE_DATA.scope1;
  const scope2Value = hasRealData ? current.scope2 : DEMO_SCOPE_DATA.scope2;
  const scope3Value = hasRealData ? current.scope3 : DEMO_SCOPE_DATA.scope3;

  // Real change vs the comparable earlier period (null when there is none)
  const totalChange = hasRealData ? pctChange(current.total, previous?.total) : null;
  const scope1Change = hasRealData ? pctChange(current.scope1, previous?.scope1) : null;
  const scope2Change = hasRealData ? pctChange(current.scope2, previous?.scope2) : null;
  const scope3Change = hasRealData ? pctChange(current.scope3, previous?.scope3) : null;

  // Generate table data from category data
  const tableData = useMemo(() => {
    const total = categoryData.reduce((sum, cat) => sum + cat.emissions, 0);
    return categoryData.map(cat => {
      const change = hasRealData && previous
        ? pctChange(cat.emissions, previous.categories[cat.name as CategoryName])
        : null;
      return {
        category: cat.name,
        emissions: cat.emissions,
        percentage: total > 0 ? (cat.emissions / total) * 100 : 0,
        change,
      };
    });
  }, [categoryData, previous, hasRealData]);

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

    return emissions.map((record, index) => ({
      id: index + 1,
      recordId: record.id as string | undefined,
      title: `${record.report_period || 'Report'} Dashboard Report`,
      period: record.period_start && record.period_end
        ? `${new Date(record.period_start).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })} - ${new Date(record.period_end).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}`
        : 'Period not specified',
      emissions: `${(record.total_emissions ?? 0).toFixed(1)} t CO2e`,
      generated: new Date(record.created_at).toLocaleDateString('en-AU'),
    }));
  }, [emissions]);

  // Site data, summed across the selected period
  const siteData = useMemo(() => {
    if (!hasRealData) {
      return [
        { name: "Bibra Lake", emissions: 112.45, percentage: 50.2, change: null as number | null },
        { name: "Kalgoorlie", emissions: 78.32, percentage: 34.9, change: null as number | null },
        { name: "Australind", emissions: 33.39, percentage: 14.9, change: null as number | null },
      ];
    }
    const rows = Object.entries(current.sites)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        emissions: value,
        percentage: current.total > 0 ? (value / current.total) * 100 : 0,
        change: previous ? pctChange(value, previous.sites[name]) : null,
      }));
    if (current.organisationWide > 0.005) {
      rows.push({
        name: "Organisation-wide (fleet fuel & travel)",
        emissions: current.organisationWide,
        percentage: current.total > 0 ? (current.organisationWide / current.total) * 100 : 0,
        change: previous ? pctChange(current.organisationWide, previous.organisationWide) : null,
      });
    }
    return rows;
  }, [hasRealData, current, previous]);

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

  // Quarterly trend (all saved quarters, oldest first)
  const trendData = useMemo(() => quarterlyTrend(emissions), [emissions]);
  const selectedQuarters = new Set(hasRealData ? current.quarters : []);

  // Year comparison - real data only
  const yearlyData = useMemo(() => yearlyTotals(emissions), [emissions]);
  const availableYears = Object.keys(yearlyData).sort().reverse();
  const [compareYear1State, setCompareYear1] = useState<string | null>(null);
  const [compareYear2State, setCompareYear2] = useState<string | null>(null);
  const compareYear1 = compareYear1State && yearlyData[compareYear1State] ? compareYear1State : (availableYears[0] ?? "");
  const compareYear2 = compareYear2State && yearlyData[compareYear2State] ? compareYear2State : (availableYears[1] ?? availableYears[0] ?? "");
  const canCompareYears = availableYears.length >= 2;
  const emptyTotals = aggregate([]);
  // Whatever order the two years are picked in, show the change from the earlier year to the
  // later one, so "up" always means emissions went up over time.
  const [laterYear, earlierYear] = [compareYear1, compareYear2].sort((x, y) => y.localeCompare(x));
  const year1Data = yearlyData[laterYear] ?? emptyTotals;
  const year2Data = yearlyData[earlierYear] ?? emptyTotals;

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const comparisonChartData = CATEGORY_KEYS.map(c => ({
    name: c.name,
    [laterYear]: year1Data.categories[c.name],
    [earlierYear]: year2Data.categories[c.name],
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
          <Alert className="mb-6 border-primary/30 bg-primary/5">
            <Upload className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              <span className="font-medium">Showing demo data.</span>{" "}
              <Link to="/file-upload" className="underline font-medium text-primary">Upload your data</Link> to see your real emissions.
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
            {hasRealData && (
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  Showing
                </span>
                <Select value={activeValue} onValueChange={setPeriodValue}>
                  <SelectTrigger className="w-60" aria-label="Reporting period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Overall", "Calendar year", "Quarter"] as const).map(group => (
                      <SelectGroup key={group}>
                        <SelectLabel>{group}</SelectLabel>
                        {options.filter(o => o.group === group).map(o => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.value === latestQuarterValue ? `${o.label} (latest)` : o.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {current.records} {current.records === 1 ? "quarter" : "quarters"}
                  {current.quarters.length > 1 ? `: ${current.quarters[0]} to ${current.quarters[current.quarters.length - 1]}` : ""}
                  {yearCoverageNote ? ` · ${yearCoverageNote}` : ""}
                </span>
              </div>
            )}
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
                          <Button variant="outline" size="sm" disabled={!('recordId' in report)} onClick={() => openReport((report as { recordId?: string }).recordId, false)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Report
                          </Button>
                          <Button size="sm" className="gradient-primary" disabled={!('recordId' in report)} onClick={() => openReport((report as { recordId?: string }).recordId, true)}>
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
                          <h4 className="font-semibold text-foreground text-lg">Leadership Report</h4>
                          <p className="text-sm text-muted-foreground">
                            The full report for your latest quarter{latestEmissions?.report_period ? ` (${latestEmissions.report_period})` : ''}, the same one that is emailed
                          </p>
                        </div>
                        <Button className="gradient-primary" disabled={!latestEmissions} onClick={() => openReport(latestEmissions?.id, true)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Full Report
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h5 className="font-medium text-foreground mb-2">Report Contents</h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Summary, key messages and rolling 12-month totals</li>
                            <li>• Emissions profile by source, scope and site</li>
                            <li>• Performance over time and emissions intensity</li>
                            <li>• Analysis and recommendations</li>
                            <li>• Compliance, methodology and emission factors</li>
                          </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">Total Emissions</p>
                            <p className="text-2xl font-bold text-foreground">{(hasRealData ? Number(latestEmissions?.total_emissions ?? 0) : totalEmissionsValue).toFixed(2)} t CO2e</p>
                          </div>
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">Report Period</p>
                            <p className="text-2xl font-bold text-foreground">
                              {hasRealData ? (latestEmissions?.report_period || periodTitle) : 'Q4 2024'}
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
                  <ChangeNote change={totalChange} label={compareLabel} fallback={hasRealData ? periodTitle : "Demo data"} inverse />
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
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <ChangeNote change={scope1Change} label={compareLabel} fallback="Direct emissions" />
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
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <ChangeNote change={scope2Change} label={compareLabel} fallback="Purchased electricity" />
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
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <ChangeNote change={scope3Change} label={compareLabel} fallback="Value chain emissions" />
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
                      {site.change !== null && (
                        <div className={`flex items-center justify-end gap-1 text-xs ${site.change > 0 ? 'text-red-500' : 'text-green-600'}`}>
                          {site.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {site.change > 0 ? '+' : ''}{site.change.toFixed(1)}% {compareLabel}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quarterly Trend */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Quarterly Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Emissions by scope for every uploaded quarter{hasRealData && selection.kind !== "all" ? ". Highlighted bars are in the selected period." : "."}
              </p>
              {trendData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-16 text-center">Upload a quarter to see the trend.</p>
              ) : (
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(value) => `${value}t`} width={48} />
                      <Tooltip
                        formatter={(value: number, name: string) => [`${value.toFixed(2)} t CO2e`, name]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      {([
                        { key: "scope1", name: "Scope 1", color: "#f97316" },
                        { key: "scope2", name: "Scope 2", color: "hsl(var(--primary))" },
                        { key: "scope3", name: "Scope 3", color: "#8b5cf6" },
                      ] as const).map((sc, i) => (
                        <Bar key={sc.key} dataKey={sc.key} name={sc.name} stackId="scopes" fill={sc.color} radius={i === 2 ? [4, 4, 0, 0] : [0, 0, 0, 0]}>
                          {trendData.map((d) => (
                            <Cell
                              key={d.quarter}
                              fillOpacity={selection.kind === "all" || selectedQuarters.has(d.quarter) ? 1 : 0.3}
                            />
                          ))}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Year Comparison Section */}
        {(!hasRealData || canCompareYears) && <Card className="shadow-md hover:shadow-lg transition-shadow mb-8">
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
                      {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">vs</span>
                <Select value={compareYear2} onValueChange={setCompareYear2}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
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
                {hasRealData && (year1Data.records < 4 || year2Data.records < 4) && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800">
                    {laterYear} has {year1Data.records} of 4 quarters uploaded and {earlierYear} has {year2Data.records}. Totals only include uploaded quarters, so a partial year will look lower.
                  </p>
                )}

                {/* Total Emissions Comparison */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Emissions, change {earlierYear} → {laterYear}</span>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      calculateChange(year1Data.total, year2Data.total) > 0 ? 'text-red-500' : 'text-green-600'
                    }`}>
                      {calculateChange(year1Data.total, year2Data.total) > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {calculateChange(year1Data.total, year2Data.total) > 0 ? '+' : ''}{calculateChange(year1Data.total, year2Data.total).toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">{year1Data.total.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground ml-1">t CO2e ({laterYear})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg text-muted-foreground">{year2Data.total.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground ml-1">t CO2e ({earlierYear})</span>
                    </div>
                  </div>
                </div>

                {/* Scope Comparisons Table */}
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 text-xs font-medium text-muted-foreground">
                        <th className="p-3 text-left w-24">Scope</th>
                        <th className="p-3 text-center bg-primary/5">{laterYear}</th>
                        <th className="w-[3px] bg-border"></th>
                        <th className="p-3 text-center">{earlierYear}</th>
                        <th className="p-3 text-center w-28">Change {earlierYear} → {laterYear}</th>
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
                                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
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
                      <Bar dataKey={laterYear} fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                      <Bar dataKey={earlierYear} fill="hsl(var(--primary) / 0.4)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>}

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
                    <TableHead className="font-semibold text-right">{compareLabel ? `Change ${compareLabel}` : "Change"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={row.category} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                      <TableCell className="font-medium">{row.category}</TableCell>
                      <TableCell className="text-right">{row.emissions.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{row.percentage.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        {row.change === null ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.change > 0
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {row.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {row.change > 0 ? '+' : ''}{row.change.toFixed(1)}%
                          </div>
                        )}
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
