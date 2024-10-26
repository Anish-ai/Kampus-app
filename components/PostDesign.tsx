import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../app/context/auth';

type PostDesignProps = {
    initialLikes: number;
    caption: string;
    image: string;
    comments: number;
};

const PostDesign: React.FC<PostDesignProps> = ({ initialLikes, caption, image, comments }) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useAuth();

    const handleLikePress = () => {
        if (isLiked) {
            setLikes(likes - 1); // Decrease likes if already liked
        } else {
            setLikes(likes + 1); // Increase likes if not liked
        }
        setIsLiked(!isLiked); // Toggle like state
    };

    return (
        <View style={styles.post}>
            {/* Post Header */}
            <View style={styles.postHeader}>
                <Ionicons name="person-circle-outline" size={34} color="white" />
                <Text style={styles.username}>{user?.uname}</Text>
                <MaterialIcons name="more-vert" size={24} color="white" style={styles.moreIcon} />
            </View>

            <View style={styles.postBorder}>
                {/* Post Image */}
                {image ? (
                    <View style={styles.ImageContainer}>
                        <Image source={{ uri: image }} style={styles.postImage} />
                    </View>
                ) : (
                    <Text style={styles.noImageText}>No Image</Text>
                )}

                {/* Post Content */}
                <Text style={styles.postContent}>{caption}</Text>

                {/* Post Actions */}
                <View style={styles.postActions}>
                    <TouchableOpacity onPress={handleLikePress}>
                        <Text style={styles.actionText}>
                            {isLiked ? '❤️' : '🤍'} {likes}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.actionText}>
                        💬 {comments}
                    </Text>
                </View>


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    post: {
        backgroundColor: 'black',
        padding: 10,
        paddingRight: 20,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: -6,
    },
    username: {
        color: 'white',
        fontSize: 23,
        marginLeft: 5,
        fontFamily: 'Jaldi-Bold',
    },
    moreIcon: {
        marginLeft: 'auto',
    },
    postBorder: {
        borderWidth: 0.3,
        borderColor: '#878787',
        width: '100%',
        paddingRight: 10,
        marginLeft: 17,
        paddingTop: 10,
        borderTopWidth: 0,
        borderBottomLeftRadius: 15,
        borderRightWidth: 0,
    },
    ImageContainer: {
        width: '90%',
        height: 200,
        marginBottom: 10,
        marginLeft: 17,
    },
    postImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    noImageText: {
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Jaldi-Regular',
    },
    postContent: {
        color: 'white',
        marginBottom: 10,
        fontFamily: 'Jaldi-Regular',
        fontSize: 18,
        left: 17,
        lineHeight: 22,
        marginTop: 0,
    },
    postActions: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingLeft: 17,
        gap: 10,
        paddingBottom: 5,
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Jaldi-Regular',
    }    
});

export default PostDesign;