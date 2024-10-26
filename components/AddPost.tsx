import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface AddPostProps {
    onClose: () => void;
    onSubmit: (post: { id: string; likes: number; caption: string; image: string | null; comments: number }) => void;
}

const AddPost: React.FC<AddPostProps> = ({ onClose, onSubmit }) => {
    const [caption, setCaption] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Function to pick an image
    const pickImage = async () => {
        // Ask for permission to access media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access media library is required!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
            }
        }
    };

    const handleSubmit = () => {
        const newPost = {
            id: Math.random().toString(),
            likes: 0,
            caption,
            image: selectedImage,
            comments: 0,
        };

        onSubmit(newPost);
        onClose(); // Close dialog after submitting
    };

    return (
        <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Add a New Post</Text>

            {/* Image upload section */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                {selectedImage ? (
                    <View style={styles.imageNoContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                        <TextInput
                            style={styles.inputImage}
                            placeholder="Enter your caption..."
                            placeholderTextColor="#aaa"
                            value={caption}
                            onChangeText={setCaption}
                        />
                    </View>
                ) : (
                    <View style={styles.imageYesContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your caption..."
                            placeholderTextColor="#aaa"
                            value={caption}
                            onChangeText={setCaption}
                        />
                        <MaterialCommunityIcons name="image-plus" size={30} color="grey" />
                    </View>

                )}
            </TouchableOpacity>

            {/* Caption input */}
            {/* <TextInput
                style={styles.input}
                placeholder="Enter your caption..."
                placeholderTextColor="#aaa"
                value={caption}
                onChangeText={setCaption}
            /> */}

            {/* Submit and Cancel buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dialogContainer: {
        backgroundColor: '#333',
        padding: 20,
        borderTopEndRadius: 40,
        borderTopStartRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogTitle: {
        fontSize: 25,
        color: '#fff',
        fontFamily: 'Jaldi-Bold',
    },
    imagePicker: {
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    imagePickerText: {
        color: '#fff',
        fontFamily: 'Jaldi-Regular',
        fontSize: 18,
    },
    imageNoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        flexDirection: 'column',
    },
    imageYesContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
        backgroundColor: 'black',
        borderRadius: 50,
    },
    selectedImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        color: '#fff',
        padding: 10,
        borderRadius: 10,
        fontFamily: 'Jaldi-Regular',
        fontSize: 16,
    },
    inputImage: {
        width: 300,
        color: '#fff',
        padding: 10,
        borderRadius: 30,
        fontFamily: 'Jaldi-Regular',
        fontSize: 16,
        backgroundColor: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'grey',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#0088CC',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Jaldi-Bold',
        fontSize: 18,
    },
});

export default AddPost;