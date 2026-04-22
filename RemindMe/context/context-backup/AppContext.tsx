import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Goal = {
  id: string;
  text: string;
  type: 'chore' | 'goal';
  points: number;
};

export type CheckedState = {
  [goalId: string]: { [day: number]: boolean };
};

type AppState = {
  goals: Goal[];
  checked: CheckedState;
  totalPoints: number;
  goalsCompleted: number;
  streak: number;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  removeGoal: (id: string) => void;
  toggleCheck: (goalId: string, day: number) => void;
  pendingPoints: number | null;
  clearPendingPoints: () => void;
};

const AppContext = createContext<AppState | null>(null);

const POINTS_PER_GOAL = 5;

export function AppProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', text: 'Make your bed', type: 'chore', points: POINTS_PER_GOAL },
    { id: '2', text: 'Do homework', type: 'chore', points: POINTS_PER_GOAL },
    { id: '3', text: 'Read for 20 min', type: 'goal', points: POINTS_PER_GOAL },
  ]);
  const [checked, setChecked] = useState<CheckedState>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [streak] = useState(3);
  const [pendingPoints, setPendingPoints] = useState<number | null>(null);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const id = Date.now().toString();
    setGoals(prev => [...prev, { ...goal, id }]);
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setChecked(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const toggleCheck = (goalId: string, day: number) => {
    const wasChecked = checked[goalId]?.[day] ?? false;
    setChecked(prev => ({
      ...prev,
      [goalId]: { ...prev[goalId], [day]: !wasChecked },
    }));
    if (!wasChecked) {
      const goal = goals.find(g => g.id === goalId);
      const pts = goal?.points ?? POINTS_PER_GOAL;
      setTotalPoints(prev => prev + pts);
      setGoalsCompleted(prev => prev + 1);
      setPendingPoints(pts);
    } else {
      const goal = goals.find(g => g.id === goalId);
      const pts = goal?.points ?? POINTS_PER_GOAL;
      setTotalPoints(prev => Math.max(0, prev - pts));
      setGoalsCompleted(prev => Math.max(0, prev - 1));
    }
  };

  const clearPendingPoints = () => setPendingPoints(null);

  return (
    <AppContext.Provider value={{
      goals, checked, totalPoints, goalsCompleted, streak,
      addGoal, removeGoal, toggleCheck,
      pendingPoints, clearPendingPoints,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
