import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen
          name="add-group-name"
          options={{ title: 'Add Group Name' }}
        />
        <Stack.Screen
          name="add-group-members"
          options={{ title: 'Add Group Members', headerShown: false }}
        />
        <Stack.Screen
          name="view-group"
          options={{ title: 'View Group', headerShown: false }}
        />
        <Stack.Screen
          name="add-expense"
          options={{ title: 'Add Expense', headerShown: false }}
        />
      </Stack>
    </TamaguiProvider>
  );
}
