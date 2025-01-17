// /app/profile/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const SearchLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="Search"
        />
        <Stack.Screen
          name="id" options={{
            headerShown: true, // Ensure the header is visible
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default SearchLayout;