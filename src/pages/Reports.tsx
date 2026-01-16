import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Printer,
  Download,
  FileText,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEmissions } from "@/hooks/useEmissions";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmissionCategory {
  name: string;
  emissions: number;
  percentage: number;
}

// Placeholder demo data when no real data exists
const DEMO_REPORTS = [
  {
    id: 'demo-1',
    report_period: 'Q4 2024',
    total_emissions: 0,
    scope1_total: 0,
    scope2_total: 0,
    scope3_total: 0,
    electricity_emissions: 0,
    gas_emissions: 0,
    flights_emissions: 0,
    water_emissions: 0,
    waste_emissions: 0,
    fuel_emissions: 0,
    created_at: new Date().toISOString(),
    period_start: '2024-10-01',
    period_end: '2024-12-31',
    source_file: null,
    isDemo: true,
  },
  {
    id: 'demo-2',
    report_period: 'Q3 2024',
    total_emissions: 0,
    scope1_total: 0,
    scope2_total: 0,
    scope3_total: 0,
    electricity_emissions: 0,
    gas_emissions: 0,
    flights_emissions: 0,
    water_emissions: 0,
    waste_emissions: 0,
    fuel_emissions: 0,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    period_start: '2024-07-01',
    period_end: '2024-09-30',
    source_file: null,
    isDemo: true,
  },
];

const Reports = () => {
  const { user, loading: authLoading } = useAuth();
  const { emissions, latestEmissions, isLoading: emissionsLoading, getCategoryData } = useEmissions(user?.id);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [userReports, setUserReports] = useState<Record<string, any>>({});
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch user_reports to get full reportHtml
  useEffect(() => {
    const fetchUserReports = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user_reports:', error);
          return;
        }

        if (data) {
          // Create a map of filename -> report_data for easy lookup
          const reportsMap: Record<string, any> = {};
          data.forEach(report => {
            reportsMap[report.filename] = report.report_data;
          });
          setUserReports(reportsMap);
          console.log('Loaded user_reports:', Object.keys(reportsMap));
        }
      } catch (err) {
        console.error('Error in fetchUserReports:', err);
      }
    };

    fetchUserReports();
  }, [user?.id]);

  const isLoading = authLoading || emissionsLoading;
  const hasReports = emissions && emissions.length > 0;

  // Use real data if available, otherwise show demo placeholders
  const displayReports = hasReports ? emissions : DEMO_REPORTS;
  const displayLatest = hasReports ? latestEmissions : DEMO_REPORTS[0];

  // Get the selected report data
  const selectedReport = selectedReportId
    ? displayReports.find(e => e.id === selectedReportId)
    : displayLatest;

  // Generate categories from selected report
  const getCategories = (): EmissionCategory[] => {
    if (!selectedReport) return [];

    const cats = [
      { name: "Electricity", emissions: selectedReport.electricity_emissions ?? 0 },
      { name: "Gas", emissions: selectedReport.gas_emissions ?? 0 },
      { name: "Flights", emissions: selectedReport.flights_emissions ?? 0 },
      { name: "Water", emissions: selectedReport.water_emissions ?? 0 },
      { name: "Waste", emissions: selectedReport.waste_emissions ?? 0 },
      { name: "Fuel", emissions: selectedReport.fuel_emissions ?? 0 },
    ];

    const total = cats.reduce((sum, cat) => sum + cat.emissions, 0);
    return cats.map(cat => ({
      ...cat,
      percentage: total > 0 ? (cat.emissions / total) * 100 : 0,
    }));
  };

  const categories = getCategories();
  const totalEmissions = selectedReport?.total_emissions ?? 0;
  const isPlaceholderData = !hasReports;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = (reportId?: string) => {
    const report = reportId
      ? emissions.find(e => e.id === reportId)
      : selectedReport;

    if (!report) return;

    // Try to find the full HTML report from user_reports
    const sourceFile = report.source_file;
    const fullReportData = sourceFile ? userReports[sourceFile] : null;
    const reportHtml = fullReportData?.reportHtml;

    console.log('Download PDF - source_file:', sourceFile);
    console.log('Download PDF - fullReportData keys:', fullReportData ? Object.keys(fullReportData) : 'none');
    console.log('Download PDF - has reportHtml:', !!reportHtml);

    // If we have the full HTML report from n8n, use it!
    if (reportHtml) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(reportHtml);
      printWindow.document.close();
      printWindow.focus();

      setTimeout(() => {
        printWindow.print();
      }, 500);
      return;
    }

    // Fallback: Generate simple summary report if no full HTML available
    console.log('No reportHtml found, using fallback summary report');

    // Create a printable HTML document
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cats = [
      { name: "Electricity", emissions: report.electricity_emissions ?? 0 },
      { name: "Gas", emissions: report.gas_emissions ?? 0 },
      { name: "Flights", emissions: report.flights_emissions ?? 0 },
      { name: "Water", emissions: report.water_emissions ?? 0 },
      { name: "Waste", emissions: report.waste_emissions ?? 0 },
      { name: "Fuel", emissions: report.fuel_emissions ?? 0 },
    ];
    const total = cats.reduce((sum, cat) => sum + cat.emissions, 0);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Emissions Report - ${report.report_period || 'Report'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          h1 { color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px; }
          h2 { color: #555; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-row { background-color: #e8f5e9; font-weight: bold; }
          .scope-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .scope-card { background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; }
          .scope-value { font-size: 24px; font-weight: bold; color: #16a34a; }
          .footer { margin-top: 40px; text-align: center; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Carbon Emissions Report</h1>
        <p><strong>Report Period:</strong> ${report.report_period || 'Not specified'}</p>
        <p><strong>Generated:</strong> ${new Date(report.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <h2>Executive Summary</h2>
        <p>This report provides a comprehensive overview of your organisation's carbon emissions.
        Total emissions for the reporting period amount to <strong>${totalEmissions.toLocaleString('en-AU', { maximumFractionDigits: 2 })} tonnes of CO2 equivalent (t CO2e)</strong>.</p>

        <h2>Scope Classification</h2>
        <div class="scope-grid">
          <div class="scope-card">
            <div>Scope 1 (Direct)</div>
            <div class="scope-value">${(report.scope1_total ?? 0).toFixed(2)} t CO2e</div>
            <div>Gas, Fuel combustion</div>
          </div>
          <div class="scope-card">
            <div>Scope 2 (Indirect)</div>
            <div class="scope-value">${(report.scope2_total ?? 0).toFixed(2)} t CO2e</div>
            <div>Electricity, purchased energy</div>
          </div>
          <div class="scope-card">
            <div>Scope 3 (Value Chain)</div>
            <div class="scope-value">${(report.scope3_total ?? 0).toFixed(2)} t CO2e</div>
            <div>Flights, Water, Waste</div>
          </div>
        </div>

        <h2>Emissions Breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Emissions (t CO2e)</th>
              <th>% of Total</th>
            </tr>
          </thead>
          <tbody>
            ${cats.map(cat => `
              <tr>
                <td>${cat.name}</td>
                <td>${cat.emissions.toFixed(2)}</td>
                <td>${total > 0 ? ((cat.emissions / total) * 100).toFixed(1) : 0}%</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td>Total</td>
              <td>${(report.total_emissions ?? 0).toFixed(2)}</td>
              <td>100%</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Generated by Carbon Emissions Calculator</p>
          <p>Report ID: ${report.id}</p>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Trigger print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setViewDialogOpen(true);
  };

  const formatReportPeriod = (report: typeof latestEmissions) => {
    if (!report) return '';
    if (report.period_start && report.period_end) {
      const start = new Date(report.period_start);
      const end = new Date(report.period_end);
      return `${start.getFullYear()}-${end.getFullYear()} Emission Report`;
    }
    return report.report_period || 'Emission Report';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading reports...</span>
          </div>
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
            Emissions Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            View and download your carbon emissions reports
          </p>
        </div>

        {!user && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <Link to="/auth" className="underline font-medium">Sign in</Link> to view your saved reports.
            </AlertDescription>
          </Alert>
        )}

        {isPlaceholderData && (
          <Alert className="mb-6 border-primary/30 bg-primary/5">
            <Upload className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              <span className="font-medium">No emissions data yet.</span> These are placeholder reports.{" "}
              <Link to="/file-upload" className="underline font-medium text-primary">Upload your data</Link> to generate real reports.
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg">
          <Tabs defaultValue="full-report" className="w-full">
            <div className="border-b">
              <TabsList className="h-12 w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="full-report"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary hover:text-foreground"
                >
                  Current Report
                </TabsTrigger>
                <TabsTrigger
                  value="previous-reports"
                  className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary hover:text-foreground"
                >
                  Previous Reports
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="previous-reports" className="p-6">
              <div className="space-y-4">
                {displayReports.map((report) => (
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
                          {formatReportPeriod(report)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {report.report_period || 'Report'} • {(report.total_emissions ?? 0).toFixed(1)} t CO2e
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Generated: {new Date(report.created_at).toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewReport(report.id)}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Report
                      </Button>
                      <Button
                        size="sm"
                        className="gradient-primary"
                        onClick={() => handleDownloadPDF(report.id)}
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
                  onClick={() => handleDownloadPDF()}
                  className="gradient-primary"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* Report Viewer Container */}
              <div className="border rounded-lg bg-card overflow-hidden" ref={reportRef}>
                <div className="max-h-[600px] overflow-auto p-6">
                  {/* Report Content */}
                  <div className="space-y-6">
                    <div className="text-center border-b pb-6">
                      <h2 className="text-2xl font-bold text-foreground">
                        Carbon Emissions Report
                      </h2>
                      <p className="text-primary font-medium mt-1">
                        {displayLatest?.report_period || 'Current Period'}
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Generated on {new Date(displayLatest?.created_at || new Date()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    <section>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Executive Summary
                      </h3>
                      <p className="text-muted-foreground">
                        This report provides a comprehensive overview of your organisation's
                        carbon emissions across all measured categories. Total emissions for
                        the reporting period amount to <span className="font-semibold text-foreground">{totalEmissions.toLocaleString('en-AU', { maximumFractionDigits: 2 })} tonnes
                        of CO2 equivalent (t CO2e)</span>.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Scope Classification
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                          <p className="font-medium text-foreground">Scope 1 (Direct)</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Gas, Fuel combustion
                          </p>
                          <p className="text-xl font-bold text-orange-600 mt-2">
                            {(displayLatest?.scope1_total ?? 0).toFixed(2)} t CO2e
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="font-medium text-foreground">Scope 2 (Indirect)</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Electricity, purchased energy
                          </p>
                          <p className="text-xl font-bold text-primary mt-2">
                            {(displayLatest?.scope2_total ?? 0).toFixed(2)} t CO2e
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                          <p className="font-medium text-foreground">Scope 3 (Value Chain)</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Flights, Water, Waste
                          </p>
                          <p className="text-xl font-bold text-purple-600 mt-2">
                            {(displayLatest?.scope3_total ?? 0).toFixed(2)} t CO2e
                          </p>
                        </div>
                      </div>
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
                                  {category.emissions.toFixed(2)}
                                </td>
                                <td className="text-right py-2 text-muted-foreground">
                                  {category.percentage.toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                            <tr className="font-semibold bg-primary/5">
                              <td className="py-2 text-foreground">Total</td>
                              <td className="text-right py-2 text-foreground">
                                {totalEmissions.toFixed(2)}
                              </td>
                              <td className="text-right py-2 text-foreground">100%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* View Report Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedReport ? formatReportPeriod(selectedReport) : 'Report'}
              </DialogTitle>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-6 mt-4">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleDownloadPDF(selectedReport.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">Total Emissions</p>
                    <p className="text-2xl font-bold text-foreground">
                      {(selectedReport.total_emissions ?? 0).toFixed(2)} t CO2e
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Report Period</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedReport.report_period || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Scope 1</p>
                    <p className="text-lg font-bold text-orange-600">
                      {(selectedReport.scope1_total ?? 0).toFixed(2)} t
                    </p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Scope 2</p>
                    <p className="text-lg font-bold text-primary">
                      {(selectedReport.scope2_total ?? 0).toFixed(2)} t
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Scope 3</p>
                    <p className="text-lg font-bold text-purple-600">
                      {(selectedReport.scope3_total ?? 0).toFixed(2)} t
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Category Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { name: "Electricity", value: selectedReport.electricity_emissions },
                      { name: "Gas", value: selectedReport.gas_emissions },
                      { name: "Fuel", value: selectedReport.fuel_emissions },
                      { name: "Flights", value: selectedReport.flights_emissions },
                      { name: "Water", value: selectedReport.water_emissions },
                      { name: "Waste", value: selectedReport.waste_emissions },
                    ].map(cat => (
                      <div key={cat.name} className="flex justify-between py-2 border-b">
                        <span className="text-foreground">{cat.name}</span>
                        <span className="text-muted-foreground">{(cat.value ?? 0).toFixed(2)} t CO2e</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Generated: {new Date(selectedReport.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {selectedReport.source_file && ` • Source: ${selectedReport.source_file}`}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Reports;
