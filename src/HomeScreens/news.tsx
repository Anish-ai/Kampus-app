import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Modal, Animated, Easing, TouchableWithoutFeedback, Alert } from 'react-native';
import PostDesign from '../../components/PostDesign';
import AddPost from '../../components/AddPost';
import { Ionicons } from '@expo/vector-icons';
import { subscribeToPosts, Post, createPost } from '../../types/posts';
import { useAuth } from '../../app/context/auth';
import { auth } from '../../firebaseConfig';
import { ProfileService, Profile } from '../../types/profiles';

const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(300))[0];
  const [profile, setProfile] = useState<Profile | null>(null); // State to hold user profile data
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const fetchedProfile = await ProfileService.getProfile(currentUser.uid);
          setProfile(fetchedProfile); // Set profile data
        } catch (error) {
          console.error('Error fetching profile:', error);
          Alert.alert('Error', 'Failed to fetch profile data');
        }
      }
    };

    fetchProfile();

    // Subscribe to real-time post updates
    const unsubscribe = subscribeToPosts((updatedPosts) => {
      setPosts(updatedPosts);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddPost = async (newPost: { caption: string; image: string | null }) => {
    try {
      if (!user) return;
      
      await createPost(
        user?.uid,
        profile?.username || 'Anonymous',
        newPost.caption,
        newPost.image
      );
      closeModal();
    } catch (error) {
      console.error('Error adding post:', error);
      // Handle error (show error message to user)
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostDesign
            post={item}
            userId={user?.uid || ''}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.addButtonContainer}>
        <Ionicons name="add" size={40} color="white" onPress={openModal} />
      </View>

      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
          <AddPost onClose={closeModal} onSubmit={handleAddPost} />
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  addButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#0088CC',
    position: 'absolute',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 30,
    right: 30,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0, // Align to the bottom of the screen
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for the modal background
  },
});

export default News;