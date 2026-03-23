import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Send, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ChatWindowProps {
  otherUser: {
    id: string;
    username: string;
    profile: any;
  } | null;
  messages: Message[];
  currentUserId: string | null;
  viewedAt: string | null;
  onSend: (content: string) => void;
}

export function ChatWindow({ otherUser, messages, currentUserId, viewedAt, onSend }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profile = otherUser?.profile || {};
  const avatarUrl = profile.profileImage || profile.image || profile.avatar;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!viewedAt) return null;
    const viewedDate = new Date(viewedAt);
    const expiresAt = new Date(viewedDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const hoursRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)));
    return hoursRemaining;
  };

  const timeRemaining = getTimeRemaining();

  if (!otherUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
          <Send className="w-10 h-10 text-blue-400" />
        </div>
        <p className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-medium">Select a conversation</p>
        <p className="text-gray-500 text-sm mt-1">
          Choose from your existing conversations or start a new one
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <Avatar className="h-10 w-10 border-2 border-blue-500/30 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <User className="w-5 h-5 text-blue-400" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">{profile.name || otherUser.username}</p>
          {timeRemaining !== null && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Disappears in {timeRemaining}h</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                      : "bg-[#1a1a2e] text-gray-200 rounded-bl-sm border border-blue-500/30"
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMine ? "text-blue-200" : "text-gray-500"
                    }`}
                  >
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-500/30 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-[#1a1a2e] border-blue-500/30 focus:border-blue-500/50 text-gray-200 placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full w-10 h-10 p-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
