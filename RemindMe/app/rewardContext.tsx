import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./userContext";

const firestore = require("@react-native-firebase/firestore").default;
const auth = require("@react-native-firebase/auth").default;

type Child = { id: string; name: string; email: string; points: number };

type RewardsContextType = {
  children: Child[];
  addKid: (name: string, pin: string) => Promise<string | null>;
  removeKid: (kidId: string) => Promise<void>;
  addPoints: (childId: string, amount: number) => void;
  getPoints: (childId: string) => number;
};

const RewardsContext = createContext<RewardsContextType | null>(null);

export function RewardsProvider({
  children: appChildren,
}: {
  children: React.ReactNode;
}) {
  const { currentUserId } = useUser();
  const [kids, setKids] = useState<Child[]>([]);

  useEffect(() => {
    if (!currentUserId) return;

    const unsub = firestore()
      .collection("users")
      .doc(currentUserId)
      .collection("kids")
      .onSnapshot((snap: any) => {
        const loaded: Child[] = snap.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKids(loaded);
      });
    return unsub;
  }, [currentUserId]);

  const addKid = async (name: string, pin: string): Promise<string | null> => {
    if (!currentUserId) return "Not logged in.";
    if (!name.trim()) return "Please enter a name.";
    if (!/^\d{5}$/.test(pin)) return "PIN must be exactly 5 digits";

    try {
      const email = `${name.toLowerCase().replace(/\s+/g, "")}${currentUserId.slice(0, 6)}@remindme.app`;
      const password = pin + "0";

      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const kidUid = result.user.uid;

      await firestore()
        .collection("users")
        .doc(currentUserId)
        .collection("kids")
        .doc(kidUid)
        .set({ name, email, points: 0 });

      await firestore().collection("kids").doc(kidUid).set({
        name,
        email,
        parentId: currentUserId,
        points: 0,
      });

      return null;
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use")
        return "A kid with this name already exists.";
      return "Something went wrong. Try again.";
    }
  };

  const removeKid = async (kidId: string) => {
    if (!currentUserId) return;
    await firestore()
      .collection("users")
      .doc(currentUserId)
      .collection("kids")
      .doc(kidId)
      .delete();
  };

  const addPoints = async (childId: string, amount: number) => {
    if (!currentUserId) return;

    const increment = firestore.FieldValue.increment(amount);

    await Promise.all([
      firestore()
        .collection("users")
        .doc(currentUserId)
        .collection("kids")
        .doc(childId)
        .update({ points: increment }),

      firestore().collection("kids").doc(childId).update({ points: increment }),
    ]);
  };

  const getPoints = (childId: string) =>
    kids.find((k) => k.id === childId)?.points ?? 0;

  return (
    <RewardsContext.Provider
      value={{ children: kids, addKid, removeKid, addPoints, getPoints }}
    >
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
