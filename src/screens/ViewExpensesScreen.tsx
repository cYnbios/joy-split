import React, { useState, useEffect } from 'react';
import { YStack, XStack, Button, Text, ScrollView } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getGroup } from '../utils/database';

interface Expense {
  id: string;
  description: string;
  amount: number;
  createdAt: number;
  paidBy: string;
}

interface Member {
  id: string;
  name: string;
}

export function ViewExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [groupName, setGroupName] = useState('');
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  useEffect(() => {
    const loadGroupData = async () => {
      const group = await getGroup(groupId);
      if (group) {
        setExpenses(group.expenses);
        setMembers(group.members);
        setGroupName(group.name);
      }
    };
    loadGroupData();
  }, [groupId]);

  const handleBack = () => {
    router.replace({ pathname: '/view-group', params: { groupId } });
  };

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="bold">
          Expenses for {groupName}
        </Text>
        <Button onPress={handleBack}>Back</Button>
      </XStack>
      <ScrollView>
        {expenses.map((expense) => (
          <XStack
            key={expense.id}
            backgroundColor="$backgroundHover"
            padding="$3"
            marginBottom="$2"
            borderRadius="$2"
            justifyContent="space-between"
          >
            <YStack>
              <Text fontWeight="bold">{expense.description}</Text>
              <Text fontSize="$2">
                Paid by: {getMemberName(expense.paidBy)}
              </Text>
            </YStack>
            <Text>${expense.amount.toFixed(2)}</Text>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
}
