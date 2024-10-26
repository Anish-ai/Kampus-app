import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  PanResponderGestureState,
  GestureResponderEvent
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Allchats from '../../src/ChatsScreens/AllChats';
import Community from '../../src/ChatsScreens/Community';
import GroupChats from '../../src/ChatsScreens/Groups';
import Status from '../../src/ChatsScreens/Status';
import { Link } from 'expo-router';
import ChatDesign from '../../components/ChatDesign';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

const screenWidth = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;
const SWIPE_SPEED_THRESHOLD = 0.5;
const GESTURE_DETECTION_DELAY = 10;

const ChatsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<'Allchats' | 'Groups' | 'Community' | 'Status'>('Allchats');
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const tabWidth = screenWidth / 4;

  // Gesture tracking refs
  const gestureStartTime = useRef(0);
  const initialGestureState = useRef({ dx: 0, dy: 0 });
  const isHorizontalGesture = useRef(false);

  const getTabIndex = (tab: 'Allchats' | 'Groups' | 'Community' | 'Status') => {
    return tab === 'Allchats' ? 0 : tab === 'Groups' ? 1 : tab === 'Community' ? 2 : 3;
  };

  const getTabFromIndex = (index: number): 'Allchats' | 'Groups' | 'Community' | 'Status' => {
    switch (index) {
      case 0: return 'Allchats';
      case 1: return 'Groups';
      case 2: return 'Community';
      case 3: return 'Status';
      default: return 'Allchats';
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const { dx, dy } = gestureState;
      
      if (!gestureStartTime.current) {
        gestureStartTime.current = Date.now();
        initialGestureState.current = { dx, dy };
        isHorizontalGesture.current = false;
        return false;
      }

      if (Date.now() - gestureStartTime.current < GESTURE_DETECTION_DELAY) {
        return false;
      }

      const isHorizontal = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
      isHorizontalGesture.current = isHorizontal;
      
      return isHorizontal;
    },
    onPanResponderGrant: () => {
      slideAnimation.extractOffset();
    },
    onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      if (!isHorizontalGesture.current) return;

      const currentIndex = getTabIndex(selectedTab);
      const currentOffset = -currentIndex * screenWidth;
      const proposedPosition = currentOffset + gestureState.dx;
      
      const minPosition = -(screenWidth * 3); // Updated for 4 tabs (0-3)
      const maxPosition = 0;
      
      if (proposedPosition <= maxPosition && proposedPosition >= minPosition) {
        slideAnimation.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      gestureStartTime.current = 0;
      initialGestureState.current = { dx: 0, dy: 0 };

      if (!isHorizontalGesture.current) return;

      slideAnimation.flattenOffset();
      const currentIndex = getTabIndex(selectedTab);
      const { dx, vx } = gestureState;
      
      let newIndex = currentIndex;

      if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > SWIPE_SPEED_THRESHOLD) {
        if (dx > 0 && currentIndex > 0) {
          newIndex = currentIndex - 1;
        } else if (dx < 0 && currentIndex < 3) { // Updated for 4 tabs
          newIndex = currentIndex + 1;
        }
      }
      
      handleTabChange(getTabFromIndex(newIndex));
    },
    onPanResponderTerminate: () => {
      gestureStartTime.current = 0;
      initialGestureState.current = { dx: 0, dy: 0 };
      isHorizontalGesture.current = false;
    },
  });

  const handleTabChange = (tab: 'Allchats' | 'Groups' | 'Community' | 'Status') => {
    const tabIndex = getTabIndex(tab);
    const toValue = -screenWidth * tabIndex;

    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(tabIndicatorPosition, {
        toValue: tabWidth * tabIndex,
        useNativeDriver: false,
        friction: 5,
      }),
    ]).start();

    setSelectedTab(tab);
  };

  useEffect(() => {
    handleTabChange('Allchats');
  }, []);

  const renderAllContent = () => {
    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.contentContainer,
          {
            flexDirection: 'row',
            transform: [{ translateX: slideAnimation }],
          },
        ]}
      >
        <View style={[styles.screen]}>
          <Allchats />
        </View>
        <View style={[styles.screen]}>
          <GroupChats />
        </View>
        <View style={[styles.screen]}>
          <Community />
        </View>
        <View style={[styles.screen]}>
          <Status />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Kampus.png')} style={styles.kampus} />
        <View style={styles.headerIcons}>
          <Ionicons name="scan-outline" size={30} color="grey" />
          {/* <Link href="/Profile">
            <Ionicons name="person-circle-outline" size={32} color="grey" style={{ marginLeft: 20 }} />
          </Link> */}
          <Ionicons name="person-circle-outline" size={32} color="grey" style={{ marginLeft: 20 }} />
        </View>
      </View>

      <View style={styles.tabs}>
        <Animated.View
          style={[
            styles.tabIndicator,
            { width: tabWidth, transform: [{ translateX: tabIndicatorPosition }] },
          ]}
        />

        <TouchableOpacity onPress={() => handleTabChange('Allchats')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'Allchats' && styles.activeTabText]}>All Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Groups')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'Groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Community')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'Community' && styles.activeTabText]}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Status')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'Status' && styles.activeTabText]}>Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderAllContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  header: {
    height: '8%',
    backgroundColor: '#181818',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  kampus: {
    height: 50,
    width: 145,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabs: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Jaldi-Bold',
  },
  activeTabText: {
    color: '#0088CC',
  },
  tabIndicator: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#0088CC',
    bottom: 0,
    borderRadius: 2,
  },
  content: {
    width: '100%',
    flex: 1,
  },
  contentContainer: {
    width: screenWidth * 4,
    flex: 1,
  },
  screen: {
    width: screenWidth,
    flex: 1,
  },
});

export default ChatsScreen;