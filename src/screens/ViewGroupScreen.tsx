import React from 'react';
import { YStack, Text, Button, ScrollView } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getGroups } from '../utils/database';

export function ViewGroupScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [group, setGroup] = React.useState<any>(null);

  React.useEffect(() => {
    const loadGroup = async () => {
      const groups = await getGroups();
      const foundGroup = groups.find((g) => g.id === groupId);
      setGroup(foundGroup);
    };
    loadGroup();
  }, [groupId]);

  if (!group) {
    return <Text>Loading...</Text>;
  }

  return (
    <YStack flex={1} padding="$4">
      <Text fontSize="$6" fontWeight="bold">
        {group.name}
      </Text>
      <ScrollView>
        {group.members.map((member: any) => (
          <Text key={member.id}>
            {member.name}: {member.balance}
          </Text>
        ))}
      </ScrollView>
      <Text>Total Expenses: {/* Display total expenses here */}</Text>
      <Button onPress={() => router.push('/')}>Back to Home</Button>
    </YStack>
  );
}
