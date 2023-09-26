import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../App.module.js";
import * as ImagePicker from "expo-image-picker";
import { StackActions } from "@react-navigation/native";
import NavBar from "./navBar";
export default function UserProfile({ route, navigation }) {
  //  let user=route.params;
  console.log("UserProfile Route---->", route.params);

  const BackGroundImageLocal = require("../assets/bg_userProfile.png");
  const HomePageIcon = require("../assets/logo_without_title.png");
  const ForumIcon = require("../assets/Icon_navbar_forums.png");
  const ShopIcon = require("../assets/Shop_icon.png");
  const LeafIcon = require("../assets/leaf_money_icon.png");
  const QuestionIcon = require("../assets/question.png");

  //לסוף של זה מוסיף את השם של הקובץ וככה קורא לו מהשרת
  // https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/

  const currentHour = new Date().getHours();
  apiUrl = "https://proj.ruppin.ac.il/cgroup41/prod/api/Upload";
  apiUrlinsert = "https://proj.ruppin.ac.il/cgroup41/prod/addPhoto";

  const [filename, setFileName] = useState(null);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [profilePhotoAs, setprofilePhotoAs] = useState(false);
  const [profilePhoto, setprofilePhoto] = useState("");
  let profilePhotoURI = "";
  console.log("USER profile Route -->", route.params);

  let interval;
  useEffect(() => {
    console.log("Onload User Profile !!! user--->", user);

    load();
    console.log("After Calling load function ");
  }, []);

  async function load() {
    try {
      let userAsync = await AsyncStorage.getItem("user");
      let profImage = await AsyncStorage.getItem("isProfile");
      console.log("asd 44", profImage);
      if (profImage != "0" && profilePhotoURI == "") {
        setprofilePhoto(profImage);
        console.log("47 ", profImage);
      }
      console.log("13 ", userAsync);
      if (user == null) {
        setUser(JSON.parse(userAsync));
        console.log("From function Load()", JSON.stringify(user));
      }
      if (profImage != "0") {
        setprofilePhotoAs(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function logOut() {
    console.log("asd");
    await AsyncStorage.setItem("isLoged", "0");
    reset();
    navigation.dispatch(StackActions.replace("Login"));
  }

  async function profiliLog() {
    await AsyncStorage.setItem("isProfile", profilePhotoURI);
    interval = setInterval(() => {
      console.log("this ran after 2 second");
      setprofilePhotoAs(true);
      setprofilePhoto(profilePhotoURI);

      clearInterval(interval);
    }, 2000);
    interval;
  }

  async function reset() {
    await AsyncStorage.setItem("isProfile", "0");
    setprofilePhotoAs(false);
    console.log("reset");
  }
  const pickImage = async () => {
    let uriName;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    console.log("sdasd ", result.assets[0]);
    uriName = result.assets[0].uri;
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    let uriNameToUp = uriName;
    uriName = uriName.split("ImagePicker");
    uriName = uriName[1].split("/");
    uriName = uriName[1].split(".");

    console.log("109 ", uriName[0]);
    profilePhotoURI = uriName[0];
    const formData = new FormData();
    formData.append("files", {
      uri: uriNameToUp,
      type: "image/png",
      name: `${uriName[0]}.png`,
    });

    console.log("88 ", formData._parts[0][1]);

    fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log("response= ", JSON.stringify(response));
        return response.json();
      })
      .then(
        (result) => {
          console.log("fetch POST= ", JSON.stringify(result));
        },
        (error) => {
          console.log("err post=", error);
        }
      );
    let d = new Date();

    const s = {
      PhotoUri: profilePhotoURI,
      PhotoTimestamp: 0,
      PostId: 0,
      UserId: user.userId,
      Latitude: 0,
      Longitude: 0,
      PhotoTimestamp:
        d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
    };

    console.log("171 =", user.userId);
    fetch(apiUrlinsert, {
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
          let GetUser = JSON.stringify(result);
          if (GetUser != "") {
            console.log("140 ", GetUser);
            console.log("fetch POST= ", JSON.stringify(result));
          }
        },
        (error) => {
          console.log("err post=", JSON.stringify(error));
        }
      );

    profiliLog();
  };

  function greeting() {
    if (currentHour <= 6 || currentHour >= 22) return "לילה טוב,";
    else if (currentHour >= 6 && currentHour <= 12) return "בוקר טוב,";
    else if (currentHour >= 12 && currentHour <= 17) return "צהריים טובים,";
    else return "ערב טוב,";
  }

  const RenderExpertButton = () => {
    if (route.params.isExpert) {
      return (
        <TouchableOpacity
          style={styles.btnStyleProfile}
          onPress={() => navigation.navigate("QuestExpertScreen", user.userId)}
        >
          <View style={styles.ViewInButton}>
            <Image style={styles.iconIdentification} source={QuestionIcon} />
            <Text style={{ fontSize: 25, textAlign: "center" }}>
              {" "}
              מענה על זיהויים
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  if (user != null) {
    return (
      <KeyboardAvoidingView >
        <View >
          <ImageBackground
            source={BackGroundImageLocal}
            // style={styles.backgroundImage}
            style={{ width: "100%", height: "100%" }}
          >
            <TouchableOpacity style={styles.logout} onPress={() => logOut()}>
              <Ionicons
                style={{ fontSize: 40 }}
                name="log-out-outline"
                color="#77a068"
              ></Ionicons>
            </TouchableOpacity>

            <View
              style={{
                top: 85,
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
                    source={{
                      uri: `https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/${profilePhoto}.png`,
                    }}
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
              <View style={{ flexDirection: "column", top: 30, left: 14 }}>
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

            <TouchableOpacity
              style={styles.backSettings}
              onPress={() =>
                navigation.navigate("UserSetting", {
                  user: user,
                  profileImage: `https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/${profilePhoto}.png`,
                  profilePhotoAs: profilePhotoAs,
                  greeting: greeting,
                  pickImage: pickImage,
                  load: load,
                  isExpert: route.params.isExpert,
                })
              }
            >
              <Ionicons
                style={{ fontSize: 40 }}
                name="settings"
                color="#77a068"
              ></Ionicons>
            </TouchableOpacity>
            <View style={{ marginTop: 170,flexDirection:'column',alignItems:'center'}}>
              <TouchableOpacity
                style={styles.btnStyleProfile}
                onPress={() =>
                  navigation.navigate("UserIdentification", {
                    userId: route.params.userID,
                    isExpert: route.params.isExpert,
                  })
                }
              >
                <View style={styles.ViewInButton}>
                  <Image
                    style={styles.iconIdentification}
                    source={HomePageIcon}
                  />
                  <Text style={{ fontSize: 25, textAlign: "center" }}>

                    הזיהויים האחרונים שלי
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnStyleProfile}
                onPress={() =>
                  navigation.navigate("UsersForum", {
                    userId: route.params.userID,
                    isExpert: route.params.isExpert,
                  })
                }
              >
                <View style={styles.ViewInButton}>
                  <Image style={styles.iconIdentification} source={ForumIcon} />
                  <Text style={{ fontSize: 25, textAlign: "center" }}>

                    קבוצות במעקב
                  </Text>
                </View>
              </TouchableOpacity>



              <TouchableOpacity
                style={styles.btnStyleProfile}
                onPress={() =>
                  navigation.navigate("Shop", {
                    userId: route.params.userID,
                    isExpert: route.params.isExpert,
                  })
                }
              >
                <View style={styles.ViewInButton}>
                  <Image style={styles.iconIdentification} source={ShopIcon} />
                  <Text style={{ fontSize: 25, textAlign: "center" }}>
                    חנות
                  </Text>
                </View>
              </TouchableOpacity>
              {RenderExpertButton()}
            </View>
          </ImageBackground>
          <NavBar
            isExpert={route.params.isExpert}
            userID={route.params.userID}
          ></NavBar>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
