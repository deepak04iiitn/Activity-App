import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddActivity() {

  const [activityName, setActivityName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {

    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);

  };

  const onStartTimeChange = (event, selectedTime) => {

    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);

  };

  const onEndTimeChange = (event, selectedTime) => {

    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);

  };

  const handleAddActivity = () => {
    // Implement the logic to add the activity
    console.log('Activity added:', { activityName, instructor, price, capacity, date, startTime, endTime });
    // You would typically send this data to your backend or store it locally
  };

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Activity</Text>

        <TouchableOpacity>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>

      </View>

      <ScrollView style={styles.form}>

        <TextInput
          style={styles.input}
          placeholder="Activity Name"
          value={activityName}
          onChangeText={setActivityName}
        />

        <TextInput
          style={styles.input}
          placeholder="Instructor"
          value={instructor}
          onChangeText={setInstructor}
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>

          <Text>{date.toDateString()}</Text>

        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartTimePicker(true)}>

          <Text>{startTime.toLocaleTimeString()}</Text>

        </TouchableOpacity>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onStartTimeChange}
          />
        )}

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndTimePicker(true)}>

          <Text>{endTime.toLocaleTimeString()}</Text>

        </TouchableOpacity>

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onEndTimeChange}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>

          <Text style={styles.addButtonText}>Add Activity</Text>

        </TouchableOpacity>

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
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  
  form: {
    padding: 16,
  },
  
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  
  dateInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});