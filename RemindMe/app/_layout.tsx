import { ThemeProvider } from "./ThemeContext";
import { UserProvider } from "./userContext";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="create-account"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="adultDashboard"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="adultSettings" options={{ headerShown: false }} />
          <Stack.Screen
            name="progressjourney"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="kids-login" options={{ headerShown: false }} />
          <Stack.Screen name="kidshome" options={{ headerShown: false }} />
          <Stack.Screen
            name="kidsforgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="kidsregister" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}
