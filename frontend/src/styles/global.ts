import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Define global colors, spacing, and sizes
export const colors = {
  background: "#F0F2F5",
  cardBackground: "#FFFFFF",
  primary: "#4AAFFE",
  primaryDark: "#328FD1",
  text: "#333333",
  placeholder: "#999999",
  border: "#E0E0E0",
  overlay: "rgba(0,0,0,0.4)",
  headerBg: "#4AAFFE",
  headerText: "#FFFFFF",
  footerBg: "rgba(0,0,0,0.5)",
  footerText: "#EEEEEE",
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
};

export const sizes = {
  screenWidth: width,
  screenHeight: height,
  cardMaxWidth: 1440,
  cardMinWidth: 500,
};

export const globalStyles = StyleSheet.create({
  background: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },

  // Styles for header
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: colors.headerBg,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.headerText,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Styles for main container and card
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
    alignSelf: "center",
    maxWidth: sizes.cardMaxWidth,
    minWidth: sizes.cardMinWidth,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.text,
  },

  // Styles for input fields and buttons
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: spacing.md,
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: colors.background,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
  switchText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.sm,
    color: colors.primaryDark,
  },

  // Styles for footer
  footer: {
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.footerBg,
  },
  footerText: {
    fontSize: 12,
    color: colors.footerText,
  },

  // Styles for password input and visibility toggle
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -20 }],
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});
