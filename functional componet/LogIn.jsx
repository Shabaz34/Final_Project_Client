import React, { createContext, useState, useEffect } from "react";
import styles from "../App.module.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  ScrollView,
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  I18nManager,
  Alert,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import UserProfile from "./UserProfile";
import Register from "./Register";
import ResetPassword from "./ResetPassword";

import Ionicons from "@expo/vector-icons/Ionicons";

let GetUser;

export default function Login({ navigation }) {
  const BackGroundImageLocal = require("../assets/background_signup.png");
  const appIcon = require("../assets/icon_title.png");

  const [text, setText] = useState("");
  const [emailCount, setEmailCount] = useState(false);
  const [email, setEmail] = useState("");
  const [checkValdEmail, setCheckValdEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoged, setIsLoged] = useState(true);
  const [CheckValdPassword, setCheckValdPassword] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(true);



  useEffect(() => {
    async function load() {
      try {
        let isLoged = await AsyncStorage.getItem("isLoged");
        console.log('line 50 ',isLoged);
        if (isLoged == "1") {
          let userAsync = await AsyncStorage.getItem("user");
          let localuser = JSON.parse(userAsync);
          console.log("AutoLogin localuser ---->", localuser);
          navigation.navigate("Identify", localuser)
        } else setIsLoged(false);
      } catch (error) {
        console.log("15");
        console.log(error);

      }
    }
    load();
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
  }, []);

  async function save(userToStore) {
    try {
      await AsyncStorage.setItem("user", userToStore);
      console.log("User To Store in LogIn", userToStore);
      await AsyncStorage.setItem("isLoged", "1");
      userCheckForPhoto=JSON.parse(userToStore)
      console.log("type of ",typeof userCheckForPhoto.photoURI)
      console.log("what is this of ",userCheckForPhoto.photoURI)

      if(userCheckForPhoto.photoURI!=""){
      await AsyncStorage.setItem("isProfile",userCheckForPhoto.photoURI)
      

      }
      else
      {
        console.log('not got at all')

      }
      // await AsyncStorage.setItem("isProfile", )
      console.log("51 ", userToStore);
      console.log("asdaasd");
    } catch (error) {
      console.log(error);
    }
  }

  const handelCheckEmail = (text) => {
    setEmail(text);
  };
  const handelCheckPassword = (text) => {
    setPassword(text);
  };

  function MoveToProfilePage() {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    console.log(text);

    if (password.length < 5) {
      setCheckValdPassword(true);
    } else {
      setCheckValdPassword(false);
    }

    if (re.test(email) || regex.test(email)) {
      setCheckValdEmail(false);
    } else {
      setCheckValdEmail(true);
      setEmailCount(true);
    }
    console.log("AS");
    console.log(checkValdEmail);

    if (checkValdEmail == false && CheckValdPassword == false) {
      fetch(
        `https://proj.ruppin.ac.il/cgroup41/prod/LogIn?password=${password}&email=${email}`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json; charset=UTF-8",
            Accept: "application/json; charset=UTF-8",
          }),
        }
      )
        .then((res) => {
          console.log("res= ", JSON.stringify(res));
          return res.json();
        })
        .then(
          (result) => {
            GetUser = JSON.stringify(result[0]);
            console.log("82----> ", GetUser);
            if (GetUser == "[]") Alert.alert("Email or password is incorrect");
            else {
              console.log("fetch POST= ", JSON.stringify(result));
              {
                save(GetUser);
              }
              // navigation.dispatch(StackActions.replace("Identify", GetUser));
              navigation.navigate("Identify", GetUser)

            }
          },
          (error) => {
            console.log("err post=", error);
            Alert.alert("סיסמא או מייל לא נכונים");
          }
        );


    }
  }
  if (isLoged == false) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ImageBackground
            source={BackGroundImageLocal}
            style={styles.backgroundImage}
          >
            <Image style={styles.tinyLogo} source={appIcon} />
            <View style={styles.containerIn}>
              <Text style={{  fontWeight: "bold" }}>
                דואר אלקטרוני
              </Text>
              <TextInput
                style={styles.Textinput}
                value={email}
                onChangeText={(text) => handelCheckEmail(text)}
              />
              {checkValdEmail && emailCount ? (
                <Text style={{  color: "red" }}>
                  פורמט אימייל שגוי
                </Text>
              ) : (
                ""
              )}
              <Text style={{  fontWeight: "bold" }}>סיסמה</Text>
              <View>
                <TextInput
                  label="Password"
                  style={[styles.Textinput, styles.TextinputLeft]}
                  secureTextEntry={passwordVisible}
                  onChangeText={(text) => handelCheckPassword(text)}
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
              </View>
              {CheckValdPassword ? (
                <Text style={{ left: 25, color: "red" }}>
                  סיסמה שגויה,על סיסמה להיות גדול מ5 תוים
                </Text>
              ) : (
                ""
              )}

              <TouchableOpacity
                style={styles.btnStyleLogin}
                onPress={MoveToProfilePage}
              >
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    top: 4,
                    textAlign: "center",
                  }}
                >
                  התחבר
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ top: 260, position: "absolute", left: 25 }}
                onPress={() => navigation.navigate("Register")}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  הירשם
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ top: 260, position: "absolute", right: 25 }}
                onPress={() => navigation.navigate("ResetPassword")}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  שכחתי סיסמה
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
