import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and analyze your carbon emissions data
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="gradient-primary">
              <Link to="/file-upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/reports">
                <FileText className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
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
                <ArrowUp className="h-5 w-5" />
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
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <ArrowUp className="h-5 w-5 text-muted-foreground" />
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
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <ArrowUp className="h-5 w-5 text-muted-foreground" />
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
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <ArrowUp className="h-5 w-5 text-muted-foreground" />
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

        {/* Data Table */}
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
