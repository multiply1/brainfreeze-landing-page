import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useStreakLogic = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Process daily check-in for a goal
  const processGoalCheckIn = async (
    goalId: string,
    status: 'success' | 'almost' | 'failed'
  ) => {
    if (!user) return null;

    try {
      // Fetch current goal data
      const { data: goal, error: fetchError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('id', goalId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !goal) throw fetchError || new Error('Goal not found');

      const today = new Date().toISOString().split('T')[0];
      let newStreak = goal.streak;
      let newBestStreak = goal.best_streak || 0;
      let newFreezeTokens = goal.freeze_tokens || 0;
      let checkInStatus: string = 'completed';
      let lastRelapse = goal.last_relapse;
      let streakStartDate = goal.streak_start_date;

      if (status === 'success') {
        // Increment streak
        newStreak = goal.streak + 1;
        
        // Check for streak milestones (earn freeze token every 7 days)
        if (newStreak % 7 === 0 && newFreezeTokens < 3) {
          newFreezeTokens += 1;
          toast({
            title: '🧊 Freeze Token Earned!',
            description: `${newStreak} day streak! You earned a freeze token.`,
          });
        }

        // Update best streak
        if (newStreak > newBestStreak) {
          newBestStreak = newStreak;
        }

        // Set streak start date if not set
        if (!streakStartDate) {
          streakStartDate = today;
        }

      } else if (status === 'almost') {
        // Streak stays the same (grace)
        checkInStatus = 'completed';
        toast({
          title: 'Close call! 💪',
          description: 'Streak preserved. Stay strong tomorrow.',
        });

      } else if (status === 'failed') {
        // Reset streak
        const oldStreak = goal.streak;
        newStreak = 0;
        lastRelapse = 'Just now';
        streakStartDate = null;
        checkInStatus = 'missed';

        toast({
          title: 'Streak reset',
          description: `Previous best: ${newBestStreak} days. You'll get there again.`,
          variant: 'destructive',
        });

        // Log relapse event
        await supabase.from('goal_events').insert({
          goal_id: goalId,
          user_id: user.id,
          event_type: 'relapse',
          metadata: { previous_streak: oldStreak },
        });
      }

      // Update the goal
      const { error: updateError } = await supabase
        .from('user_goals')
        .update({
          streak: newStreak,
          best_streak: newBestStreak,
          freeze_tokens: newFreezeTokens,
          last_check_in_date: today,
          check_in_status: checkInStatus,
          last_relapse: lastRelapse,
          streak_start_date: streakStartDate,
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Log check-in event
      await supabase.from('goal_events').insert({
        goal_id: goalId,
        user_id: user.id,
        event_type: 'check_in',
        metadata: { status, new_streak: newStreak },
      });

      return {
        streak: newStreak,
        bestStreak: newBestStreak,
        freezeTokens: newFreezeTokens,
      };
    } catch (error) {
      console.error('Error processing goal check-in:', error);
      toast({
        title: 'Error',
        description: 'Failed to update goal',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Use a freeze token
  const useFreezeToken = async (goalId: string) => {
    if (!user) return false;

    try {
      const { data: goal, error: fetchError } = await supabase
        .from('user_goals')
        .select('freeze_tokens, streak')
        .eq('id', goalId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !goal) throw fetchError || new Error('Goal not found');

      if ((goal.freeze_tokens || 0) <= 0) {
        toast({
          title: 'No freeze tokens',
          description: 'Earn tokens by maintaining a 7-day streak.',
          variant: 'destructive',
        });
        return false;
      }

      const today = new Date().toISOString().split('T')[0];

      const { error: updateError } = await supabase
        .from('user_goals')
        .update({
          freeze_tokens: goal.freeze_tokens - 1,
          last_check_in_date: today,
          check_in_status: 'frozen',
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Log freeze event
      await supabase.from('goal_events').insert({
        goal_id: goalId,
        user_id: user.id,
        event_type: 'freeze_used',
        metadata: { streak_preserved: goal.streak },
      });

      toast({
        title: '🧊 Streak Frozen!',
        description: `Day preserved. ${goal.freeze_tokens - 1} tokens remaining.`,
      });

      return true;
    } catch (error) {
      console.error('Error using freeze token:', error);
      return false;
    }
  };

  // Check if goals need attention (missed check-ins)
  const checkMissedCheckIns = async () => {
    if (!user) return [];

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: goals, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .or(`last_check_in_date.is.null,last_check_in_date.lt.${yesterdayStr}`);

      if (error) throw error;

      return goals || [];
    } catch (error) {
      console.error('Error checking missed check-ins:', error);
      return [];
    }
  };

  return {
    processGoalCheckIn,
    useFreezeToken,
    checkMissedCheckIns,
  };
};
