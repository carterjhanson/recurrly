import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Image, ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/theme";

const tabBar = components.tabBar;
const TAB_ICON_SIZE = 24;
const TAB_PILL_SIZE = 48;

type TabIconProps = {
    focused: boolean;
    icon: ImageSourcePropType;
};

const TabIcon = ({ focused, icon }: TabIconProps) => (
    <View
        style={{
            width: TAB_PILL_SIZE,
            height: TAB_PILL_SIZE,
            borderRadius: TAB_PILL_SIZE / 2,
            backgroundColor: focused ? colors.accent : "transparent",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
        <Image
            source={icon}
            resizeMode="contain"
            style={{
                width: TAB_ICON_SIZE,
                height: TAB_ICON_SIZE,
            }}
        />
    </View>
);

export default function TabLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const insets = useSafeAreaInsets();

    if (!isLoaded) {
        return (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color={colors.accent} />
            </View>
        );
    }

    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: "center",
                },
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}



/*
=========================================
HOW THE TAB NAVIGATION WORKS
=========================================

1. The "tabs" array contains all tab data:
   - name
   - title
   - icon

   Example:
   [
     { name: "index", title: "Home", icon: homeIcon },
     { name: "subscriptions", title: "Subscriptions", icon: subIcon }
   ]

                tabs array
                     ↓

2. tabs.map() loops through every tab object.

                     ↓

3. For each tab object, a <Tabs.Screen> is created.

   tabs.map((tab) => (
     <Tabs.Screen ... />
   ))

                     ↓

4. Each Tabs.Screen renders a custom TabIcon component.

   tabBarIcon={({ focused }) => (
     <TabIcon
       focused={focused}
       icon={tab.icon}
     />
   )}

                     ↓

5. Expo Router automatically determines which tab
   is currently selected and passes:

   focused = true
   OR
   focused = false

   to the TabIcon component.

                     ↓

6. TabIcon checks the value of "focused".

   If focused === true:
     - Show accent-colored circle background

   If focused === false:
     - Show transparent background

                     ↓

7. Result:
   The currently selected tab gets the orange
   background while all other tabs remain transparent.

FLOW SUMMARY:

tabs array
    ↓
tabs.map()
    ↓
Creates Tabs.Screen for each tab
    ↓
Each screen uses TabIcon
    ↓
TabIcon checks if it's focused
    ↓
Shows orange background if selected

*/