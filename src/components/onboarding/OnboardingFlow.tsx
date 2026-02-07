import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Snowflake, ArrowRight, ArrowLeft, Check,
  EyeOff, Ban, Smartphone, Cigarette, Target,
  Sun, Moon, Clock, Zap
} from 'lucide-react';
import logo from '@/assets/logo.png';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  selectedGoals: string[];
  primaryMotivation: string;
  riskTimes: string[];
  preferredCheckInTime: string;
}

const GOAL_OPTIONS = [
  { id: 'porn', title: "Quit Porn", icon: EyeOff, color: "text-red-400", bg: "bg-red-900/30" },
  { id: 'sugar', title: "No Sugar", icon: Ban, color: "text-orange-400", bg: "bg-orange-900/30" },
  { id: 'scroll', title: "No Doomscrolling", icon: Smartphone, color: "text-purple-400", bg: "bg-purple-900/30" },
  { id: 'smoke', title: "Quit Smoking", icon: Cigarette, color: "text-gray-400", bg: "bg-gray-800/50" },
  { id: 'shower', title: "Cold Showers", icon: Snowflake, color: "text-cyan-400", bg: "bg-cyan-900/30" },
  { id: 'other', title: "Custom Goal", icon: Target, color: "text-green-400", bg: "bg-green-900/30" },
];

const RISK_TIME_OPTIONS = [
  { id: 'morning', label: 'Morning', icon: Sun, desc: '6am - 12pm' },
  { id: 'afternoon', label: 'Afternoon', icon: Clock, desc: '12pm - 6pm' },
  { id: 'evening', label: 'Evening', icon: Moon, desc: '6pm - 12am' },
  { id: 'night', label: 'Late Night', icon: Zap, desc: '12am - 6am' },
];

const CHECK_IN_TIMES = [
  { id: '08:00', label: 'Morning', time: '8:00 AM' },
  { id: '12:00', label: 'Noon', time: '12:00 PM' },
  { id: '20:00', label: 'Evening', time: '8:00 PM' },
  { id: '22:00', label: 'Night', time: '10:00 PM' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    selectedGoals: [],
    primaryMotivation: '',
    riskTimes: [],
    preferredCheckInTime: '20:00',
  });

  const steps = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'goals', title: 'Your Challenges' },
    { id: 'motivation', title: 'Your Why' },
    { id: 'risk', title: 'Risk Times' },
    { id: 'checkin', title: 'Check-in Time' },
  ];

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return data.selectedGoals.length > 0;
      case 2: return data.primaryMotivation.length > 10;
      case 3: return data.riskTimes.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === steps.length - 1) {
      onComplete(data);
    } else {
      setStep(s => s + 1);
    }
  };

  const toggleGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(id)
        ? prev.selectedGoals.filter(g => g !== id)
        : [...prev.selectedGoals, id]
    }));
  };

  const toggleRiskTime = (id: string) => {
    setData(prev => ({
      ...prev,
      riskTimes: prev.riskTimes.includes(id)
        ? prev.riskTimes.filter(t => t !== id)
        : [...prev.riskTimes, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1a] text-white flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? 'bg-cyan-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full" />
                <img src={logo} alt="BrainFreeze" className="w-24 h-24 relative z-10" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black">
                  <span className="text-white">Brain</span>
                  <span className="text-cyan-400">Freeze</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-sm">
                  Your mental cold shock therapy for building unbreakable habits.
                </p>
              </div>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>🧊 Track your streaks</p>
                <p>🎯 Set meaningful goals</p>
                <p>💪 Build lasting discipline</p>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">What's your biggest challenge?</h2>
                <p className="text-slate-400">Select 1-3 habits you want to change.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {GOAL_OPTIONS.map((goal) => {
                  const isSelected = data.selectedGoals.includes(goal.id);
                  return (
                    <motion.button
                      key={goal.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleGoal(goal.id)}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${goal.bg}`}>
                        <goal.icon className={goal.color} size={28} />
                      </div>
                      <span className="text-sm font-medium">{goal.title}</span>
                      {isSelected && (
                        <Check className="absolute top-2 right-2 text-cyan-400" size={20} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="motivation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Why do you want to change?</h2>
                <p className="text-slate-400">This will remind you when things get hard.</p>
              </div>
              <textarea
                value={data.primaryMotivation}
                onChange={(e) => setData(prev => ({ ...prev, primaryMotivation: e.target.value }))}
                placeholder="I want to quit because..."
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
              />
              <p className="text-xs text-slate-500 text-center">
                Be honest. This is for you.
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">When do you struggle most?</h2>
                <p className="text-slate-400">We'll send reminders at the right time.</p>
              </div>
              <div className="space-y-3">
                {RISK_TIME_OPTIONS.map((time) => {
                  const isSelected = data.riskTimes.includes(time.id);
                  return (
                    <motion.button
                      key={time.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleRiskTime(time.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <time.icon className={isSelected ? 'text-cyan-400' : 'text-slate-500'} size={24} />
                      <div className="text-left flex-1">
                        <p className="font-medium">{time.label}</p>
                        <p className="text-xs text-slate-500">{time.desc}</p>
                      </div>
                      {isSelected && <Check className="text-cyan-400" size={20} />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Daily check-in time?</h2>
                <p className="text-slate-400">We'll remind you to log your progress.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {CHECK_IN_TIMES.map((time) => {
                  const isSelected = data.preferredCheckInTime === time.id;
                  return (
                    <motion.button
                      key={time.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setData(prev => ({ ...prev, preferredCheckInTime: time.id }))}
                      className={`p-5 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      <p className="text-lg font-bold">{time.time}</p>
                      <p className="text-xs text-slate-500">{time.label}</p>
                    </motion.button>
                  );
                })}
              </div>
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-center text-cyan-300 text-sm">
                  🧊 You're ready to start your journey!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="p-4 rounded-xl bg-slate-800 text-white"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === steps.length - 1 ? (
              <>Start My Journey <Snowflake size={20} /></>
            ) : (
              <>Continue <ArrowRight size={20} /></>
            )}
          </motion.button>
        </div>
        {step === 0 && (
          <p className="text-center text-xs text-slate-500">
            Takes less than 2 minutes
          </p>
        )}
      </div>
    </div>
  );
};
