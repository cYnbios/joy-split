import { useState, useEffect } from 'react';
import { YStack, XStack, Button, Text, ScrollView } from 'tamagui';
import { Plus, Minus } from '@tamagui/lucide-icons';
import { getGroups, removeGroup } from '../utils/database';
import { useRouter } from 'expo-router';

interface Group {
  id: string;
  name: string;
}

export function HomeScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const loadedGroups = await getGroups();
    setGroups(loadedGroups);
  };

  const handleAddGroup = () => {
    router.replace('/add-group-name');
  };

  const handleRemoveGroup = async (groupId: string) => {
    await removeGroup(groupId);
    loadGroups();
  };

  const handleViewGroup = (groupId: string) => {
    router.replace({ pathname: '/view-group', params: { groupId } });
  };

  return (
    <YStack flex={1} padding="$4">
      <Button size="$6" circular icon={Plus} onPress={handleAddGroup} />
      {groups.length === 0 ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Text margin="$4 0 0 0">Add your first group</Text>
        </YStack>
      ) : (
        <>
          <XStack
            justifyContent="space-between"
            alignItems="center"
            margin="0 0 $4 0"
          >
            <Text fontSize="$6" fontWeight="bold">
              Groups
            </Text>
          </XStack>
          <ScrollView>
            {groups.map((group) => (
              <XStack
                key={group.id}
                backgroundColor="$backgroundHover"
                padding="$3"
                marginBottom="$2"
                borderRadius="$2"
                alignItems="center"
                justifyContent="space-between"
                onPress={() => handleViewGroup(group.id)}
              >
                <Text>{group.name}</Text>
                <Button
                  size="$2"
                  icon={Minus}
                  onPress={() => handleRemoveGroup(group.id)}
                  theme="red"
                />
              </XStack>
            ))}
          </ScrollView>
        </>
      )}
    </YStack>
  );
}
