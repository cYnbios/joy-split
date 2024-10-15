import React, { useState, useEffect } from 'react';
import { YStack, Text, Button, ScrollView } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getGroup } from '../utils/database';

interface Member {
  id: string;
  name: string;
  balance: number;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
}

export function SettleUpScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadGroupData = async () => {
      const group = await getGroup(groupId);
      if (group) {
        setMembers(group.members);
        const optimizedTransactions = calculateOptimizedTransactions(
          group.members
        );
        setTransactions(optimizedTransactions);
      }
    };
    loadGroupData();
  }, [groupId]);

  const calculateOptimizedTransactions = (members: Member[]): Transaction[] => {
    const debtors = members
      .filter((m) => m.balance < 0)
      .sort((a, b) => a.balance - b.balance);
    const creditors = members
      .filter((m) => m.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    const transactions: Transaction[] = [];

    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: Number(amount.toFixed(2)),
      });

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 0.01) debtors.shift();
      if (creditor.balance < 0.01) creditors.shift();
    }

    return transactions;
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Button
        onPress={() =>
          router.replace({ pathname: '/view-group', params: { groupId } })
        }
      >
        Back to Group
      </Button>
      <Text fontSize="$6" fontWeight="bold">
        Settle Up
      </Text>
      <ScrollView>
        {transactions.map((transaction, index) => (
          <Text key={index} marginVertical="$2">
            {transaction.from} owes {transaction.to} $
            {transaction.amount.toFixed(2)}
          </Text>
        ))}
      </ScrollView>
    </YStack>
  );
}
