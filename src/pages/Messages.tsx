import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { SpaceBackground } from "@/components/SpaceBackground";
import { MessagesList } from "@/components/messages/MessagesList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { useMessages } from "@/hooks/useMessages";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Messages() {
  const navigate = useNavigate();
  const { recipientId } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    currentUserId,
    getOrCreateConversation,
    fetchMessages,
    sendMessage
  } = useMessages();

  const { unreadCounts, markAsRead } = useUnreadMessages();

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setIsAuthenticated(true);

      const { data: userData } = await supabase
        .from('users')
        .select('username, profile')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (userData) {
        setUsername(userData.username);
        const profile = userData.profile as any;
        setProfileImage(profile?.profileImage || profile?.image || profile?.avatar || "");
      }
    };
    checkAuth();
  }, [navigate]);

  // Handle recipient from URL
  useEffect(() => {
    const initConversation = async () => {
      if (recipientId && currentUserId) {
        const convId = await getOrCreateConversation(recipientId);
        if (convId) {
          const conv = conversations.find(c => c.id === convId);
          if (conv) {
            setCurrentConversation(conv);
            fetchMessages(convId);
          }
        }
      }
    };
    initConversation();
  }, [recipientId, currentUserId, conversations.length]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation?.id) {
      fetchMessages(currentConversation.id);
    }
  }, [currentConversation?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/welcome");
  };

  const handleSelectConversation = (conv: any) => {
    setCurrentConversation(conv);
    // Mark as read when selecting conversation
    if (conv.id) {
      markAsRead(conv.id);
    }
    navigate(`/messages/${conv.otherUser?.id || conv.id}`);
  };

  const handleSendMessage = (content: string) => {
    if (currentConversation?.id) {
      sendMessage(currentConversation.id, content);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SpaceBackground />
      <Header
        isAuthenticated={isAuthenticated}
        username={username}
        profileImage={profileImage}
        onLogout={handleLogout}
      />

      <main className="relative z-10 pt-24 pb-4 px-4" style={{ zoom: "90%" }}>
        <div className="container mx-auto max-w-[85%]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Messages</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-blue-500/10 rounded-full"
            >
              <X className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-150px)]">
            {/* Conversations List */}
            <div className="md:col-span-1 rounded-xl border border-blue-500/30 bg-gradient-to-br from-[#0d0d1a]/90 via-[#0d0d1a]/80 to-[#1a0d2e]/80 backdrop-blur-sm overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <div className="p-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <h2 className="font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">Conversations</h2>
              </div>
              <MessagesList
                conversations={conversations}
                selectedId={currentConversation?.id || null}
                onSelect={handleSelectConversation}
                unreadCounts={unreadCounts}
              />
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2 rounded-xl border border-purple-500/30 bg-gradient-to-br from-[#0d0d1a]/90 via-[#0d0d1a]/80 to-[#1a0d2e]/80 backdrop-blur-sm overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.15)]">
              <ChatWindow
                otherUser={currentConversation?.otherUser || null}
                messages={messages}
                currentUserId={currentUserId}
                viewedAt={currentConversation?.viewed_at || null}
                onSend={handleSendMessage}
              />
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            💫 Your conversations are secure and private
          </p>
        </div>
      </main>
    </div>
  );
}
