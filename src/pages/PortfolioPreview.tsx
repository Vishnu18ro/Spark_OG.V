import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SpaceBackground } from "@/components/SpaceBackground";
import { QuoteTicker } from "@/components/QuoteTicker";
import { Header } from "@/components/Header";
import { useProfile } from "@/contexts/ProfileContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  User,
  Briefcase,
  Sparkles,
  Code,
  Award,
  Building,
  Terminal,
  FileText,
  GraduationCap,
  Heart
} from "lucide-react";
import { ProfileInfoPreview } from "@/components/portfolio/ProfileInfoPreview";
import { ProjectsPreview } from "@/components/portfolio/ProjectsPreview";
import { SurpriseProjectsPreview } from "@/components/portfolio/SurpriseProjectsPreview";
import { SkillsPreview } from "@/components/portfolio/SkillsPreview";
import { CertificatesPreview } from "@/components/portfolio/CertificatesPreview";
import { ExperiencePreview } from "@/components/portfolio/ExperiencePreview";
import { CodingPlatformPreview } from "@/components/portfolio/CodingPlatformPreview";
import { AboutMePreview } from "@/components/portfolio/AboutMePreview";
import { EducationPreview } from "@/components/portfolio/EducationPreview";
import { PersonalConnectionPreview } from "@/components/portfolio/PersonalConnectionPreview";
import { logout, isGuestMode } from "@/lib/auth";
import { toast } from "sonner";

interface Section {
  id: string;
  title: string;
  icon: typeof User;
}

const sections: Section[] = [
  { id: "profile-info", title: "Profile Info", icon: User },
  { id: "projects", title: "Projects", icon: Briefcase },
  { id: "surprise-projects", title: "Surprise Projects", icon: Sparkles },
  { id: "skills", title: "Skills & Expertise", icon: Code },
  { id: "certificates", title: "Certificates", icon: Award },
  { id: "experience", title: "Experience", icon: Building },
  { id: "coding-platform", title: "Coding Platform", icon: Terminal },
  { id: "about-me", title: "About Me", icon: FileText },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "personal-connection", title: "Personal Connection", icon: Heart },
];

export default function PortfolioPreview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profileImage, username, session, isLoading } = useProfile();
  const [activeSection, setActiveSection] = useState("profile-info");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handle section query parameter for direct navigation
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scrollToSection(sectionParam);
      }, 100);
    }
  }, [searchParams]);

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Header
        isAuthenticated
        username={username || "User"}
        profileImage={profileImage}
        onLogout={handleLogout}
      />

      <div className="pt-20 flex w-full">
        {/* Fixed Left Sidebar Navigation */}
        <aside
          className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-card/50 backdrop-blur-md border-r border-primary/30 transition-all duration-300 z-40 ${isSidebarOpen ? "w-64" : "w-16"
            } hidden lg:block`}
        >
          <div className="flex flex-col h-full">
            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="m-2 hover:bg-primary/10"
            >
              {isSidebarOpen ? "←" : "→"}
            </Button>

            {/* Navigation Items */}
            <ScrollArea className="flex-1 px-2">
              <nav className="space-y-2 py-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${isActive
                        ? "bg-primary/20 text-primary shadow-glow-primary"
                        : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon
                        className={`${isSidebarOpen ? "w-5 h-5" : "w-6 h-6"} shrink-0 transition-all ${isActive ? "animate-glow" : ""
                          }`}
                      />
                      {isSidebarOpen && (
                        <span className={`text-xs font-medium transition-all ${isActive ? "font-bold" : ""
                          }`}>
                          {section.title}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <div className="lg:hidden fixed bottom-4 left-4 z-50">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-full w-14 h-14 shadow-glow-primary"
          >
            ☰
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <aside className="lg:hidden fixed left-0 top-20 h-[calc(100vh-5rem)] w-64 bg-card/95 backdrop-blur-md border-r border-primary/30 z-40">
            <ScrollArea className="h-full px-2">
              <nav className="space-y-2 py-4">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        scrollToSection(section.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${isActive
                        ? "bg-primary/20 text-primary shadow-glow-primary"
                        : "hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </aside>
        )}

        {/* Main Scrollable Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
          }`}>
          <div className="container mx-auto px-4 py-8 space-y-8" style={{ zoom: "75%" }}>
            <div id="profile-info">
              <ProfileInfoPreview />
            </div>

            <div id="projects">
              <ProjectsPreview />
            </div>

            <div id="surprise-projects">
              <SurpriseProjectsPreview />
            </div>

            <div id="skills">
              <SkillsPreview />
            </div>

            <div id="certificates">
              <CertificatesPreview />
            </div>

            <div id="experience">
              <ExperiencePreview />
            </div>

            <div id="coding-platform">
              <CodingPlatformPreview />
            </div>

            <div id="about-me">
              <AboutMePreview />
            </div>

            <div id="education">
              <EducationPreview />
            </div>

            <div id="personal-connection">
              <div className="bg-[#0d0d0d] border border-purple-500/30 rounded-xl p-6 mb-8 shadow-[0_0_20px_rgba(168,85,247,0.35)]">
                <PersonalConnectionPreview />
              </div>
            </div>
          </div>
        </main>
      </div>

      <QuoteTicker />
    </div>
  );
}
