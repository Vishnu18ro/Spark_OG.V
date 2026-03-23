import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  participant_one: string;
  participant_two: string;
  created_at: string;
  viewed_at: string | null;
  last_message_at: string | null;
}

interface ConversationWithUser extends Conversation {
  otherUser: {
    id: string;
    username: string;
    profile: any;
  } | null;
  lastMessage?: Message;
}

export function useMessages() {
  const [conversations, setConversations] = useState<ConversationWithUser[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ConversationWithUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch all conversations
  const fetchConversations = async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const { data: convs, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_one.eq.${currentUserId},participant_two.eq.${currentUserId}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Fetch user details for each conversation
      const conversationsWithUsers: ConversationWithUser[] = await Promise.all(
        (convs || []).map(async (conv) => {
          const otherUserId = conv.participant_one === currentUserId 
            ? conv.participant_two 
            : conv.participant_one;
          
          const { data: userData } = await supabase
            .from('users')
            .select('id, username, profile')
            .eq('auth_user_id', otherUserId)
            .maybeSingle();

          // Get last message
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...conv,
            otherUser: userData,
            lastMessage: lastMsg
          };
        })
      );

      // Filter out conversations where the other user doesn't exist (invalid data)
      const validConversations = conversationsWithUsers.filter(conv => conv.otherUser !== null);
      setConversations(validConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create or get existing conversation
  const getOrCreateConversation = async (otherUserAuthId: string): Promise<string | null> => {
    if (!currentUserId) return null;

    try {
      // Check if conversation exists (in either direction)
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(participant_one.eq.${currentUserId},participant_two.eq.${otherUserAuthId}),and(participant_one.eq.${otherUserAuthId},participant_two.eq.${currentUserId})`)
        .maybeSingle();

      if (existingConv) {
        return existingConv.id;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant_one: currentUserId,
          participant_two: otherUserAuthId
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchConversations();
      return newConv.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
      return null;
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark as viewed
      const conv = conversations.find(c => c.id === conversationId);
      if (conv && !conv.viewed_at && conv.participant_two === currentUserId) {
        await supabase
          .from('conversations')
          .update({ viewed_at: new Date().toISOString() })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!currentUserId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: content.trim()
        });

      if (error) throw error;

      // Update last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  // Set up realtime subscription for messages
  useEffect(() => {
    if (!currentConversation?.id) return;

    const channel = supabase
      .channel(`messages-${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation?.id]);

  // Set up realtime subscription for conversations
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    currentUserId,
    fetchConversations,
    getOrCreateConversation,
    fetchMessages,
    sendMessage
  };
}
