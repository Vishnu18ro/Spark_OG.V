import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SpaceBackground } from "@/components/SpaceBackground";
import { QuoteTicker } from "@/components/QuoteTicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { signUp, login, enableGuestMode } from "@/lib/auth";
import { toast } from "sonner";

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (location.state?.tab === "signup") {
      setActiveTab("signup");
    } else if (location.state?.tab === "signin") {
      setActiveTab("signin");
    }
  }, [location.state]);

  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestVisit = () => {
    enableGuestMode();
    toast.success("Guest Mode Active - data will not be saved");
    navigate("/guest");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await login(signInUsername, signInPassword);

      if (error) {
        toast.error(error.message || "Invalid username or password");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpPassword !== signUpConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (signUpUsername.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(signUpUsername, signUpPassword);

      if (error) {
        toast.error(error.message || "Failed to create account");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        toast.success("Account created successfully! You can now sign in.");
        // Clear signup form
        setSignUpUsername("");
        setSignUpPassword("");
        setSignUpConfirm("");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4" style={{ zoom: "90%" }}>
      <SpaceBackground />

      <div className="absolute inset-0 bg-gradient-cosmic opacity-50" />

      <div className="relative z-10 w-full max-w-md mb-20">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-float">
          <div className="flex items-center gap-3">
            <Zap className="w-16 h-16 text-primary animate-glow" />
            <h1 className="text-6xl font-bold bg-gradient-electric bg-clip-text text-transparent">
              SPARK
            </h1>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-card/50 backdrop-blur-lg border-primary/30 shadow-glow-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-foreground">Welcome</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join the cosmic community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Username</Label>
                    <Input
                      id="signin-username"
                      type="text"
                      placeholder="yourusername"
                      value={signInUsername}
                      onChange={(e) => setSignInUsername(e.target.value)}
                      className="bg-input border-border"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="bg-input border-border"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:shadow-glow-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="yourusername"
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      className="bg-input border-border"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="bg-input border-border"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signUpConfirm}
                      onChange={(e) => setSignUpConfirm(e.target.value)}
                      className="bg-input border-border"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-electric text-foreground hover:shadow-glow-secondary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={handleGuestVisit}
                className="w-full border-secondary text-secondary hover:bg-secondary/10"
              >
                Visit as Guest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <QuoteTicker />
    </div>
  );
}
