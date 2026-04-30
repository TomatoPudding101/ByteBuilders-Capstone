import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AppProvider } from "../context/AppContext";
import { RewardsProvider } from "./rewardContext";
import { ThemeProvider } from "./ThemeContext";
import { UserProvider } from "./userContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <UserProvider>
        <ThemeProvider>
          <RewardsProvider>
            <Stack>
              <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="create-account" options={{ headerShown: false }} />
              <Stack.Screen name="adultDashboard" options={{ headerShown: false }} />
              <Stack.Screen name="adultSettings" options={{ headerShown: false }} />
              <Stack.Screen name="progressjourney" options={{ headerShown: false }} />
              <Stack.Screen name="adultfocustimer" options={{ headerShown: false }} />
              <Stack.Screen name="adultcalender" options={{ headerShown: false }} />
              <Stack.Screen name="kids-login" options={{ headerShown: false }} />
              <Stack.Screen name="kidshome" options={{ headerShown: false }} />
              <Stack.Screen name="kidsforgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="kidsregister" options={{ headerShown: false }} />
              <Stack.Screen name="kidsgoals" options={{ headerShown: false }} />
              <Stack.Screen name="kidscalendar" options={{ headerShown: false }} />
              <Stack.Screen name="kidsprogress1" options={{ headerShown: false }} />
              <Stack.Screen name="kidsrewards1" options={{ headerShown: false }} />
              <Stack.Screen name="kidstimer" options={{ headerShown: false }} />
              <Stack.Screen name="kidsettings" options={{ headerShown: false }} />
              <Stack.Screen name="parentlogin" options={{ headerShown: false }} />
              <Stack.Screen name="parentsettings" options={{ headerShown: false }} />
              <Stack.Screen name="parentforgotpassword" options={{ headerShown: false }} />
              <Stack.Screen name="kidsroadmap" options={{ headerShown: false }} />
              <Stack.Screen name="whackamole" options={{ headerShown: false }} />
              <Stack.Screen name="solvemaze" options={{ headerShown: false }} />
              <Stack.Screen name="stopgame" options={{ headerShown: false }} />


            </Stack>
            <StatusBar style="auto" />
          </RewardsProvider>
        </ThemeProvider>
      </UserProvider>
    </AppProvider>
  );
}