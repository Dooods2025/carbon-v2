import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Upload,
  FileText,
  Zap,
  Flame,
  Plane,
  Droplets,
  Trash2,
  Fuel,
  Target,
  Calendar,
  Building2
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
} from "recharts";

const Dashboard = () => {
  // Mock data - replace with actual data
  const stats = [
    {
      title: "Total Emissions",
      value: "1,250.5",
      unit: "t CO2e",
      change: "+5.2%",
      trend: "up" as const,
      description: "vs last quarter",
      accent: true,
    },
    {
      title: "Scope 1",
      value: "363.9",
      unit: "t CO2e",
      change: "-2.1%",
      trend: "down" as const,
      description: "Direct emissions",
      accent: false,
    },
    {
      title: "Scope 2",
      value: "420.3",
      unit: "t CO2e",
      change: "+8.4%",
      trend: "up" as const,
      description: "Indirect emissions",
      accent: false,
    },
    {
      title: "Reduction Target",
      value: "15%",
      unit: "",
      change: "On Track",
      trend: "down" as const,
      description: "Annual goal",
      accent: false,
    },
  ];

  const monthlyData = [
    { month: "Jan", emissions: 280 },
    { month: "Feb", emissions: 250 },
    { month: "Mar", emissions: 310 },
    { month: "Apr", emissions: 290 },
    { month: "May", emissions: 340 },
    { month: "Jun", emissions: 320 },
  ];

  const categoryData = [
    { name: "Electricity", value: 420.3, color: "#3b82f6" },
    { name: "Gas", value: 285.7, color: "#f97316" },
    { name: "Flights", value: 195.2, color: "#8b5cf6" },
    { name: "Water", value: 125.8, color: "#06b6d4" },
    { name: "Waste", value: 145.3, color: "#92400e" },
    { name: "Fuel", value: 78.2, color: "#ef4444" },
  ];

  const recentActivity = [
    { id: 1, action: "Q4 Report Generated", date: "Dec 15, 2024", type: "report" },
    { id: 2, action: "Emissions Data Uploaded", date: "Dec 10, 2024", type: "upload" },
    { id: 3, action: "New Site Added: London Office", date: "Dec 5, 2024", type: "site" },
    { id: 4, action: "Q3 Report Downloaded", date: "Nov 28, 2024", type: "report" },
  ];

  const topSources = [
    { name: "Electricity", icon: Zap, emissions: 420.3, percentage: 33.6, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Gas", icon: Flame, emissions: 285.7, percentage: 22.8, color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Flights", icon: Plane, emissions: 195.2, percentage: 15.6, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Waste", icon: Trash2, emissions: 145.3, percentage: 11.6, color: "text-amber-700", bg: "bg-amber-700/10" },
    { name: "Water", icon: Droplets, emissions: 125.8, percentage: 10.1, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { name: "Fuel", icon: Fuel, emissions: 78.2, percentage: 6.3, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
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
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden ${stat.accent ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-medium ${stat.accent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      {stat.value}
                      <span className="text-sm font-normal ml-1">{stat.unit}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {stat.trend === "down" ? (
                        <TrendingDown className={`h-4 w-4 ${stat.accent ? 'text-green-300' : 'text-green-500'}`} />
                      ) : (
                        <TrendingUp className={`h-4 w-4 ${stat.accent ? 'text-red-300' : 'text-red-500'}`} />
                      )}
                      <span className={`text-xs ${stat.accent ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {stat.change} {stat.description}
                      </span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.accent ? 'bg-primary-foreground/20' : 'bg-muted'}`}>
                    <ArrowUpRight className={`h-4 w-4 ${stat.accent ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Emissions Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Emissions Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar 
                      dataKey="emissions" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} t CO2e`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {categoryData.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-muted-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Emission Sources */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Top Emission Sources</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/reports">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSources.map((source) => (
                  <div key={source.name} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${source.bg} flex items-center justify-center`}>
                      <source.icon className={`h-5 w-5 ${source.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{source.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {source.emissions} t CO2e
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${source.percentage}%`,
                            backgroundColor: source.color.replace('text-', '').includes('amber') 
                              ? '#92400e' 
                              : `var(--${source.color.replace('text-', '').replace('-500', '-500').replace('-700', '-700')})`
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                      {source.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'report' ? 'bg-primary/10' :
                      activity.type === 'upload' ? 'bg-blue-500/10' :
                      'bg-purple-500/10'
                    }`}>
                      {activity.type === 'report' ? (
                        <FileText className="h-4 w-4 text-primary" />
                      ) : activity.type === 'upload' ? (
                        <Upload className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Building2 className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-primary">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
