import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { styles } from "./BottomBar.styles";
import { useTheme } from '../theme/ThemeContext';

const icons: Record<string, string> = {
  Chats: "chatbubble-ellipses-outline",
  Home: "home-outline",
  Profile: "person-circle-outline",
};

const BottomBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.bottomBar.backgroundColor, borderColor: theme.bottomBar.borderColor }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label: string;
        if (typeof options.tabBarLabel === 'string') {
          label = options.tabBarLabel;
        } else if (typeof options.title === 'string') {
          label = options.title;
        } else {
          label = route.name;
        }
        const isFocused = state.index === index;
        const iconName = icons[route.name] || 'ellipse-outline';
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={() => {
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            }}
            style={[styles.item, isFocused && { opacity: 1 }, !isFocused && { opacity: 0.6 }]}
          >
            <Ionicons
              name={iconName as any}
              size={24}
              color={isFocused ? theme.bottomBar.activeIcon : theme.bottomBar.inactiveIcon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomBar;
