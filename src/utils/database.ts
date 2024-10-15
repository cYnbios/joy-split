import AsyncStorage from '@react-native-async-storage/async-storage';

const GROUPS_KEY = 'groups';

interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  createdAt: number;
  paidBy: string; // ID of the member who paid
}

interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
}

export async function getGroup(groupId: string): Promise<Group | null> {
  try {
    const groups = await getGroups();
    return groups.find((group) => group.id === groupId) || null;
  } catch (error) {
    console.error('Failed to get group', error);
    return null;
  }
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

export async function addExpense(
  groupId: string,
  description: string,
  amount: number,
  paidBy: string
): Promise<Expense> {
  try {
    const groups = await getGroups();
    const groupIndex = groups.findIndex((group) => group.id === groupId);

    if (groupIndex === -1) {
      throw new Error('Group not found');
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      createdAt: Date.now(),
      paidBy,
    };

    groups[groupIndex].expenses = groups[groupIndex].expenses || [];
    groups[groupIndex].expenses.push(newExpense);

    await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
    return newExpense;
  } catch (error) {
    console.error('Failed to add expense', error);
    throw error;
  }
}
