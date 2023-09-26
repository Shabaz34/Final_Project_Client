import { useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  I18nManager,
  Alert,
  Modal
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../App.module.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import NotificationPush from "./NotificationPush.jsx";
const apiUrl = "https://proj.ruppin.ac.il/cgroup41/prod/UpdateSettingsUser";
const LeafIcon = require("../assets/leaf_money_icon.png");
const BackGroundImageLocal = require("../assets/bg_userProfile.png");
import { StackActions } from "@react-navigation/native";
const BackIcon = require("../assets/back.png");
const SaveIcon = require("../assets/save.png");
const comunityOptions=["בחר קהילה","לקט","מדריך טיולים","מגדל","חובב טבע"]
import { BlurView } from "expo-blur";

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function UserSetting({ route, navigation }) {
  console.log("UserSettings Route---->", route.params);
  const { greeting, pickImage, load, profileImage, user, profilePhotoAs } =
    route.params;
  const [comunity, setComunity] = useState(user.userType);
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(user.userName);
  const [CheckValdPassword, setCheckValdPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setIsOpen(false);
    setComunity(option)
  };

  const clearAll = () => {
    setComunity("");
    setPassword("");
    setFullname("");
  };
  const submit = () => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;


    if (fullname == "" || password == "") {
      Alert.alert("יש לבדוק תקינות הכנסת נתונים");
      return;
    }
    if (password.length < 5) {
      setCheckValdPassword(true);
      return;
    } else {
      setCheckValdPassword(false);
    }

    s = {
      UserName: fullname,
      UserPassword: password,
      UserEmail: user.userEmail,
      UserType: comunity,
      UserToken: user.userToken,
    };
    fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(s),
      headers: new Headers({
        "Content-type": "application/json; charset=UTF-8", //very important to add the 'charset=UTF-8'!!!!
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        console.log("66 res=", JSON.stringify(response));
        return response.text();
      })
      .then(
        (result) => {
          // GetUser = JSON.stringify(result);
          console.log("Fetch is success in UserSettings  user--> ", s);
          const usertoSaveLocal = {
            userName: s.UserName,
            userPassword: "",
            userEmail: s.UserEmail,
            userType: s.UserType,
            userToken: s.UserToken,
            userCoins: user.userCoins,
            profileImage: user.profileImage,
            userRating: user.userRating,
            userId: user.userId,
          };
          save(usertoSaveLocal);

          navigation.dispatch(
            StackActions.replace("UserProfile", {
              isExpert: route.params.isExpert,
              userID: route.params.user.userId,
            })
          );
        },
        (error) => {
          console.log("err post=", JSON.parse(error));
        }
      );
  };

  async function save(userToStore) {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userToStore));
      console.log("User To Store in LogIn", userToStore);
    } catch (error) {
      console.log("Error in save to Asyncs storage--->", error);
    }
  }

  if (user != null) {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.container}>
          <ImageBackground
            source={BackGroundImageLocal}
            style={styles.backgroundImage}
          >
            <TouchableOpacity
              style={styles.back}
              onPress={() =>
                navigation.goBack({
                  isExpert: route.params.isExpert,
                  userID: route.params.user.userId,
                })
              }
            >
              <Ionicons
                style={styles.iconBack}
                name="return-up-back-outline"
                color="green"
              ></Ionicons>
            </TouchableOpacity>
            <View
              style={{
                top: 40,
                left: 20,
                flexDirection: "row",
                alignItems: "flex-start",
                opacity: 0.7,
              }}
            >
              <TouchableHighlight onPress={() => pickImage()}>
                {profilePhotoAs ? (
                  <Image
                    style={{
                      borderRadius: 80,
                      width: 100,
                      height: 100,
                      borderWidth: 1,
                      borderColor: "black",
                    }}
                    source={{ uri: profileImage }}
                  />
                ) : (
                  <Image
                    style={{
                      borderRadius: 80,
                      width: 100,
                      height: 100,
                      borderWidth: 1,
                      borderColor: "black",
                    }}
                    source={{
                      uri: `https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/AnonymosProfile.png`,
                    }}
                  />
                )}
              </TouchableHighlight>
              <View style={{ flexDirection: "column", top: 35, left: 15 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {greeting()} {user.userName}
                </Text>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  {user.userType}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={LeafIcon}
                    style={{ height: 15, width: 15 }}
                  ></Image>
                  <Text style={{ fontWeight: "bold" }}>{user.userCoins}</Text>
                </View>
              </View>
            </View>

            <View style={{ alignItems: "center", marginTop: 100 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 17,
                  marginBottom: 25,
                  textDecorationLine: "underline",
                }}
              >
                עריכת פרטים אישיים
              </Text>
              <Text style={{ fontWeight: "bold" }}>שם משתמש</Text>
              <TextInput
                style={styles.Textinput}
                value={fullname}
                onChangeText={(fullText) => setFullname(fullText)}
              />
              <Text style={{ fontWeight: "bold" }}>סיסמה</Text>
              <View style={{alignItems:"center"}}>
                <TextInput
                  label="Password"
                  style={styles.Textinput}
                  secureTextEntry={passwordVisible}
                  value={password}
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

                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                  בחר קהילה
                </Text>

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
              padding: 10
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
              </View>
              <TouchableOpacity
                style={styles.btnStyleSettings}
                onPress={() => submit()}
              >
                <View style={styles.ViewInButton}>
                  <Image style={styles.iconIdentification} source={SaveIcon} />
                  <Text style={{ fontSize: 25, textAlign: "center"}}>
                    שמור שינויים
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => clearAll()}
                style={styles.btnStyleSettings}
              >
                <View style={styles.ViewInButton}>
                  <Image style={styles.iconIdentification} source={BackIcon} />
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    נקה שינויים
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
