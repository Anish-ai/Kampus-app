import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const tabWidth = screenWidth / state.routes.length; // Calculate the width of each tab
  const sliderPosition = useSharedValue(0); // Shared value to track the X position of the rectangle

  const handleTabPress = (route: typeof state.routes[number], index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
      sliderPosition.value = withTiming(index * tabWidth, { duration: 100 }); // Move the rectangle by tab width
    }
  };

  // Style for the sliding rectangle
  const slidingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderPosition.value }],
    };
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 70 + insets.bottom,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Sliding Rectangle Behind the Selected Tab */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: tabWidth - 80, // Set rectangle width smaller than tab width for padding
            height: 35, // Set rectangle height
            backgroundColor: '#00679B', // Rectangle color
            borderRadius: 20, // Make the rectangle rounded
            top: 5, // Align vertically at the top
            left: 40, // Add 20 padding to the left
          },
          slidingStyle, // Apply animated position
        ]}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const color = isFocused ? 'white' : 'gray'; // Set white color for focused label

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={() => handleTabPress(route, index)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Render Icon */}
            {options.tabBarIcon && options.tabBarIcon({
              color: isFocused ? 'white' : 'gray',
              focused: isFocused,
              size: 24, // Add the size property with a default value
            })}

            {/* Render Label */}
            <Text style={{ color, fontSize: 15, fontFamily: 'Jaldi-Bold', bottom: -5 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;