// app/_layout.tsx
import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { LanguageProvider } from "@/lib/language-context";
import Toast from 'react-native-toast-message';   // ← ΝΕΟ

const PUBLIC_SEGMENTS = ["login", "register"];

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (cancelled) return;

      const isAuthenticated = !!userId;
      const currentSegment = segments[0];
      const isPublicScreen = PUBLIC_SEGMENTS.includes(currentSegment ?? "");

      if (!isAuthenticated && !isPublicScreen) {
        router.replace("/login");
      } else if (isAuthenticated && isPublicScreen) {
        router.replace("/(tabs)");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [segments, router]);

  return null;
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const initialFrame = initialWindowMetrics?.frame ?? { x: 0, y: 0, width: 0, height: 0 };

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  useEffect(() => {
    initManusRuntime();
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
  }));

  const [trpcClient] = useState(() => createTRPCClient());

  const providerInitialMetrics = useMemo(() => ({
    ... (initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame }),
    insets: {
      ...initialInsets,
      top: Math.max(initialInsets.top, 16),
      bottom: Math.max(initialInsets.bottom, 12),
    },
  }), [initialInsets, initialFrame]);

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <AuthGate />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="register" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="oauth/callback" />
            </Stack>
            <StatusBar style="auto" />

            {/* Toast Provider */}
            <Toast />
          </QueryClientProvider>
        </trpc.Provider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );

  // ... (το υπόλοιπο του αρχείου παραμένει ίδιο)
  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          <SafeAreaFrameContext.Provider value={frame}>
            <SafeAreaInsetsContext.Provider value={insets}>
              {content}
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        {content}
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
