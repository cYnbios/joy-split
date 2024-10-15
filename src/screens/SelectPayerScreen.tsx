import React from 'react';
import { YStack, Button, Text, ScrollView } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getGroup } from '../utils/database';

export function SelectPayerScreen() {
  const [members, setMembers] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const router = useRouter();
  const { groupId, expenseName, expenseAmount } = useLocalSearchParams<{
    groupId: string;
    expenseName: string;
    expenseAmount: string;
  }>();

  React.useEffect(() => {
    const loadMembers = async () => {
      const group = await getGroup(groupId);
      if (group) {
        setMembers(group.members);
      }
    };
    loadMembers();
  }, [groupId]);

  const handleSelectPayer = (payerId: string, payerName: string) => {
    router.replace({
      pathname: '/add-expense',
      params: { groupId, expenseName, expenseAmount, payerId, payerName },
    });
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Text fontSize="$6" fontWeight="bold">
        Who Paid?
      </Text>
      <ScrollView>
        {members.map((member) => (
          <Button
            key={member.id}
            onPress={() => handleSelectPayer(member.id, member.name)}
            margin="$2"
          >
            {member.name}
          </Button>
        ))}
      </ScrollView>
    </YStack>
  );
}
