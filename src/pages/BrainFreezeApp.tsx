import React, { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals, Goal } from '@/hooks/useGoals';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { useStreakLogic } from '@/hooks/useStreakLogic';
import { OnboardingFlow, OnboardingData } from '@/components/onboarding/OnboardingFlow';
import { DailyCheckInModal, CheckInData } from '@/components/checkin/DailyCheckInModal';
import logo from '@/assets/logo.png';
import {
  Wind, Zap, Home, Activity, Droplets, Moon,
  BarChart2, User, LayoutGrid, Target, LogOut,
  Snowflake, AlertCircle, Menu, Frown, Meh, Smile,
  ArrowRight, Settings, Plus, X, Trash2, Clock,
  Award, Smartphone, EyeOff, Utensils, Brain, CloudFog,
  BatteryCharging, BedDouble, Dumbbell, BookOpen, Ban, Cigarette,
  Check, TrendingUp, Calendar, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- UTILS & DATA ---

const SOUNDSCAPES = [
  { id: 1, name: 'Cold Wind', desc: 'Arctic, steady wind.', icon: Wind, color: 'text-cyan-200' },
  { id: 2, name: 'Deep Ice Drone', desc: 'Low grounding hum.', icon: Activity, color: 'text-blue-400' },
  { id: 3, name: 'Glacial Bells', desc: 'Bright ice chimes.', icon: Zap, color: 'text-white' },
  { id: 4, name: 'Frozen River', desc: 'Flowing water.', icon: Droplets, color: 'text-cyan-500' },
  { id: 5, name: 'Night Freeze', desc: 'Dark ambient.', icon: Moon, color: 'text-indigo-400' },
];

const TECHNIQUES = [
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    desc: 'Calming technique',
    duration: '60s',
    seconds: 60,
    icon: Wind,
    color: 'text-cyan-300',
    bg: 'bg-cyan-950/30',
    border: 'border-cyan-500/30',
    steps: ['Breathe in (4s)', 'Hold (4s)', 'Breathe out (4s)', 'Hold (4s)']
  },
  {
    id: 'cold-splash',
    title: 'Cold Splash',
    desc: 'Instant reset',
    duration: '2 min',
    seconds: 120,
    icon: Droplets,
    color: 'text-blue-300',
    bg: 'bg-blue-950/30',
    border: 'border-blue-500/30',
    steps: ['Fill bowl with ice water', 'Hold breath', 'Submerge face 30s']
  }
];

const SITUATIONS = [
  { id: 'panic', title: 'Panic / Anxiety', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-950/20', border: 'border-red-500/30' },
  { id: 'focus', title: 'Get to Work (5min)', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-950/20', border: 'border-yellow-500/30' },
  { id: 'sleep', title: 'Before Bed', icon: BedDouble, color: 'text-indigo-400', bg: 'bg-indigo-950/20', border: 'border-indigo-500/30' },
  { id: 'urge', title: 'Social / Dopamine Urge', icon: Smartphone, color: 'text-pink-400', bg: 'bg-pink-950/20', border: 'border-pink-500/30' },
  { id: 'racing', title: 'Racing Thoughts', icon: Brain, color: 'text-purple-400', bg: 'bg-purple-950/20', border: 'border-purple-500/30' },
  { id: 'low', title: 'Low Mood / Empty', icon: BatteryCharging, color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-600/30' },
  { id: 'foggy', title: 'Brain Fog / Unclear', icon: CloudFog, color: 'text-cyan-400', bg: 'bg-cyan-950/20', border: 'border-cyan-500/30' },
];

const GOAL_TEMPLATES = [
  { id: 'porn', title: "Quit Porn", icon: EyeOff, color: "text-red-400", bg: "bg-red-900/20", border: "border-red-500/30" },
  { id: 'sugar', title: "No Sugar", icon: Ban, color: "text-orange-400", bg: "bg-orange-900/20", border: "border-orange-500/30" },
  { id: 'shower', title: "Cold Shower", icon: Snowflake, color: "text-cyan-400", bg: "bg-cyan-900/20", border: "border-cyan-500/30" },
  { id: 'scroll', title: "No Doomscrolling", icon: Smartphone, color: "text-purple-400", bg: "bg-purple-900/20", border: "border-purple-500/30" },
  { id: 'smoke', title: "Quit Smoking", icon: Cigarette, color: "text-gray-400", bg: "bg-gray-800/50", border: "border-gray-600/30" },
  { id: 'other', title: "Custom Goal", icon: Target, color: "text-green-400", bg: "bg-green-900/20", border: "border-green-500/30" },
];

const IMPULSE_TYPES = [
  { id: 'scroll', label: 'Doomscrolling', icon: Smartphone },
  { id: 'snack', label: 'Junk Food', icon: Utensils },
  { id: 'procrastination', label: 'Procrastination', icon: Clock },
  { id: 'content', label: 'Adult Content', icon: EyeOff },
];

const REPLACEMENT_HABITS = [
  { id: 'pushups', label: '10 Pushups', icon: Dumbbell },
  { id: 'deepwork', label: '5min Deep Work', icon: Zap },
  { id: 'read', label: 'Read a Page', icon: BookOpen },
];

// Icon mapping for database storage
const ICON_MAP: Record<string, any> = {
  EyeOff, Ban, Snowflake, Smartphone, Cigarette, Target
};

// --- SUB-COMPONENTS ---

const NavigationBar = memo(({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-4 py-3 safe-area-pb lg:left-auto lg:right-auto lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:w-20 lg:rounded-2xl lg:border lg:border-slate-700 lg:ml-4 lg:flex-col lg:py-6">
    <div className="max-w-md mx-auto flex justify-around items-center lg:flex-col lg:gap-6">
      <NavButton tab="home" current={activeTab} set={setActiveTab} icon={Home} label="Home" />
      <NavButton tab="insights" current={activeTab} set={setActiveTab} icon={BarChart2} label="Insights" />
      <NavButton tab="tools" current={activeTab} set={setActiveTab} icon={Zap} label="Tools" />
      <NavButton tab="goals" current={activeTab} set={setActiveTab} icon={Target} label="Goals" />
      <NavButton tab="settings" current={activeTab} set={setActiveTab} icon={Settings} label="Settings" />
    </div>
  </nav>
));

const NavButton = ({ tab, current, set, icon: Icon, label }: any) => {
  const isActive = current === tab;
  return (
    <button
      onClick={() => set(tab)}
      className={`flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-1 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400 hover:text-white'}`}
    >
      <Icon size={20} />
      <span className="text-xs">{label}</span>
    </button>
  );
};

// --- MAIN COMPONENT ---

export default function BrainFreezeApp() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { goals, loading: goalsLoading, createGoal, resetStreak, refetch: refetchGoals } = useGoals();
  const { preferences, loading: prefsLoading, needsOnboarding, createPreferences, completeOnboarding } = useUserPreferences();
  const { todayLog, hasCheckedInToday, checkInStreak, createOrUpdateTodayLog, logs } = useDailyLogs();
  const { processGoalCheckIn } = useStreakLogic();

  const [activeTab, setActiveTab] = useState('home');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [modals, setModals] = useState({
    goalCreator: false,
    resetConfirm: false
  });

  const [freezeFlow, setFreezeFlow] = useState<{ step: string | null; timer: number; technique: typeof TECHNIQUES[0] | null }>({ step: null, timer: 0, technique: null });
  const [goalForm, setGoalForm] = useState<{ template: typeof GOAL_TEMPLATES[0] | null; reason: string; target: string }>({ template: null, reason: "", target: "" });

  // Check if onboarding needed
  useEffect(() => {
    if (!prefsLoading && needsOnboarding) {
      setShowOnboarding(true);
    }
  }, [prefsLoading, needsOnboarding]);

  // Prompt for check-in if not done today
  useEffect(() => {
    if (!prefsLoading && !needsOnboarding && !hasCheckedInToday && goals.length > 0) {
      // Small delay to avoid immediate popup
      const timer = setTimeout(() => {
        setShowCheckIn(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [prefsLoading, needsOnboarding, hasCheckedInToday, goals.length]);

  const toggleModal = (key: keyof typeof modals, value: boolean) => {
    setModals(prev => ({ ...prev, [key]: value }));
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    await createPreferences({
      primary_motivation: data.primaryMotivation,
      risk_times: data.riskTimes,
      preferred_check_in_time: data.preferredCheckInTime,
      onboarding_completed: true,
    });

    // Create goals from selected templates
    for (const goalId of data.selectedGoals) {
      const template = GOAL_TEMPLATES.find(t => t.id === goalId);
      if (template) {
        await createGoal({
          goal_id: template.id,
          title: template.title,
          type: 'avoid',
          streak: 0,
          last_relapse: null,
          icon: template.icon.name || 'Target',
          color: template.color,
          reason: data.primaryMotivation,
          target: null,
        });
      }
    }

    setShowOnboarding(false);
    refetchGoals();
  };

  const handleCheckInComplete = async (data: CheckInData) => {
    // Save daily log
    await createOrUpdateTodayLog({
      mood_score: data.moodScore,
      energy_level: data.energyLevel,
      reflection: data.reflection,
    });

    // Process each goal status
    for (const goalStatus of data.goalStatuses) {
      await processGoalCheckIn(goalStatus.goalId, goalStatus.status);
    }

    setShowCheckIn(false);
    refetchGoals();
  };

  const startIntervention = () => {
    setFreezeFlow(prev => ({ ...prev, step: 'intervention', timer: prev.technique?.seconds || 60 }));
  };

  const skipTimer = () => {
    setFreezeFlow(prev => ({ ...prev, step: 'replacement' }));
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (freezeFlow.step === 'intervention' && freezeFlow.timer > 0) {
      interval = setInterval(() => {
        setFreezeFlow(prev => {
          if (prev.timer <= 1) return { ...prev, step: 'replacement', timer: 0 };
          return { ...prev, timer: prev.timer - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [freezeFlow.step, freezeFlow.timer]);

  const openGoalCreator = (template: typeof GOAL_TEMPLATES[0]) => {
    setGoalForm({ template, reason: "", target: "" });
    toggleModal('goalCreator', true);
  };

  const saveNewGoal = async () => {
    if (!goalForm.template) return;
    await createGoal({
      goal_id: goalForm.template.id,
      title: goalForm.template.title,
      type: 'avoid',
      streak: 0,
      last_relapse: "Just started",
      icon: goalForm.template.icon.name || 'Target',
      color: goalForm.template.color,
      reason: goalForm.reason || null,
      target: goalForm.target || null,
    });
    toggleModal('goalCreator', false);
    setActiveTab('goals');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Map database goals to display format
  const displayGoals = goals.map(g => ({
    ...g,
    icon: ICON_MAP[g.icon] || Target,
    lastRelapse: g.last_relapse,
  }));

  // Calculate total streak from all goals
  const totalStreak = goals.reduce((max, g) => Math.max(max, g.streak), 0);
  const bestStreak = goals.reduce((max, g) => Math.max(max, (g as any).best_streak || g.streak), 0);
  const todayProgress = hasCheckedInToday ? 100 : goals.length > 0 ? 0 : 50;

  // Show onboarding if needed
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen font-sans text-white" style={{ background: 'var(--gradient-hero)' }}>
      {/* App Header - Logo only */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src={logo} 
              alt="BrainFreeze Logo" 
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" 
            />
            <div className="text-xl lg:text-2xl font-bold tracking-wide leading-tight">
              <span className="text-white">Brain</span>
              <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Freeze</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {/* Check-in indicator */}
            {hasCheckedInToday ? (
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                <Check size={14} /> Checked in
              </span>
            ) : goals.length > 0 && (
              <button
                onClick={() => setShowCheckIn(true)}
                className="flex items-center gap-1 text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full animate-pulse hover:bg-cyan-500/20 transition-colors"
              >
                <Snowflake size={14} /> Check in
              </button>
            )}
            <span className="text-sm text-slate-400 hidden sm:block">{user?.email}</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT AREA - Desktop optimized */}
      <main className="pt-20 pb-24 px-4 lg:pl-28 lg:pr-8 lg:pb-8 max-w-7xl mx-auto overflow-y-auto min-h-screen">
        {activeTab === 'home' && (
          <HomeView
            streak={{ current: totalStreak, best: bestStreak, todayProgress }}
            hasCheckedInToday={hasCheckedInToday}
            checkInStreak={checkInStreak}
            onCheckIn={() => setShowCheckIn(true)}
            goals={displayGoals}
            openGoalCreator={openGoalCreator}
            loading={goalsLoading}
            logs={logs}
          />
        )}

        {activeTab === 'insights' && <InsightsView goals={displayGoals} logs={logs} checkInStreak={checkInStreak} />}

        {activeTab === 'tools' && (
          <ToolsView
            startSituation={() => setFreezeFlow({ step: 'checkin', timer: 0, technique: TECHNIQUES[0] })}
          />
        )}

        {activeTab === 'goals' && <GoalsView goals={displayGoals} loading={goalsLoading} onReset={resetStreak} />}

        {activeTab === 'settings' && (
          <SettingsView
            email={user?.email || ''}
            preferences={preferences}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {showCheckIn && goals.length > 0 && (
          <DailyCheckInModal
            onClose={() => setShowCheckIn(false)}
            onComplete={handleCheckInComplete}
            goals={goals}
          />
        )}
      </AnimatePresence>

      {freezeFlow.step && (
        <FreezeFlowOverlay
          step={freezeFlow.step}
          technique={freezeFlow.technique!}
          timer={freezeFlow.timer}
          onClose={() => setFreezeFlow({ step: null, timer: 0, technique: null })}
          onStartIntervention={startIntervention}
          onSkipTimer={skipTimer}
          onFinish={() => setFreezeFlow({ step: null, timer: 0, technique: null })}
        />
      )}

      {modals.goalCreator && goalForm.template && (
        <GoalCreationModal
          template={goalForm.template}
          form={goalForm}
          setForm={setGoalForm}
          onClose={() => toggleModal('goalCreator', false)}
          onSave={saveNewGoal}
        />
      )}

      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// --- VIEW COMPONENTS ---

const HomeView = ({ streak, hasCheckedInToday, checkInStreak, onCheckIn, goals, openGoalCreator, loading, logs }: any) => (
  <div className="space-y-8 max-w-5xl mx-auto">
    {/* Check-in CTA if not done */}
    {!hasCheckedInToday && goals.length > 0 && (
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onCheckIn}
        className="w-full p-6 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-between group hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <Snowflake className="text-cyan-400" size={24} />
          </div>
          <div className="text-left">
            <p className="font-bold text-white">Daily Check-in</p>
            <p className="text-sm text-slate-400">How did you do today?</p>
          </div>
        </div>
        <ArrowRight className="text-cyan-400 group-hover:translate-x-1 transition-transform" size={24} />
      </motion.button>
    )}

    {/* Desktop grid layout */}
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      {/* Left column */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-bold text-white">Daily Overview</h2>
          <span className="text-sm text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
        </div>

        {/* Streak Card - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8 rounded-3xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex items-center gap-8">
            <div>
              <p className="text-6xl lg:text-7xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">{streak.current}</p>
              <p className="text-slate-400 font-medium mt-1">Day Streak</p>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="text-orange-400" size={16} />
                <p className="text-sm text-slate-300">Best: {streak.best} days</p>
              </div>
              <div className="h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${streak.todayProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full" 
                />
              </div>
              <p className="text-xs text-slate-500">
                {hasCheckedInToday ? '✅ Checked in today' : '⏳ Waiting for check-in'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Check-in Streak Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/40 backdrop-blur-xl flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
            <Calendar className="text-green-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white">{checkInStreak} Day Check-in Streak</p>
            <p className="text-xs text-slate-400">Keep logging daily for rewards</p>
          </div>
          {checkInStreak >= 7 && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">🧊 Freeze Token</span>
          )}
        </motion.div>
      </div>

      {/* Right column - Goals */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4 mt-8 lg:mt-0"
      >
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-white">Your Goals</h3>
          <span className="text-sm text-slate-400">{goals.length} active</span>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">Start your first goal:</p>
            <div className="grid grid-cols-2 gap-3">
              {GOAL_TEMPLATES.slice(0, 4).map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openGoalCreator(template)}
                  className={`p-4 rounded-xl border cursor-pointer bg-slate-900/60 backdrop-blur-lg hover:bg-slate-800/60 ${template.border} flex items-center gap-3`}
                >
                  <template.icon className={template.color} size={20} />
                  <span className="text-sm font-medium text-white">{template.title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.slice(0, 3).map((goal: any) => {
              const IconComponent = goal.icon;
              return (
                <motion.div
                  key={goal.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-4"
                >
                  <div className={`p-2.5 rounded-lg bg-slate-800 ${goal.color}`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white text-sm">{goal.title}</p>
                    <p className="text-xs text-slate-500">{goal.lastRelapse || 'Just started'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-cyan-400">{goal.streak}</p>
                    <p className="text-xs text-slate-500">days</p>
                  </div>
                </motion.div>
              );
            })}
            {goals.length > 3 && (
              <p className="text-center text-sm text-slate-500">+{goals.length - 3} more goals</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  </div>
);

const InsightsView = ({ goals, logs, checkInStreak }: any) => {
  // Calculate stats
  const totalDaysTracked = logs.length;
  const avgMood = logs.length > 0 
    ? (logs.reduce((sum: number, l: any) => sum + (l.mood_score || 0), 0) / logs.length).toFixed(1)
    : 0;
  const bestStreak = goals.reduce((max: number, g: any) => Math.max(max, g.best_streak || g.streak), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-bold text-white">Insights</h2>
        <span className="text-sm text-slate-400">Your Progress</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Days Tracked" value={totalDaysTracked} color="text-cyan-400" />
        <StatCard icon={Flame} label="Best Streak" value={`${bestStreak} days`} color="text-orange-400" />
        <StatCard icon={TrendingUp} label="Check-in Streak" value={`${checkInStreak} days`} color="text-green-400" />
        <StatCard icon={Smile} label="Avg Mood" value={`${avgMood}/5`} color="text-yellow-400" />
      </div>

      {/* Goals Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Goal Progress</h3>
        {goals.length === 0 ? (
          <p className="text-slate-400">No goals yet. Start one to see insights!</p>
        ) : (
          <div className="space-y-3">
            {goals.map((goal: any) => {
              const IconComponent = goal.icon;
              const progress = goal.target ? Math.min(100, (goal.streak / parseInt(goal.target)) * 100) : (goal.streak / 30) * 100;
              return (
                <div key={goal.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-slate-800 ${goal.color}`}>
                      <IconComponent size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{goal.title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-cyan-400 font-bold">{goal.streak}</span>
                      <span className="text-slate-500 text-sm"> / {goal.target || 30}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Check-ins */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Recent Check-ins</h3>
        {logs.length === 0 ? (
          <p className="text-slate-400">No check-ins yet.</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 7).map((log: any) => (
              <div key={log.id} className="p-3 rounded-lg bg-slate-900/30 border border-slate-800 flex items-center gap-3">
                <MoodIcon score={log.mood_score} />
                <div className="flex-1">
                  <p className="text-sm text-white">{new Date(log.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  {log.reflection && <p className="text-xs text-slate-500 truncate">{log.reflection}</p>}
                </div>
                <span className="text-xs text-slate-500">{log.energy_level}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
    <Icon className={`${color} mb-2`} size={24} />
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-slate-500">{label}</p>
  </div>
);

const MoodIcon = ({ score }: { score: number }) => {
  if (score >= 4) return <Smile className="text-green-400" size={20} />;
  if (score >= 3) return <Meh className="text-yellow-400" size={20} />;
  return <Frown className="text-red-400" size={20} />;
};

const ToolsView = ({ startSituation }: any) => (
  <div className="space-y-8">
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white">Situation?</h2>
        <p className="text-slate-400">Choose a card to start.</p>
      </div>
      <div className="space-y-3">
        {SITUATIONS.map((sit) => (
          <button key={sit.id} onClick={startSituation} className={`w-full p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-4 ${sit.bg} ${sit.border}`}>
            <sit.icon className={sit.color} size={28} />
            <div className="text-left">
              <p className="font-bold text-white">{sit.title}</p>
              <p className="text-xs text-slate-400">Start freeze flow</p>
            </div>
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Soundscapes</h3>
      <div className="grid grid-cols-2 gap-3">
        {SOUNDSCAPES.map((s) => (
          <button key={s.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3 hover:border-cyan-500/30 transition-all">
            <s.icon className={s.color} size={20} />
            <span className="text-sm text-white">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const GoalsView = ({ goals, loading, onReset }: any) => (
  <div className="space-y-6">
    <div className="flex items-baseline justify-between">
      <h2 className="text-2xl font-bold text-white">Goals</h2>
      <span className="text-sm text-slate-400">Active Commitments</span>
    </div>

    {loading ? (
      <div className="text-center py-12 text-slate-400">Loading goals...</div>
    ) : goals.length === 0 ? (
      <div className="text-center py-12">
        <Target className="mx-auto mb-4 text-slate-600" size={48} />
        <p className="text-slate-400">No goals yet. Start one from the Home tab!</p>
      </div>
    ) : (
      <div className="space-y-4">
        {goals.map((goal: any) => {
          const IconComponent = goal.icon;
          const freezeTokens = (goal as any).freeze_tokens || 0;
          return (
            <div key={goal.id} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-lg">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full bg-slate-800 ${goal.color}`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{goal.title}</h3>
                  {goal.reason && <p className="text-sm text-slate-400 mt-1">{goal.reason}</p>}
                  {freezeTokens > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: freezeTokens }).map((_, i) => (
                        <Snowflake key={i} className="text-cyan-400" size={14} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">{freezeTokens} freeze tokens</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-cyan-400">{goal.streak}</p>
                  <p className="text-xs text-slate-500">Days</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">Last: {goal.lastRelapse || 'Never'}</span>
                <button onClick={() => onReset(goal.id)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <Trash2 size={14} /> Reset
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const SettingsView = ({ email, preferences, onLogout }: any) => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-white">Settings</h2>

    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
      <h3 className="font-bold text-white mb-2">Account</h3>
      <p className="text-slate-400">{email}</p>
    </div>

    {preferences && (
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white">Preferences</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Check-in time</span>
            <span className="text-white">{preferences.preferred_check_in_time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Risk times</span>
            <span className="text-white">{preferences.risk_times?.join(', ') || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Notifications</span>
            <span className="text-white">{preferences.notification_enabled ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    )}

    {preferences?.primary_motivation && (
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
        <h3 className="font-bold text-white mb-2">Your Motivation</h3>
        <p className="text-slate-400 text-sm italic">"{preferences.primary_motivation}"</p>
      </div>
    )}

    <button onClick={onLogout} className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
      <LogOut size={20} />
      Sign Out
    </button>
  </div>
);

// --- MODAL COMPONENTS ---

const GoalCreationModal = ({ template, form, setForm, onClose, onSave }: any) => (
  <div className="fixed inset-0 z-[60] flex flex-col bg-[#0B1120] text-white p-6">
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full bg-slate-900 ${template.color}`}><template.icon size={24} /></div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">New Goal</p>
          <h2 className="text-xl font-bold">{template.title}</h2>
        </div>
      </div>
      <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={20} /></button>
    </div>
    <div className="flex-1 space-y-8 overflow-y-auto pb-4">
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Why?</label>
        <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="My reason is..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 h-28 resize-none" />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Target (days)?</label>
        <input type="text" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="e.g., 30" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500" />
      </div>
    </div>
    <button onClick={onSave} disabled={!form.reason} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold disabled:opacity-50 mb-6 shadow-lg">Commit</button>
  </div>
);

const FreezeFlowOverlay = ({ step, technique, timer, onClose, onStartIntervention, onSkipTimer, onFinish }: any) => (
  <div className="fixed inset-0 z-[60] flex flex-col bg-[#0B1120] text-white p-6">
    <div className="absolute top-6 right-6"><button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={20} /></button></div>
    {step === 'checkin' && (
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <h2 className="text-3xl font-bold text-center">Emergency Reset</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {IMPULSE_TYPES.map((imp) => (
            <button key={imp.id} onClick={onStartIntervention} className="p-4 rounded-xl border border-slate-800 bg-slate-900 hover:border-cyan-500 flex flex-col items-center gap-2 w-28">
              <imp.icon className="text-slate-400" size={24} />
              <span className="text-xs text-center">{imp.label}</span>
            </button>
          ))}
        </div>
      </div>
    )}
    {step === 'intervention' && technique && (
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
        <h2 className="text-2xl font-bold">{technique.title}</h2>
        <div className="text-6xl font-mono text-cyan-400">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
        <div className="space-y-2">{technique.steps.map((s: string, i: number) => <p key={i} className="text-slate-400">{s}</p>)}</div>
        <button onClick={onSkipTimer} className="text-slate-500 underline">Skip</button>
      </div>
    )}
    {step === 'replacement' && (
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <h2 className="text-2xl font-bold text-center">Do this instead</h2>
        {REPLACEMENT_HABITS.map(h => (
          <button key={h.id} onClick={onFinish} className="p-4 bg-slate-800 rounded-xl flex items-center gap-4 hover:bg-slate-700">
            <h.icon className="text-cyan-400" size={24} />
            <span className="text-lg">{h.label}</span>
          </button>
        ))}
      </div>
    )}
  </div>
);
