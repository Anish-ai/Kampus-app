// /app/home/_layout.tsx
import { Tabs } from 'expo-router';
import { Stack } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomTabBar from '../../components/CustomTabBar'; // Make sure to import the CustomTabBar component
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  // Reset the Chats Tab stack when it gains focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset the stack to the Chats Screen when the Chats Tab is selected
      navigation.reset({
        index: 0,
        routes: [{ name: 'chats/ChatsScreen' }], // Ensure this matches the route name
      });
    }, [navigation])
  );

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />} // Use the custom tab bar with sliding rectangle
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          height: 40,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={focused ? 28 : 23}
            />
          ),
        }}
      >
        {/* {() => (
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen
              name="Profile"
              options={{
                headerShown: false, // Hide header for Profile screen
              }}
            />
          </Stack>
        )} */}
      </Tabs.Screen>

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'search' : 'search-outline'}
              color={color}
              size={focused ? 28 : 23}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              color={color}
              size={focused ? 28 : 23}
            />
          ),
        }}
      />
    </Tabs>
  );
}