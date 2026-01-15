import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CloudUpload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Info, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Use Vercel API proxy to avoid CORS issues with n8n
// Falls back to direct n8n call for local development
const N8N_CALCULATOR_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_URL ||
  ? "https://dgledhill.app.n8n.cloud/webhook/50b6281b-c102-4135-90e4-c81d725e6f7f"
  : "/api/calculate-emissions";

type UploadStatus = "idle" | "uploading" | "processing" | "saving" | "success" | "error";

interface EmissionsResult {
  electricity_emissions?: number;
  gas_emissions?: number;
  fuel_emissions?: number;
  flights_emissions?: number;
  water_emissions?: number;
  waste_emissions?: number;
  scope1_total?: number;
  scope2_total?: number;
  scope3_total?: number;
  total_emissions?: number;
  report_period?: string;
  period_start?: string;
  period_end?: string;
  site_breakdown?: Record<string, number>;
}

// Generate quarterly period options (Q4 2026 - Q1 2022, newer dates at top)
const getQuarterlyOptions = () => {
  const options = [];
  for (let year = 2026; year >= 2022; year--) {
    for (let q = 4; q >= 1; q--) {
      options.push(`Q${q} ${year}`);
    }
  }
  return options;
};

// Get date range for a quarter
const getQuarterDateRange = (quarter: string) => {
  const match = quarter.match(/Q(\d) (\d{4})/);
  if (!match) return { start: '', end: '' };

  const q = parseInt(match[1]);
  const year = parseInt(match[2]);

  const quarterStarts: Record<number, string> = {
    1: `${year}-01-01`,
    2: `${year}-04-01`,
    3: `${year}-07-01`,
    4: `${year}-10-01`,
  };

  const quarterEnds: Record<number, string> = {
    1: `${year}-03-31`,
    2: `${year}-06-30`,
    3: `${year}-09-30`,
    4: `${year}-12-31`,
  };

  return {
    start: quarterStarts[q],
    end: quarterEnds[q],
  };
};

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [reportingPeriod, setReportingPeriod] = useState<string>("");

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const quarterlyPeriods = getQuarterlyOptions();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFileType(droppedFile)) {
      setFile(droppedFile);
      setStatus("idle");
      setErrorMessage("");
    } else {
      setErrorMessage("Please upload an Excel (.xlsx, .xls) or CSV file.");
      setStatus("error");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFileType(selectedFile)) {
      setFile(selectedFile);
      setStatus("idle");
      setErrorMessage("");
    } else if (selectedFile) {
      setErrorMessage("Please upload an Excel (.xlsx, .xls) or CSV file.");
      setStatus("error");
    }
  }, []);

  const isValidFileType = (file: File) => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      ".xlsx",
      ".xls",
      ".csv"
    ];
    return validTypes.includes(file.type) ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.name.endsWith(".csv");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const removeFile = () => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!file) return;

    // Check if user is logged in
    if (!user) {
      setErrorMessage("Please log in to upload files.");
      setStatus("error");
      toast({
        title: "Authentication Required",
        description: "Please log in to upload and process emissions data.",
        variant: "destructive",
      });
      return;
    }

    setStatus("uploading");
    setProcessingStep("Uploading file to calculator...");

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.id);
      formData.append("filename", file.name);
      if (reportingPeriod) {
        formData.append("reporting_period", reportingPeriod);
        // Parse quarterly period to dates (e.g., "Q1 2024" -> Jan 1 to Mar 31)
        const { start, end } = getQuarterDateRange(reportingPeriod);
        if (start && end) {
          formData.append("period_start", start);
          formData.append("period_end", end);
        }
      }

      // Send file to n8n webhook
      setStatus("processing");
      setProcessingStep("Calculating emissions...");

      const response = await fetch(N8N_CALCULATOR_WEBHOOK, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("n8n webhook error:", response.status, errorText);
        throw new Error(`Calculator returned error: ${response.status}. The n8n workflow may be inactive or misconfigured.`);
      }

      // Parse the response from n8n
      let result: EmissionsResult;
      const responseText = await response.text();
      console.log("Raw n8n response:", responseText);

      try {
        let parsed = JSON.parse(responseText);

        // n8n often returns arrays - extract first element if so
        if (Array.isArray(parsed)) {
          console.log("n8n returned array with", parsed.length, "elements");
          parsed = parsed[0];
        }

        // Check if data is nested under a common key (e.g., { data: {...} }, { json: {...} }, { output: {...} })
        if (parsed && !parsed.total_emissions && typeof parsed === 'object') {
          const possibleKeys = ['data', 'json', 'output', 'result', 'body'];
          for (const key of possibleKeys) {
            if (parsed[key] && typeof parsed[key] === 'object') {
              console.log("Extracting from nested key:", key);
              parsed = parsed[key];
              break;
            }
          }
          // Handle nested array in these keys
          if (Array.isArray(parsed)) {
            parsed = parsed[0];
          }
        }

        // Map n8n camelCase response to our snake_case interface
        // n8n returns: { totalEmissions, scopes: { scope1, scope2, scope3 }, emissions: { electricity, gas, ... }, ... }
        if (parsed.totalEmissions !== undefined || parsed.scopes || parsed.emissions) {
          console.log("Mapping n8n camelCase response to snake_case");
          result = {
            total_emissions: parsed.totalEmissions ?? parsed.total_emissions ?? 0,
            scope1_total: parsed.scopes?.scope1 ?? parsed.scope1_total ?? 0,
            scope2_total: parsed.scopes?.scope2 ?? parsed.scope2_total ?? 0,
            scope3_total: parsed.scopes?.scope3 ?? parsed.scope3_total ?? 0,
            electricity_emissions: parsed.emissions?.electricity ?? parsed.electricity_emissions ?? 0,
            gas_emissions: parsed.emissions?.gas ?? parsed.gas_emissions ?? 0,
            fuel_emissions: parsed.emissions?.fuel ?? parsed.fuel_emissions ?? 0,
            flights_emissions: parsed.emissions?.flights ?? parsed.flights_emissions ?? 0,
            water_emissions: parsed.emissions?.water ?? parsed.water_emissions ?? 0,
            waste_emissions: parsed.emissions?.waste ?? parsed.waste_emissions ?? 0,
            report_period: parsed.reportingPeriod ?? parsed.report_period ?? null,
            period_start: parsed.periodStart ?? parsed.period_start ?? null,
            period_end: parsed.periodEnd ?? parsed.period_end ?? null,
            site_breakdown: parsed.sites ?? parsed.site_breakdown ?? null,
          };
        } else {
          result = parsed;
        }
        console.log("Mapped emissions result:", result);
      } catch (parseError) {
        console.error("Failed to parse n8n response:", responseText);
        throw new Error(`Invalid response from calculator. Raw response: ${responseText.substring(0, 200)}...`);
      }

      // Validate we got emissions data back
      if (!result || typeof result.total_emissions === "undefined") {
        console.error("Missing total_emissions in response:", result);
        // Provide more helpful error with the actual response shape
        const keys = result ? Object.keys(result).join(', ') : 'null';
        throw new Error(`Calculator response missing total_emissions. Response keys: ${keys}. Check n8n workflow output format.`);
      }

      // Save results to Supabase
      setStatus("saving");
      setProcessingStep("Saving results to database...");

      // Use selected reporting period if n8n doesn't return one
      let periodStart = result.period_start ?? null;
      let periodEnd = result.period_end ?? null;
      let reportPeriodLabel = result.report_period ?? null;

      if (reportingPeriod && !reportPeriodLabel) {
        reportPeriodLabel = reportingPeriod;
        const { start, end } = getQuarterDateRange(reportingPeriod);
        periodStart = start || periodStart;
        periodEnd = end || periodEnd;
      }

      if (!reportPeriodLabel) {
        reportPeriodLabel = `Upload ${new Date().toLocaleDateString()}`;
      }

      const { error: saveError } = await supabase
        .from("emissions_data")
        .insert({
          user_id: user.id,
          electricity_emissions: result.electricity_emissions ?? 0,
          gas_emissions: result.gas_emissions ?? 0,
          fuel_emissions: result.fuel_emissions ?? 0,
          flights_emissions: result.flights_emissions ?? 0,
          water_emissions: result.water_emissions ?? 0,
          waste_emissions: result.waste_emissions ?? 0,
          scope1_total: result.scope1_total ?? 0,
          scope2_total: result.scope2_total ?? 0,
          scope3_total: result.scope3_total ?? 0,
          total_emissions: result.total_emissions ?? 0,
          report_period: reportPeriodLabel,
          period_start: periodStart,
          period_end: periodEnd,
          site_breakdown: result.site_breakdown ?? null,
          source_file: file.name,
        });

      if (saveError) {
        console.error("Failed to save to Supabase:", saveError);
        throw new Error("Failed to save results. Please try again.");
      }

      // Success!
      setStatus("success");
      setProcessingStep("");

      toast({
        title: "Emissions Calculated!",
        description: `Total emissions: ${result.total_emissions?.toFixed(2)} t CO2e`,
      });

    } catch (error) {
      console.error("Upload error:", error);
      setStatus("error");
      setProcessingStep("");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to process file. Please check the format and try again."
      );

      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Calculating emissions...";
      case "saving":
        return "Saving results...";
      default:
        return "Upload & Calculate Emissions";
    }
  };

  const isProcessing = status === "uploading" || status === "processing" || status === "saving";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-12 pt-28">
        <div className="max-w-2xl mx-auto">
          {/* Upload Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CloudUpload className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                Upload Emissions Data
              </h1>
              <p className="text-muted-foreground">
                Upload your Excel or CSV file to calculate emissions
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-accent/30",
                file && "border-primary bg-primary/5",
                isProcessing && "pointer-events-none opacity-75"
              )}
            >
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />

              {!file ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <CloudUpload className={cn(
                      "w-6 h-6 transition-colors",
                      isDragging ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Drag and drop your emissions data file here
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to select file (Excel or CSV)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground truncate max-w-[200px] md:max-w-[300px]">
                        {file.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="w-8 h-8 rounded-full bg-muted hover:bg-destructive/10 flex items-center justify-center transition-colors group"
                    >
                      <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Reporting Period Selection */}
            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <Label className="font-medium text-foreground">Reporting Period</Label>
              </div>
              <Select value={reportingPeriod} onValueChange={setReportingPeriod}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select quarter (e.g., Q1 2024)" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {quarterlyPeriods.map((quarter) => {
                    const { start, end } = getQuarterDateRange(quarter);
                    const startDate = new Date(start);
                    const endDate = new Date(end);
                    const startFormatted = startDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
                    const endFormatted = endDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
                    return (
                      <SelectItem key={quarter} value={quarter}>
                        {quarter} ({startFormatted} - {endFormatted})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Emissions are calculated quarterly for accurate tracking
              </p>
            </div>

            {/* Upload Button */}
            <div className="mt-6">
              <Button
                onClick={handleUpload}
                disabled={!file || isProcessing}
                className="w-full h-12 text-base font-medium"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {getStatusMessage()}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CloudUpload className="w-5 h-5" />
                    Upload & Calculate Emissions
                  </span>
                )}
              </Button>

              {/* Processing step indicator */}
              {processingStep && (
                <p className="text-sm text-center text-muted-foreground mt-2">
                  {processingStep}
                </p>
              )}
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Upload Successful!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your emissions data has been calculated and saved.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary mt-2"
                    onClick={() => navigate("/dashboard")}
                  >
                    View results in Dashboard →
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && errorMessage && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Upload Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Not logged in warning */}
            {!user && (
              <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">Login Required</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Please log in to upload and process emissions data.
                  </p>
                </div>
              </div>
            )}

            {/* File Requirements Section */}
            <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-primary">File Requirements:</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    // Create CSV template content
                    const csvContent = `Category,Date,Site,Quantity,Unit
Electricity,2024-01-15,Head Office,1500,kWh
Electricity,2024-02-15,Head Office,1450,kWh
Gas,2024-01-15,Head Office,500,MJ
Gas,2024-02-15,Head Office,480,MJ
Fuel,2024-01-15,Fleet,200,Litres
Flights,2024-01-20,Business Travel,2500,km
Water,2024-01-15,Head Office,50,kL
Waste,2024-01-31,Head Office,2,Tonnes`;

                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'emissions-template.csv';
                    link.click();
                    URL.revokeObjectURL(url);

                    toast({
                      title: "Template downloaded",
                      description: "Open the CSV file in Excel to fill in your data.",
                    });
                  }}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download Template (CSV)
                </Button>
              </div>
              <ul className="text-sm text-primary space-y-2 ml-7">
                <li className="list-disc">Excel file (.xlsx or .xls) or CSV format</li>
                <li className="list-disc">Must contain sheets for emission categories:
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Electricity</strong> - kWh consumption</li>
                    <li>• <strong>Gas</strong> - MJ or GJ consumption</li>
                    <li>• <strong>Fuel</strong> - Litres (petrol, diesel, LPG)</li>
                    <li>• <strong>Flights</strong> - Distance in km or passenger-km</li>
                    <li>• <strong>Water</strong> - kL consumption</li>
                    <li>• <strong>Waste</strong> - Tonnes sent to landfill</li>
                  </ul>
                </li>
                <li className="list-disc">Each sheet should have columns: Date, Site, Usage/Quantity</li>
                <li className="list-disc">NGERS emission factors are applied automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FileUpload;
