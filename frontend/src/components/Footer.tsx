import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../styles/global";

export const Footer: React.FC = () => (
  <View style={globalStyles.footer}>
    <Text style={globalStyles.footerText}>
      © {new Date().getFullYear()} SmartInwestor
    </Text>
  </View>
);
