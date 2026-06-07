// Import the Tabs component from Expo Router.
// This creates the bottom navigation bar for our app.
import { Tabs } from "expo-router";
// Import our list of tabs from a separate file.
// This contains information like the tab name, title, and icon.
import { tabs } from "@/constants/data";
import { View, Image } from "react-native";

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

// Main component that controls our bottom tab navigation.
const TabLayout = () => {

    // Get safe area information for the current device.
    // Example: iPhones with a home indicator need extra bottom spacing.
    const insets = useSafeAreaInsets();

    // This component is responsible for rendering a single tab icon.
    // It receives:
    // - focused: true if the tab is currently selected
    // - icon: the image to display
    const TabIcon = ({ focused, icon }: TabIconProps) => (

        // Outer container that holds the icon.
        <View
            style={{
                // Width and height create a square container.
                width: TAB_PILL_SIZE,
                height: TAB_PILL_SIZE,

                // Makes the square become a circle.
                borderRadius: TAB_PILL_SIZE / 2,

                // If the tab is selected, show the accent color.
                // Otherwise make it transparent.
                backgroundColor: focused
                    ? colors.accent
                    : "transparent",

                // Center the icon horizontally.
                justifyContent: "center",

                // Center the icon vertically.
                alignItems: "center",
            }}
        >

            {/* Display the tab icon image */}
            <Image
                source={icon}

                // Prevent the image from stretching.
                resizeMode="contain"

                style={{
                    // Size of the icon itself.
                    width: TAB_ICON_SIZE,
                    height: TAB_ICON_SIZE,
                }}
            />
        </View>
    );

    // Render the actual tab navigator.
    return (
        <Tabs
            screenOptions={{

                // Hide the header at the top of each screen.
                headerShown: false,

                // Hide the text labels under each icon.
                tabBarShowLabel: false,

                // Styling for the entire tab bar.
                tabBarStyle: {

                    // Allows the tab bar to float above the screen.
                    position: "absolute",

                    // Push the tab bar up from the bottom.
                    // We use whichever value is larger:
                    // - the device safe area
                    // - our custom spacing
                    bottom: Math.max(
                        insets.bottom,
                        tabBar.horizontalInset
                    ),

                    // Height of the tab bar.
                    height: tabBar.height,

                    // Add spacing on the left and right sides.
                    marginHorizontal: tabBar.horizontalInset,

                    // Rounded corners.
                    borderRadius: tabBar.radius,

                    // Background color of the tab bar.
                    backgroundColor: colors.primary,

                    // Remove the default top border.
                    borderTopWidth: 0,

                    // Remove Android shadow.
                    elevation: 0,
                },

                // Controls spacing inside each tab button.
                tabBarItemStyle: {
                    paddingVertical:
                        tabBar.height / 2 -
                        tabBar.iconFrame / 1.6,
                },

                // Controls the size of the icon area.
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,

                    // Center icons horizontally.
                    alignItems: "center",
                },
            }}
        >

            {/* Loop through every tab in our tabs array */}
            {tabs.map((tab) => (

                // Create a screen for each tab.
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{

                        // Text shown in navigation settings.
                        title: tab.title,

                        // Custom icon renderer.
                        tabBarIcon: ({ focused }) => (

                            // Pass the focused state and icon
                            // into our custom TabIcon component.
                            <TabIcon
                                focused={focused}
                                icon={tab.icon}
                            />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
};

// Export this component so Expo Router can use it.
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