import React, { useState } from 'react';
import { YStack, Input, Button } from 'tamagui';
import { useRouter } from 'expo-router';

export function AddGroupNameScreen() {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (groupName.trim()) {
      router.push({ pathname: '/add-group-members', params: { groupName } });
    }
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <Input
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Enter group name"
      />
      <Button onPress={handleNext}>Next</Button>
    </YStack>
  );
}
