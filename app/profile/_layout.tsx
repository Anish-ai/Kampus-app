import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ProfileLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="Profile"
        />
        <Stack.Screen
          name="Settings"
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default ProfileLayout;