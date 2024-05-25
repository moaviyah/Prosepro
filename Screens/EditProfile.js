import React, { useState , useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { PRIMARY, SECONDARY } from '../colors';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, updateProfile } from 'firebase/auth';
import { ref, getStorage, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { getDatabase, ref as dbRef, set, onValue } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = ({ navigation }) => {
  const [name, setName] = useState('John');
  const [email, setEmail] = useState('Johndoe@email.com');
  const [phoneNumber, setPhoneNumber] = useState('(+1) 234 567 890');
  const [password, setPassword] = useState('******');
  const [profilePic, setProfilePic] = useState(null);
  const storage = getStorage()
  const auth = getAuth();
  const db = getDatabase();
  const uid = auth.currentUser.uid;
  useEffect(() => {
    const fetchData = async () => {
      
      const userRef = dbRef(db, `users/${uid}`);
      try {
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhoneNumber(userData.phoneNumber || '');
            setProfilePic(userData.profileImage || null);
            setPassword(userData.password || '')
          }
        });
        // if (snapshot.exists()) {
        //   const userData = snapshot.val();
        //   setName(userData.name || '');
        //   setEmail(userData.email || '');
        //   setPhoneNumber(userData.phoneNumber || '');
        //   setProfilePic(userData.profileImage || null);
        // }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);
  const handleChooseProfilePic = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
      const uri = result.assets[0].uri;
    
      try {
        setProfilePic(uri);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
    
  };
  
    
  
  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    try {
      await updateProfile(user, {
        displayName: name,
      });
      const db = getDatabase();
      const uid = user.uid;
      const userRef = dbRef(db, `users/${uid}`);
      await set(userRef, {
        name,
        email,
        phoneNumber,
        profileImage: profilePic,
        password
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1,backgroundColor:SECONDARY }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft:15}}>
        <FontAwesome name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
        </View>
        <TouchableOpacity style={styles.profilePicContainer} onPress={handleChooseProfilePic}>
          <Image
            style={styles.profilePic}
            source={profilePic ? { uri: profilePic } : require('../assets/dummydp.png')}

          />
          <Text style={styles.changePictureText}>Change Picture</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePictureText: {
    color: 'purple',
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  saveButton: {
    backgroundColor: PRIMARY,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
