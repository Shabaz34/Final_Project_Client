import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity,ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import storage from "@react-native-async-storage/async-storage";
import RadioButton from './RadioButton';
import IdeCard from './IdeCard';
import SpecificIdentification from './SpecificIdentification';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

let asd='asd sss ss ';

export default function Stam() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const urlStam1='https://news.cgtn.com/news/2021-10-21/3-pretty-plants-to-brighten-your-garden-in-autumn-14xqyrh3fQk/img/81b388b7f82f4f01a4d62174e9a63e88/81b388b7f82f4f01a4d62174e9a63e88.jpeg';
  const urlStam2='https://m.media-amazon.com/images/I/81+xmn2X9TL._AC_UF894,1000_QL80_.jpg';

  const FakeData={
    plant:{
      probability:0.66,
      similar_images:[{url:urlStam1},{url:urlStam2}],
      plant_details:{
        scientific_name:'iphonedddd 12xx',
      }

    },
    ready:false,
  }

//   useEffect(() => {
//     //check if the device is indeed device (android or IOS)
//     const getPermission = async () => {
//       if (Constants.isDevice) {
//           const { status: existingStatus } = await Notifications.getPermissionsAsync();
//           let finalStatus = existingStatus;
//           if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//           }
//           if (finalStatus !== 'granted') {
//             alert('Enable push notifications to use the app!');
//             await storage.setItem('expopushtoken', "");
//             return;
//           }
//           const token = (await Notifications.getExpoPushTokenAsync()).data;
//           await storage.setItem('expopushtoken', token);
//       } else {
//         alert('Must use physical device for Push Notifications');
//       }

//         if (Platform.OS === 'android') {
//           Notifications.setNotificationChannelAsync('default', {
//             name: 'default',
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: '#FF231F7C',
//           });
//         }
//     }

//     getPermission();
// //set a listner to the notification 
//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

  // const onClick = async () => {
  //   console.log('asd')
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "משתמש זיהה צמח בקרבתך",
  //       body: `בלה בלה בלה`,
  //       data: { data: "data goes here" }
  //     },
  //     trigger: { seconds: 2 },
  //   });
    
  // }
  const Example=(state)=>{
    console.log('Example-->',state);
  }

  return (
    <View style={{height:'100%' ,borderWidth:5,borderColor:'#000'}} >
      {/* <TouchableOpacity onPress={()=>onClick()}>
        <Text style={{backgroundColor: 'red', padding: 10, color: 'white'}}>Click me to send a push notification</Text>
      </TouchableOpacity> */}
      {/* this is example for Custom Radio Button */}
      <ScrollView style={{height:150,borderWidth:5,borderColor:'#000'}}>
      <RadioButton Size={15} fontSize={18} Brcolor={'#000'} Bcolor={'#f0f'} TranferInfo={Example} Label={'BLa bla bla bla '} />
      {/* <IdeCard PlantName={'bbbbbbbbb bxxxxxxxxxxx'} photo={'https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcT55uJPqq12tVPzWphJLwHP_Niw8A8b1CVcPSdvX1DIAYWqTNIsEsFt5FfaiQSNPA2aBLvHZUODFIMtvbg'} precetage={6}/> */}
      <SpecificIdentification id={1} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={2} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={3} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={4} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={5} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={6} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={7} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={8} plant={FakeData.plant} ready={FakeData.ready}/>
      <SpecificIdentification id={9} plant={FakeData.plant} ready={FakeData.ready}/>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
