import React, { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals, Goal } from '@/hooks/useGoals';
import { Navbar } from '@/components/Navbar';
import {
  Wind, Zap, Home, Activity, Droplets, Moon,
  BarChart2, User, LayoutGrid, Target, LogOut,
  Snowflake, AlertCircle, Menu, Frown, Meh, Smile,
  ArrowRight, Settings, Plus, X, Trash2, Clock,
  Award, Smartphone, EyeOff, Utensils, Brain, CloudFog,
  BatteryCharging, BedDouble, Dumbbell, BookOpen, Ban, Cigarette
} from 'lucide-react';
import { motion } from 'framer-motion';

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

const MOOD_OPTIONS = [
  { value: 'great', label: "Great", icon: Smile, color: "text-green-400" },
  { value: 'okay', label: "Okay", icon: Meh, color: "text-yellow-400" },
  { value: 'struggling', label: "Struggling", icon: Frown, color: "text-red-400" },
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

const CHART_DATA = Array.from({ length: 60 }, (_, i) => {
  let val = 10;
  val += Math.sin(i * 0.2) * 5 + i * 0.5 + Math.random() * 5;
  return Math.max(5, val);
});

// Icon mapping for database storage
const ICON_MAP: Record<string, any> = {
  EyeOff, Ban, Snowflake, Smartphone, Cigarette, Target
};

// --- SUB-COMPONENTS ---

const NavigationBar = memo(({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 px-4 py-3 safe-area-pb">
    <div className="max-w-md mx-auto flex justify-around items-center">
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
  const { goals, loading: goalsLoading, createGoal, resetStreak } = useGoals();

  const [activeTab, setActiveTab] = useState('home');
  const [streak] = useState({ current: 12, best: 15, todayProgress: 75 });
  const [dailyLogs, setDailyLogs] = useState([{ id: 1, time: '08:30', mood: 'great', note: 'Good sleep.' }]);

  const [modals, setModals] = useState({
    logging: false,
    goalCreator: false,
    redlight: false,
    resetConfirm: false
  });

  const [freezeFlow, setFreezeFlow] = useState<{ step: string | null; timer: number; technique: typeof TECHNIQUES[0] | null }>({ step: null, timer: 0, technique: null });
  const [goalForm, setGoalForm] = useState<{ template: typeof GOAL_TEMPLATES[0] | null; reason: string; target: string }>({ template: null, reason: "", target: "" });
  const [logForm, setLogForm] = useState<{ mood: string | null; note: string }>({ mood: null, note: "" });

  const toggleModal = (key: keyof typeof modals, value: boolean) => {
    setModals(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveLog = () => {
    if (!logForm.mood) return;
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: logForm.mood,
      note: logForm.note
    };
    setDailyLogs(prev => [newLog, ...prev]);
    setLogForm({ mood: null, note: "" });
    toggleModal('logging', false);
  };

  const startIntervention = () => {
    setFreezeFlow(prev => ({ ...prev, step: 'intervention', timer: prev.technique?.seconds || 60 }));
  };

  const skipTimer = () => {
    setFreezeFlow(prev => ({ ...prev, step: 'replacement' }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
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

  return (
    <div className="min-h-screen font-sans text-white" style={{ background: 'var(--gradient-hero)' }}>
      <Navbar />

      {/* CONTENT AREA */}
      <main className="pt-24 pb-24 px-4 max-w-md mx-auto overflow-y-auto min-h-screen">
        {activeTab === 'home' && (
          <HomeView
            streak={streak}
            dailyLogs={dailyLogs}
            startFreezeFlow={() => setFreezeFlow({ step: 'checkin', timer: 0, technique: TECHNIQUES[0] })}
            toggleLogging={() => toggleModal('logging', true)}
            goals={displayGoals}
            openGoalCreator={openGoalCreator}
            loading={goalsLoading}
          />
        )}

        {activeTab === 'insights' && <InsightsView logs={dailyLogs} />}

        {activeTab === 'tools' && (
          <ToolsView
            startSituation={() => setFreezeFlow({ step: 'checkin', timer: 0, technique: TECHNIQUES[0] })}
            startRedlight={() => toggleModal('redlight', true)}
          />
        )}

        {activeTab === 'goals' && <GoalsView goals={displayGoals} loading={goalsLoading} onReset={resetStreak} />}

        {activeTab === 'settings' && (
          <SettingsView
            email={user?.email || ''}
            onReset={() => toggleModal('resetConfirm', true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* MODALS */}
      {modals.logging && (
        <LoggingModal
          onClose={() => toggleModal('logging', false)}
          form={logForm}
          setForm={setLogForm}
          onSave={handleSaveLog}
        />
      )}

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

const HomeView = ({ streak, dailyLogs, startFreezeFlow, toggleLogging, goals, openGoalCreator, loading }: any) => (
  <div className="space-y-8">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={startFreezeFlow}
      className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold text-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3"
    >
      <Snowflake className="animate-pulse" />
      FREEZE NOW
    </motion.button>

    <div className="flex items-baseline justify-between">
      <h2 className="text-lg font-bold text-white">Daily Overview</h2>
      <span className="text-sm text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
    </div>

    <div className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20 backdrop-blur-lg">
      <p className="text-5xl font-bold text-cyan-400">{streak.current}</p>
      <p className="text-slate-400">Day Streak</p>
      <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${streak.todayProgress}%` }} />
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Start a New Goal</h3>
      {loading ? (
        <div className="text-center py-8 text-slate-400">Loading goals...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {GOAL_TEMPLATES.map(template => {
            const isActive = goals.some((g: any) => g.goal_id === template.id);
            return (
              <button
                key={template.id}
                onClick={() => !isActive && openGoalCreator(template)}
                className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 backdrop-blur-lg relative overflow-hidden ${isActive ? 'bg-slate-900/30 border-green-500/30 opacity-60 pointer-events-none' : `cursor-pointer hover:scale-[1.02] active:scale-95 ${template.bg} ${template.border}`}`}
              >
                <div className="flex items-center justify-between">
                  <template.icon className={template.color} size={24} />
                  {isActive && <span className="text-xs text-green-400 font-medium">Active</span>}
                </div>
                <span className="text-sm font-medium text-white">{template.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>

    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Daily Check-ins</h3>
          <p className="text-sm text-slate-400">Track your mood 3x / day</p>
        </div>
        <span className="text-cyan-400 font-bold">{dailyLogs.length}/3</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((index) => {
          const log = dailyLogs[index];
          const isLocked = index > dailyLogs.length;
          return (
            <button
              key={index}
              onClick={() => !log && !isLocked && toggleLogging()}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all backdrop-blur-sm ${log ? 'bg-slate-800 border border-cyan-500/30 text-cyan-400' : isLocked ? 'bg-slate-900/30 border border-slate-800 text-slate-700' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-cyan-500/50 hover:text-white cursor-pointer'}`}
            >
              {log ? (
                <>
                  {log.mood === 'great' && <Smile size={24} />}
                  {log.mood === 'okay' && <Meh size={24} />}
                  {log.mood === 'struggling' && <Frown size={24} />}
                  <span className="text-xs">{log.time}</span>
                </>
              ) : isLocked ? <Clock size={24} /> : <Plus size={24} />}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const InsightsView = ({ logs }: any) => (
  <div className="space-y-8">
    <div className="flex items-baseline justify-between">
      <h2 className="text-2xl font-bold text-white">INSIGHTS</h2>
      <span className="text-sm text-slate-400">Performance Metrics</span>
    </div>

    <div className="p-6 rounded-2xl bg-slate-900/50 border border-cyan-500/20 backdrop-blur-lg">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400">Clarity Index CIX</p>
          <p className="text-3xl font-bold text-cyan-400">{CHART_DATA[CHART_DATA.length - 1].toFixed(2)} <span className="text-sm text-green-400">+15.4%</span></p>
        </div>
        <span className="text-xs text-slate-500">24h</span>
      </div>
      <svg viewBox="0 0 300 150" className="w-full h-32">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M 0 150 ${CHART_DATA.map((val, i) => `L ${i * (300 / (CHART_DATA.length - 1))} ${150 - (val / 100) * 150}`).join(' ')} L 300 150 Z`} fill="url(#chartGradient)" />
        <path d={`M 0 ${150 - (CHART_DATA[0] / 100) * 150} ${CHART_DATA.map((val, i) => `L ${i * (300 / (CHART_DATA.length - 1))} ${150 - (val / 100) * 150}`).join(' ')}`} fill="none" stroke="#22d3ee" strokeWidth="2" />
      </svg>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Log History</h3>
      <div className="space-y-3">
        {logs.map((log: any) => (
          <div key={log.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-4">
            {log.mood === 'great' && <Smile className="text-green-400" />}
            {log.mood === 'okay' && <Meh className="text-yellow-400" />}
            {log.mood === 'struggling' && <Frown className="text-red-400" />}
            <div>
              <p className="font-medium text-white capitalize">{log.mood}</p>
              <p className="text-xs text-slate-500">{log.time}</p>
            </div>
            <p className="ml-auto text-sm text-slate-400">"{log.note}"</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
      <h2 className="text-2xl font-bold text-white">GOALS</h2>
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
          return (
            <div key={goal.id} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-lg">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full bg-slate-800 ${goal.color}`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{goal.title}</h3>
                  {goal.reason && <p className="text-sm text-slate-400 mt-1">{goal.reason}</p>}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">{goal.streak}</p>
                  <p className="text-xs text-slate-500">Days Clean</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">Last: {goal.lastRelapse}</span>
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

const SettingsView = ({ email, onLogout }: any) => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-white">Settings</h2>

    <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
      <h3 className="font-bold text-white mb-2">Account</h3>
      <p className="text-slate-400">{email}</p>
    </div>

    <button onClick={onLogout} className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
      <LogOut size={20} />
      Sign Out
    </button>
  </div>
);

// --- MODAL COMPONENTS ---

const LoggingModal = ({ onClose, form, setForm, onSave }: any) => (
  <div className="fixed inset-0 z-[60] flex flex-col bg-[#0B1120] text-white p-6">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-bold">Daily Check-In</h2>
      <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400"><X size={20} /></button>
    </div>
    <div className="flex-1 space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Mood</label>
        <div className="flex gap-3">
          {MOOD_OPTIONS.map((m) => (
            <button key={m.value} onClick={() => setForm({ ...form, mood: m.value })} className={`flex-1 py-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.mood === m.value ? 'bg-slate-800 border-cyan-500 text-white' : 'bg-slate-900/50 border-slate-800 text-slate-500'}`}>
              <m.icon size={28} className={form.mood === m.value ? m.color : ''} />
              <span className="text-sm">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Notes</label>
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Thoughts?" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 h-32 resize-none" />
      </div>
    </div>
    <button onClick={onSave} disabled={!form.mood} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-bold disabled:opacity-50">Save</button>
  </div>
);

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
        <label className="text-sm font-bold text-slate-300 uppercase tracking-wide">Target?</label>
        <input type="text" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="e.g., 30 days" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500" />
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
