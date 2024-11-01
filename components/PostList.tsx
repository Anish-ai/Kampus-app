// components/PostList.tsx
import React from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface PostListProps {
    posts: string[]; // Array of post image URLs
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
    const numColumns = 3; // Number of columns in the grid

    return (
        <FlatList
            data={posts}
            renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                    <Image source={{ uri: item }} style={styles.image} />
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.grid}
        />
    );
};

const styles = StyleSheet.create({
    grid: {
        padding: 5,
    },
    itemContainer: {
        flex: 1,
        margin: 5,
    },
    image: {
        width: (width / 3) - 10, // Subtract margins to fit three images
        height: (width / 3) - 10, // Keep the aspect ratio square
        borderRadius: 10, // Optional: add some rounding
    },
});

export default PostList;
