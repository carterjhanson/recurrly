import { View, Text, Image } from 'react-native'
import React from 'react'
import { formatCurrency } from "@/lib/utils";

/*
 * Displays a single upcoming subscription card.
 *
 * Example:
 * --------------------------------
 * Spotify
 * $5.99
 * 2 days left
 * --------------------------------
 */
const UpcomingSubscriptionCard = ({
                                      name,
                                      price,
                                      daysLeft,
                                      icon,
                                      currency
                                  }: UpcomingSubscription) => {

    return (
        // Main card container
        <View className="upcoming-card">

            {/* Top section containing the icon, price, and days left */}
            <View className="upcoming-row">

                {/* Subscription logo */}
                <Image
                    source={icon}
                    className="upcoming-icon"
                />

                <View>

                    {/* Formatted subscription price */}
                    <Text className="upcoming-price">
                        {formatCurrency(price, currency)}
                    </Text>

                    {/* Show days remaining until renewal */}
                    <Text
                        className="upcoming-meta"
                        numberOfLines={1}
                    >
                        {daysLeft > 1
                            ? `${daysLeft} days left`
                            : 'Last day'}
                    </Text>

                </View>
            </View>

            {/* Subscription name */}
            <Text
                className="upcoming-name"
                numberOfLines={1}
            >
                {name}
            </Text>

        </View>
    )
}

export default UpcomingSubscriptionCard;

/*
 * Data Flow:
 *
 * Parent Component
 *        ↓
 * UpcomingSubscriptionCard
 *        ↓
 * Receives:
 * - name
 * - price
 * - daysLeft
 * - icon
 * - currency
 *        ↓
 * Displays a styled subscription card
 */