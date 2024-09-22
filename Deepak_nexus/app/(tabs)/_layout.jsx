import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        if (route.name === 'addactivity') {
          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.addButton}
            >
              <Ionicons name="add-circle-outline" size={40} color={Colors.PRIMARY} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={options.tabBarIcon({ color: isFocused ? Colors.PRIMARY : 'gray' }).props.name}
              size={24}
              color={isFocused ? Colors.PRIMARY : 'gray'}
            />
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? Colors.PRIMARY : 'gray' }
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="wallet" 
        options={{ 
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="addactivity" 
        options={{ 
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="activity" 
        options={{ 
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color }) => <Ionicons name="bag-check-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="people-circle-outline" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});