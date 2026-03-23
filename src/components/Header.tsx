// @ts-nocheck
import { Zap, User, Search, Eye, Sparkles, Send, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOPV } from "@/contexts/OPVContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
interface HeaderProps {
  isAuthenticated?: boolean;
  isGuest?: boolean;
  username?: string;
  profileImage?: string;
  onLogout?: () => void;
}

export const Header = ({ isAuthenticated = false, isGuest = false, username, profileImage, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchUsername, setSearchUsername] = useState("");
  const { setOpvUserData, setIsOPVMode } = useOPV();
  const { unreadCounts } = useUnreadMessages();

  const currentPath = location.pathname;

  const handleOPVClick = async () => {
    const query = searchUsername.trim();
    if (!query) {
      toast.error("Please enter a username.");
      return;
    }

    // @ts-ignore - Supabase types issue
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', query)
      .maybeSingle();

    if (error) {
      console.error(error);
      toast.error("Error checking username.");
      return;
    }

    if (data) {
      setOpvUserData(data);
      setIsOPVMode(true);
      setSearchUsername("");
      navigate("/opv");
    } else {
      toast.error("No such username exists.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleOPVClick();
    }
  };

  const handleBackClick = () => {
    if (currentPath === "/portfolio") {
      navigate("/dashboard");
    } else if (currentPath.startsWith("/opv-portfolio")) {
      navigate("/opv");
    }
  };

  const showBackButton = currentPath === "/portfolio" || currentPath.startsWith("/opv-portfolio");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="hover:bg-primary/10 rounded-full"
              aria-label="Go back to profile"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
          )}
          <Link to="/welcome" className="flex items-center gap-2 group">
            <Zap className="w-8 h-8 text-primary animate-glow" />
            <span className="text-2xl font-bold bg-gradient-electric bg-clip-text text-transparent">
              SPARK
            </span>
          </Link>

          {(isAuthenticated || isGuest) && (
            <div className="flex items-center gap-3">
              {isGuest ? (
                <Button
                  variant="outline"
                  className={
                    currentPath === "/readme"
                      ? "bg-primary/20 text-primary border-primary h-8 px-3 text-xs"
                      : "border-primary text-primary hover:bg-primary/10 h-8 px-3 text-xs"
                  }
                  onClick={() => navigate("/readme")}
                >
                  <Eye className="mr-1.5 w-3.5 h-3.5" />
                  ReadMe
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className={
                    currentPath === "/dashboard"
                      ? "bg-primary text-primary-foreground hover:shadow-glow-primary border-primary h-8 px-3 text-xs"
                      : "border-primary text-primary hover:bg-primary/10 h-8 px-3 text-xs"
                  }
                  onClick={() => navigate("/dashboard")}
                >
                  <Eye className="mr-1.5 w-3.5 h-3.5" />
                  PV
                </Button>
              )}
              <Button
                variant="outline"
                className={
                  currentPath === "/explore"
                    ? "bg-secondary text-secondary-foreground hover:shadow-glow-secondary border-secondary h-8 px-3 text-xs"
                    : "border-secondary text-secondary hover:bg-secondary/10 h-8 px-3 text-xs"
                }
                onClick={() => navigate("/explore")}
              >
                <Sparkles className="mr-1.5 w-3.5 h-3.5" />
                Explore
              </Button>
              <Button
                variant="outline"
                className={
                  currentPath === "/opv"
                    ? "bg-secondary text-secondary-foreground hover:shadow-glow-secondary border-secondary h-8 px-3 text-xs"
                    : "border-primary text-primary hover:bg-primary/10 h-8 px-3 text-xs"
                }
                onClick={() => navigate("/opv")}
              >
                <Eye className="mr-1.5 w-3.5 h-3.5" />
                OPV
              </Button>
            </div>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {(isAuthenticated || isGuest) && (
            <div className="hidden md:flex items-center gap-2 bg-card/50 backdrop-blur-md rounded-full px-4 py-1.5 border border-primary/30 w-64 transition-all duration-300 focus-within:w-72 focus-within:shadow-glow-primary focus-within:bg-card/80 focus-within:border-primary">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyUp={handleKeyPress}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground h-auto p-0"
              />
            </div>
          )}

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 relative"
                onClick={() => navigate("/messages")}
              >
                <Send className="w-5 h-5 text-primary" />
                {unreadCounts.total > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse">
                    {unreadCounts.total > 99 ? '99+' : unreadCounts.total}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full p-0 h-10 w-10 border-2 border-primary/50">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={profileImage} />
                      <AvatarFallback className="bg-muted">
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile/edit")}>
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={onLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/", { state: { tab: "signin" } })}>
                Sign In
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:shadow-glow-primary"
                onClick={() => navigate("/", { state: { tab: "signup" } })}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
