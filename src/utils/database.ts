import AsyncStorage from '@react-native-async-storage/async-storage';

const GROUPS_KEY = 'groups';

interface Member {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
}

export async function getGroups(): Promise<Group[]> {
  try {
    const groupsJson = await AsyncStorage.getItem(GROUPS_KEY);
    return groupsJson ? JSON.parse(groupsJson) : [];
  } catch (error) {
    console.error('Failed to get groups', error);
    return [];
  }
}

export async function addGroup(group: Omit<Group, 'id'>): Promise<Group> {
  try {
    const groups = await getGroups();
    const newGroup = { ...group, id: Date.now().toString() };
    const updatedGroups = [...groups, newGroup];
    await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(updatedGroups));
    return newGroup;
  } catch (error) {
    console.error('Failed to add group', error);
    throw error;
  }
}

export async function removeGroup(groupId: string): Promise<void> {
  try {
    const groups = await getGroups();
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(updatedGroups));
  } catch (error) {
    console.error('Failed to remove group', error);
    throw error;
  }
}
