import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import QuestCard from "../functional componet/QuestCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../App.module.js";
import { StackActions } from "@react-navigation/native";



const BackGroundImageLocal = require("../assets/bg_userProfile.png");

export default function QuestExpertScreen({ route, navigation }) {
  const [QuestList, setQuestList] = useState(null);
  const [Reload, setReload] = useState(0);
  let Render = 0;
  const prefixPhoto = "https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/";

  useEffect(() => {
    console.log("only onload! QuestExpertScreen ");
    let expertid = route.params;
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/GetQuestForExpert?ExpertId=${expertid}`;
    fetch(api, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        console.log("from only onload! res= ", JSON.stringify(res));
        return res.json();
      })
      .then(
        (result) => {
          console.log("QuestList = ", result);
          setQuestList(result);
        },
        (error) => {
          console.log("ERROR in fetch to get Expert Quest! = ", error);
          setQuestList(null);
        }
      );
  }, [Reload]);

  const refresh = () => {
    setReload((prev) => prev + 1);
  };

  const RenderListOfQuest = () => {
    if (QuestList != null) {
      Render = QuestList.map((quest, index) => {
        console.log(index, quest);
        return (
          <QuestCard
            key={index}
            PhotoUri={prefixPhoto + quest.photoUri.replace('"', "")}
            requestId={quest.requestId}
            expertID={quest.expertId}
            SendToToken={quest.sendToToken}
            index={index}
            QuestID={quest.questionsForExpertsId}
            Refresh={refresh}
          />
        );
      });
    }
  };
  RenderListOfQuest();
  return (
    <View>
      <ImageBackground
        style={{ width: "100%", height: "100%" }}
        source={BackGroundImageLocal}
      >
        <TouchableOpacity
          style={styles.back}
          onPress={() =>
            navigation.dispatch(StackActions.replace("UserProfile", {isExpert:true, userID: route.params}))
          }
        >
          <Ionicons
            style={styles.iconBack}
            name="return-up-back-outline"
            color="green"
          ></Ionicons>
        </TouchableOpacity>
        <View style={{ alignItems: "center", marginTop: 85 }}>
          <ScrollView>
            <Text
              style={{ fontSize: 22, textAlign: "center", color: "#3F493A" }}
            >
              זיהויים לא מוצלחים של משתמשים
            </Text>
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              בדף זה תמצאו תמונות מזיהויים לא מוצלחים של משתמשי האפליקציה עזרו
              להם לזהות את הצמחים ותקבלו מטבעות
            </Text>
            <View style={{ alignItems: "center" }}>
              {Render != 0 ? (
                Render
              ) : (
                <Text
                  style={{ fontSize: 25, textAlign: "center", marginTop: 75 }}
                >
                  אין בקשות לזיהוי כרגע ,בדוק מאוחר יותר
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}


