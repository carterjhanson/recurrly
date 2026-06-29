import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
    const router = useRouter();
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleSignOut = () => {
        Alert.alert(
            "Sign out?",
            "You will need to sign back in to access your subscriptions.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Sign out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/(auth)/sign-in");
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 140,
                }}
            >
                <Text className="settings-title">Settings</Text>
                <Text className="settings-subtitle">
                    Manage your account, preferences, and app settings.
                </Text>

                <View className="settings-card">
                    <Text className="settings-section-title">Account</Text>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">Email</Text>
                            <Text className="settings-value">
                                {user?.primaryEmailAddress?.emailAddress ?? "No email found"}
                            </Text>
                        </View>
                    </View>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">User ID</Text>
                            <Text className="settings-value" numberOfLines={1}>
                                {user?.id ?? "Unavailable"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="settings-card">
                    <Text className="settings-section-title">Preferences</Text>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">Currency</Text>
                            <Text className="settings-value">USD</Text>
                        </View>
                    </View>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">Notifications</Text>
                            <Text className="settings-value">Renewal reminders enabled</Text>
                        </View>
                    </View>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">Theme</Text>
                            <Text className="settings-value">Recurrly default</Text>
                        </View>
                    </View>
                </View>

                <View className="settings-card">
                    <Text className="settings-section-title">Support</Text>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">Help Center</Text>
                            <Text className="settings-value">
                                Get help with your account and subscriptions.
                            </Text>
                        </View>
                    </View>

                    <View className="settings-row">
                        <View>
                            <Text className="settings-label">Privacy</Text>
                            <Text className="settings-value">
                                View privacy and data settings.
                            </Text>
                        </View>
                    </View>
                </View>

                <Pressable className="settings-signout-button" onPress={handleSignOut}>
                    <Text className="settings-signout-text">Sign out</Text>
                </Pressable>

                <Text className="settings-version">Recurrly v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}