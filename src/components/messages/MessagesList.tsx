import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConversationItem {
  id: string;
  otherUser: {
    id: string;
    username: string;
    profile: any;
  } | null;
  lastMessage?: {
    content: string;
    created_at: string;
  };
  viewed_at: string | null;
}

interface UnreadCounts {
  total: number;
  perConversation: Record<string, number>;
}

interface MessagesListProps {
  conversations: ConversationItem[];
  selectedId: string | null;
  onSelect: (conv: ConversationItem) => void;
  unreadCounts?: UnreadCounts;
}

export function MessagesList({ conversations, selectedId, onSelect, unreadCounts }: MessagesListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <User className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-gray-400 text-sm">No messages yet</p>
        <p className="text-gray-500 text-xs mt-1">
          Start a conversation from someone's profile
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {conversations.map((conv) => {
        const profile = conv.otherUser?.profile || {};
        const avatarUrl = profile.profileImage || profile.image || profile.avatar;
        const unreadCount = unreadCounts?.perConversation[conv.id] || 0;

        return (
          <button
            key={conv.id}
            onClick={() => onSelect(conv)}
            className={`flex items-center gap-3 p-4 border-b border-blue-500/20 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all text-left ${
              selectedId === conv.id ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20' : ''
            }`}
          >
            <Avatar className="h-12 w-12 border-2 border-blue-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <User className="w-6 h-6 text-blue-400" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-medium truncate ${unreadCount > 0 ? 'text-white' : 'text-gray-200'}`}>
                  {profile.name || conv.otherUser?.username || 'Unknown User'}
                </p>
                {unreadCount > 0 && (
                  <span className="min-w-[20px] h-[20px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[11px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {conv.lastMessage.content}
                </p>
              )}
              {conv.lastMessage && (
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
