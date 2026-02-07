import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPreferences {
  id: string;
  user_id: string;
  timezone: string;
  preferred_check_in_time: string;
  risk_times: string[];
  notification_enabled: boolean;
  onboarding_completed: boolean;
  primary_motivation: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPreferences = async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setPreferences(data as UserPreferences | null);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPreferences = async (prefs: Partial<UserPreferences>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          ...prefs,
        })
        .select()
        .single();

      if (error) throw error;
      setPreferences(data as UserPreferences);
      return data;
    } catch (error) {
      console.error('Error creating preferences:', error);
      return null;
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const completeOnboarding = async () => {
    await updatePreferences({ onboarding_completed: true });
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  return {
    preferences,
    loading,
    needsOnboarding: !loading && !preferences?.onboarding_completed,
    createPreferences,
    updatePreferences,
    completeOnboarding,
    refetch: fetchPreferences,
  };
};
