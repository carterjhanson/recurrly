import {View, Text, Image} from 'react-native'
import React from 'react'
import {formatCurrency} from "@/lib/utils";

const UpcomingSubscriptionCard = ({ data: { name, price, daysLeft, icon, currency }}: UpcomingSubscription) => {
    // @ts-ignore
    return (
        <View className="upcoming-card">
            <View className="upcoming-row">
                <Image source={icon} className="upcoming-icon" />
                <View>
                    <Text className="upcoming-price">{formatCurrency(price, currency)}</Text>
                    <Text className="upcoming-meta" numberOfLines={1}>
                        {daysLeft > 1 ? `${daysLeft} days left` : 'Last day'}
                    </Text>
                </View>
            </View>
        </View>
    )
}
export default UpcomingSubscriptionCard
