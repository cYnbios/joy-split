import { useState, useEffect, useCallback, useRef } from 'react';
import { YStack, XStack, Button, Text, ScrollView, Stack } from 'tamagui';
import { Plus, Minus } from '@tamagui/lucide-icons';
import { getGroups, removeGroup } from '../utils/database';
import { useRouter } from 'expo-router';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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

  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const scrollOffset = useRef(0);

  const topGradientOpacity = useRef(new Animated.Value(0)).current;
  const bottomGradientOpacity = useRef(new Animated.Value(0)).current;

  const animateGradient = useCallback(
    (gradientOpacity: Animated.Value, toValue: number) => {
      Animated.timing(gradientOpacity, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    []
  );

  useEffect(() => {
    animateGradient(topGradientOpacity, showTopGradient ? 1 : 0);
  }, [showTopGradient]);

  useEffect(() => {
    animateGradient(bottomGradientOpacity, showBottomGradient ? 1 : 0);
  }, [showBottomGradient]);

  const handleContentSizeChange = useCallback(
    (_: number, height: number) => {
      setContentHeight(height);
      updateGradientVisibility(scrollOffset.current, height);
    },
    [scrollViewHeight]
  );

  const handleLayoutChange = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      setScrollViewHeight(height);
      updateGradientVisibility(scrollOffset.current, contentHeight);
    },
    [contentHeight]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollOffset.current = offsetY;
      updateGradientVisibility(offsetY, contentHeight);
    },
    [contentHeight]
  );

  const updateGradientVisibility = useCallback(
    (offsetY: number, contentHeight: number) => {
      const isScrolledToBottom = offsetY + scrollViewHeight >= contentHeight;
      setShowTopGradient(offsetY > 0);
      setShowBottomGradient(
        contentHeight > scrollViewHeight && !isScrolledToBottom
      );
    },
    [scrollViewHeight]
  );

  const AnimatedLinearGradient =
    Animated.createAnimatedComponent(LinearGradient);

  return (
    <YStack flex={1} padding="$4">
      {groups.length === 0 ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Button size="$6" circular icon={Plus} onPress={handleAddGroup} />
          <Text fontSize="$8">Add your first group</Text>
        </YStack>
      ) : (
        <YStack flex={1}>
          <YStack flex={0.05} />
          <YStack flex={0.95}>
            <YStack
              alignItems="center"
              justifyContent="center"
              marginBottom="$4"
            >
              <Button size="$6" circular icon={Plus} onPress={handleAddGroup} />
            </YStack>
            <Stack flex={1} overflow="hidden">
              <ScrollView
                onContentSizeChange={handleContentSizeChange}
                onLayout={handleLayoutChange}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                <YStack gap="$2">
                  {groups.map((group) => (
                    <XStack
                      key={group.id}
                      backgroundColor="$backgroundHover"
                      padding="$3"
                      borderRadius="$2"
                      alignItems="center"
                      justifyContent="space-between"
                      onPress={() => handleViewGroup(group.id)}
                      gap="$4"
                    >
                      <Text>{group.name}</Text>
                      <Button
                        size="$2"
                        icon={Minus}
                        onPress={() => {
                          handleRemoveGroup(group.id);
                        }}
                        theme="red"
                      />
                    </XStack>
                  ))}
                </YStack>
              </ScrollView>
              <AnimatedLinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 40,
                  opacity: topGradientOpacity,
                  pointerEvents: 'none',
                }}
              />
              <AnimatedLinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 40,
                  opacity: bottomGradientOpacity,
                  pointerEvents: 'none',
                }}
              />
            </Stack>
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}
