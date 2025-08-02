import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthStore } from "@/store/authStore";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { restoreSession, isLoading } = useAuthStore();

  useEffect(() => {
    // Attempt to restore session on app load
    restoreSession();
  }, [restoreSession]);

  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: 'white',
      },
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/parent-register" options={{ title: "Create Family Account" }} />
      <Stack.Screen name="auth/parent-login" options={{ title: "Parent Login" }} />
      <Stack.Screen name="auth/child-login" options={{ title: "Child Login" }} />
      <Stack.Screen name="auth/family-code" options={{ title: "Family Code", headerBackVisible: false }} />
      <Stack.Screen name="auth/add-children" options={{ title: "Add Children", headerBackVisible: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}