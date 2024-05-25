import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Scan from './Scan';
import AccountScreen from './AccountScreen';
import Explore from './Explore';

const Tab = createBottomTabNavigator();

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Navigator = ({navigation}) => {
  return (

      <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown:false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
              return <FontAwesome name={iconName} size={size} color={color} />;
            } else if (route.name === 'Scan') {
              iconName = 'camera-alt';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            }else if (route.name === 'Explore') {
              iconName = 'explore';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            } 
            else if (route.name === 'Account') {
              iconName = 'person';
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: 'purple',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Explore" component={Explore} />
        <Tab.Screen name="Scan" component={Scan} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>

  );
};

export default Navigator;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
