"use no memo";

import "@/global.css";

import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import SubscriptionCard from "@/components/SubscriptionCard";

export default function SubscriptionsScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
        string | null
    >(null);

    const filteredSubscriptions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) return HOME_SUBSCRIPTIONS;

        return HOME_SUBSCRIPTIONS.filter((subscription) => {
            const searchableText = [
                subscription.name,
                subscription.plan,
                subscription.category,
                subscription.billing,
                subscription.status,
                subscription.paymentMethod,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [searchQuery]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff9e3" }}>
            <View style={{ flex: 1, padding: 20 }}>
                <Text className="subscriptions-title">Subscriptions</Text>

                <Text className="subscriptions-subtitle">
                    Search, review, and manage your recurring payments.
                </Text>

                <TextInput
                    className="subscriptions-search"
                    placeholder="Search subscriptions..."
                    placeholderTextColor="rgba(0,0,0,0.45)"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <View className="subscriptions-summary-row">
                    <Text className="subscriptions-count">
                        {filteredSubscriptions.length} result
                        {filteredSubscriptions.length === 1 ? "" : "s"}
                    </Text>

                    {searchQuery.trim().length > 0 && (
                        <Text
                            className="subscriptions-clear"
                            onPress={() => setSearchQuery("")}
                        >
                            Clear
                        </Text>
                    )}
                </View>

                <FlatList
                    data={filteredSubscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SubscriptionCard
                            {...item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={() =>
                                setExpandedSubscriptionId((currentId) =>
                                    currentId === item.id ? null : item.id
                                )
                            }
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 140 }}
                    ListEmptyComponent={
                        <View className="subscriptions-empty">
                            <Text className="subscriptions-empty-title">
                                No subscriptions found
                            </Text>

                            <Text className="subscriptions-empty-copy">
                                Try searching by name, category, billing type, or payment
                                method.
                            </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}