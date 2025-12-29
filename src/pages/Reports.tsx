import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Flame, 
  Plane, 
  Droplets, 
  Trash2, 
  Fuel, 
  Upload, 
  Printer, 
  Download 
} from "lucide-react";

interface EmissionCategory {
  name: string;
  emissions: number;
  percentage: number;
  icon: React.ReactNode;
  gradientClass: string;
}

const Reports = () => {
  const [hasReport] = useState(true); // Toggle this based on actual data

  // Mock data - replace with actual data from your backend
  const totalEmissions = 1250.5;
  const categories: EmissionCategory[] = [
    {
      name: "Electricity",
      emissions: 420.3,
      percentage: 33.6,
      icon: <Zap className="h-8 w-8" />,
      gradientClass: "from-blue-500 to-blue-600",
    },
    {
      name: "Gas",
      emissions: 285.7,
      percentage: 22.8,
      icon: <Flame className="h-8 w-8" />,
      gradientClass: "from-orange-500 to-orange-600",
    },
    {
      name: "Flights",
      emissions: 195.2,
      percentage: 15.6,
      icon: <Plane className="h-8 w-8" />,
      gradientClass: "from-purple-500 to-purple-600",
    },
    {
      name: "Water",
      emissions: 125.8,
      percentage: 10.1,
      icon: <Droplets className="h-8 w-8" />,
      gradientClass: "from-cyan-500 to-cyan-600",
    },
    {
      name: "Waste",
      emissions: 145.3,
      percentage: 11.6,
      icon: <Trash2 className="h-8 w-8" />,
      gradientClass: "from-amber-700 to-amber-800",
    },
    {
      name: "Fuel",
      emissions: 78.2,
      percentage: 6.3,
      icon: <Fuel className="h-8 w-8" />,
      gradientClass: "from-red-500 to-red-600",
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Placeholder for PDF download functionality
    console.log("Downloading PDF...");
  };

  if (!hasReport) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-lg mx-auto shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No report available
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload emissions data to generate a report
              </p>
              <Button asChild className="gradient-primary">
                <Link to="/file-upload">Go to Upload</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Emissions Report
          </h1>
          <p className="text-muted-foreground mt-1">
            View and download your carbon emissions report
          </p>
        </div>

        <Card className="shadow-lg">
          <Tabs defaultValue="summary" className="w-full">
            <div className="border-b">
              <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="summary"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary hover:text-foreground"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="full-report"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary hover:text-foreground"
                >
                  Full Report
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="summary" className="p-6">
              {/* Total Emissions Header */}
              <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Carbon Emissions
                </p>
                <p className="text-3xl font-bold text-primary">
                  {totalEmissions.toLocaleString()} <span className="text-lg font-normal">t CO2e</span>
                </p>
              </div>

              {/* Category Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${category.gradientClass} p-5 text-white shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90 mb-1">
                          {category.name}
                        </p>
                        <p className="text-2xl font-bold">
                          {category.emissions.toLocaleString()}
                          <span className="text-sm font-normal ml-1">t CO2e</span>
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                          {category.percentage}% of total
                        </p>
                      </div>
                      <div className="opacity-80">{category.icon}</div>
                    </div>
                    {/* Decorative circle */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="full-report" className="p-6">
              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Report
                </Button>
                <Button
                  onClick={handleDownload}
                  className="gradient-primary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Report Viewer Container */}
              <div className="border rounded-lg bg-card overflow-hidden">
                <div className="max-h-[600px] overflow-auto p-6">
                  {/* Report Content - Replace with actual report or iframe */}
                  <div className="space-y-6">
                    <div className="text-center border-b pb-6">
                      <h2 className="text-2xl font-bold text-foreground">
                        Carbon Emissions Report
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Generated on {new Date().toLocaleDateString()}
                      </p>
                    </div>

                    <section>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Executive Summary
                      </h3>
                      <p className="text-muted-foreground">
                        This report provides a comprehensive overview of your organization's 
                        carbon emissions across all measured categories. Total emissions for 
                        the reporting period amount to {totalEmissions.toLocaleString()} tonnes 
                        of CO2 equivalent (t CO2e).
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Emissions Breakdown
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-semibold text-foreground">Category</th>
                              <th className="text-right py-2 font-semibold text-foreground">Emissions (t CO2e)</th>
                              <th className="text-right py-2 font-semibold text-foreground">% of Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((category) => (
                              <tr key={category.name} className="border-b">
                                <td className="py-2 text-foreground">{category.name}</td>
                                <td className="text-right py-2 text-muted-foreground">
                                  {category.emissions.toLocaleString()}
                                </td>
                                <td className="text-right py-2 text-muted-foreground">
                                  {category.percentage}%
                                </td>
                              </tr>
                            ))}
                            <tr className="font-semibold">
                              <td className="py-2 text-foreground">Total</td>
                              <td className="text-right py-2 text-foreground">
                                {totalEmissions.toLocaleString()}
                              </td>
                              <td className="text-right py-2 text-foreground">100%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Scope Classification
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="font-medium text-foreground">Scope 1 (Direct)</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Gas, Fuel combustion
                          </p>
                          <p className="text-xl font-bold text-primary mt-2">
                            {(categories[1].emissions + categories[5].emissions).toLocaleString()} t CO2e
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="font-medium text-foreground">Scope 2 (Indirect)</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Electricity, purchased energy
                          </p>
                          <p className="text-xl font-bold text-primary mt-2">
                            {categories[0].emissions.toLocaleString()} t CO2e
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
