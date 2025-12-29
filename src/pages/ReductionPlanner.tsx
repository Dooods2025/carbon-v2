import { useState } from "react";
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
  Save,
  RotateCcw,
  Eye,
  Pencil,
  Trash,
  Target,
} from "lucide-react";
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

interface SavedScenario {
  id: string;
  name: string;
  targetReduction: number;
  timeline: string;
  dateCreated: string;
}

const ReductionPlanner = () => {
  const [scenarioName, setScenarioName] = useState("");
  const [timeline, setTimeline] = useState("12 months");
  const [categories, setCategories] = useState<Category[]>([
    { name: "Electricity", icon: Zap, color: "text-blue-500", bgColor: "bg-blue-100", currentEmissions: 98.32, reduction: 0 },
    { name: "Gas", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-100", currentEmissions: 52.18, reduction: 0 },
    { name: "Flights", icon: Plane, color: "text-purple-500", bgColor: "bg-purple-100", currentEmissions: 28.45, reduction: 0 },
    { name: "Water", icon: Droplets, color: "text-cyan-500", bgColor: "bg-cyan-100", currentEmissions: 8.92, reduction: 0 },
    { name: "Waste", icon: Trash2, color: "text-amber-700", bgColor: "bg-amber-100", currentEmissions: 18.76, reduction: 0 },
    { name: "Fuel", icon: Fuel, color: "text-red-500", bgColor: "bg-red-100", currentEmissions: 17.53, reduction: 0 },
  ]);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    { id: "1", name: "Net Zero 2030", targetReduction: 45, timeline: "5 years", dateCreated: "2024-12-15" },
    { id: "2", name: "Quick Wins Q1", targetReduction: 15, timeline: "6 months", dateCreated: "2024-12-20" },
  ]);

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

  const handleSave = () => {
    if (!scenarioName.trim()) return;
    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name: scenarioName,
      targetReduction: Math.round(totalReduction),
      timeline,
      dateCreated: new Date().toISOString().split('T')[0],
    };
    setSavedScenarios([...savedScenarios, newScenario]);
    setScenarioName("");
  };

  const handleDelete = (id: string) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id));
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
                disabled={!scenarioName.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Scenario
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
                <CardTitle className="text-lg">Before vs After Comparison</CardTitle>
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
                <CardTitle className="text-lg">Projected Timeline ({timeline})</CardTitle>
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

            {/* Environmental Impact */}
            {emissionsReduced > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">This reduction is equivalent to:</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Saved Scenarios */}
        <Card className="mt-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            {savedScenarios.length === 0 ? (
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
                    {savedScenarios.map((scenario) => (
                      <TableRow key={scenario.id}>
                        <TableCell className="font-medium">{scenario.name}</TableCell>
                        <TableCell className="text-right">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            -{scenario.targetReduction}%
                          </span>
                        </TableCell>
                        <TableCell>{scenario.timeline}</TableCell>
                        <TableCell>{scenario.dateCreated}</TableCell>
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
                    ))}
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
