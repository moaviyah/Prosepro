import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { PRIMARY } from '../colors';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { app } from '../config';

const CreateAccount = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const db = getDatabase();
    const auth = getAuth();
    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRef = ref(db, 'users/' + user.uid);
            await set(userRef, {
                name: name,
                email: email,
                password: password,
                timestamp: new Date().toISOString(),
                docId: user.uid
            });
            setName('');
            setEmail('');
            setPassword('');
            Alert.alert('Welcome', 'Account created successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesome name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create account and choose favorite menu</Text>

            <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
                placeholder="Your name"
                autoCapitalize="words"
            />
            <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
                placeholder="Your email"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                placeholder="Your password"
                secureTextEntry={true}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.registerButton} onPress={() => handleRegister()}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInText}>Have an account? Sign In</Text>
            </TouchableOpacity>
            <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                    By clicking Register, you agree to our
                    <Text style={styles.termsLink}> Terms and Data Policy.</Text>
                </Text>
            </View>
        </View>
    );
};

export default CreateAccount;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: 'grey',
        marginVertical: 10,
    },
    input: {
        paddingVertical: 15,

        borderRadius: 5,
        marginVertical: 10,
        paddingHorizontal: 10,

        backgroundColor: '#FAFAFA'
    },
    registerButton: {
        backgroundColor: PRIMARY,
        borderRadius: 25,
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
    },
    signInText: {
        color: 'purple',
        textAlign: 'center',
        marginVertical: 10,
    },
    termsContainer: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    termsText: {
        textAlign: 'center',
        color: 'grey',
        marginTop: 20,
    },
    termsLink: {
        color: 'purple',
    },
});
