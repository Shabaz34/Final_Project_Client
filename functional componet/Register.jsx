import React, { createContext, useState, useEffect } from "react";
import styles from "../App.module.js";
import { Picker } from "@react-native-picker/picker";
import * as WebBrowser from "expo-web-browser";
import * as Notifications from "expo-notifications";
import * as Google from "expo-auth-session/providers/google";
import {
  KeyboardAvoidingView,
  ImageBackground,
  CheckBox,
  ScrollView,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Modal
} from "react-native";
import { StackActions } from "@react-navigation/native";
import UserProfile from "./UserProfile";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RadioButton from "./RadioButton";
import { BlurView } from "expo-blur";

WebBrowser.maybeCompleteAuthSession();

export default function Register({ navigation }) {
  const BackGroundImageLocal = require("../assets/background_signup.png");
  const appIcon = require("../assets/icon_title.png");

  apiUrl = "https://proj.ruppin.ac.il/cgroup41/prod/Registrations";
  const comunityOptions=["בחר קהילה","לקט","מדריך טיולים","מגדל","חובב טבע"]

  const [isSelected, setSelection] = useState(false);

  const [accessToken, setAccessToken] = useState(null);

  const [user, setUser] = useState(null);
  const [emailCount, setEmailCount] = useState(false);
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [comunity, setComunity] = useState("");
  const [checkValdEmail, setCheckValdEmail] = useState(true);
  const [CheckValdPassword, setCheckValdPassword] = useState(false);
  const [token, setToken] = useState("");
  const [terms, setTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setIsOpen(false);
    setComunity(option)
  };

  const [request, response, promtAsync] = Google.useAuthRequest({
    clientId:
      "222431351949-u9t6ooea1k530kli2d6tiqbk6cndm78n.apps.googleusercontent.com",
    iosClientId:
      "222431351949-bf16s29kjk5uhqaamuf76bhln3o9ulq1.apps.googleusercontent.com",
    androidClientId:
      "222431351949-h1ulm3jsa1t5cmghgghtppfip4j67p6t.apps.googleusercontent.com",
  });
  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  }, [response, accessToken]);

  async function save(userToStore) {
    try {
      await AsyncStorage.setItem("user", userToStore);
      await AsyncStorage.setItem("isLoged", "1");
      console.log("51 ", userToStore);
    } catch (error) {
      console.log(error);
    }
  }
  const Example=(state)=>{
    setTerms(state)
    console.log('Example-->',state);
  }

  //permissions for push
  useEffect(() => {
    configurePushNotification();
  }, []);

  async function configurePushNotification() {
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission required",
        "Push notification need the appropriate permissions"
      );
      return;
    }

    const pushTokenData = await Notifications.getExpoPushTokenAsync().then(
      (pushTokenData) => {
        console.log("PUSH TOKEN", pushTokenData);
        setToken(pushTokenData.data);
        console.log("PUSH TOKEN", token);
      }
    );
    //pushTokenData holds the token of user for expo push

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userinfo = await response.json();
    setUser(userinfo);

    // console.log('55 ',user);
  }

  const ModalTerms = () =>{
setModalVisible(true)
}

  async function RegisterAndLogin() {
    let s;
    let GetUser = "";

    if (user == null) {
      let re = /\S+@\S+\.\S+/;
      let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

      console.log(password, " ", email, " ", fullname, " ", comunity);
      s = {
        UserName: fullname,
        UserPassword: password,
        UserEmail: email,
        UserType: comunity,
        UserToken: token,
      };
      console.log("81 ", s);

      if (comunity == "") {
        Alert.alert("יש לבחור קהילה");
        return;
      }
      if (fullname == "" || password == "" || email == "") {
        Alert.alert("יש לבדוק תקינות הכנסת נתונים");
        return;
      }
      
      if (terms == false) {
        Alert.alert("יש להסכים לתנאי השימוש");
        return;
      }
      if (re.test(email) || regex.test(email)) {
        setCheckValdEmail(false);
      } else {
        setCheckValdEmail(true);
        setEmailCount(true);
        return;
      }

      if (password.length < 5) {
        setCheckValdPassword(true);
        return;
      } else {
        setCheckValdPassword(false);
      }
    } else {
      if (comunity == "") {
        Alert.alert("יש לבחור קהילה");
        console.log("103 ", user);
        return;
      }

      s = {
        UserName: user.name,
        UserPassword: user.email,
        UserEmail: user.email,
        UserType: comunity,
        UserToken: token,
      };
    }
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(s),
      headers: new Headers({
        "Content-type": "application/json; charset=UTF-8", //very important to add the 'charset=UTF-8'!!!!
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        console.log("res=", JSON.stringify(response));
        return response.json();
      })
      .then(
        (result) => {
          GetUser = JSON.stringify(result);
          if (GetUser != "") {
            console.log("140 ", GetUser);
            {
              save(GetUser);
            }
            console.log("fetch POST= ", JSON.stringify(result));
            navigation.dispatch(StackActions.replace("Identify", GetUser));
          }
        },
        (error) => {
          console.log("err post=", error);
        }
      );

    const response = await fetch(apiUrl);
    const json = await response.json();
  }

  const ShowUserInfo = () => {
    if (user) {
      let fullname = `${user.given_name} ${user.family_name}`;
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "Bold" }}>{fullname}</Text>
          <Text style={{ fontSize: 20, fontWeight: "Bold" }}>{user.email}</Text>
        </View>
      );
    }
  };
  const [passwordVisible, setPasswordVisible] = useState(true);
  console.log('229',isSelected);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ImageBackground
          source={BackGroundImageLocal}
          style={styles.backgroundImage}
        >
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons
              style={styles.iconBack}
              name="return-up-back-outline"
              color="#77a068"
            ></Ionicons>
          </TouchableOpacity>
          <Image style={styles.tinyLogo} source={appIcon} />
          <View style={styles.containerReg}>
            <Text style={{ fontWeight: "bold" }}>שם מלא</Text>
            <TextInput
              style={styles.Textinput}
              onChangeText={(fullText) => setFullname(fullText)}
            />
            <Text style={{ fontWeight: "bold" }}>דואר אלקטרוני</Text>
            <TextInput
              style={styles.Textinput}
              value={email}
              onChangeText={(emailText) => setEmail(emailText)}
            />
            {checkValdEmail && emailCount ? (
              <Text style={{ left: 25, color: "red" }}>פורמט אימייל שגוי</Text>
            ) : (
              ""
            )}
            <Text style={{ fontWeight: "bold" }}>סיסמה</Text>
            <View>
              <TextInput
                label="Password"
                style={[styles.Textinput, styles.TextinputLeft]}
                secureTextEntry={passwordVisible}
                onChangeText={(passText) => setPassword(passText)}
              />
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                style={{
                  position: "absolute",
                  top: 4,
                  left: 30,
                  fontSize: 30,
                  textAlign: "left",
                }}
                onPress={() => setPasswordVisible(!passwordVisible)}
              ></Ionicons>
              {CheckValdPassword ? (
                <Text style={{ left: 25, color: "red" }}>
                  סיסמה שגויה,על סיסמה להיות גדול מ5 תוים
                </Text>
              ) : (
                ""
              )}
              <TouchableOpacity style={[{ padding: 10},styles.Textinput]} onPress={toggleDropdown}>
                   <Text style={{textAlign:"center"}}>{comunity || "בחר קהילה"}</Text>
                   <Ionicons style={{
                    position: "absolute",
                    top: 3,
                    left: 30,
                    fontSize: 30,
                    textAlign: "left",
                  }}
                   name={isOpen ? "chevron-up" : "chevron-down"}
                   size={20}
                   color="black"
                   />
                </TouchableOpacity>
              <Modal visible={isOpen} transparent={true}>
              <BlurView
          style={styles.blurContainer}
          intensity={100}
        >
               <TouchableOpacity
               style={{ flex: 1, justifyContent:"center"
                       }}
               onPress={() => setIsOpen(false)}
               >
               <View
                style={{
                backgroundColor: "white",
                borderRadius: 4,
                margin: 20,
                
               }}
               >
              
                {comunityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={{ paddingVertical: 25,margin:50,marginBottom:0,marginTop:0}}
                onPress={() => selectOption(option)}
              >
                <Text style={{textAlign:"center",fontSize:22}}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
        </BlurView>

      </Modal>

              <View style={{ flexDirection: "row" }}>
<RadioButton Size={7} Brcolor={'black'} Label={''} TranferInfo={Example}></RadioButton>
<Text> לאישור  </Text><Text style={{color:'blue',textDecorationLine: "underline",}} onPress={()=>ModalTerms()}> תנאי השימוש</Text>
<View style={stylesM.centeredView}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
                      <BlurView
          style={styles.blurContainer}
          intensity={100}
        >
        <View style={stylesM.centeredView}>
          <ScrollView
              contentContainerStyle={stylesM.modalView}>
                <View style={{flexDirection: "column",}}>
            <Text style={stylesM.modalText}>בליעה של כל צמח או מוצר צמחי. באחריות המשתמש לחקור, לאמת ולהבטיח את הבטיחות של כל צמח לפני הצריכה או השימוש.</Text>
            <Text style={stylesM.modalText}>2.2. דיבור פוגעני: במהלך השימוש באפליקציה, אתה עלול להיתקל בתוכן שנוצר על ידי משתמשים, כולל דיבור או שפה שעלולים להיות פוגעניים או בלתי הולמים. אנו לא תומכים או מסננים תוכן כזה ומתנערים בזאת מכל אחריות או חבות לכל שפה פוגענית, מזיקה או בלתי הולמת שנתקלה באפליקציה.
</Text>
<Text style={stylesM.modalText}>אחריות משתמש
3.1. צמחים רעילים: האפליקציה עשויה לספק מידע על צמחים רעילים; עם זאת, האחריות לטיפול, התמודדות או אינטראקציה עם כל צמח רעיל היא על המשתמש בלבד. לא נישא באחריות לכל תוצאה, נזק או נזק הנובעים מאינטראקציות של המשתמש או מהתמודדויות עם צמחים רעילים.</Text>


<Text style={stylesM.modalText}>פרטיות ואבטחה
4.1. מידע אישי: אנו מעריכים את פרטיותך ומחויבים לשמור על המידע האישי שלך מאובטח ובטוח. על ידי שימוש באפליקציה, אתה מסכים למדיניות הפרטיות שלנו, המתארת כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך. אנא עיין במדיניות הפרטיות שלנו כדי להבין את הנהלים שלנו בנוגע לפרטיות שלך.</Text>


<Text style={stylesM.modalText}>הוראות כלליות
תנאים אלה מהווים את כל ההסכם בינך לבינינו לגבי השימוש באפליקציה ומחליפים כל הסכמים או הבנות קודמים, בין בכתב ובין בעל פה. תנאים אלה יהיו כפופים לחוקי [שיפוט], ללא קשר לעקרונות ניגוד החוקים שלהם. כל מחלוקת שתתעורר במסגרת תנאים אלה או בקשר אליהם תהיה כפופה לסמכות השיפוט הבלעדית של בתי המשפט הממוקמים ב[תחום שיפוט].</Text>


<Text style={stylesM.modalText}>על ידי סימון תיבת הסימון, אתה מאשר שקראת, הבנת והסכמת לתנאי שימוש אלה.
</Text>


<Text style={stylesM.modalText}>אם יש לך שאלות או חששות לגבי תנאים אלה, אנא צור איתנו קשר בכתובת picaplantteam@gmail.com.
</Text>

</View>
            <Pressable
              style={[stylesM.button, stylesM.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={stylesM.textStyle}>Hide Modal</Text>
            </Pressable>
          </ScrollView>
        </View>
        </BlurView>
      </Modal>
      {/* <Pressable
        style={[stylesM.button, stylesM.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={stylesM.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
</View>


            </View>
            <TouchableOpacity
              style={styles.btnStyleLogin}
              onPress={RegisterAndLogin}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  top: 4,
                  textAlign: "center",
                }}
              >
                הירשם
              </Text>
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginVertical: 6 }}>או</Text>
            <TouchableOpacity
              style={styles.btnStyleLogin}
              disabled={!request}
              onPress={() => {
                promtAsync();
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  top: 4,
                  textAlign: "center",
                }}
              >
                הירשם באמצעות גוגל
              </Text>
            </TouchableOpacity>
            {user && <ShowUserInfo />}
          </View>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}

const stylesM = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    
    
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize:12,
    marginBottom: 7,
    textAlign: 'center',
  },
});