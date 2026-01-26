import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { globalStyles } from "../styles/global";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[globalStyles.card, style]}>{children}</View>
);
