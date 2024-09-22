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

// Get device dimensions
const { width, height } = Dimensions.get('window');

export default function Home({ navigation }) {
  // Animated values for different sections
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      // Reset animation values to 0 before playing them again
      fadeAnim1.setValue(0);
      fadeAnim2.setValue(0);
      fadeAnim3.setValue(0);
      fadeAnim4.setValue(0);

      // Sequence of animations that triggers every time the screen comes into focus
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ActivityCentre</Text>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle-outline" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Section */}
        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim1, alignItems: 'center' }}>
            <Ionicons name="ios-happy-outline" size={100} color="#007AFF" />
            <Text style={styles.title}>Welcome to ActivityCentre</Text>
            <Text style={styles.subtitle}>
              Your hub for managing and participating in activities.
            </Text>
          </Animated.View>
        </View>

        {/* Feature 1: Create Activities */}
        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim2, flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/activity.jpg')} // Replace with your image path
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

        {/* Feature 2: Manage Wallet */}
        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim3, flexDirection: 'row-reverse', alignItems: 'center' }}>
            <Image
              source={require('../../assets/images/wallet.jpg')} // Replace with your image path
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

        {/* Feature 3: Real-Time Updates */}
        <View style={styles.section}>
          <Animated.View style={{ opacity: fadeAnim4, alignItems: 'center' }}>
            <Ionicons name="ios-sync-outline" size={80} color="#FF9500" />
            <Text style={styles.featureTitle}>Real-Time Updates</Text>
            <Text style={styles.featureDescription}>
              Stay updated with the latest activities and wallet changes in real-time.
            </Text>
          </Animated.View>
        </View>

        {/* Get Started Button */}
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

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  section: {
    width: width * 0.9,
    marginBottom: 30,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
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
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
  featureImage: {
    width: 80,
    height: 80,
    marginRight: 20,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  featureDescription: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
  },
  getStartedButton: {
    backgroundColor: '#007AFF',
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
