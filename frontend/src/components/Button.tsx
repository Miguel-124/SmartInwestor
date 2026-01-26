import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme";

export const Button = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: theme.colors.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: "#fff" }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
