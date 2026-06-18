import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import dayjs from "dayjs";

import images from "@/constants/images";
import {
    HOME_BALANCE,
    HOME_SUBSCRIPTIONS,
    HOME_USER,
    UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";

export default function HomeScreen() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
        string | null
    >(null);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                data={HOME_SUBSCRIPTIONS}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <>
                        <View className="home-header">
                            <View className="home-user">
                                <Image
                                    source={images.avatar}
                                    resizeMode="cover"
                                    style={{ width: 48, height: 48, borderRadius: 24 }}
                                />

                                <Text className="home-user-name">{HOME_USER.name}</Text>
                            </View>

                            <Image
                                source={icons.add}
                                resizeMode="contain"
                                style={{ width: 40, height: 40 }}
                            />
                        </View>

                        <View className="home-balance-card">
                            <Text className="home-balance-label">Balance</Text>

                            <View className="home-balance-row">
                                <Text className="home-balance-amount">
                                    {formatCurrency(HOME_BALANCE.amount)}
                                </Text>

                                <Text className="home-balance-date">
                                    {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <ListHeading title="Upcoming" />

                            <FlatList
                                data={UPCOMING_SUBSCRIPTIONS}
                                renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                ListEmptyComponent={
                                    <Text className="home-empty-state">
                                        No upcoming renewals yet.
                                    </Text>
                                }
                            />
                        </View>

                        <ListHeading title="All Subscriptions" />
                    </>
                }
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() =>
                            setExpandedSubscriptionId((currentId) =>
                                currentId === item.id ? null : item.id,
                            )
                        }
                    />
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text className="home-empty-state">No subscriptions yet.</Text>
                }
                contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    );
}
