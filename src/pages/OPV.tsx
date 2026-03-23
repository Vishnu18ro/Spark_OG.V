import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { QuoteTicker } from "@/components/QuoteTicker";
import { Header } from "@/components/Header";
import { useProfile } from "@/contexts/ProfileContext";
import { useOPV } from "@/contexts/OPVContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { logout, isGuestMode } from "@/lib/auth";
import { toast } from "sonner";


export default function OPV() {
  const navigate = useNavigate();
  const { profileImage, username, session, isLoading } = useProfile();
  const { opvUserData, isOPVMode } = useOPV();
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    if (!isLoading && !session && !isGuestMode()) {
      navigate("/");
    }
  }, [session, isLoading, navigate]);

  useEffect(() => {
    if (isOPVMode && opvUserData) {
      console.log("OPV User Data:", opvUserData);
      console.log("Profile:", opvUserData.profile);
      setShowPlaceholder(false);
    }
  }, [isOPVMode, opvUserData]);

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

  const opvProfileImage = opvUserData?.profile?.image?.value || opvUserData?.profile?.image;
  const opvName = opvUserData?.profile?.name;
  const opvTagline = opvUserData?.profile?.tagline;
  const opvGithubUrl = opvUserData?.profile?.github?.value || opvUserData?.profile?.github;
  const opvLinkedinUrl = opvUserData?.profile?.linkedin?.value || opvUserData?.profile?.linkedin;

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Header isAuthenticated={!!session} isGuest={isGuestMode()} username={username || "User"} profileImage={profileImage} onLogout={handleLogout} />

      <main className="container mx-auto px-4 pt-32 pb-20" style={{ zoom: "90%" }}>
        {isOPVMode && opvUserData ? (
          <>
            {/* Hero Section for OPV User */}
            <div className="text-center mb-16 max-w-4xl mx-auto">
              {/* Profile Photo */}
              <div className="flex justify-center mb-8 animate-float">
                <Avatar className="w-48 h-48 border-4 border-primary/50 shadow-glow-primary">
                  <AvatarImage src={opvProfileImage} alt={opvName || "Profile"} />
                  <AvatarFallback className="text-4xl bg-primary/20">
                    {opvName ? opvName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name */}
              <h1 className="text-7xl font-bold bg-gradient-electric bg-clip-text text-transparent mb-6">
                {opvName || opvUserData.username}
              </h1>

              {/* Tagline */}
              <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">
                {opvTagline || ""}
              </p>

              {/* Social Links */}
              <div className="flex justify-center gap-4 mb-10">
                {opvGithubUrl && (
                  <a
                    href={opvGithubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
                  >
                    <Github className="w-6 h-6 text-foreground" />
                  </a>
                )}
                {opvLinkedinUrl && (
                  <a
                    href={opvLinkedinUrl}
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
                  onClick={() => navigate(`/opv-portfolio/${opvUserData.username}`)}
                  className="bg-primary text-primary-foreground hover:shadow-glow-primary px-8 py-6 text-lg"
                >
                  View Portfolio Hub 🎁
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(`/opv-portfolio/${opvUserData.username}?section=personal-connection`)}
                  className="border-secondary text-foreground hover:bg-secondary/10 px-8 py-6 text-lg"
                >
                  Get In Touch
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Placeholder when no user is searched */}
            <div className="text-center mb-16 max-w-4xl mx-auto min-h-[60vh] flex flex-col items-center justify-center">
              <div className="mb-8">
                <div className="w-48 h-48 rounded-full bg-card/50 backdrop-blur-sm border-4 border-primary/30 flex items-center justify-center mx-auto animate-pulse">
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="text-6xl bg-primary/20">
                      ?
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <h1 className="text-5xl font-bold bg-gradient-electric bg-clip-text text-transparent mb-6">
                Search for a User
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                Enter a username in the search bar above to view their profile
              </p>

              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm">Please enter a username.</span>
              </div>
            </div>
          </>
        )}
      </main>

      <QuoteTicker />
    </div>
  );
}
