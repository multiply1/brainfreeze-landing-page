import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  mood_score: number | null;
  energy_level: 'low' | 'medium' | 'high' | null;
  reflection: string | null;
  check_in_time: string;
  created_at: string;
}

export const useDailyLogs = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const fetchLogs = async () => {
    if (!user) {
      setLogs([]);
      setTodayLog(null);
      setLoading(false);
      return;
    }

    try {
      // Fetch last 30 days of logs
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('log_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('log_date', { ascending: false });

      if (error) throw error;

      const typedData = data as DailyLog[];
      setLogs(typedData || []);
      
      // Find today's log
      const todaysLog = typedData?.find(log => log.log_date === today) || null;
      setTodayLog(todaysLog);
    } catch (error) {
      console.error('Error fetching daily logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateTodayLog = async (data: {
    mood_score: number;
    energy_level?: 'low' | 'medium' | 'high';
    reflection?: string;
  }) => {
    if (!user) return null;

    try {
      // Check if today's log exists
      const { data: existing } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data: updated, error } = await supabase
          .from('daily_logs')
          .update({
            mood_score: data.mood_score,
            energy_level: data.energy_level,
            reflection: data.reflection,
            check_in_time: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        
        const typedUpdated = updated as DailyLog;
        setTodayLog(typedUpdated);
        setLogs(prev => prev.map(l => l.id === typedUpdated.id ? typedUpdated : l));
        
        toast({
          title: 'Check-in updated! 🧊',
          description: 'Your daily log has been saved.',
        });
        
        return typedUpdated;
      } else {
        // Create new
        const { data: created, error } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            log_date: today,
            mood_score: data.mood_score,
            energy_level: data.energy_level,
            reflection: data.reflection,
          })
          .select()
          .single();

        if (error) throw error;
        
        const typedCreated = created as DailyLog;
        setTodayLog(typedCreated);
        setLogs(prev => [typedCreated, ...prev]);
        
        toast({
          title: 'Check-in complete! 🧊',
          description: 'Great job staying on track.',
        });
        
        return typedCreated;
      }
    } catch (error) {
      console.error('Error saving daily log:', error);
      toast({
        title: 'Error',
        description: 'Failed to save check-in',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Calculate streak from logs
  const calculateCheckInStreak = (): number => {
    if (logs.length === 0) return 0;
    
    let streak = 0;
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.log_date).getTime() - new Date(a.log_date).getTime()
    );

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].log_date);
      logDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(now);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  return {
    logs,
    todayLog,
    loading,
    hasCheckedInToday: !!todayLog,
    checkInStreak: calculateCheckInStreak(),
    createOrUpdateTodayLog,
    refetch: fetchLogs,
  };
};
