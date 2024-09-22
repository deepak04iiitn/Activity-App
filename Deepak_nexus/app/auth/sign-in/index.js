import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SignIn() {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const onSignIn = () => {
        if (!email && !password) {
            ToastAndroid.show('Please enter all details!', ToastAndroid.LONG);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                router.replace('/home');
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage, errorCode);

                if (errorCode == 'auth/invalid-credential') {
                    ToastAndroid.show("Invalid Credentials", ToastAndroid.LONG);
                }
            });
    }

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <Animated.View entering={FadeIn.duration(1000)} style={styles.content}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.Text entering={SlideInDown.duration(800).delay(300)} style={styles.title}>
                    Let's Sign You In
                </Animated.Text>

                <Animated.Text entering={SlideInDown.duration(800).delay(600)} style={styles.subtitle}>
                    Welcome Back 👋
                </Animated.Text>

                <Animated.Text entering={SlideInDown.duration(800).delay(900)} style={styles.subtitle}>
                    You've been missed !
                </Animated.Text>

                <Animated.View entering={FadeIn.duration(1000).delay(1200)} style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder='Enter Email'
                        style={styles.input}
                        onChangeText={(value) => setEmail(value)}
                        placeholderTextColor="#A0A0A0"
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1000).delay(1500)} style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='Enter Password'
                        style={styles.input}
                        onChangeText={(value) => setPassword(value)}
                        placeholderTextColor="#A0A0A0"
                    />
                </Animated.View>

                <Animated.View entering={SlideInDown.duration(800).delay(1800)} style={styles.buttonContainer}>
                    <TouchableOpacity onPress={onSignIn} style={styles.signInButton}>
                        <Text style={styles.buttonText}>Sign In 🔑</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.createAccountButton}
                        onPress={() => router.replace('auth/sign-up')}
                    >
                        <Text style={styles.createAccountText}>Create Account ✏️</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 25,
        paddingTop: 40,
        height: '100%',
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 36,
        marginTop: 30,
        textAlign: 'center',
        color: 'white',
    },
    subtitle: {
        fontFamily: 'outfit',
        fontSize: 24,
        color: '#E0E0E0',
        marginTop: 10,
        textAlign: 'center',
    },
    inputContainer: {
        marginTop: 30,
    },
    label: {
        fontFamily: 'outfit',
        color: 'white',
        marginBottom: 5,
    },
    input: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        fontFamily: 'outfit',
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonContainer: {
        marginTop: 50,
    },
    signInButton: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginBottom: 20,
    },
    createAccountButton: {
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'white',
    },
    buttonText: {
        color: Colors.WHITE,
        textAlign: 'center',
        fontFamily: 'outfit-bold',
        fontSize: 18,
    },
    createAccountText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'outfit-bold',
        fontSize: 18,
    },
});