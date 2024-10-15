import React, { useState } from 'react';
import { YStack, XStack, Input, Button, Text, ScrollView } from 'tamagui';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addGroup } from '../utils/database';

interface Member {
  id: string;
  name: string;
  balance: number;
}

export function AddGroupMembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMember, setCurrentMember] = useState('');
  const router = useRouter();
  const { groupName } = useLocalSearchParams<{ groupName: string }>();

  const addMember = () => {
    if (currentMember.trim()) {
      setMembers([
        ...members,
        { id: Date.now().toString(), name: currentMember.trim(), balance: 0 },
      ]);
      setCurrentMember('');
    }
  };

  const createGroup = async () => {
    try {
      await addGroup({ name: groupName, members });
      router.push('/');
    } catch (error) {
      console.error('Failed to create group', error);
    }
  };

  return (
    <YStack flex={1} padding="$4" space="$4">
      <XStack space="$2">
        <Input
          flex={1}
          value={currentMember}
          onChangeText={setCurrentMember}
          placeholder="Enter member name"
        />
        <Button onPress={addMember}>Add Member</Button>
      </XStack>
      <ScrollView>
        {members.map((member) => (
          <Text key={member.id}>{member.name}</Text>
        ))}
      </ScrollView>
      <Button onPress={createGroup}>Create Group</Button>
    </YStack>
  );
}
