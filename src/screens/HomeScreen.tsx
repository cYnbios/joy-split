import { useState, useEffect } from 'react';
import { YStack, XStack, Button, Text, ScrollView, Input } from 'tamagui';
import { Plus, Minus } from '@tamagui/lucide-icons';
import { getGroups, removeGroup } from '../utils/database';
import { useRouter } from 'expo-router';
import { Modal } from 'react-native';
import { addGroup } from '../utils/database';

interface Group {
  id: string;
  name: string;
}

export function HomeScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const loadedGroups = await getGroups();
    setGroups(loadedGroups);
  };

  const handleAddGroup = () => {
    setModalVisible(true); // Show the modal
  };

  const handleCreateGroup = async () => {
    if (newGroupName.trim()) {
      // Add logic to create the group in the database
      await addGroup({ name: newGroupName, members: [] }); // Uncomment this line if you have an addGroup function
      setNewGroupName(''); // Clear the input
      setModalVisible(false); // Close the modal
      loadGroups(); // Refresh the group list
    }
  };

  const handleRemoveGroup = async (groupId: string) => {
    await removeGroup(groupId);
    loadGroups();
  };

  const handleViewGroup = (groupId: string) => {
    router.push({ pathname: '/view-group', params: { groupId } });
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

      {/* Modal for adding a new group */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <YStack flex={1} padding="$4" space="$4" backgroundColor="white">
          <Input
            value={newGroupName}
            onChangeText={setNewGroupName}
            placeholder="Enter group name"
          />
          <XStack space="$2">
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            <Button onPress={handleCreateGroup}>Next</Button>
          </XStack>
        </YStack>
      </Modal>
    </YStack>
  );
}
