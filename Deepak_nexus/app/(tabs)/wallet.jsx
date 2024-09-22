import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, getDocs, orderBy, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Wallet({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('No user logged in');
      return;
    }

    const db = getFirestore();

    // Listen for balance changes
    const unsubscribeBalance = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setBalance(doc.data().balance || 0);
      }
    });

    // Set up listener for real-time updates on transactions
    const transactionsRef = collection(db, 'transactions');
    const q = query(
      transactionsRef,
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
      const updatedTransactions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(updatedTransactions);
    });

    // Clean up listeners on component unmount
    return () => {
      unsubscribeBalance();
      unsubscribeTransactions();
    };
  }, []);

  const TransactionCard = ({ transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionAmount}>
          {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount.toFixed(2)}
        </Text>
        <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
        {transaction.activityName && (
          <Text style={styles.transactionActivity}>Activity: {transaction.activityName}</Text>
        )}
      </View>
      <Text style={[
        styles.transactionStatus,
        { color: transaction.status === 'completed' ? 'green' : 'orange' }
      ]}>
        {transaction.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
      </View>

      <ScrollView style={styles.transactionsList}>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions available</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  transactionActivity: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceContainer: {
    backgroundColor: '#007AFF',
    padding: 16,
    alignItems: 'center',
  },
  balanceTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  transactionsList: {
    padding: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  noTransactionsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  addFundsButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  addFundsButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});