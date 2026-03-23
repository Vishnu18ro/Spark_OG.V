import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { QuoteTicker } from "@/components/QuoteTicker";
import { Header } from "@/components/Header";
import { useProfile } from "@/contexts/ProfileContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { logout, isGuestMode } from "@/lib/auth";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profileImage, name, tagline, githubUrl, linkedinUrl, username, session, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && !session && !isGuestMode()) {
      navigate("/");
    }
  }, [session, isLoading, navigate]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <SpaceBackground />
        <div className="text-center">
          <div className="text-2xl text-primary animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Header isAuthenticated username={username || "User"} profileImage={profileImage} onLogout={handleLogout} />

      <main className="container mx-auto px-4 pt-32 pb-20" style={{ zoom: "90%" }}>
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          {/* Profile Photo */}
          <div className="flex justify-center mb-8 animate-float">
            <Avatar className="w-48 h-48 border-4 border-primary/50 shadow-glow-primary">
              <AvatarImage src={profileImage} alt={name || "Profile"} />
              <AvatarFallback className="text-4xl bg-primary/20">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <h1 className="text-7xl font-bold bg-gradient-electric bg-clip-text text-transparent mb-6">
            {name || "Your Name"}
          </h1>

          {/* Tagline */}
          <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">
            {tagline || "Your tagline goes here"}
          </p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mb-10">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
              >
                <Github className="w-6 h-6 text-foreground" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
              >
                <Linkedin className="w-6 h-6 text-foreground" />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6">
            <Button
              size="lg"
              onClick={() => navigate("/portfolio")}
              className="bg-primary text-primary-foreground hover:shadow-glow-primary px-8 py-6 text-lg"
            >
              View Portfolio Hub 🎁
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/portfolio?section=personal-connection")}
              className="border-secondary text-foreground hover:bg-secondary/10 px-8 py-6 text-lg"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </main>

      <QuoteTicker />
    </div>
  );
}
