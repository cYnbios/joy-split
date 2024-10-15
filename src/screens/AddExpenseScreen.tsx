import React, { useState } from 'react';
import { YStack, Text, Input, Button } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addExpense } from '../utils/database';

export function AddExpenseScreen() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = async () => {
    if (description && amount) {
      try {
        await addExpense(groupId as string, description, parseFloat(amount));
        router.back();
      } catch (error) {
        console.error('Error adding expense:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Text fontSize="$6" fontWeight="bold">
        Add Expense
      </Text>
      <Input
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Input
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button onPress={handleAddExpense} theme="active">
        Add Expense
      </Button>
      <Button
        onPress={() =>
          router.replace({ pathname: '/view-group', params: { groupId } })
        }
      >
        Cancel
      </Button>
    </YStack>
  );
}
