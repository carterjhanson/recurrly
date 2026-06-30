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

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { signIn } = useSignIn();

    const [emailAddress, setEmailAddress] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [codeSent, setCodeSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const canSendCode = emailAddress.trim().length > 0 && !loading;

    const canResetPassword =
        code.trim().length >= 4 &&
        newPassword.length >= 8 &&
        confirmPassword.length >= 8 &&
        newPassword === confirmPassword &&
        !loading;

    const handleSendCode = async () => {
        if (!canSendCode) return;

        setError("");
        setLoading(true);

        try {
            const { error: createError } = await signIn.create({
                identifier: emailAddress.trim(),
            });

            if (createError) {
                setError(createError.message || "Unable to start password reset.");
                return;
            }

            const { error: sendCodeError } =
                await signIn.resetPasswordEmailCode.sendCode();

            if (sendCodeError) {
                setError(sendCodeError.message || "Unable to send reset code.");
                return;
            }

            setCodeSent(true);
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || "Unable to send reset code.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!canResetPassword) {
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
            }
            return;
        }

        setError("");
        setLoading(true);

        try {
            const { error: verifyError } =
                await signIn.resetPasswordEmailCode.verifyCode({
                    code: code.trim(),
                });

            if (verifyError) {
                setError(verifyError.message || "Invalid reset code.");
                return;
            }

            const { error: passwordError } =
                await signIn.resetPasswordEmailCode.submitPassword({
                    password: newPassword,
                    signOutOfOtherSessions: true,
                });

            if (passwordError) {
                setError(passwordError.message || "Unable to reset password.");
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
                router.replace("/(auth)/sign-in");
            }
        } catch (err: any) {
            setError(err?.errors?.[0]?.message || "Unable to reset password.");
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

                    <Text className="auth-title">
                        {codeSent ? "Create new password" : "Forgot password?"}
                    </Text>

                    <Text className="auth-subtitle">
                        {codeSent
                            ? "Enter the reset code from your email and choose a new password."
                            : "Enter your email and we’ll send you a reset code."}
                    </Text>

                    <View className="auth-card">
                        {!codeSent ? (
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

                                {!!error && <Text className="auth-error">{error}</Text>}

                                <Pressable
                                    className={`auth-button ${
                                        !canSendCode ? "auth-button-disabled" : ""
                                    }`}
                                    onPress={handleSendCode}
                                    disabled={!canSendCode}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff9e3" />
                                    ) : (
                                        <Text className="auth-button-text">Send reset code</Text>
                                    )}
                                </Pressable>

                                <View className="auth-link-row">
                                    <Link href="/(auth)/sign-in">
                                        <Text className="auth-link">Back to sign in</Text>
                                    </Link>
                                </View>
                            </>
                        ) : (
                            <>
                                <View className="auth-field">
                                    <Text className="auth-label">Reset code</Text>
                                    <TextInput
                                        className="auth-input"
                                        placeholder="Enter code"
                                        placeholderTextColor="rgba(0,0,0,0.45)"
                                        keyboardType="number-pad"
                                        value={code}
                                        onChangeText={setCode}
                                    />
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">New password</Text>
                                    <TextInput
                                        className="auth-input"
                                        placeholder="Enter new password"
                                        placeholderTextColor="rgba(0,0,0,0.45)"
                                        secureTextEntry
                                        textContentType="newPassword"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                    <Text className="auth-link-copy">
                                        Use at least 8 characters.
                                    </Text>
                                </View>

                                <View className="auth-field">
                                    <Text className="auth-label">Confirm password</Text>
                                    <TextInput
                                        className="auth-input"
                                        placeholder="Confirm new password"
                                        placeholderTextColor="rgba(0,0,0,0.45)"
                                        secureTextEntry
                                        textContentType="newPassword"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>

                                {!!error && <Text className="auth-error">{error}</Text>}

                                <Pressable
                                    className={`auth-button ${
                                        !canResetPassword ? "auth-button-disabled" : ""
                                    }`}
                                    onPress={handleResetPassword}
                                    disabled={!canResetPassword}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff9e3" />
                                    ) : (
                                        <Text className="auth-button-text">Reset password</Text>
                                    )}
                                </Pressable>

                                <View className="auth-link-row">
                                    <Pressable
                                        onPress={() => {
                                            setCodeSent(false);
                                            setError("");
                                            setCode("");
                                            setNewPassword("");
                                            setConfirmPassword("");
                                        }}
                                    >
                                        <Text className="auth-link">Use a different email</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/*
Forgot Password Flow

User enters email
        ↓
handleSendCode()
        ↓
Clerk emails verification code
        ↓
codeSent = true
        ↓
Screen changes to verification form
        ↓
User enters code + new password
        ↓
handleResetPassword()
        ↓
Verify code with Clerk
        ↓
Save new password
        ↓
Automatically sign the user in
        ↓
Navigate to Home Tabs
*/