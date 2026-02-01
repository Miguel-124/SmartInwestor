import React from "react";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";

import DashboardScreen from "../screens/DashboardScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import MetricsScreen from "../screens/MetricsScreen";
import AdviceScreen from "../screens/AdviceScreen";
import SettingsScreen from "../screens/SettingsScreen";

export type RootStackParamList = {
  Dashboard: undefined;
  Portfolio: { id?: string };
  Metrics: { id?: string };
  Advice: { id?: string };
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
      Portfolio: "portfolio/:id?",
      Metrics: "metrics/:id?",
      Advice: "advice/:id?",
      Settings: "settings",
    },
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Portfolio" component={PortfolioScreen} />
        <Stack.Screen name="Metrics" component={MetricsScreen} />
        <Stack.Screen name="Advice" component={AdviceScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
