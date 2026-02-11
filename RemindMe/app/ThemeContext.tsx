import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: {
    background: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    primary: string;
    inputBackground: string;
    inputBorder: string;
    border: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  });

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem("darkMode");
      if (saved !== null) {
        setIsDarkMode(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem("darkMode", JSON.stringify(newValue));
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const theme = {
    background: isDarkMode ? "#1F2937" : "#FDF4F5",
    cardBackground: isDarkMode ? "#374151" : "#FFF",
    text: isDarkMode ? "#95badf" : "#333",
    textSecondary: isDarkMode ? "#D1D5DB" : "#666",
    textTertiary: isDarkMode ? "#9CA3AF" : "#999",
    primary: "#9333EA",
    inputBackground: isDarkMode ? "#4B5563" : "#F9FAFB",
    inputBorder: isDarkMode ? "#6B7280" : "#E5E7EB",
    border: isDarkMode ? "#4B5563" : "#F3F4F6",
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
