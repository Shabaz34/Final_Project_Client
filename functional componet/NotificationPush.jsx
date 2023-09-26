//all
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {StyleSheet,Text,View,Button,Alert,Platform} from 'react-native'
import styles from "../assets/styles";
import * as Notifications from 'expo-notifications'
// רשימת פושים - 
// ברצוני לקבל התראות עבור זיהויים שביצעו חברים אך טרם ביצעתי בטווח של עד אינפוט מטר. 
// -ברגע שמוסיפים חבר (אותך) יופיע פוש למשתמש 
// - תגובה על פוסט שלך בפורום

// -פוש ככה אשר משתמש מומחה עונה לך על זיהוי 
// - פוש למומחה כאשר יש זיהוי לא מוצלח

//props should be user title and body
export default function NotificationPush(props) {
const userToken=props.userToken
const title=props.title
const body=props.body

function sendPushNotificationHandler(){
  fetch('https://exp.host/--/api/v2/push/send',{
    method:"POST",
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      to:userToken, //should read from DB
      title:title,
      body:body,
      //data:{user}
    })
  });
}

const PushNotification=(token,title,body)=>{
  fetch('https://exp.host/--/api/v2/push/send',{
    method:"POST",
    headers:{
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      to:token, //should read from DB
      title:title,
      body:body,
      
    })
  });
}

return (
  <View style={{marginTop:200, backgroundColor:"#CCC"}}>
    <Button title='Send Push Notification' onPress={sendPushNotificationHandler}></Button>
    <StatusBar style="auto"></StatusBar>
  </View>
  );


}