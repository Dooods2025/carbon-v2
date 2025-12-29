import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowLeft, Building2, Hash, Factory, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INDUSTRIES = [
  "Agriculture",
  "Construction",
  "Education",
  "Energy & Utilities",
  "Financial Services",
  "Healthcare",
  "Hospitality & Tourism",
  "Information Technology",
  "Manufacturing",
  "Mining & Resources",
  "Professional Services",
  "Retail & Wholesale",
  "Transport & Logistics",
  "Other",
];

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup fields
  const [businessName, setBusinessName] = useState("");
  const [abn, setAbn] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [numberOfSites, setNumberOfSites] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation for login
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Additional validation for signup
    if (isSignUp) {
      if (!businessName || !abn || !contactEmail || !industry || !numberOfSites) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        toast({
          title: "Error",
          description: "Password must be at least 8 characters",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: isSignUp ? "Account created!" : "Welcome back!",
      description: "Redirecting to dashboard...",
    });

    // Redirect to upload page
    setTimeout(() => {
      navigate("/upload");
    }, 500);

    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Left side - decorative (fixed, no scroll) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <Leaf className="w-16 h-16 mb-6" />
          <h1 className="text-4xl font-display font-bold mb-4 text-center">
            Carbon Emissions Calculator
          </h1>
          <p className="text-lg text-primary-foreground/80 text-center max-w-md">
            Track, measure, and reduce your carbon footprint with our powerful emissions calculator.
          </p>
        </div>
      </div>

      {/* Right side - form (scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col justify-center items-center min-h-full p-8">
          <div className="w-full max-w-md py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-semibold text-foreground">
              Carbon Emissions Calculator
            </span>
          </div>

          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Enter your business details to get started"
              : "Enter your credentials to access your profile and dashboard"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <>
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* ABN */}
                <div className="space-y-2">
                  <Label htmlFor="abn">ABN (Australian Business Number) *</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="abn"
                      type="text"
                      placeholder="e.g., 12 345 678 901"
                      value={abn}
                      onChange={(e) => setAbn(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="Enter contact email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Industry/Sector */}
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry/Sector *</Label>
                  <div className="relative">
                    <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="pl-10 h-12">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => (
                          <SelectItem key={ind} value={ind}>
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Number of Sites */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfSites">Number of Sites *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="numberOfSites"
                      type="number"
                      min="1"
                      placeholder="e.g., 3"
                      value={numberOfSites}
                      onChange={(e) => setNumberOfSites(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-5 mt-5">
                  <p className="text-sm text-muted-foreground mb-4">Account Credentials</p>
                </div>
              </>
            )}

            {/* Email for login */}
            <div className="space-y-2">
              <Label htmlFor="email">{isSignUp ? "Login Email *" : "Email address"}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password {isSignUp && "*"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              )}
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="text-center mt-8 text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
