import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../app/context/auth';
import { Comment, CommentService } from '../types/posts';
import { formatDistanceToNow } from 'date-fns';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface CommentSectionProps {
    postId: string;
    onClose: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, onClose }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Subscribe to real-time comment updates
    useEffect(() => {
        if (!postId) return;

        setLoading(true);
        const unsubscribe = onSnapshot(
            doc(db, 'posts', postId),
            (snapshot) => {
                if (snapshot.exists()) {
                    const postData = snapshot.data();
                    setComments(postData.commentList || []);
                }
                setLoading(false);
            },
            (error) => {
                console.error('Error subscribing to comments:', error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || !user) return;

        try {
            await CommentService.addComment(postId, user.uid, newComment.trim());
            setNewComment('');
            // No need to manually reload comments as the snapshot listener will update automatically
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (comment: Comment) => {
        if (!user || user.uid !== comment.userId) return;

        try {
            await CommentService.deleteComment(postId, comment);
            // No need to manually reload comments as the snapshot listener will update automatically
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentContainer}>
            <View style={styles.commentHeader}>
                <TouchableOpacity style={styles.profileImageContainer}>
                    {item.profileImage ? (
                        <Image
                            source={{ uri: item.profileImage }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="white" />
                    )}
                </TouchableOpacity>
                <View style={styles.commentInfo}>
                    <Text style={styles.commentUsername}>{item.username}</Text>
                    <Text style={styles.commentTime}>
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </Text>
                </View>
                {user && user.uid === item.userId && (
                    <TouchableOpacity
                        onPress={() => handleDeleteComment(item)}
                        style={styles.deleteButton}
                    >
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.headerText}>Comments ({comments.length})</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={renderComment}
                contentContainerStyle={styles.commentsList}
                inverted={true}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    placeholderTextColor="#666"
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    onPress={handleAddComment}
                    style={[
                        styles.sendButton,
                        !newComment.trim() && styles.sendButtonDisabled
                    ]}
                    disabled={!newComment.trim()}
                >
                    <Ionicons name="send" size={24} color={newComment.trim() ? "white" : "#666"} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    commentsList: {
        padding: 15,
    },
    commentContainer: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#111',
        borderRadius: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileImageContainer: {
        marginRight: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    commentInfo: {
        flex: 1,
    },
    commentUsername: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentTime: {
        color: '#666',
        fontSize: 12,
    },
    commentText: {
        color: 'white',
        marginLeft: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#222',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'white',
        marginRight: 10,
        maxHeight: 100,
    },
    sendButton: {
        padding: 10,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    deleteButton: {
        padding: 5,
    },
});

export default CommentSection;