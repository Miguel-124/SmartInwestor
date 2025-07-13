import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../theme";

export const Input = (props: any) => {
  const theme = useTheme();
  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        {
          borderColor: theme.colors.border,
          color: theme.colors.text,
        },
      ]}
      placeholderTextColor={theme.colors.placeholder}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
