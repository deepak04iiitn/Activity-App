import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs, orderBy, doc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Activity({ navigation }) {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { isDark, colors, toggleTheme } = useTheme();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [activeTab, selectedDate, user]);

  const fetchActivities = async () => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const db = getFirestore();
    const activitiesRef = collection(db, 'activities');
    const now = new Date();

    let q;
    if (activeTab === 'Upcoming') {
      q = query(
        activitiesRef,
        where('userId', '==', user.uid),
        where('date', '>=', now.toISOString()),
        orderBy('date', 'asc')
      );
    } else {
      // Past tab
      q = query(
        activitiesRef,
        where('userId', '==', user.uid),
        where('date', '<', now.toISOString()),
        orderBy('date', 'desc')
      );
    }

    try {
      const querySnapshot = await getDocs(q);
      const fetchedActivities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      Alert.alert('Error', 'Failed to fetch activities. Please try again.');
    }
  };

  const cancelActivity = async (activityId, activityPrice) => {
    const db = getFirestore();
    const activityDocRef = doc(db, 'activities', activityId);
    const userDocRef = doc(db, 'users', user.uid);

    Alert.alert(
      "Cancel Activity",
      "Are you sure you want to cancel this activity?",
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await deleteDoc(activityDocRef);
              
              // Update user's balance
              await updateDoc(userDocRef, {
                balance: increment(-activityPrice)
              });

              fetchActivities(); // Refresh the list after deletion
              Alert.alert("Success", "Activity cancelled and balance updated.");
            } catch (error) {
              console.error("Error cancelling activity: ", error);
              Alert.alert("Error", "Failed to cancel activity. Please try again.");
            }
          }
        }
      ]
    );
  };

  const renderDateSelector = () => {
    const dates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
  
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
        {dates.map((date, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.dateButton,
              selectedDate.toDateString() === date.toDateString() && [
                styles.selectedDateButton,
                { backgroundColor: colors.primary, borderColor: colors.primary }
              ]
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={[
              styles.dateButtonDay, 
              selectedDate.toDateString() === date.toDateString() && { color: colors.background }
            ]}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </Text>
            <Text style={[
              styles.dateButtonDate,
              selectedDate.toDateString() === date.toDateString() && { color: colors.background }
            ]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };


  const ActivityCard = ({ activity }) => (
    <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: activity.image }} style={styles.activityImage} />
      <View style={styles.activityInfo}>
        <Text style={[styles.activityName, { color: colors.text }]}>{activity.name}</Text>
        <Text style={[styles.activityTime, { color: colors.secondary }]}>
          {new Date(activity.startTime).toLocaleTimeString()} - {new Date(activity.endTime).toLocaleTimeString()}
        </Text>
        <Text style={[styles.activityInstructor, { color: colors.text }]}>{activity.instructor}</Text>
        <Text style={[styles.activityPrice, { color: colors.primary }]}>₹ {activity.price}</Text>
        <Text style={[styles.activityCapacity, { color: colors.secondary }]}>
          {activity.currentCapacity}/{activity.capacity}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => cancelActivity(activity.id, activity.price)}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const filterActivitiesByDate = (activities) => {
    if (activeTab === 'Upcoming') {
      return activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === selectedDate.toDateString();
      });
    }
    return activities; // For the past tab, all activities already come filtered
  };

  const filterActivitiesBySearch = (activities) => {
    if (!searchQuery) return activities;
    return activities.filter(activity => 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const filteredActivities = filterActivitiesBySearch(filterActivitiesByDate(activities));

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
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    headerIcons: {
      flexDirection: 'row',
    },
    headerIcon: {
      marginLeft: 16,
    },
    searchContainer: {
      padding: 16,
      backgroundColor: colors.background,
    },
    searchInput: {
      backgroundColor: colors.card,
      padding: 8,
      borderRadius: 8,
      fontSize: 16,
      color: colors.text,
    },
    tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      color: colors.secondary,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    dateSelector: {
      paddingVertical: 8,
      maxHeight: 80,
    },
    dateButton: {
      alignItems: 'center',
      padding: 8,
      marginRight: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
    },
    selectedDateButton: {
      backgroundColor: colors.primary,
    },
    dateButtonDay: {
      fontSize: 12,
    },
    dateButtonDate: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    activitiesList: {
      padding: 16,
    },
    activityCard: {
      flexDirection: 'row',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    },
    activityImage: {
      width: 100,
      height: '100%',
    },
    activityInfo: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    activityName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    activityTime: {
      fontSize: 14,
      marginTop: 4,
    },
    activityInstructor: {
      fontSize: 14,
      marginTop: 4,
    },
    activityPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
    },
    activityCapacity: {
      fontSize: 14,
      marginTop: 4,
    },
    cancelButton: {
      backgroundColor: '#FF0000',
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    noActivitiesText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: colors.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search" size={24} color={colors.text} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={24}
              color={colors.text}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities or instructors"
            placeholderTextColor={colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]} 
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Past' && styles.activeTab]} 
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Upcoming' && renderDateSelector()}

      <ScrollView style={styles.activitiesList}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        ) : (
          <Text style={styles.noActivitiesText}>No activities available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}