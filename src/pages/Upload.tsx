import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { CloudUpload, FileSpreadsheet, X, CheckCircle2, AlertCircle, Info, Leaf, Building2, MapPin, Users, Phone, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface BusinessProfile {
  companyName: string;
  industry: string;
  address: string;
  city: string;
  country: string;
  employees: string;
  phone: string;
  email: string;
  website: string;
}

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    companyName: "",
    industry: "",
    address: "",
    city: "",
    country: "",
    employees: "",
    phone: "",
    email: "",
    website: "",
  });

  const handleProfileChange = (field: keyof BusinessProfile, value: string) => {
    setBusinessProfile(prev => ({ ...prev, [field]: value }));
  };

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
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Carbonly
            </span>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Business Profile Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
            {/* Profile Header */}
            <div className="bg-primary/5 border-b border-border p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    Business Profile
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Complete your company details to generate accurate emissions reports
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="companyName" className="text-foreground font-medium">
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={businessProfile.companyName}
                      onChange={(e) => handleProfileChange("companyName", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground font-medium">
                    Industry
                  </Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Manufacturing, Technology"
                    value={businessProfile.industry}
                    onChange={(e) => handleProfileChange("industry", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Number of Employees */}
                <div className="space-y-2">
                  <Label htmlFor="employees" className="text-foreground font-medium">
                    Number of Employees
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="employees"
                      placeholder="e.g., 50-100"
                      value={businessProfile.employees}
                      onChange={(e) => handleProfileChange("employees", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-foreground font-medium">
                    Business Address
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={businessProfile.address}
                      onChange={(e) => handleProfileChange("address", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground font-medium">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={businessProfile.city}
                    onChange={(e) => handleProfileChange("city", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-foreground font-medium">
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="Enter country"
                    value={businessProfile.country}
                    onChange={(e) => handleProfileChange("country", e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={businessProfile.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="businessEmail" className="text-foreground font-medium">
                    Business Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="businessEmail"
                      type="email"
                      placeholder="contact@company.com"
                      value={businessProfile.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="website" className="text-foreground font-medium">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.company.com"
                      value={businessProfile.website}
                      onChange={(e) => handleProfileChange("website", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Summary Card */}
              {businessProfile.companyName && (
                <div className="mt-8 p-6 rounded-xl bg-accent/30 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                        Profile Preview
                      </span>
                      <h3 className="text-xl font-display font-bold text-foreground">
                        {businessProfile.companyName}
                      </h3>
                      {businessProfile.industry && (
                        <p className="text-muted-foreground mt-1">{businessProfile.industry}</p>
                      )}
                    </div>
                  </div>
                  {(businessProfile.city || businessProfile.country) && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {[businessProfile.city, businessProfile.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  {businessProfile.employees && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{businessProfile.employees} employees</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CloudUpload className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                Upload Emissions Data
              </h2>
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
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>

            {/* Status Messages */}
            {status === "success" && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 text-sm">
                  File processed successfully! Your emissions report is ready.
                </p>
              </div>
            )}

            {status === "error" && errorMessage && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{errorMessage}</p>
              </div>
            )}

            {/* Requirements Info Box */}
            <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">File Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Excel file (.xlsx or .xls) or CSV format</li>
                    <li>Must contain sheets: Electricity, Gas, Flights, Water, Waste, Fuel</li>
                    <li>Each sheet should have columns: Date, Site, Usage (or Activity-pkm for Flights)</li>
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

export default Upload;
