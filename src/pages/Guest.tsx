import { useEffect } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { QuoteTicker } from "@/components/QuoteTicker";
import { Header } from "@/components/Header";
import { Rocket } from "lucide-react";
import { enableGuestMode } from "@/lib/auth";

export default function Guest() {
  useEffect(() => {
    enableGuestMode();
  }, []);
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Header isGuest={true} />

      <main className="container mx-auto px-4 pt-24 pb-20 flex flex-col items-center justify-center min-h-screen" style={{ zoom: "90%" }}>
        <div className="text-center space-y-6 max-w-2xl">
          <Rocket className="w-24 h-24 text-primary mx-auto animate-float" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-electric bg-clip-text text-transparent whitespace-nowrap">
            SPARK — Discover. Connect. Build.
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            SPARK is a revolutionary platform where creators showcase their projects,
            skills, and achievements in an electrifying space-themed environment.
            Connect with innovators, explore groundbreaking work, and ignite your own spark.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: "Projects", desc: "Share your stellar work" },
              { title: "Skills", desc: "Showcase your expertise" },
              { title: "Connect", desc: "Build your network" }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-glow-primary"
              >
                <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <QuoteTicker />
    </div>
  );
}
