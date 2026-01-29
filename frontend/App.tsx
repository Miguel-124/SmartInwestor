import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/app/query";
import { AppNavigator } from "./src/app/navigation";

import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/MainScreen";

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  React.useEffect(() => {
    if (typeof window !== "undefined" && __DEV__) {
      import("@/mocks/browser").then(({ worker }) => worker.start());
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AppNavigator />
    </QueryClientProvider>
  );
}
