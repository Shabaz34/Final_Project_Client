import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
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
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../App.module.js";
import Login from "./LogIn";
import { StackActions } from "@react-navigation/native";
import NavBar from "./navBar";
import IdeCard from "./IdeCard.jsx";

export default function UserIdentification({ route, navigation }) {
  const HomePageIcon = require("../assets/logo_without_title.png");
  const BackGroundImageLocal = require("../assets/bg_userProfile.png");
  const prefixPhoto = "https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/";

  const ZeroLowBar = require("../assets/0-25.png");
  const LowMidBar = require("../assets/25-50.png");
  const MidGoodBar = require("../assets/50-75.png");
  const GoodBestBar = require("../assets/75-100.png");

  let userId = route.params.userId;
  let isExpert=route.params.isExpert
  let identibyId;
  console.log('useridefication Route----->',route.params)

  let templist = [];
  let identiMap;
  console.log(userId, " 15 ");
  const [identification, setidentification] = useState(null);
  const [listofAnswer, setlistofAnswer] = useState(null);
  const [stam, setstam] = useState(0);
  const [TheAnswer, setTheAnswer] = useState("");

  useEffect(() => {
    fetch(
      `https://proj.ruppin.ac.il/cgroup41/prod/getIdentifiedUser/${userId}`,
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
          identibyId = result;
          if (identification == null) {
            setidentification(identibyId);
          }
          console.log("identit= ", identibyId);
          GetAnswers();
        },
        (error) => {
          console.log("err post=", error);
        }
      );
  }, []);

  const GetAnswers = () => {
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/GetAnswerForMe?userid=${userId}`;
    fetch(api, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        console.log(" from GetAnswers function res = ", JSON.stringify(res));
        return res.json();
      })
      .then(
        (result) => {
          console.log("List of Answers = ", result);
          setlistofAnswer(result);
          setstam(1);
          templist = result;
          console.log("List of Answers local = ", listofAnswer, templist);
        },
        (error) => {
          console.log("err in GetAnswers function =", error);
        }
      );
  };

  const GetAnswerById = (id) => {
    //console.log("List of Answer---->", listofAnswer,id);
    let flag = false;
    for (let i = 0; i < listofAnswer.length; i++) {
      const element = listofAnswer[i];
      if (element.identificationId == id) {
        console.log("Found this Answer", element);
        flag = true;
        return element;
      }
    }
    if (flag == false) {
      return flag;
    }
  };

  if (identification != null) {
    console.log("in Render identification to user", listofAnswer);
    identiMap = identification.map((st) => {
      console.log("in map ide-->", st);
      // console.log('in map ide-->',listofAnswer,st.identificationId);
      let answer = false;
      if (stam == 1) {
        answer = GetAnswerById(st.identificationId);
      }

      console.log("The Answer for this st--->", answer);
      //here need to use the IdeCard
      return (
        <IdeCard
          key={st.identificationId}
          Answer={answer}
          PlantName={st.plantScientificName}
          photo={prefixPhoto + st.photoUri.replace('"', "")}
          precetage={st.identificationPercentage}
          IdentificationId={st.identificationId}
          TimeStamp={st.timeStamp}
        />
      );
    });
  }

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
                userID: route.params.userId,
              })
            }
          >
            <Ionicons
              style={styles.iconBack}
              name="return-up-back-outline"
              color="#77a068"
            ></Ionicons>
          </TouchableOpacity>
          <View
            style={{
              marginBottom: 100,
              top: 80,
              flexDirection: "column",
              alignItems: "center",
              opacity: 1,
            }}
          >
            <Image style={{ width: 146, height: 100 }} source={HomePageIcon} />
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              זיהויים אחרונים
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{ Top: 170, alignItems: "center" }}
          >
            {identiMap}
            <View style={{ height: 50 }}></View>
          </ScrollView>
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}
