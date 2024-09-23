import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function Home({ navigation }) {
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;

  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      fadeAnim1.setValue(0);
      fadeAnim2.setValue(0);
      fadeAnim3.setValue(0);
      fadeAnim4.setValue(0);

      Animated.stagger(300, [
        Animated.timing(fadeAnim1, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim4, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim1, fadeAnim2, fadeAnim3, fadeAnim4])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
    },
    scrollContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    section: {
      width: width * 0.9,
      marginBottom: 30,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      marginTop: 10,
      textAlign: 'center',
      color: colors.text,
    },
    featureImage: {
      width: 80,
      height: 80,
      marginRight: 20,
      borderRadius: 40,
      backgroundColor: colors.secondary,
    },
    featureTextContainer: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: colors.text,
    },
    featureDescription: {
      fontSize: 16,
      marginTop: 8,
      color: colors.text,
    },
    getStartedButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 20,
    },
    getStartedButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ActivityCentre</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons
            name="person-circle-outline"
            size={30}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim1, alignItems: 'center' }}>
            <Ionicons
              name="ios-happy-outline"
              size={100}
              color={colors.primary}
            />
            <Text style={styles.title}>Welcome to ActivityCentre</Text>
            <Text style={styles.subtitle}>
              Your hub for managing and participating in activities.
            </Text>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Animated.View
            style={{ opacity: fadeAnim2, flexDirection: 'row', alignItems: 'center' }}
          >
            <Image
              source={require('../../assets/images/activity.jpg')}
              style={styles.featureImage}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Create Activities</Text>
              <Text style={styles.featureDescription}>
                Easily create and manage your activities with our intuitive interface.
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Animated.View
            style={{ opacity: fadeAnim3, flexDirection: 'row-reverse', alignItems: 'center' }}
          >
            <Image
              source={require('../../assets/images/wallet.jpg')}
              style={styles.featureImage}
            />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Manage Wallet</Text>
              <Text style={styles.featureDescription}>
                Keep track of your balance and transactions seamlessly.
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim4, alignItems: 'center' }}>
            <Ionicons
              name="ios-sync-outline"
              size={80}
              color={colors.secondary}
            />
            <Text style={styles.featureTitle}>Real-Time Updates</Text>
            <Text style={styles.featureDescription}>
              Stay updated with the latest activities and wallet changes in real-time.
            </Text>
          </Animated.View>
        </View>

        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim4 }}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => navigation.navigate('Activity')}
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
