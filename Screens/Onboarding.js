import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { PRIMARY, SECONDARY } from '../colors'

const Onboarding = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
        <Image source={require('../assets/onBoarding1.png')} style={styles.onBoardingImage}/>
        <Text style={styles.titleText}>Now reading books {'\n'}will be easier</Text>
        <Text style={styles.titleDes}>Discover new worlds, join a vibrant {'\n'}reading community. Start your reading {'\n'}adventure effortlessly with us.</Text>
        <TouchableOpacity style={styles.getStartedBtn} onPress={()=>{navigation.navigate('CreateAccount')}}>
            <Text style={styles.getStartedBtnText}>
                Get Started
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.getStartedBtn, {backgroundColor:'#FAF9FD'}]} onPress={()=>{navigation.navigate('Login')}}>
            <Text style={[styles.getStartedBtnText, {color:PRIMARY}]}>
                Sign In
            </Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Onboarding

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:SECONDARY
    },
    onBoardingImage:{
        alignSelf:'center'
    },
    titleText:{
        fontWeight:'700',
        fontSize:24,
        textAlign:'center',
        marginVertical:20
    },
    titleDes:{
        fontSize:16,
        color:'#CCC',
        textAlign:'center',
        marginBottom:20
    },
    getStartedBtn:{
        backgroundColor:PRIMARY,
        width:'90%',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:12,
        paddingVertical:20,
        marginBottom:5
    },
    getStartedBtnText:{
        color:SECONDARY,
        fontSize:16,
        fontWeight:'700'
    }
})