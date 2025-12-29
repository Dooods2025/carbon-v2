import { useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Printer, 
  Download,
  FileText,
  Eye
} from "lucide-react";

interface PreviousReport {
  id: string;
  name: string;
  date: string;
  totalEmissions: number;
  period: string;
}

interface EmissionCategory {
  name: string;
  emissions: number;
  percentage: number;
}

const Reports = () => {
  const [hasReport] = useState(true);
  const [selectedReport, setSelectedReport] = useState<PreviousReport | null>(null);

  // Mock data - replace with actual data from your backend
  const previousReports: PreviousReport[] = [
    {
      id: "1",
      name: "Q4 2024 Emissions Report",
      date: "2024-12-15",
      totalEmissions: 1250.5,
      period: "Oct - Dec 2024",
    },
    {
      id: "2",
      name: "Q3 2024 Emissions Report",
      date: "2024-09-30",
      totalEmissions: 1180.3,
      period: "Jul - Sep 2024",
    },
    {
      id: "3",
      name: "Q2 2024 Emissions Report",
      date: "2024-06-30",
      totalEmissions: 1320.8,
      period: "Apr - Jun 2024",
    },
    {
      id: "4",
      name: "Q1 2024 Emissions Report",
      date: "2024-03-31",
      totalEmissions: 1410.2,
      period: "Jan - Mar 2024",
    },
  ];

  const categories: EmissionCategory[] = [
    { name: "Electricity", emissions: 420.3, percentage: 33.6 },
    { name: "Gas", emissions: 285.7, percentage: 22.8 },
    { name: "Flights", emissions: 195.2, percentage: 15.6 },
    { name: "Water", emissions: 125.8, percentage: 10.1 },
    { name: "Waste", emissions: 145.3, percentage: 11.6 },
    { name: "Fuel", emissions: 78.2, percentage: 6.3 },
  ];

  const totalEmissions = selectedReport?.totalEmissions || 1250.5;

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
        <main className="container mx-auto px-4 pt-24 pb-8">
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
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Emissions Report
          </h1>
          <p className="text-muted-foreground mt-1">
            View and download your carbon emissions report
          </p>
        </div>

        <Card className="shadow-lg">
          <Tabs defaultValue="previous-reports" className="w-full">
            <div className="border-b">
              <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="previous-reports"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary hover:text-foreground"
                >
                  Previous Reports
                </TabsTrigger>
                <TabsTrigger
                  value="full-report"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary hover:text-foreground"
                >
                  Full Report
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="previous-reports" className="p-6">
              <div className="space-y-4">
                {previousReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {report.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {report.period} • {report.totalEmissions.toLocaleString()} t CO2e
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Generated: {new Date(report.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button
                        size="sm"
                        className="gradient-primary"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
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
