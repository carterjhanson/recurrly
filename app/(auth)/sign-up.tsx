import { useAuth, useSignUp } from "@clerk/expo";
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

export default function SignUpScreen() {
    const router = useRouter();
    const { signUp } = useSignUp();
    const { isSignedIn } = useAuth();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const canSubmit =
        emailAddress.trim().length > 0 && password.length >= 8 && !loading;

    const canVerify = code.trim().length >= 4 && !loading;

    const handleSignUp = async () => {
        if (!canSubmit) return;

        setError("");
        setLoading(true);

        try {
            const { error: signUpError } = await signUp.password({
                emailAddress: emailAddress.trim(),
                password,
            });

            if (signUpError) {
                setError(signUpError.message || "Unable to create account.");
                return;
            }

            await signUp.verifications.sendEmailCode();
            setPendingVerification(true);
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || "Unable to create account.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!canVerify) return;

        setError("");
        setLoading(true);

        try {
            await signUp.verifications.verifyEmailCode({
                code: code.trim(),
            });

            if (signUp.status === "complete") {
                await signUp.finalize({
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
                setError("Verification could not be completed.");
            }
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || "Invalid verification code.");
        } finally {
            setLoading(false);
        }
    };

    if (signUp.status === "complete" || isSignedIn) return null;

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#fff9e3",
            }}
        >
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

                    <Text className="auth-title">
                        {pendingVerification ? "Verify your email" : "Create account"}
                    </Text>

                    <Text className="auth-subtitle">
                        {pendingVerification
                            ? "Enter the code sent to your email."
                            : "Track renewals, control spending, and stay ahead."}
                    </Text>

                    <View className="auth-card">
                        {!pendingVerification ? (
                            <>
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
                                        placeholder="Create a password"
                                        placeholderTextColor="rgba(0,0,0,0.45)"
                                        secureTextEntry
                                        textContentType="newPassword"
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <Text className="auth-helper-text">Use at least 8 characters.</Text>
                                </View>

                                {!!error && <Text className="auth-error">{error}</Text>}

                                <View
                                    nativeID="clerk-captcha"
                                    style={{
                                        width: "100%",
                                        minHeight: 80,
                                        marginTop: 12,
                                        marginBottom: 12,
                                    }}
                                />

                                <Pressable
                                    className={`auth-button ${!canSubmit ? "auth-button-disabled" : ""}`}
                                    onPress={handleSignUp}
                                    disabled={!canSubmit}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff9e3" />
                                    ) : (
                                        <Text className="auth-button-text">Create account</Text>
                                    )}
                                </Pressable>

                                <View className="auth-link-row">
                                    <Text className="auth-link-copy">Already have an account? </Text>
                                    <Link href="/(auth)/sign-in">
                                        <Text className="auth-link">Sign in</Text>
                                    </Link>
                                </View>
                            </>
                        ) : (
                            <>
                                <View className="auth-field">
                                    <Text className="auth-label">Verification code</Text>
                                    <TextInput
                                        className="auth-input"
                                        placeholder="Enter code"
                                        placeholderTextColor="rgba(0,0,0,0.45)"
                                        keyboardType="number-pad"
                                        value={code}
                                        onChangeText={setCode}
                                    />
                                </View>

                                {!!error && <Text className="auth-error">{error}</Text>}

                                <Pressable
                                    className={`auth-button ${!canVerify ? "auth-button-disabled" : ""}`}
                                    onPress={handleVerify}
                                    disabled={!canVerify}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff9e3" />
                                    ) : (
                                        <Text className="auth-button-text">Verify email</Text>
                                    )}
                                </Pressable>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
