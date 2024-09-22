import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Wallet() {

  const renderTransactionItem = (transaction) => (

    <View style={styles.transactionItem} key={transaction.id}>

      <View style={styles.transactionIcon}>

        <Ionicons name={transaction.type === 'credit' ? 'add-circle-outline' : 'remove-circle-outline'} size={24} color={transaction.type === 'credit' ? 'green' : 'red'} />

      </View>

      <View style={styles.transactionInfo}>

        <Text style={styles.transactionTitle}>{transaction.title}</Text>

        <Text style={styles.transactionDate}>{transaction.date}</Text>

      </View>

      <Text style={[styles.transactionAmount, { color: transaction.type === 'credit' ? 'green' : 'red' }]}>

        {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount}

      </Text>

    </View>
  );

  const transactions = [
    { id: 1, title: 'Adult Fitness Swim', date: '22 Sep 2024', amount: '799', type: 'debit' },
    { id: 2, title: 'Added Funds', date: '20 Sep 2024', amount: '2000', type: 'credit' },
    { id: 3, title: 'Yoga Class', date: '18 Sep 2024', amount: '500', type: 'debit' },
  ];

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.header}>

        <Text style={styles.headerTitle}>Wallet</Text>

        <TouchableOpacity>

          <Ionicons name="ellipsis-horizontal" size={24} color="black" />

        </TouchableOpacity>

      </View>

      <View style={styles.balanceCard}>

        <Text style={styles.balanceTitle}>Current Balance</Text>

        <Text style={styles.balanceAmount}>₹3,500</Text>

        <TouchableOpacity style={styles.addFundsButton}>

          <Text style={styles.addFundsButtonText}>Add Funds</Text>

        </TouchableOpacity>

      </View>

      <View style={styles.transactionsSection}>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        <ScrollView>
          {transactions.map(renderTransactionItem)}
        </ScrollView>

      </View>

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
  
  balanceCard: {
    backgroundColor: '#007AFF',
    padding: 24,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  balanceTitle: {
    color: 'white',
    fontSize: 16,
  },
  
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  
  addFundsButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  
  addFundsButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  
  transactionsSection: {
    flex: 1,
    padding: 16,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  
  transactionIcon: {
    marginRight: 16,
  },
  
  transactionInfo: {
    flex: 1,
  },
  
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});