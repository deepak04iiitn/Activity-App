import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, RefreshControl, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, doc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import Ionicons from '@expo/vector-icons/Ionicons'; // Import Ionicons
import { useTheme } from '../contexts/ThemeContext'; // Import ThemeContext for toggle

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const { isDark, colors, toggleTheme } = useTheme(); // Destructure theme values and toggle
  const navigation = useNavigation(); // Use the navigation hook

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribeBalance;

    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      unsubscribeBalance = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setBalance(userData.balance || 0);
        } else {
          console.error('User document not found');
        }
      }, (error) => {
        console.error('Error fetching user balance:', error);
        Alert.alert('Error', 'Failed to fetch wallet balance. Please try again.');
      });
    }

    return () => {
      if (unsubscribeBalance) {
        unsubscribeBalance();
      }
    };
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to withdraw.');
      return;
    }

    if (amount > balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance to withdraw this amount.');
      return;
    }

    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);

    try {
      await updateDoc(userRef, {
        balance: increment(-amount)
      });

      setModalVisible(false);
      setWithdrawAmount('');
      Alert.alert('Success', `Successfully withdrew ₹${amount.toFixed(2)}`);
    } catch (error) {
      console.error('Error withdrawing amount:', error);
      Alert.alert('Error', 'Failed to process withdrawal. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Updated to use theme colors
    },
    header: {
      backgroundColor: colors.card, // Updated to use theme colors
      padding: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      paddingRight: 10, // Added spacing between the back button and the title
    },
    headerTitle: {
      flex: 1,
      color: colors.text, // Updated to use theme colors
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 30, // Adjust the title to move it to the right
      textAlign: 'center', // Keep the title centered
    },
    scrollView: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      alignItems: 'center',
    },
    balanceContainer: {
      backgroundColor: colors.primary, // Updated to use theme colors
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      width: '100%',
      marginBottom: 20,
    },
    balanceTitle: {
      color: '#FFF',
      fontSize: 18,
      marginBottom: 10,
    },
    balanceAmount: {
      color: '#FFF',
      fontSize: 36,
      fontWeight: 'bold',
    },
    explanation: {
      textAlign: 'center',
      color: colors.text, 
      fontSize: 14,
      marginBottom: 20,
    },
    withdrawButton: {
      backgroundColor: colors.primary, 
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    withdrawButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: colors.card, // Updated to use theme colors
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 18,
      color: colors.text, // Updated to use theme colors
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200,
      borderRadius: 5,
      color: colors.text, // Updated to use theme colors
      borderColor: colors.border, // Updated to use theme colors
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      minWidth: 100,
    },
    buttonClose: {
      backgroundColor: "#FF3B30",
    },
    buttonConfirm: {
      backgroundColor: "#34C759",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Back arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>

        {/* Toggle Theme Button */}
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
          </View>
          <Text style={styles.explanation}>
            This balance represents the total price of all activities you've created.
          </Text>
          <TouchableOpacity style={styles.withdrawButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter amount to withdraw:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setWithdrawAmount}
              value={withdrawAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleWithdraw}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
