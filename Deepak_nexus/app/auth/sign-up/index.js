import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from './../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
    const navigation = useNavigation();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const OnCreateAccount = async () => {
        if (!email || !password || !fullName) {
            ToastAndroid.show('Please enter all details!', ToastAndroid.LONG);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const db = getFirestore();
            await setDoc(doc(db, 'users', user.uid), {
                fullName: fullName,
                email: email,
                balance: 0
            });

            ToastAndroid.show('Account created successfully!', ToastAndroid.LONG);
            router.replace('/home');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error creating account:', errorMessage);
            ToastAndroid.show("Error creating account: " + errorMessage, ToastAndroid.LONG);
        }
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

                <Animated.Text entering={SlideInRight.duration(800)} style={styles.title}>
                    Create New Account
                </Animated.Text>

                <Animated.View entering={SlideInLeft.duration(800).delay(300)} style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        placeholder='Enter Full Name'
                        style={styles.input}
                        onChangeText={(value) => setFullName(value)}
                        placeholderTextColor="#A0A0A0"
                    />
                </Animated.View>

                <Animated.View entering={SlideInRight.duration(800).delay(600)} style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder='Enter Email'
                        style={styles.input}
                        onChangeText={(value) => setEmail(value)}
                        placeholderTextColor="#A0A0A0"
                    />
                </Animated.View>

                <Animated.View entering={SlideInLeft.duration(800).delay(900)} style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='Enter Password'
                        style={styles.input}
                        onChangeText={(value) => setPassword(value)}
                        placeholderTextColor="#A0A0A0"
                    />
                </Animated.View>

                <Animated.View entering={FadeIn.duration(1000).delay(1200)} style={styles.buttonContainer}>
                    <TouchableOpacity onPress={OnCreateAccount} style={styles.createAccountButton}>
                        <Text style={styles.buttonText}>Create Account ✏️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => router.replace('auth/sign-in')}
                    >
                        <Text style={styles.signInText}>Sign In 🔑</Text>
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
        paddingTop: 50,
        height: '100%',
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontFamily: 'outfit-bold',
        fontSize: 36,
        marginTop: 30,
        marginBottom: 30,
        textAlign: 'center',
        color: 'white',
    },
    inputContainer: {
        marginBottom: 20,
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
        marginTop: 30,
    },
    createAccountButton: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 15,
        marginBottom: 20,
    },
    signInButton: {
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
    signInText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'outfit-bold',
        fontSize: 18,
    },
});