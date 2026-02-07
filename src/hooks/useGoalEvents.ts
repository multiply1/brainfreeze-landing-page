import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type GoalEventType = 'check_in' | 'relapse' | 'freeze_used' | 'streak_milestone' | 'goal_created' | 'goal_updated';

export interface GoalEvent {
  id: string;
  goal_id: string;
  user_id: string;
  event_type: GoalEventType;
  event_date: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const useGoalEvents = (goalId?: string) => {
  const [events, setEvents] = useState<GoalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('goal_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (goalId) {
        query = query.eq('goal_id', goalId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents((data as GoalEvent[]) || []);
    } catch (error) {
      console.error('Error fetching goal events:', error);
    } finally {
      setLoading(false);
    }
  };

  const logEvent = async (
    goalId: string,
    eventType: GoalEventType,
    metadata: Record<string, any> = {}
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('goal_events')
        .insert({
          goal_id: goalId,
          user_id: user.id,
          event_type: eventType,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newEvent = data as GoalEvent;
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (error) {
      console.error('Error logging goal event:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user, goalId]);

  return {
    events,
    loading,
    logEvent,
    refetch: fetchEvents,
  };
};
