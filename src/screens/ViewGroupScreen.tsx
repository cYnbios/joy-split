import React from 'react';
import { YStack, Text, Button, ScrollView, XStack } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getGroups } from '../utils/database';
import { Plus } from '@tamagui/lucide-icons';

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
      <Button onPress={() => router.replace('/')}>Back to Home</Button>
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
      <Button
        onPress={() =>
          router.replace({ pathname: '/settle-up', params: { groupId } })
        }
        theme="green"
        marginVertical="$2"
      >
        Settle Up
      </Button>
      <Text>Total Expenses: {/* Display total expenses here */}</Text>
      <XStack space="$2" marginTop="$4">
        <Button
          flex={1}
          icon={Plus}
          onPress={() =>
            router.replace({ pathname: '/add-expense', params: { groupId } })
          }
          theme="active"
        >
          Add Expense
        </Button>
        <Button
          flex={1}
          onPress={() =>
            router.replace({ pathname: '/view-expenses', params: { groupId } })
          }
          theme="blue"
        >
          View Expenses
        </Button>
      </XStack>
    </YStack>
  );
}
