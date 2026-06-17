import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
    const router = useRouter();
    const { signIn } = useSignIn();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const canSubmit =
        emailAddress.trim().length > 0 &&
        password.trim().length > 0 &&
        !loading;

    const handleSignIn = async () => {
        if (!canSubmit) return;

        setError("");
        setLoading(true);

        try {
            const { error } = await signIn.password({
                emailAddress: emailAddress.trim(),
                password,
            });

            if (error) {
                setError(error.message || "Unable to sign in.");
                return;
            }

            if (signIn.status === "complete") {
                await signIn.finalize({
                    navigate: ({ decorateUrl }) => {
                        const url = decorateUrl("/(tabs)");

                        if (url.startsWith("http")) {
                            window.location.href = url;
                        } else {
                            router.replace(url as Href);
                        }
                    },
                });
            } else {
                setError("Additional verification is required.");
            }
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || "Unable to sign in.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="auth-safe-area">
            <View className="auth-screen">
                <View className="auth-brand-block">
                    <View className="auth-logo-row">
                        <View className="auth-logo-mark">
                            <Text className="auth-logo-text">R</Text>
                        </View>

                        <View>
                            <Text className="auth-brand-title">Recurrly</Text>
                            <Text className="auth-brand-subtitle">SMART BILLING</Text>
                        </View>
                    </View>
                </View>

                <Text className="auth-title">Welcome back</Text>
                <Text className="auth-subtitle">
                    Sign in to continue managing your subscriptions.
                </Text>

                <View className="auth-card">
                    <View className="auth-field">
                        <Text className="auth-label">Email</Text>
                        <TextInput
                            className="auth-input"
                            placeholder="Enter your email"
                            placeholderTextColor="rgba(0,0,0,0.45)"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                        />
                    </View>

                    <View className="auth-field">
                        <Text className="auth-label">Password</Text>
                        <TextInput
                            className="auth-input"
                            placeholder="Enter your password"
                            placeholderTextColor="rgba(0,0,0,0.45)"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {!!error && <Text className="auth-error">{error}</Text>}

                    <Pressable
                        className={`auth-button ${!canSubmit ? "auth-button-disabled" : ""}`}
                        onPress={handleSignIn}
                        disabled={!canSubmit}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff9e3" />
                        ) : (
                            <Text className="auth-button-text">Sign in</Text>
                        )}
                    </Pressable>

                    <View className="auth-link-row">
                        <Text className="auth-link-copy">New to Recurrly? </Text>
                        <Link href="/(auth)/sign-up">
                            <Text className="auth-link">Create an account</Text>
                        </Link>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}