import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function AddActivity({ navigation }) {

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
  const [image, setImage] = useState(null);
  
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const selectedImageUri = result.assets ? result.assets[0].uri : result.uri;
      setImage(selectedImageUri);
    }
  };

  const uploadImage = async () => {
    if (!image) return null;

    try {
      const storage = getStorage();
      const filename = image.split('/').pop();
      const storageRef = ref(storage, `activity_images/${filename}`);

      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      console.log('Image uploaded successfully:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  const handleAddActivity = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error('No user logged in');
      return;
    }
  
    const imageUrl = await uploadImage();
  
    const activityData = {
      name: activityName,
      instructor,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      date: date.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      image: imageUrl,
      userId: user.uid,
      currentCapacity: 0,
    };
  
    const db = getFirestore();
  
    try {
      const activityRef = await addDoc(collection(db, 'activities'), activityData);
  
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(parseFloat(price)),
      });
  
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        amount: parseFloat(price),
        type: 'credit',
        status: 'completed',
        date: new Date().toISOString(),
        activityId: activityRef.id,
        activityName: activityName,
      });
  
      console.log('Activity added successfully and wallet updated');
  
      setActivityName('');
      setInstructor('');
      setPrice('');
      setCapacity('');
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      setImage(null);
  
      Alert.alert(
        'Success',
        `Activity added successfully and ₹${price} has been added to your wallet.`,
        [{ text: 'OK', onPress: () => router.push('/activity') }]
      );
    } catch (error) {
      console.error('Error adding activity: ', error);
      Alert.alert('Error', 'Failed to add activity. Please try again.');
    }
  };


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
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    form: {
      padding: 16,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      color: colors.text,
    },
    dateInput: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    dateText: {
      color: colors.text,
    },
    addButton: {
      backgroundColor: colors.primary,
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
    imageUploadButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    imageUploadButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 16,
    },
  });


  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Activity</Text>

        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

      </View>

      <ScrollView style={styles.form}>

        <TextInput
          style={styles.input}
          placeholder="Activity Name"
          placeholderTextColor={colors.text}
          value={activityName}
          onChangeText={setActivityName}
        />

        <TextInput
          style={styles.input}
          placeholder="Instructor"
          placeholderTextColor={colors.text}
          value={instructor}
          onChangeText={setInstructor}
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor={colors.text}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Capacity"
          placeholderTextColor={colors.text}
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            textColor={colors.text}
          />
        )}

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.dateText}>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onStartTimeChange}
            textColor={colors.text}
          />
        )}

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.dateText}>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onEndTimeChange}
            textColor={colors.text}
          />
        )}

        <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
          <Text style={styles.imageUploadButtonText}>Upload Image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>
          <Text style={styles.addButtonText}>Add Activity</Text>
        </TouchableOpacity>

      </ScrollView>
      
    </SafeAreaView>
  );
}