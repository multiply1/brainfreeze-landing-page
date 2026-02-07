import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Smile, Meh, Frown, Zap, Battery, BatteryLow, Snowflake } from 'lucide-react';
import { Goal } from '@/hooks/useGoals';

interface DailyCheckInModalProps {
  onClose: () => void;
  onComplete: (data: CheckInData) => void;
  goals: Goal[];
}

export interface CheckInData {
  moodScore: number;
  energyLevel: 'low' | 'medium' | 'high';
  reflection: string;
  goalStatuses: { goalId: string; status: 'success' | 'almost' | 'failed' }[];
}

const MOOD_OPTIONS = [
  { value: 1, label: 'Terrible', icon: Frown, color: 'text-red-400', bg: 'bg-red-500/20' },
  { value: 2, label: 'Bad', icon: Frown, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { value: 3, label: 'Okay', icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { value: 4, label: 'Good', icon: Smile, color: 'text-green-400', bg: 'bg-green-500/20' },
  { value: 5, label: 'Great', icon: Smile, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
];

const ENERGY_OPTIONS = [
  { value: 'low', label: 'Low', icon: BatteryLow, color: 'text-red-400' },
  { value: 'medium', label: 'Medium', icon: Battery, color: 'text-yellow-400' },
  { value: 'high', label: 'High', icon: Zap, color: 'text-green-400' },
];

const GOAL_STATUS_OPTIONS = [
  { value: 'success', label: '✅ Stayed strong', color: 'border-green-500 bg-green-500/20' },
  { value: 'almost', label: '⚠️ Almost slipped', color: 'border-yellow-500 bg-yellow-500/20' },
  { value: 'failed', label: '❌ Had a setback', color: 'border-red-500 bg-red-500/20' },
];

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  onClose,
  onComplete,
  goals,
}) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CheckInData>({
    moodScore: 0,
    energyLevel: 'medium',
    reflection: '',
    goalStatuses: goals.map(g => ({ goalId: g.id, status: 'success' as const })),
  });

  const totalSteps = goals.length > 0 ? 3 : 2;

  const canProceed = () => {
    switch (step) {
      case 0: return data.moodScore > 0;
      case 1: return true;
      case 2: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === totalSteps - 1) {
      onComplete(data);
    } else {
      setStep(s => s + 1);
    }
  };

  const updateGoalStatus = (goalId: string, status: 'success' | 'almost' | 'failed') => {
    setData(prev => ({
      ...prev,
      goalStatuses: prev.goalStatuses.map(gs =>
        gs.goalId === goalId ? { ...gs, status } : gs
      ),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#0a0f1a] text-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-cyan-400' : 'bg-slate-800'}`}
            />
          ))}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800 text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">How are you feeling?</h2>
              <p className="text-slate-400">Be honest with yourself</p>
            </div>

            {/* Mood Selection */}
            <div className="flex justify-center gap-3">
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = data.moodScore === mood.value;
                return (
                  <motion.button
                    key={mood.value}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setData(prev => ({ ...prev, moodScore: mood.value }))}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? `border-cyan-400 ${mood.bg}`
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <mood.icon
                      size={32}
                      className={isSelected ? mood.color : 'text-slate-600'}
                    />
                    <span className="text-xs">{mood.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Energy Level */}
            <div className="space-y-4">
              <p className="text-center text-slate-400">Energy level?</p>
              <div className="flex justify-center gap-4">
                {ENERGY_OPTIONS.map((energy) => {
                  const isSelected = data.energyLevel === energy.value;
                  return (
                    <motion.button
                      key={energy.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setData(prev => ({ ...prev, energyLevel: energy.value as any }))}
                      className={`px-6 py-3 rounded-xl border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/10'
                          : 'border-slate-800'
                      }`}
                    >
                      <energy.icon className={isSelected ? energy.color : 'text-slate-600'} size={20} />
                      <span className="text-sm">{energy.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">How did you do today?</h2>
              <p className="text-slate-400">Check in on each goal</p>
            </div>

            <div className="space-y-4">
              {goals.map((goal) => {
                const currentStatus = data.goalStatuses.find(gs => gs.goalId === goal.id)?.status || 'success';
                return (
                  <div key={goal.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-slate-800 ${goal.color}`}>
                        <Snowflake size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{goal.title}</p>
                        <p className="text-xs text-slate-500">Day {goal.streak + 1}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {GOAL_STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateGoalStatus(goal.id, option.value as any)}
                          className={`p-2 rounded-lg border text-xs transition-all ${
                            currentStatus === option.value
                              ? option.color
                              : 'border-slate-700 bg-slate-800/50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {((step === 1 && goals.length === 0) || (step === 2 && goals.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Any reflections?</h2>
              <p className="text-slate-400">Optional but helpful</p>
            </div>

            <textarea
              value={data.reflection}
              onChange={(e) => setData(prev => ({ ...prev, reflection: e.target.value }))}
              placeholder="What helped today? What was challenging?"
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />

            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <p className="text-center text-sm">
                {data.moodScore >= 4 ? (
                  <span className="text-cyan-300">🧊 You're doing great! Keep it up.</span>
                ) : data.moodScore >= 2 ? (
                  <span className="text-yellow-300">💪 Tough days build strength. You got this.</span>
                ) : (
                  <span className="text-orange-300">🫂 It's okay to struggle. Tomorrow is a fresh start.</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {step === totalSteps - 1 ? (
            <>Complete Check-in <Snowflake size={20} /></>
          ) : (
            'Continue'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
