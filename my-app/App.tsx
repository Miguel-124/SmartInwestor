import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/MainScreen";

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Dashboard" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
