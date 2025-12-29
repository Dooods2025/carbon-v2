import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cloud,
  Flame,
  Zap,
  Calendar,
  Upload,
  FileText,
  Plane,
  Droplets,
  Trash2,
  Fuel,
  ArrowUp,
  ArrowDown,
  Building2,
  TrendingUp,
  TrendingDown,
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
  // Stats data
  const stats = [
    {
      title: "Total Emissions",
      value: "224.16",
      unit: "t",
      subtext: "CO2e",
      icon: Cloud,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Scope 1",
      value: "85.42",
      unit: "t",
      subtext: "Direct",
      icon: Flame,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      title: "Scope 2",
      value: "98.32",
      unit: "t",
      subtext: "Indirect",
      icon: Zap,
      gradient: "from-primary to-primary/80",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Scope 3",
      value: "40.42",
      unit: "t",
      subtext: "Value Chain",
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-1 text-foreground">
                        {stat.value}
                        <span className="text-lg font-normal ml-1">{stat.unit}</span>
                      </p>
                      <p className={`text-sm mt-1 ${stat.iconColor}`}>
                        {stat.subtext}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
                {/* Gradient accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              </Card>
            );
          })}
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
