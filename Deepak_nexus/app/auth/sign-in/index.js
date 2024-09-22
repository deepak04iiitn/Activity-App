import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from './../../../constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';

export default function SignIn() {

    const navigation = useNavigation();
    const router = useRouter();

    const [email , setEmail] = useState();
    const [password , setPassword] = useState();

    useEffect(() => {
        navigation.setOptions({
            headerShown : false
        })
    } , [])


    const onSignIn = () => {

        if(!email && !password)
        {
            ToastAndroid.show('Please enter all details!' , ToastAndroid.LONG);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                router.replace('/home');
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage , errorCode);

                if(errorCode == 'auth/invalid-credential')
                {
                    ToastAndroid.show("Invalid Credentials" , ToastAndroid.LONG);
                }
                
            });

    }

  return (

    <View style={{
        padding:25,
        height:'100%',
        paddingTop:40,
        backgroundColor:Colors.WHITE
    }}>

      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={{
         fontFamily:'outfit-bold',
         fontSize:30,
         marginTop:30,
         textAlign:'center'
      }}>Let's Sign You In</Text>

      <Text style={{
         fontFamily:'outfit',
         fontSize:30,
         color:Colors.GRAY,
         marginTop:20,
         textAlign:'center'
      }}>Welcome Back 👋</Text>

      <Text style={{
         fontFamily:'outfit',
         fontSize:30,
         color:Colors.GRAY,
         marginTop:10,
         textAlign:'center'
      }}>You've been missed !</Text>


      {/* Email */}
      <View style={{
            marginTop:50
      }}>

        <Text style={{
            fontFamily:'outfit'
        }}>Email</Text>

        <TextInput placeholder='Enter Email'style={styles.input} onChangeText={(value) => setEmail(value)} />

      </View>


      {/* Password */}
      <View style={{
            marginTop:20
      }}>

        <Text style={{
            fontFamily:'outfit'
        }}>Pasword</Text>

        <TextInput secureTextEntry={true} placeholder='Enter Password'style={styles.input} onChangeText={(value) => setPassword(value)} />

      </View>

      {/* Sign In Button */}
      <TouchableOpacity 
        onPress={onSignIn}
        style={{
            padding:20,
            backgroundColor:Colors.PRIMARY,
            borderRadius:15,
            marginTop:50
        }}
    >
        
        <Text style={{color:Colors.WHITE , textAlign:'center'}}>Sign In 🔑</Text>

      </TouchableOpacity>


      {/* Create Account Button */}
      <TouchableOpacity 
            style={{
                padding:20,
                backgroundColor:Colors.WHITE,
                borderRadius:15,
                marginTop:20,
                borderWidth:1
            }}
            onPress={() => router.replace('auth/sign-up')}
        >
        
            <Text style={{color:Colors.PRIMARY , textAlign:'center'}}>Create Account ✏️</Text>

      </TouchableOpacity>

    </View>
  )
}


const styles = StyleSheet.create({
    input : {
        padding:15,
        borderWidth:1,
        borderRadius:15,
        borderColor:Colors.GRAY,
        fontFamily:'outfit'
    }
})