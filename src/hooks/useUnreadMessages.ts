import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UnreadCounts {
  total: number;
  perConversation: Record<string, number>;
}

export function useUnreadMessages() {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({ total: 0, perConversation: {} });
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch unread counts
  const fetchUnreadCounts = async () => {
    if (!currentUserId) return;

    try {
      // Get all conversations for current user
      const { data: convs, error: convError } = await supabase
        .from('conversations')
        .select('id, participant_one, participant_two, viewed_at, last_message_at')
        .or(`participant_one.eq.${currentUserId},participant_two.eq.${currentUserId}`);

      if (convError) throw convError;

      const perConversation: Record<string, number> = {};
      let total = 0;

      // For each conversation, count unread messages
      await Promise.all(
        (convs || []).map(async (conv) => {
          // Determine if user is recipient (the one who should see unread)
          const isParticipantTwo = conv.participant_two === currentUserId;
          const isParticipantOne = conv.participant_one === currentUserId;
          
          // Get messages sent by the OTHER user that are newer than viewed_at
          const otherUserId = isParticipantOne ? conv.participant_two : conv.participant_one;
          
          let query = supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conv.id)
            .eq('sender_id', otherUserId);
          
          // If viewed_at exists, only count messages after that time
          if (conv.viewed_at) {
            query = query.gt('created_at', conv.viewed_at);
          }

          const { count, error } = await query;

          if (!error && count && count > 0) {
            perConversation[conv.id] = count;
            total++;
          }
        })
      );

      setUnreadCounts({ total, perConversation });
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  // Mark conversation as read
  const markAsRead = async (conversationId: string) => {
    if (!currentUserId) return;

    try {
      await supabase
        .from('conversations')
        .update({ viewed_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Update local state immediately
      setUnreadCounts(prev => {
        const newPerConversation = { ...prev.perConversation };
        const hadUnread = newPerConversation[conversationId] > 0;
        delete newPerConversation[conversationId];
        
        return {
          total: hadUnread ? prev.total - 1 : prev.total,
          perConversation: newPerConversation
        };
      });
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  // Set up realtime subscription for new messages
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('unread-messages-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchUnreadCounts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          fetchUnreadCounts();
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
      fetchUnreadCounts();
    }
  }, [currentUserId]);

  return {
    unreadCounts,
    markAsRead,
    fetchUnreadCounts
  };
}
