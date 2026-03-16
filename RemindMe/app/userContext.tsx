import React, { createContext, useContext, useEffect, useState } from "react";

const auth = require("@react-native-firebase/auth").default;
const firestore = require("@react-native-firebase/firestore").default;

type userContextType = {
  currentUser: string | null;
  currentUserId: string | null;
  login: (parentId: string, password: string) => Promise<boolean>;
  signup: (
    parentId: string,
    password: string,
    confirmPassword: string,
  ) => Promise<string | null>;
  logout: () => void;
};

const userContext = createContext<userContextType>({
  currentUser: null,
  currentUserId: null,
  login: async () => false,
  signup: async () => null,
  logout: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = auth().onAuthStateChanged(async (user: any) => {
        if (user) {
          setCurrentUserId(user.uid);
          try {
            const doc = await firestore()
              .collection("users")
              .doc(user.uid)
              .get();
            if (doc.exists) {
              setCurrentUser(doc.data()?.parentId ?? null);
            }
          } catch {}
        } else {
          setCurrentUser(null);
          setCurrentUserId(null);
        }
      });
    } catch {
      console.log("Firebase not available in this enviornment");
      if (__DEV__) {
        setCurrentUser("devuser");
        setCurrentUserId("devuser");
      }
    }
    return unsubscribe;
  }, []);

  const login = async (
    parentId: string,
    password: string,
  ): Promise<boolean> => {
    if (__DEV__ && parentId === "devuser") {
      setCurrentUser("devUser");
      setCurrentUserId("devuser");
      return true;
    }
    try {
      const email = `${parentId.toLowerCase()}@remindme.app`;
      const result = await auth().signInWithEmailAndPassword(email, password);
      setCurrentUserId(result.user.uid);
      setCurrentUser(parentId);
      return true;
    } catch (e) {
      console.log("Login error:", e);
      return false;
    }
  };

  const signup = async (
    parentId: string,
    password: string,
    confirmPassword: string,
  ): Promise<string | null> => {
    if (!parentId.trim()) return "Please enter a parent ID.";
    if (password.length < 6) return "Password must be longer than 6 letters.";
    if (password !== confirmPassword) return "Passwords do not match.";

    try {
      const email = `${parentId.toLowerCase()}@remindme.app`;
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await firestore().collection("users").doc(result.user.uid).set({
        parentId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setCurrentUserId(result.user.uid);
      setCurrentUser(parentId);
      return null;
    } catch (e: any) {
      console.log("Signup error code:", e.code);
      console.log("Signup error message:", e.message);
      if (e.code === "auth/email-already-in-use") {
        return "An account with this paren ID already exists.";
      }
      return "Signup failed. Please try again.";
    }
  };

  const logout = async () => {
    if (!__DEV__ || currentUserId !== "devuser") {
      setCurrentUser(null);
      setCurrentUserId(null);
      return;
    }
    try {
      await auth().signOut();
    } catch {
      console.log("Firebase not available in this enviornment");
    }
    setCurrentUser(null);
    setCurrentUserId(null);
  };

  return (
    <userContext.Provider
      value={{ currentUser, currentUserId, login, signup, logout }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
