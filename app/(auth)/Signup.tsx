// app/(auth)/Signup.tsx
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
    ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/auth';
import { StatusBar } from 'expo-status-bar';
import { checkUsernameExists } from '../../firebaseConfig';

export default function Signup() {
    const router = useRouter();
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [uname, setUname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateUsername = (username: string) => {
        return /^[a-zA-Z0-9_]{3,20}$/.test(username);
    };
    const validatePassword = (password: string) => {
        return password.length >= 6; // You can add more validation rules here
    };

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword || !username) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateUsername(username)) {
            Alert.alert('Error', 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        try {
            // Check if username exists
            const usernameExists = await checkUsernameExists(username);
            if (usernameExists) {
                Alert.alert('Error', 'Username is already taken');
                return;
            }

            await signup(email, password, username, uname);
            router.replace('/home');
        } catch (error: any) {
            let message = 'Signup failed';
            // ... rest of your error handling remains the same
            Alert.alert('Error', message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView>
                <StatusBar style="light" />
                <View style={styles.contentContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Sign up to get started</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tell me your name 💦"
                                placeholderTextColor="#666666"
                                value={uname}
                                onChangeText={setUname}
                                autoCapitalize="none"
                                autoComplete="name"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Username</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Choose a username"
                                placeholderTextColor="#666666"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoComplete="username"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#666666"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                placeholderTextColor="#666666"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="new-password"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#666666"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoComplete="new-password"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, isLoading && styles.buttonDisabled]}
                            onPress={handleSignup}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/Login')}>
                            <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161622',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    headerContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAAAAA',
    },
    formContainer: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#1C1C28',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        gap: 8,
    },
    footerText: {
        color: '#AAAAAA',
        fontSize: 14,
    },
    footerLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});