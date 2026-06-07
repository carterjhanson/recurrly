import { Tabs } from "expo-router";
import { tabs } from "@/constants/data";
import { View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components } from "@/constants/theme";

const tabBar = components.tabBar;

const TAB_ICON_SIZE = 24;
const TAB_PILL_SIZE = 48;

const TabLayout = () => {
    const insets = useSafeAreaInsets();

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
                    bottom: Math.max(
                        insets.bottom,
                        tabBar.horizontalInset
                    ),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical:
                        tabBar.height / 2 -
                        tabBar.iconFrame / 1.6,
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

export default TabLayout;