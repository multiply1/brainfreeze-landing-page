-- User preferences table (learned patterns, timezone, notification settings)
CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timezone TEXT DEFAULT 'Europe/Helsinki',
    preferred_check_in_time TIME DEFAULT '20:00',
    risk_times TEXT[] DEFAULT ARRAY['evening'],
    notification_enabled BOOLEAN DEFAULT true,
    onboarding_completed BOOLEAN DEFAULT false,
    primary_motivation TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Daily logs table (check-ins)
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
    energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
    reflection TEXT,
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, log_date)
);

-- Goal events table (event sourcing for goals)
CREATE TABLE public.goal_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.user_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('check_in', 'relapse', 'freeze_used', 'streak_milestone', 'goal_created', 'goal_updated')),
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to user_goals for enhanced streak logic
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS freeze_tokens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_start_date DATE,
ADD COLUMN IF NOT EXISTS last_check_in_date DATE,
ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS check_in_status TEXT DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'completed', 'missed', 'frozen'));

-- Enable RLS on new tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.user_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for daily_logs
CREATE POLICY "Users can view their own logs"
ON public.daily_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
ON public.daily_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
ON public.daily_logs FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for goal_events
CREATE POLICY "Users can view their own goal events"
ON public.goal_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal events"
ON public.goal_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for performance
CREATE INDEX idx_daily_logs_user_date ON public.daily_logs(user_id, log_date);
CREATE INDEX idx_goal_events_goal_date ON public.goal_events(goal_id, event_date);
CREATE INDEX idx_goal_events_user_date ON public.goal_events(user_id, event_date);