import React from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import DashboardPage from "../screens/DashboardScreen";
import PortfolioPage from "../screens/PortfolioScreen";
import MetricsPage from "../screens/MetricsScreen";
import AdvicePage from "../screens/AdviceScreen";
import SettingsPage from "../screens/SettingsScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  Portfolio: { id: string };
  Metrics: { id: string };
  Advice: { id: string };
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: Platform.select({
    web: [typeof window !== "undefined" ? window.location.origin + "/" : "/"],
    default: ["/"],
  })!,
  config: {
    screens: {
      Dashboard: "",
      Portfolio: "portfolio/:id",
      Metrics: "metrics/:id",
      Advice: "advice/:id",
      Settings: "settings",
    },
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="Portfolio" component={PortfolioPage} />
        <Stack.Screen name="Metrics" component={MetricsPage} />
        <Stack.Screen name="Advice" component={AdvicePage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
