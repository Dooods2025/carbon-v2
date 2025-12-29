import { useState, useCallback } from "react";
import { CloudUpload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/AppHeader";

type UploadStatus = "idle" | "uploading" | "success" | "error";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

    setStatus("uploading");

    // Simulate upload process
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage("Failed to process file. Please check the format and try again.");
      }
    }, 2000);
  };

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
                file && "border-primary bg-primary/5"
              )}
            >
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="w-8 h-8 rounded-full bg-muted hover:bg-destructive/10 flex items-center justify-center transition-colors group"
                  >
                    <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="mt-6">
              <Button
                onClick={handleUpload}
                disabled={!file || status === "uploading"}
                className="w-full h-12 text-base font-medium"
              >
                {status === "uploading" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CloudUpload className="w-5 h-5" />
                    Upload & Calculate Emissions
                  </span>
                )}
              </Button>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Upload Successful!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your emissions data has been processed. View results in the Dashboard.
                  </p>
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

            {/* Help Section */}
            <div className="mt-8 p-4 rounded-lg bg-accent/50 border border-border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">File Requirements</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Supported formats: Excel (.xlsx, .xls) or CSV</li>
                    <li>• Include columns for activity, quantity, and unit</li>
                    <li>• Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FileUpload;
