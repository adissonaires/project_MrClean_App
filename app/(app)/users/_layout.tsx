import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function UsersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'User Management',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: ({ params }) => {
            const { id } = params;
            return id === 'new' ? 'Add New User' : 'Edit User';
          },
          headerShown: true,
        }}
      />
    </Stack>
  );
}