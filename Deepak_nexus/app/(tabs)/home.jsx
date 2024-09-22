import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {

  const renderActivityCard = (activity) => (

    <TouchableOpacity style={styles.activityCard} key={activity.id}>

      <Image source={{ uri: activity.image }} style={styles.activityImage} />

      <View style={styles.activityInfo}>

        <Text style={styles.activityName}>{activity.name}</Text>

        <Text style={styles.activityTime}>{activity.time}</Text>

        <Text style={styles.activityInstructor}>{activity.instructor}</Text>

      </View>

    </TouchableOpacity>
  );

  const activities = [
    { id: 1, name: 'Adult Fitness Swim', time: '11:40 AM', instructor: 'Ajay Kumar', image: 'https://example.com/swim.jpg' },
    { id: 2, name: 'Yoga Class', time: '2:00 PM', instructor: 'Priya Sharma', image: 'https://example.com/yoga.jpg' },
    { id: 3, name: 'Zumba', time: '5:30 PM', instructor: 'Rahul Verma', image: 'https://example.com/zumba.jpg' },
  ];

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>Home</Text>

        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>

      </View>

      <ScrollView>

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>Upcoming Activities</Text>

          {activities.map(renderActivityCard)}

        </View>

        <View style={styles.section}>

          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActions}>

            <TouchableOpacity style={styles.quickActionButton}>

              <Ionicons name="calendar-outline" size={24} color="#007AFF" />

              <Text style={styles.quickActionText}>Book Class</Text>

            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>

              <Ionicons name="wallet-outline" size={24} color="#007AFF" />

              <Text style={styles.quickActionText}>Add Funds</Text>

            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>

              <Ionicons name="people-outline" size={24} color="#007AFF" />

              <Text style={styles.quickActionText}>Invite Friend</Text>

            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>

  );
}

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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  section: {
    padding: 16,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  activityCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  
  activityImage: {
    width: 80,
    height: 80,
  },
  
  activityInfo: {
    flex: 1,
    padding: 12,
  },
  
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  activityTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  
  activityInstructor: {
    fontSize: 14,
    marginTop: 4,
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '30%',
  },
  
  quickActionText: {
    marginTop: 8,
    textAlign: 'center',
  },
  
});