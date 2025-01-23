// /app/(auth)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="Signup"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;