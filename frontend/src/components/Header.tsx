import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { colors } from "../styles/global";

interface Tab {
  label: string;
  onPress: () => void;
}

interface HeaderProps {
  title: string;
  isLoggedIn?: boolean;
  userName?: string;
  tabs?: Tab[];
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  isLoggedIn = false,
  userName = "",
  tabs = [],
  onLogout = () => {},
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.inner}>
        <View style={styles.left}>
          <Image
            source={require("../../assets/logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>{title}</Text>
        </View>

        {isLoggedIn && (
          <View style={styles.center}>
            {tabs.map((tab, i) => (
              <Pressable
                key={i}
                onPress={tab.onPress}
                style={({ pressed }) => [
                  styles.tab,
                  pressed && styles.tabHover,
                ]}
              >
                <Text style={styles.tabText}>{tab.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {isLoggedIn ? (
          <Pressable
            onPress={() => setMenuVisible((v) => !v)}
            style={styles.right}
          >
            <Text style={styles.userName}>{userName}</Text>
            {menuVisible && (
              <View style={styles.menu}>
                <Pressable onPress={onLogout} style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Wyloguj</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    ...Platform.select({
      web: { backdropFilter: "blur(10px)" },
    }),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inner: {
    maxWidth: 1440,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 7,
  },
  appName: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  center: {
    flexDirection: "row",
  },
  tab: {
    marginHorizontal: 12,
    paddingVertical: 4,
  },
  tabHover: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.text,
  },
  right: {
    position: "relative" as const,
    cursor: "pointer",
  },
  rightPlaceholder: {
    width: 32,
  },
  userName: {
    fontSize: 16,
    color: colors.text,
  },
  menu: {
    position: "absolute" as const,
    top: "100%",
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginTop: 4,
    minWidth: 120,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: colors.text,
  },
});
