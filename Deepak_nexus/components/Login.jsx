import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors';

export default function Login() {

    const router = useRouter();

  return (
    <View>

      <Image 
        source={require('./../assets/images/nexus.jpg')} 
        style={{
          width: '100%',
          height: 500,
        }} 
      />

      <View style={{
        backgroundColor: Colors.WHITE,
        marginTop: -20,
        height: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25
      }}>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}>

          <Text style={{
            fontSize: 30,
            fontFamily: 'outfit-bold',
            textAlign: 'center',
            marginTop:10
          }}>Activity</Text>

          <Text style={{
            fontSize: 30,
            fontFamily: 'outfit-bold',
            color: Colors.BLUE,
            textAlign: 'center',
            marginTop:10
          }}>Centre</Text>

        </View>

        <Text style={{
            fontFamily : 'outfit',
            fontSize:17,
            textAlign:'center',
            color : Colors.GRAY,
            marginTop:40
        }}>"Plan Your Day, Organize Your Life – Stay on Track with Every Activity, Every Goal!"</Text>

        <TouchableOpacity style={styles.button} 
            onPress={() => router.push('auth/sign-in')}
        >

            <Text style={{
                color:Colors.WHITE,
                textAlign:'center',
                fontFamily:'outfit',
                fontSize:17
            }}>Get Started</Text>

        </TouchableOpacity>

      </View>

    </View>
  )
}


const styles = StyleSheet.create({
    button : {
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:99,
        marginTop:'15%'
    }
})