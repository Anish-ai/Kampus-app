import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Modal, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import PostDesign from '../../components/PostDesign';
import AddPost from '../../components/AddPost';
import { Ionicons } from '@expo/vector-icons';
import { subscribeToPosts, Post, createPost } from '../../types/posts';
import { useAuth } from '../../app/context/auth';

const News = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(300))[0];
  const { user } = useAuth();

  useEffect(() => {
    // Subscribe to real-time post updates
    const unsubscribe = subscribeToPosts((updatedPosts) => {
      setPosts(updatedPosts);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddPost = async (newPost: { caption: string; image: string | null }) => {
    try {
      if (!user) return;
      const postData = {
        userId: user.uid,
        uname: user.uname || 'Anonymous',
        caption: newPost.caption,
        imageUrl: newPost.image || '',
        likes: 0,
        comments: 0,
        likedBy: [],
        createdAt: new Date()
      };
      
      await createPost(
        user.uid,
        user.uname || 'Anonymous',
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