import { useProfile } from "@/contexts/ProfileContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ExternalLink, MessageSquare } from "lucide-react";

export function ProfileInfoPreview() {
  const { profileImage, name, tagline, githubUrl, linkedinUrl } = useProfile();

  const scrollToPersonalConnection = () => {
    const element = document.getElementById("personal-connection");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div id="profile-info-section" className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-8 shadow-glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-electric bg-clip-text text-transparent">
          Profile Info
        </h2>

      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Profile Photo */}
        <Avatar className="w-32 h-32 border-4 border-primary/50 shadow-glow-primary shrink-0">
          <AvatarImage src={profileImage} alt={name || "Profile"} />
          <AvatarFallback className="text-3xl bg-primary/20">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>

        {/* Profile Details */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h3 className="text-4xl font-bold text-foreground mb-2">
              {name || "Your Name"}
            </h3>
            <p className="text-lg text-muted-foreground mb-1">
              {tagline || "Your tagline goes here"}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-3 justify-center md:justify-start">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            <button
              onClick={scrollToPersonalConnection}
              className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all cursor-pointer"
              title="Go to Personal Connection"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
