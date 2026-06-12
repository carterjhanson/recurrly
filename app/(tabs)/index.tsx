// Load global styles.
import "@/global.css";

// React Native components.
import { FlatList, Image, Text, View } from "react-native";

// Allows SafeAreaView to use className styling.
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

// App data and assets.
import images from "@/constants/images";
import {
    HOME_BALANCE,
    HOME_USER,
    UPCOMING_SUBSCRIPTIONS
} from "@/constants/data";
import { icons } from "@/constants/icons";

// Helper functions.
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";

// Reusable components.
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";

// Create a NativeWind-compatible SafeAreaView.
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    return (
        // Main screen container.
        <SafeAreaView className="flex-1 bg-background p-5">

            {/* Header */}
            <View className="home-header">
                <View className="home-user">
                    <Image source={images.avatar} className="home-avatar" />
                    <Text className="home-user-name">
                        {HOME_USER.name}
                    </Text>
                </View>

                <Image source={icons.add} className="home-add-icon" />
            </View>

            {/* Balance Card */}
            <View className="home-balance-card">
                <Text className="home-balance-label">
                    Balance
                </Text>

                <View className="home-balance-row">
                    <Text className="home-balance-amount">
                        {formatCurrency(HOME_BALANCE.amount)}
                    </Text>

                    <Text className="home-balance-date">
                        {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                    </Text>
                </View>
            </View>

            {/* Upcoming Subscriptions */}
            <View>
                <ListHeading title="Upcoming" />

                <FlatList
                    data={UPCOMING_SUBSCRIPTIONS}
                    renderItem={({ item }) => (
                        <UpcomingSubscriptionCard {...item} />
                    )}
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

            {/* All Subscriptions */}
            <View>
                <ListHeading title="All Subscriptions" />
            </View>

        </SafeAreaView>
    );
}

/*
Data Flow:

HOME_USER
    ↓
Displays avatar and username

HOME_BALANCE
    ↓
Displays balance and renewal date

UPCOMING_SUBSCRIPTIONS
    ↓
FlatList loops through each item
    ↓
Creates an UpcomingSubscriptionCard
    ↓
Displays all upcoming subscriptions
*/