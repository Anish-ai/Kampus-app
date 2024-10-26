import React, { useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Modal, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import PostDesign from '../../components/PostDesign';
import AddPost from '../../components/AddPost';
import { Ionicons } from '@expo/vector-icons'; // For plus icon

const News = () => {
  const [posts, setPosts] = useState([
    { id: '1', likes: 600, caption: 'A beautiful day!', image: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTZ8fHxlbnwwfHx8fHw%3D', comments: 12 },
    { id: '2', likes: 1200, caption: 'Your runtime has been disconnected...', image: 'https://cdn.pixabay.com/photo/2016/09/07/11/37/sunset-1651426_640.jpg', comments: 45 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(300))[0]; // 300 is the height of the modal

  const handleAddPost = (newPost: { id: string; likes: number; caption: string; image: string | null; comments: number }) => {
    const postWithDefaultImage = {
      ...newPost,
      image: newPost.image || '',
    };
    setPosts((currentPosts) => [postWithDefaultImage, ...currentPosts]);
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Moves the modal up to its position (0 means bottom-aligned)
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // Moves the modal back down (300 is the height of the modal)
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false)); // Close modal after animation completes
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Post list */}
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostDesign
            initialLikes={item.likes}
            caption={item.caption}
            image={item.image}
            comments={item.comments}
          />
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Plus Button */}
      <View style={styles.addButtonContainer}>
        <Ionicons name="add" size={40} color="white" onPress={openModal} />
      </View>

      {/* Add Post Modal */}
      <Modal
        transparent={true}
        animationType="none" // Disable default animation
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {/* Touchable background overlay to close modal */}
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