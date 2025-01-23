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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import News from '../../src/HomeScreens/news';
import Updates from '../../src/HomeScreens/updates';
import Sos from '../../src/HomeScreens/sos';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Link } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;
const SWIPE_SPEED_THRESHOLD = 1;
const GESTURE_DETECTION_DELAY = 10;

const Home = () => {
  // fonts 
  // const [loaded] = useFonts({
  //   'Jaldi-Bold': require('../../assets/fonts/Jaldi-Bold.ttf'),
  //   'Jaldi-Regular': require('../../assets/fonts/Jaldi-Regular.ttf'),
  // });

  const [selectedTab, setSelectedTab] = useState<'News' | 'Updates' | 'SOS'>('News');
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const tabWidth = screenWidth / 3;

  // Gesture tracking refs
  const gestureStartTime = useRef(0);
  const initialGestureState = useRef({ dx: 0, dy: 0 });
  const isHorizontalGesture = useRef(false);

  const getTabIndex = (tab: 'News' | 'Updates' | 'SOS') => {
    return tab === 'News' ? 0 : tab === 'Updates' ? 1 : 2;
  };

  const getTabFromIndex = (index: number): 'News' | 'Updates' | 'SOS' => {
    switch (index) {
      case 0: return 'News';
      case 1: return 'Updates';
      case 2: return 'SOS';
      default: return 'News';
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

      const minPosition = -(screenWidth * 2);
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
        } else if (dx < 0 && currentIndex < 2) {
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

  const handleTabChange = (tab: 'News' | 'Updates' | 'SOS') => {
    const tabIndex = getTabIndex(tab);
    const toValue = -screenWidth * tabIndex;

    Animated.parallel([
      Animated.spring(tabIndicatorPosition, {
        toValue: tabWidth * tabIndex,
        useNativeDriver: false,
        friction: 5,
      }),
      Animated.spring(slideAnimation, {
        toValue,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
    ]).start();

    setSelectedTab(tab);
  };

  useEffect(() => {
    handleTabChange('News');
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
          <News />
        </View>
        <View style={[styles.screen]}>
          <Updates />
        </View>
        <View style={[styles.screen]}>
          <Sos />
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
          <Link href = "/profile/Profile">
            <Ionicons name="person-circle-outline" size={32} color="grey" style={{ marginLeft: 20 }} />
          </Link>
        </View>
      </View>

      <View style={styles.tabs}>
        <Animated.View
          style={[
            styles.tabIndicator,
            { width: tabWidth, transform: [{ translateX: tabIndicatorPosition }] },
          ]}
        />

        <TouchableOpacity onPress={() => handleTabChange('News')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'News' && styles.activeTabText]}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Updates')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'Updates' && styles.activeTabText]}>Updates</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('SOS')} style={styles.tab}>
          <Text style={[styles.tabText, selectedTab === 'SOS' && styles.activeTabText]}>SOS</Text>
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
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  contentContainer: {
    width: screenWidth * 3,
    flex: 1,
  },
  screen: {
    width: screenWidth,
    flex: 1,
  },
});

export default Home;