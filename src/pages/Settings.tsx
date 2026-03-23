import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SpaceBackground } from "@/components/SpaceBackground";
import { Header } from "@/components/Header";
import { useProfile } from "@/contexts/ProfileContext";
import { logout, isGuestMode } from "@/lib/auth";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Settings as SettingsIcon, Eye, EyeOff, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const navigate = useNavigate();
  const { profileImage, username, session, isLoading: profileLoading } = useProfile();
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    if (!profileLoading && !session && !isGuestMode()) {
      navigate("/");
    }
  }, [session, profileLoading, navigate]);

  // Fetch current profile visibility setting
  useEffect(() => {
    const fetchProfileVisibility = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('profile')
          .eq('auth_user_id', session.user.id)
          .single();

        if (error) throw error;

        const profile = data?.profile as any || {};
        setIsPublic(profile.isPublic !== false);
      } catch (error) {
        console.error('Error fetching profile visibility:', error);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    if (session?.user?.id) {
      fetchProfileVisibility();
    }
  }, [session?.user?.id]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handleToggleVisibility = async (checked: boolean) => {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      // First get current profile data
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('profile')
        .eq('auth_user_id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentProfile = userData?.profile as any || {};

      // Update with new visibility setting
      const { error: updateError } = await supabase
        .from('users')
        .update({
          profile: {
            ...currentProfile,
            isPublic: checked
          }
        })
        .eq('auth_user_id', session.user.id);

      if (updateError) throw updateError;

      setIsPublic(checked);
      toast.success(checked ? "Profile set to public" : "Profile set to private");
    } catch (error) {
      console.error('Error updating profile visibility:', error);
      toast.error("Failed to update profile visibility");
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading || isLoadingSettings) {
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

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-2xl" style={{ zoom: "90%" }}>
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-electric bg-clip-text text-transparent">
            Settings
          </h1>
        </div>

        {/* Privacy Settings Card */}
        <Card className="bg-card/50 backdrop-blur-md border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              {isPublic ? (
                <Eye className="w-5 h-5 text-primary" />
              ) : (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              )}
              Profile Visibility
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              When set to private, your profile will be hidden from Explore but can still be found by searching your username directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="profile-visibility" className="text-foreground font-medium">
                  Set profile to public
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isPublic
                    ? "Your profile is visible in Explore"
                    : "Your profile is hidden from Explore"}
                </p>
              </div>
              <Switch
                id="profile-visibility"
                checked={isPublic}
                onCheckedChange={handleToggleVisibility}
                disabled={isSaving}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Return to Home Button */}
        <div className="mt-6">
          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-primary text-primary-foreground hover:shadow-glow-primary"
          >
            <Home className="mr-2 w-5 h-5" />
            Return to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
