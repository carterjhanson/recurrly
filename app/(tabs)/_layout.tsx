// Import the Tabs component from Expo Router.
// This creates the bottom navigation bar for our app.
import { Redirect, Tabs } from "expo-router";

// Clerk hook used to check if the user is signed in.
import { useAuth } from "@clerk/expo";

// Import our list of tabs from a separate file.
// This contains information like the tab name, title, and icon.
import { tabs } from "@/constants/data";

import { View, Image, ImageSourcePropType } from "react-native";

// This hook gives us information about the device's safe area.
// Safe areas help us avoid things like the iPhone home indicator.
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, components } from "@/constants/theme";

// Grab the tab bar settings from our theme file.
const tabBar = components.tabBar;

// Size of the actual icon image inside each tab.
const TAB_ICON_SIZE = 24;

// Size of the circular background behind the icon.
const TAB_PILL_SIZE = 48;

type TabIconProps = {
    focused: boolean;
    icon: ImageSourcePropType;
};

// Main component that controls our bottom tab navigation.
const TabLayout = () => {
    const { isSignedIn, isLoaded } = useAuth();

    // Get safe area information for the current device.
    const insets = useSafeAreaInsets();

    // Wait until Clerk finishes checking auth status.
    if (!isLoaded) {
        return null;
    }

    // If the user is not signed in, send them to sign in.
    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

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
};

export default TabLayout;





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