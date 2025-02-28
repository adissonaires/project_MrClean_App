import { Stack } from 'expo-router';

export default function AssignmentsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Service Assignments',
          headerShown: true,
        }}
      />
    </Stack>
  );
}