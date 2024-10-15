import React, { useState } from 'react';
import { YStack, Input, Button, XStack } from 'tamagui';
import { useRouter } from 'expo-router';

export function AddGroupNameScreen() {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const handleNext = () => {
    if (groupName.trim()) {
      router.replace({ pathname: '/add-group-members', params: { groupName } });
    }
  };

  const handleCancel = () => {
    router.replace('/');
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <XStack justifyContent="flex-start">
        <Button onPress={handleCancel}>Cancel</Button>
      </XStack>
      <Input
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Enter group name"
      />
      <Button onPress={handleNext}>Next</Button>
    </YStack>
  );
}
