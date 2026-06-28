import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
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
            const { error: signInError } = await signIn.password({
                emailAddress: emailAddress.trim(),
                password,
            });

            if (signInError) {
                setError(signInError.message || "Unable to sign in.");
                return;
            }

            if (signIn.status === "complete") {
                await signIn.finalize({
                    navigate: ({ decorateUrl }) => {
                        const url = decorateUrl("/(tabs)");

                        if (Platform.OS === "web" && url.startsWith("http")) {
                            window.location.href = url;
                            return;
                        }

                        router.replace(url as Href);
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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
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
                                autoCorrect={false}
                                keyboardType="email-address"
                                textContentType="emailAddress"
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
                                textContentType="password"
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <View style={{ alignItems: "flex-end", marginBottom: 12 }}>
                            <Link href="/(auth)/forgot-password" asChild>
                                <Pressable>
                                    <Text className="auth-link">Forgot password?</Text>
                                </Pressable>
                            </Link>
                        </View>

                        {!!error && <Text className="auth-error">{error}</Text>}

                        <Pressable
                            className={`auth-button ${
                                !canSubmit ? "auth-button-disabled" : ""
                            }`}
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
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}