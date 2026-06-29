import "@/global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PostHogProvider } from "posthog-react-native";

SplashScreen.preventAutoHideAsync().catch(() => {
    // Splash screen may already be hidden during fast refresh.
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
        "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
        "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
        "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
        "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync().catch(() => {
                // Splash screen may already be hidden.
            });
        }
    }, [fontsLoaded, fontError]);

    if (!publishableKey) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff9e3",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                }}
            >
                <Text style={{ color: "#081126", textAlign: "center", fontSize: 16 }}>
                    Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.
                </Text>
            </View>
        );
    }

    if (!fontsLoaded && !fontError) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#fff9e3",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ActivityIndicator color="#ea7a53" />
            </View>
        );
    }

    return (
        <PostHogProvider
            apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY!}
            options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
        >
            <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
                <Stack screenOptions={{ headerShown: false }} />
            </ClerkProvider>
        </PostHogProvider>
    );
}
