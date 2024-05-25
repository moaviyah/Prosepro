import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert,StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence } from 'firebase/auth/react-native'
import {  onAuthStateChanged, initializeAuth } from 'firebase/auth';
import Login from './Screens/Login';
import { PRIMARY, SECONDARY } from './colors';
import Onboarding from './Screens/Onboarding';
import Home from './Screens/Home';
import CreateAccount from './Screens/CreateAccount';
import AccountScreen from './Screens/AccountScreen';
import Navigator from './Screens/Navigator';
import Scan from './Screens/Scan';
import app from './config';
import EditProfile from './Screens/EditProfile';
import BookDetails from './Screens/BookDetails';
import ManageCategories from './Screens/ManageCategories';
import BookSummary from './Screens/BookSummary';
export default function App() {
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const [initialRoute, setInitialRoute] = useState('OnBoarding')

  useEffect(() => {
    SplashScreen();
  }, []);

  const SplashScreen = () => {
    setTimeout(() => {
      const auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true)
        }
        else{
          setUser(false)
        }
        setUser(user);
        setLoading(false);
      });
    }, 3000);
  }

  return (
        <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <StatusBar barStyle={'light-content'}/>
            <Image style={styles.logo} source={require('./assets/logo.png')} />
            <Text style={styles.loadingText}>Books.</Text>
        </View>
      ) : (
        <NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user
              ?
              (
                <>
                  <Stack.Screen name='Navigator' component={Navigator} />
                  <Stack.Screen name='EditProfile' component={EditProfile}/>
                  <Stack.Screen name='BookDetails' component={BookDetails}/>
                  <Stack.Screen name='ManageCategories' component={ManageCategories}/>
                  <Stack.Screen name='BookSummary' component={BookSummary}/>
                </>
              )
              :
              (
                <>
                  <Stack.Screen name='OnBoarding' component={Onboarding} />
                  <Stack.Screen name='Login' component={Login}/>
                  <Stack.Screen name='CreateAccount' component={CreateAccount}/>
                </>
              )
            }

          </Stack.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  loadingContainer: {
    flex:1,
    alignItems: 'center',
    backgroundColor: PRIMARY,
    justifyContent:'center',
    flexDirection:'row'
  },
  logoContainer: {
  },
  logo: {
    height: 60,
    width: 60,
  },
  loadingText: {
    color: SECONDARY,
    fontWeight: '700',
    fontSize: 20,
    marginLeft:10
  },
});
