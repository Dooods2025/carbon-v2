import { useState } from "react";
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
} from "lucide-react";
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

const Dashboard = () => {
  const [compareYear1, setCompareYear1] = useState("2024");
  const [compareYear2, setCompareYear2] = useState("2023");
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false);

  // Previous reports data
  const previousReports = [
    { id: 1, title: "Q4 2024 Dashboard Report", period: "Oct - Dec 2024", emissions: "1,250.5 t CO2e", generated: "15/12/2024" },
    { id: 2, title: "Q3 2024 Dashboard Report", period: "Jul - Sep 2024", emissions: "1,180.3 t CO2e", generated: "30/09/2024" },
    { id: 3, title: "Q2 2024 Dashboard Report", period: "Apr - Jun 2024", emissions: "1,320.8 t CO2e", generated: "30/06/2024" },
    { id: 4, title: "Q1 2024 Dashboard Report", period: "Jan - Mar 2024", emissions: "1,198.2 t CO2e", generated: "31/03/2024" },
    { id: 5, title: "Annual 2023 Dashboard Report", period: "Jan - Dec 2023", emissions: "4,820.5 t CO2e", generated: "15/01/2024" },
    { id: 6, title: "Annual 2022 Dashboard Report", period: "Jan - Dec 2022", emissions: "4,520.1 t CO2e", generated: "15/01/2023" },
  ];

  // Category data for bar chart
  const categoryData = [
    { name: "Electricity", emissions: 98.32, fill: "#3b82f6" },
    { name: "Gas", emissions: 52.18, fill: "#f97316" },
    { name: "Flights", emissions: 28.45, fill: "#8b5cf6" },
    { name: "Water", emissions: 8.92, fill: "#06b6d4" },
    { name: "Waste", emissions: 18.76, fill: "#92400e" },
    { name: "Fuel", emissions: 17.53, fill: "#ef4444" },
  ];

  // Distribution data for pie chart
  const distributionData = [
    { name: "Scope 1", value: 85.42, color: "#f97316" },
    { name: "Scope 2", value: 98.32, color: "hsl(var(--primary))" },
    { name: "Scope 3", value: 40.42, color: "#8b5cf6" },
  ];

  // Table data
  const tableData = [
    { category: "Electricity", emissions: 98.32, percentage: 43.9, trend: "up", change: 5.2 },
    { category: "Gas", emissions: 52.18, percentage: 23.3, trend: "down", change: 2.1 },
    { category: "Flights", emissions: 28.45, percentage: 12.7, trend: "up", change: 8.4 },
    { category: "Water", emissions: 8.92, percentage: 4.0, trend: "down", change: 1.5 },
    { category: "Waste", emissions: 18.76, percentage: 8.4, trend: "down", change: 3.2 },
    { category: "Fuel", emissions: 17.53, percentage: 7.8, trend: "up", change: 0.8 },
  ];

  const totalEmissions = tableData.reduce((sum, row) => sum + row.emissions, 0);

  // Site data
  const siteData = [
    { name: "Bibra Lake", emissions: 112.45, percentage: 50.2, trend: "up", change: 3.1 },
    { name: "Kalgoorlie", emissions: 78.32, percentage: 34.9, trend: "down", change: 1.8 },
    { name: "Australind", emissions: 33.39, percentage: 14.9, trend: "up", change: 2.4 },
  ];

  // Top emission sources
  const topSources = [
    { name: "Electricity - Bibra Lake", emissions: 52.18, icon: Zap, color: "text-blue-500", bgColor: "bg-blue-100" },
    { name: "Natural Gas - Kalgoorlie", emissions: 38.92, icon: Flame, color: "text-orange-500", bgColor: "bg-orange-100" },
    { name: "Fleet Fuel - All Sites", emissions: 28.45, icon: Fuel, color: "text-red-500", bgColor: "bg-red-100" },
  ];

  // Year comparison data
  const yearlyData: Record<string, { total: number; scope1: number; scope2: number; scope3: number; categories: { name: string; emissions: number }[] }> = {
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
  };

  const year1Data = yearlyData[compareYear1];
  const year2Data = yearlyData[compareYear2];

  const calculateChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const comparisonChartData = year1Data.categories.map((cat, index) => ({
    name: cat.name,
    [compareYear1]: cat.emissions,
    [compareYear2]: year2Data.categories[index].emissions,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
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
                            <p className="text-2xl font-bold text-foreground">224.16 t CO2e</p>
                          </div>
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm text-muted-foreground">Report Period</p>
                            <p className="text-2xl font-bold text-foreground">Q4 2024</p>
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

        {/* Stats Cards - Original Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Emissions - Green filled card */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Emissions</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold">224.16</span>
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

          {/* Scope 1 - White card */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scope 1</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">85.42</span>
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

          {/* Scope 2 - White card */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scope 2</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">98.32</span>
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

          {/* Scope 3 - White card */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scope 3</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-foreground">40.42</span>
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
                        <p className="text-sm text-muted-foreground">{site.percentage}% of total</p>
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
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">vs</span>
                <Select value={compareYear2} onValueChange={setCompareYear2}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
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

                {/* Scope Comparisons */}
                {[
                  { label: "Scope 1", key1: year1Data.scope1, key2: year2Data.scope1 },
                  { label: "Scope 2", key1: year1Data.scope2, key2: year2Data.scope2 },
                  { label: "Scope 3", key1: year1Data.scope3, key2: year2Data.scope3 },
                ].map((scope) => {
                  const change = calculateChange(scope.key1, scope.key2);
                  return (
                    <div key={scope.label} className="p-3 rounded-lg bg-muted/20 flex items-center justify-between">
                      <span className="font-medium text-foreground">{scope.label}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-bold text-foreground">{scope.key1.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground ml-1">vs {scope.key2.toFixed(2)}</span>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          change > 0 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(change).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
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


        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Detailed Emissions Breakdown</CardTitle>
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
                      <TableCell className="text-right">{row.percentage}%</TableCell>
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
      </main>
    </div>
  );
};

export default Dashboard;
