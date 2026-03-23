import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SpaceBackground } from "@/components/SpaceBackground";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Github, Linkedin, User } from "lucide-react";
import { useOPV } from "@/contexts/OPVContext";
import { isGuestMode } from "@/lib/auth";

interface UserProfile {
  id: string;
  username: string;
  profile: any;
}

export default function Explore() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { setOpvUserData, setIsOPVMode } = useOPV();

  useEffect(() => {
    const fetchAuthAndUsers = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const isGuest = isGuestMode();

      if (!authUser && !isGuest) {
        navigate("/");
        return;
      }

      if (authUser) {
        setUser(authUser);

        // Fetch current user data for header
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("auth_user_id", authUser.id)
          .maybeSingle();

        setCurrentUserData(userData);
      }

      // Fetch all users
      const { data: allUsers, error } = await supabase
        .from("users")
        .select("id, username, profile");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        // Filter to only show public profiles (isPublic is not explicitly set to false)
        const publicUsers = (allUsers || []).filter((u: any) => {
          const profile = u.profile;
          return profile?.isPublic !== false;
        });
        setUsers(publicUsers);
      }
      setLoading(false);
    };

    fetchAuthAndUsers();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleUserClick = async (userData: UserProfile) => {
    // Fetch full user data
    const { data: fullUserData } = await supabase
      .from("users")
      .select("*")
      .eq("id", userData.id)
      .maybeSingle();

    if (fullUserData) {
      setOpvUserData(fullUserData);
      setIsOPVMode(true);
      navigate("/opv");
    }
  };

  const getGithubUrl = (profile: UserProfile["profile"]) => {
    if (!profile?.github) return null;
    if (typeof profile.github === "string") return profile.github;
    return profile.github.value || null;
  };

  const getLinkedinUrl = (profile: UserProfile["profile"]) => {
    if (!profile?.linkedin) return null;
    if (typeof profile.linkedin === "string") return profile.linkedin;
    return profile.linkedin.value || null;
  };

  const getProfileImage = (profile: UserProfile["profile"]) => {
    if (!profile) return null;
    return profile.profileImage || profile.image || profile.avatar || null;
  };

  const currentUserProfileImage = getProfileImage(currentUserData?.profile);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SpaceBackground />
      <Header
        isAuthenticated={!!user}
        isGuest={isGuestMode()}
        username={currentUserData?.username}
        profileImage={currentUserProfileImage}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 pt-24 pb-12" style={{ zoom: "90%" }}>
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-electric bg-clip-text text-transparent">
          Explore Users
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-muted-foreground">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((userData) => {
              const profile = userData.profile;
              const name = profile?.name || userData.username;
              const tagline = profile?.tagline || "No tagline";
              const profileImage = getProfileImage(profile);
              const githubUrl = getGithubUrl(profile);
              const linkedinUrl = getLinkedinUrl(profile);

              return (
                <div
                  key={userData.id}
                  onClick={() => handleUserClick(userData)}
                  className="bg-card/50 backdrop-blur-sm border border-primary/30 rounded-lg p-6 hover:border-primary/60 hover:shadow-glow-primary transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Profile Photo */}
                    <Avatar className="w-16 h-16 border-2 border-primary/50">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback className="bg-muted">
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Name, Tagline, and Social Links */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {tagline}
                      </p>

                      {/* Social Links */}
                      <div className="flex items-center gap-3 mt-3">
                        {githubUrl && (
                          <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-card/50 border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {linkedinUrl && (
                          <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-card/50 border border-primary/30 flex items-center justify-center hover:border-primary/60 hover:shadow-glow-primary transition-all"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
