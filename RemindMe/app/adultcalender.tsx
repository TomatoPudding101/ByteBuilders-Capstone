import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { useUser } from "./userContext";

const firestore = require("@react-native-firebase/firestore").default;

type Reminder = {
  title: string;
  time: string;
  date?: string;
  notes: string;
  completed: boolean;
};

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export default function Calendar() {
  const { isDarkMode, theme } = useTheme();
  const router = useRouter();
  const { currentUser, currentUserId } = useUser();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!currentUserId || currentUserId === "devuser") return;

    try {
      const unsubscribe = firestore()
        .collection("users")
        .doc(currentUserId)
        .collection("reminders")
        .onSnapshot((snapshot: any) => {
          const loaded = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReminders(loaded);
        });
      return unsubscribe;
    } catch {
      console.log("Firestore not available in this enviornment");
    }
  }, [currentUserId]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(1);
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const selectedReminders = reminders.filter((r) => {
    return true;
  });

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
}
