import React, { useState } from 'react';
import {KeyboardAvoidingView, View, Text, TextInput, TouchableOpacity,StyleSheet,ImageBackground, Alert } from 'react-native';
import emailjs from 'emailjs-com';
import styles from '../App.module.js';
import Ionicons from '@expo/vector-icons/Ionicons'
import LogIn from './LogIn';

const BackGroundImageLocal=require("../assets/background_signup.png")
let pass;
export default function ResetPassword({route,navigation}) {
  const [password,setpassword]=useState(null);
  const [formData, setFormData] = React.useState({
    user_name: '',
    message: ''
  });

  function getPassFunc(){
    console.log(formData.user_name)
    fetch(`https://proj.ruppin.ac.il/cgroup41/prod/getUserPass?email=${formData.user_name}`, {
  method: "GET",
  headers: new Headers({
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json; charset=UTF-8",
  }),
  
})
  .then((res) => {
    console.log("res= ", JSON.stringify(res));
    return res.text(); // use res.text() instead of res.json()
  })
  .then(
    (result) => {
      console.log('31 ',JSON.stringify(result))
      pass=JSON.stringify(result);
      if (password == null) {
        setpassword(pass);
      }
      console.log("pass = ", pass);
    },
    (error) => {
      console.log("Error processing response: ", error);
    }
  ); 
  if(pass==`"0"`){
    Alert.alert('There is no user with this email')
    return;
  }
  let interval = setInterval(() => {
    console.log('this ran after 2 second');

    sendEmail();

clearInterval(interval);

}, 2000);
interval;


  }
  const sendEmail = () => {
console.log('48 ', (pass))
    console.log('50 ',typeof pass)

    const { user_name, message } = formData;
console.log('57 ',pass)
    const templateParams = {
      from_name: user_name,
      message: pass
    };

    // emailjs.send('service_f4t4yk5', 'template_lulu88f', templateParams, 'euM2LDYQaYnhbr60a')
    emailjs.send('service_y4h53s9', 'template_evu49zw', templateParams, 'MOaT-mBGbG4TDg8UA') 
    .then((result) => {
          console.log(result.text);
          Alert.alert('Check Your Email\nYour password sent successfully.');
      }, (error) => {
          console.log('ErrorCallBack Send Email--->',error.text);
          Alert.alert('Please insert a Valid email.');

      });
  };

  const handleChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <KeyboardAvoidingView style={{flex:1}}>
    <View style={styles.container}>
      <ImageBackground source={BackGroundImageLocal} style={styles.backgroundImage} >

      <TouchableOpacity
            style={styles.back}
            onPress={() =>
              navigation.navigate("Login")
            }
          >
            <Ionicons
              style={styles.iconBack}
              name="return-up-back-outline"
              color="#77a068"
            ></Ionicons>
          </TouchableOpacity>

<View style={{    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',}}>
      <Text style={{fontSize:25}}>Insert email</Text>
      <TextInput name="user_name" value={formData.user_name} onChangeText={value => handleChange('user_name', value)} style={[styles.Textinput,styles.TextinputLeft,styles.TextinputLeftPass]}/>
      <TouchableOpacity style={styles.btnStyleLogin} onPress={()=>getPassFunc()}>
        <Text style={{fontSize:30, fontWeight: 'bold',top:4,textAlign:'center'}}>Send password to email</Text>
      </TouchableOpacity>
      </View>
      </ImageBackground>
      </View>
      </KeyboardAvoidingView>
  );
};