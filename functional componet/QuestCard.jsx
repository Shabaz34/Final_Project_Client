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
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function QuestCard(props) {
  const [IsClick, setIsClick] = useState(false);
  const [ExpertAnswer, setExpertAnswer] = useState("");
  console.log("props of QuestCard comp --> ", props);
  const RenderCard = () => {
    //console.log(IsClick);
    console.log("props of QuestCard comp --> ", props);
    // console.log('uri: ',uri);
    if (IsClick) {
      return (
        <TouchableOpacity
          onPress={() => {
            setIsClick((prev) => !prev);
          }}
          style={{
            position: "absolute",
            left: -20,
            width: 600,
            height: 350,
            zIndex: 7,
          }}
        >
          <Image
            style={{
              borderRadius: 15,
              borderColor: "#3F493A",
              borderWidth: 2,
              width: 320,
              height: 290,
            }}
            source={{
              uri: props.PhotoUri,
            }}
          />
        </TouchableOpacity>
      );
    }
  };

  async function load() {
    try {
      userAsync = await AsyncStorage.getItem("user");
      userAsync = JSON.parse(userAsync);
      userAsync.userCoins = Number(userAsync.userCoins) + 100; //because in the server is 100 also.
      console.log('State of user---->',userAsync.userCoins,'User:',userAsync)
      userAsync = JSON.stringify(userAsync);
      await AsyncStorage.setItem("user", userAsync);
    } catch (error) {
      console.log("Error in load Function", error);
    }
  }

  const SubmitAnswertoServer = (flag) => {
    console.log("we are in submit function ", ExpertAnswer);
    const expertID = props.expertID;
    const QuestID = props.QuestID;
    let answer = ExpertAnswer;
    if (flag == false) {
      answer = "המומחה אינו מזהה את הצמח";
    } 

    const api = `https://proj.ruppin.ac.il/cgroup41/prod/SubmitExpertAnswer?expertID=${expertID}&QuestID=${QuestID}&answer=${answer}`;
    fetch(api, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        console.log("from SubmitAnswertoServer res= ", JSON.stringify(res));
        return res.text();
      })
      .then(
        (result) => {
          console.log("res json = ", result);
          //success
          console.log('Before Calling Push in success callback.');
          console.log('Add Money');
           load();
          PushNotification(
            props.SendToToken,
            "משתמש מומחה נתן מענה על הזיהוי שלך",
            "לחץ כאן כדי לראות את התשובה"
          );

          props.Refresh();
          setExpertAnswer('');
        },
        (error) => {
          console.log("ERROR in fetch to post submitExpert answer ! = ", error);
        }
      );
  };

  const PushNotification = (token, title, body) => {

    console.log('parmas in PushNotification---->',token,title,body);
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token, //should read from DB
        title: title,
        body: body,
      }),
    });
  };

  return (
    <View>
      {RenderCard()}
      <View style={styles.Card}>
        <TouchableOpacity
          onPress={() => {
            setIsClick((prev) => !prev);
          }}
        >
          <Image
            style={styles.img}
            source={{
              uri: props.PhotoUri,
            }}
          />
        </TouchableOpacity>

        <TextInput
          onChangeText={(answer) => {
            setExpertAnswer(answer);
          }}
          style={styles.input}
          placeholder="הכנס את תשובתך לכאן"
          value={ExpertAnswer}
        />
        <TouchableOpacity
          onPress={() => SubmitAnswertoServer(true)}
          style={styles.btn}
        >
          <Text style={styles.tx}>שלח תשובה</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => SubmitAnswertoServer(false)}
          style={styles.btnRed}
        >
          <Text style={styles.tx}>איני מזהה את הצמח</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Card: {
    width: "85%",
    height: 410,
    marginTop: 50,
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 15,
    alignItems: "center",
  },
  img: {
    width: 215,
    height: 165,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#3F493A",
  },
  imgZoom: {
    width: 350,
    height: 270,
    zIndex: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#000",
  },
  input: {
    borderWidth: 2,
    padding: 5,
    paddingLeft: 15,
    fontSize: 18,
    textAlign: "right",
    margin: 10,
    backgroundColor: "#ffffff80",
    marginBottom: 15,
    borderRadius: 15,
    width: 250,
    height: 50,
    borderWidth: 2,
    borderColor: "#3F493A",
  },

  tx: {
    fontSize: 20,
    padding: 0,
    textAlign: "center",
  },

  btn: {
    backgroundColor: "rgba(247, 251, 225, 0.46)",
    padding: 10,
    borderRadius: 15,
    textAlign: "center",
    width: 250,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderColor: "#3F493A",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 6,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 26,
    marginBottom: 15,
  },

  btnRed: {
    backgroundColor: "rgba(247, 155, 155, 0.46)",
    padding: 10,
    borderRadius: 15,
    textAlign: "center",
    width: 250,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderColor: "#3F493A",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 6,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 26,
    marginBottom: 15,
  },
});
