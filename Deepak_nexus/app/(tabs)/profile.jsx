import React, { useEffect, useState, Suspense, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getFirestore, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import { auth } from '../../configs/FirebaseConfig';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext'; // Assume this context exists

const getColors = (isDark) => ({
  PRIMARY: isDark ? '#3a7bd5' : '#4a90e2',
  SECONDARY: isDark ? '#e67e22' : '#f39c12',
  BACKGROUND: isDark ? '#121212' : '#f5f5f5',
  TEXT: isDark ? '#fff' : '#333',
  WHITE: '#fff',
  DANGER: isDark ? '#ff6b6b' : '#e74c3c',
  CARD: isDark ? '#1e1e1e' : '#ffffff',
});

function ErrorFallback({error, resetErrorBoundary}) {
  const { isDark } = useTheme();
  const Colors = getColors(isDark);

  return (
    <View style={[styles.errorContainer, { backgroundColor: Colors.BACKGROUND }]}>
      <Text style={[styles.errorTitle, { color: Colors.DANGER }]}>Oops! Something went wrong:</Text>
      <Text style={[styles.errorMessage, { color: Colors.TEXT }]}>{error.message}</Text>
      <TouchableOpacity style={[styles.errorButton, { backgroundColor: Colors.PRIMARY }]} onPress={resetErrorBoundary}>
        <Text style={styles.errorButtonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ProfileWrapper() {
  const { isDark } = useTheme();
  const Colors = getColors(isDark);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<ActivityIndicator size="large" color={Colors.PRIMARY} />}>
        <ProfileComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProfileComponent() {
  const currUser = auth.currentUser;
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const Colors = getColors(isDark);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.BACKGROUND,
    },
    header: {
      backgroundColor: Colors.PRIMARY,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      paddingTop: 40,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: 15,
    },
    headerTitle: {
      color: Colors.WHITE,
      fontSize: 20,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: 30,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
      borderColor: Colors.PRIMARY,
      borderWidth: 2,
    },
    profileName: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 5,
      color: Colors.TEXT,
    },
    profileEmail: {
      fontSize: 16,
      color: Colors.TEXT,
    },
    balanceContainer: {
      backgroundColor: Colors.PRIMARY,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      marginBottom: 30,
    },
    balanceTitle: {
      color: Colors.WHITE,
      fontSize: 18,
      marginBottom: 10,
    },
    balanceAmount: {
      color: Colors.WHITE,
      fontSize: 32,
      fontWeight: 'bold',
    },
    button: {
      flexDirection: 'row',
      backgroundColor: Colors.SECONDARY,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      marginBottom: 15,
    },
    deleteButton: {
      backgroundColor: Colors.DANGER,
    },
    buttonText: {
      color: Colors.WHITE,
      marginLeft: 10,
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.BACKGROUND,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.BACKGROUND,
      padding: 20,
    },
    errorTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.DANGER,
      marginBottom: 10,
    },
    errorMessage: {
      fontSize: 16,
      color: Colors.TEXT,
      textAlign: 'center',
      marginBottom: 20,
    },
    errorButton: {
      backgroundColor: Colors.PRIMARY,
      padding: 10,
      borderRadius: 5,
    },
    errorButtonText: {
      color: Colors.WHITE,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  useEffect(() => {
    let unsubscribeUser;
    let unsubscribeBalance;

    const fetchUserData = async () => {
      if (!currUser) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
        return;
      }

      setIsLoading(true);
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', currUser.uid);

        unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUser(doc.data());
          } else {
            throw new Error("User document doesn't exist");
          }
        });

        unsubscribeBalance = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setBalance(doc.data().balance || 0);
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeBalance) unsubscribeBalance();
    };
  }, [currUser, navigation]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('../auth/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = getFirestore();
              await deleteDoc(doc(db, 'users', currUser.uid));
              await deleteUser(currUser);
              router.push('../auth/sign-up');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!currUser || !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>User data not available. Please sign in again.</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.errorButtonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={Colors.WHITE}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <Image
            style={styles.profileImage}
            source={{
              uri: user.profilePicture || 'https://www.w3schools.com/howto/img_avatar.png',
            }}
          />
          <Text style={styles.profileName}>{user.fullName || 'User Name'}</Text>
          <Text style={styles.profileEmail}>{currUser.email || 'Email not found'}</Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Current Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color={Colors.WHITE} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={24} color={Colors.WHITE} />
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}