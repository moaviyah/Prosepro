import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import {PRIMARY} from '../colors';
import { getDatabase, ref, onValue } from 'firebase/database';

const AccountScreen = ({ navigation }) => {
  const [name, setName] = useState('John Doe');
  const [profileImage, setProfileImage] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  const handleLogout = () => {
    signOut(auth)
  };
  
  useEffect(() => {
    const userId = auth.currentUser.uid;
    const userRef = ref(db, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        setName(userData.name);
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'}/>
      <SafeAreaView>
      <View style={styles.header}>
        <View style={{borderRadius:80, padding:20}}>
        <Image
              source={profileImage ? { uri: profileImage } : require('../assets/profile.png')}
              style={styles.logo}
        />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
        <Feather name="edit" size={24} color={PRIMARY} />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManageCategories')}>
        <Image source={require('../assets/library.png')} style={{height:24, width:24}}/>
        <Text style={styles.buttonText}>Your Library & Shelves</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <FontAwesome name="lock" size={24} color={PRIMARY} />
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TermsConditions')}>
        <MaterialIcons name="description" size={24} color={PRIMARY} />
        <Text style={styles.buttonText}>Terms and Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="white" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop:50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius:50
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,

  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight:'600'
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 5,
    marginTop: 20,
    justifyContent:'center'
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
  },
});
