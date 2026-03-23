import { SpaceBackground } from "@/components/SpaceBackground";
import { Header } from "@/components/Header";
import { Rocket } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import { isGuestMode } from "@/lib/auth";

export default function Welcome() {
  const { profileImage, username, session } = useProfile();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      <Header
        isAuthenticated={!!session}
        isGuest={isGuestMode()}
        username={username || "User"}
        profileImage={profileImage}
      />

      <main className="container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen" style={{ zoom: "90%" }}>
        <div className="text-center animate-float">
          <Rocket className="w-32 h-32 text-primary animate-glow mx-auto mb-8" />
          <h1 className="text-7xl font-bold bg-gradient-electric bg-clip-text text-transparent animate-pulse">
            Welcome to SPARK
          </h1>
        </div>
      </main>

      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} SPARK. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
