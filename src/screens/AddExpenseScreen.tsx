import React, { useState, useEffect } from 'react';
import { YStack, Input, Button, Text } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addExpense, getGroup } from '../utils/database';

export function AddExpenseScreen() {
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [payer, setPayer] = useState({ id: '', name: '' });
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();
  const {
    groupId,
    payerId,
    payerName,
    expenseName: expenseNameParam,
    expenseAmount: expenseAmountParam,
  } = useLocalSearchParams<{
    groupId: string;
    payerId?: string;
    payerName?: string;
    expenseName?: string;
    expenseAmount?: string;
  }>();

  useEffect(() => {
    const loadMembers = async () => {
      const group = await getGroup(groupId);
      if (group) {
        setMembers(group.members);
      }
    };
    loadMembers();
  }, [groupId]);

  useEffect(() => {
    if (payerId && payerName) {
      setPayer({ id: payerId, name: payerName });
    }
    if (expenseNameParam) {
      setExpenseName(expenseNameParam);
    }
    if (expenseAmountParam) {
      setExpenseAmount(expenseAmountParam);
    }
  }, [payerId, payerName, expenseNameParam, expenseAmountParam]);

  const handleSelectPayer = () => {
    router.replace({
      pathname: '/select-payer',
      params: { groupId, expenseName, expenseAmount },
    });
  };

  const handleSave = async () => {
    if (!expenseName.trim() || !expenseAmount.trim() || !payer.id) {
      // Show an error message or alert
      return;
    }

    try {
      const amount = parseFloat(expenseAmount);
      if (isNaN(amount)) {
        // Show an error message for invalid amount
        return;
      }

      await addExpense(groupId, expenseName, amount, payer.id);

      // Navigate back to the group view
      router.replace({ pathname: '/view-group', params: { groupId } });
    } catch (error) {
      console.error('Failed to save expense', error);
      // Show an error message to the user
    }
  };

  const handleCancel = () => {
    router.replace({ pathname: '/view-group', params: { groupId } });
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Text fontSize="$6" fontWeight="bold">
        Add Expense
      </Text>
      <Input
        value={expenseName}
        onChangeText={setExpenseName}
        placeholder="Expense Name"
      />
      <Input
        value={expenseAmount}
        onChangeText={setExpenseAmount}
        placeholder="Amount ($)"
        keyboardType="numeric"
      />
      <Button onPress={handleSelectPayer}>
        {payer.name ? `Paid by: ${payer.name}` : 'Select Payer'}
      </Button>
      <Button onPress={handleSave} theme="active">
        Save
      </Button>
      <Button onPress={handleCancel}>Cancel</Button>
    </YStack>
  );
}
