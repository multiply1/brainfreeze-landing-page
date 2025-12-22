import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  goal_id: string;
  title: string;
  type: string;
  streak: number;
  last_relapse: string | null;
  icon: string;
  color: string;
  reason: string | null;
  target: string | null;
  status: string;
}

const LOCALSTORAGE_KEY = 'brainfreeze_goals';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch goals from database
  const fetchGoals = async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check for localStorage migration
      const localGoals = localStorage.getItem(LOCALSTORAGE_KEY);
      if (localGoals && (!data || data.length === 0)) {
        const parsedGoals = JSON.parse(localGoals);
        if (parsedGoals.length > 0) {
          // Migrate localStorage goals to database
          for (const goal of parsedGoals) {
            await createGoal({
              goal_id: goal.id?.toString() || `migrated_${Date.now()}`,
              title: goal.title,
              type: goal.type || 'avoid',
              streak: goal.streak || 0,
              last_relapse: goal.lastRelapse || null,
              icon: goal.icon?.name || 'Target',
              color: goal.color || 'text-cyan-400',
              reason: goal.reason || null,
              target: goal.target || null,
            });
          }
          localStorage.removeItem(LOCALSTORAGE_KEY);
          toast({
            title: 'Goals migrated',
            description: 'Your existing goals have been saved to your account.',
          });
          // Refetch after migration
          const { data: newData } = await supabase
            .from('user_goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          setGoals((newData as Goal[]) || []);
          setLoading(false);
          return;
        }
      }

      setGoals((data as Goal[]) || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load goals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new goal
  const createGoal = async (goal: Omit<Goal, 'id' | 'status'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          goal_id: goal.goal_id,
          title: goal.title,
          type: goal.type,
          streak: goal.streak,
          last_relapse: goal.last_relapse,
          icon: goal.icon,
          color: goal.color,
          reason: goal.reason,
          target: goal.target,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      setGoals((prev) => [data as Goal, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create goal',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Update a goal
  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
      );
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update goal',
        variant: 'destructive',
      });
    }
  };

  // Delete a goal
  const deleteGoal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete goal',
        variant: 'destructive',
      });
    }
  };

  // Reset goal streak
  const resetStreak = async (id: string) => {
    await updateGoal(id, {
      streak: 0,
      last_relapse: 'Just now',
    });
  };

  useEffect(() => {
    fetchGoals();
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    resetStreak,
    refetch: fetchGoals,
  };
};
