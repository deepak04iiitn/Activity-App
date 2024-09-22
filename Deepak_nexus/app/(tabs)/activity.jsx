import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Activity() {

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderDateSelector = () => {

    const dates = Array.from({length: 14}, (_, i) => {
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
              selectedDate.toDateString() === date.toDateString() && styles.selectedDateButton
            ]}

            onPress={() => setSelectedDate(date)}

          >

            <Text style={styles.dateButtonDay}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</Text>

            <Text style={styles.dateButtonDate}>{date.getDate()}</Text>

          </TouchableOpacity>

        ))}

      </ScrollView>

    );
  };

  const ActivityCard = ({ activity }) => (

    <View style={styles.activityCard}>

      <Image source={{ uri: activity.image }} style={styles.activityImage} />

      <View style={styles.activityInfo}>

        <Text style={styles.activityName}>{activity.name}</Text>
        <Text style={styles.activityTime}>{activity.time} • {activity.duration}</Text>
        <Text style={styles.activityInstructor}>{activity.instructor}</Text>
        <Text style={styles.activityPrice}>₹ {activity.price}</Text>
        <Text style={styles.activityCapacity}>{activity.currentCapacity}/{activity.totalCapacity}</Text>

      </View>

      <TouchableOpacity style={styles.cancelButton}>

        <Text style={styles.cancelButtonText}>Cancel</Text>

      </TouchableOpacity>

    </View>
  );

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>Activity</Text>

        <View style={styles.headerIcons}>

          <Ionicons name="search" size={24} color="black" style={styles.headerIcon} />

          <Ionicons name="options" size={24} color="black" style={styles.headerIcon} />

        </View>

      </View>
      
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
        {/* Replace with actual data */}
        {[1, 2, 3].map((_, index) => (
          <ActivityCard
            key={index}
            activity={{
              name: 'Adult Fitness Swim',
              time: '11:40 - 12:40PM',
              duration: '1 hr',
              instructor: 'Ajay Kumar',
              price: '799',
              currentCapacity: 3,
              totalCapacity: 10,
              image: 'https://example.com/image.jpg' // Replace with actual image URL
            }}

          />

        ))}

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
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  headerIcons: {
    flexDirection: 'row',
  },
  
  headerIcon: {
    marginLeft: 16,
  },
  
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  
  dateSelector: {
    padding: 16,
  },
  
  dateButton: {
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  
  selectedDateButton: {
    backgroundColor: '#000',
  },
  
  dateButtonDay: {
    fontSize: 12,
    color: '#888',
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
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  
  activityImage: {
    width: 100,
    height: 100,
  },
  
  activityInfo: {
    flex: 1,
    padding: 16,
  },
  
  activityName: {
    fontSize: 18,
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
  
  activityPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  
  activityCapacity: {
    fontSize: 14,
    color: '#888',
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
  
});