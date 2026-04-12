import React, { createContext, useContext, useState } from "react";

type Child = { id: string; name: string; points: number };

type RewardsContextType = {
  children: Child[];
  addPoints: (childId: string, amount: number) => void;
  getPoints: (childId: string) => number;
};

const RewardsContext = createContext<RewardsContextType | null>(null);

export function RewardsProvider({
  children: appChildren,
}: {
  children: React.ReactNode;
}) {
  const [kids, setKids] = useState<Child[]>([
    { id: "kid1", name: "Anders", points: 0 },
    { id: "kid2", name: "Kyle", points: 0 },
  ]);

  const addPoints = (childId: string, amount: number) => {
    setKids((prev) =>
      prev.map((k) =>
        k.id === childId ? { ...k, points: Math.max(0, k.points + amount) } : k,
      ),
    );
  };

  const getPoints = (childId: string) =>
    kids.find((k) => k.id === childId)?.points ?? 0;

  return (
    <RewardsContext.Provider value={{ children: kids, addPoints, getPoints }}>
      {appChildren}
    </RewardsContext.Provider>
  );
}

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context)
    throw new Error("useRewards must be used inside RewardsProvideer");
  return context;
};
