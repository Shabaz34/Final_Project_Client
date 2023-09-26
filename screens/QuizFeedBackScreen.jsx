import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import Question from "./Question";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BG = require("./images/bg.png");
const LeafIcon = require("../assets/leaf_money_icon.png");

export default function QuizFeedBackScreen({ route, navigation }) {
  const [Renderstate, setRenderstate] = useState(false);
  let Render = 0;
  let DATA = 0;

  //   console.log("in Quizfeed show FEED BACK -->", Data.feedback);
  //   console.log("in Quizfeed Show Quiz -->", Data.quiz);

  useEffect(() => {
    async function load() {
      try {
        userAsync = await AsyncStorage.getItem("user");
        userAsync = JSON.parse(userAsync);
        userAsync.userCoins =
          Number(userAsync.userCoins) +
          Number(route.params.feedback[route.params.feedback.length - 1]);
        userAsync = JSON.stringify(userAsync);
        await AsyncStorage.setItem("user", userAsync);
      } catch (error) {
        console.log("Error in load Function", error);
      }
    }
    load();

    // happen only one time in the load of this comppent
    console.log("onload QuizFeedBack");
    setRenderstate(true);
  }, []);
  const ShuffleArray = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    console.log("in ShuffleArray function-->", array);
    return array;
  };
  const BeforeShuffle = (cat, a, b, c, d) => {
    if (cat == "רב-ברירה") {
      var AnswerArray = [a, b, c, d];
    } else {
      var AnswerArray = [a, b];
    }
    console.log("in BeforeShuffle function", AnswerArray);
    return ShuffleArray(AnswerArray);
  };

  if (Renderstate) {
    console.log("check !!!! ", route.params.THEquiz);
    console.log("check !!!! ", route.params.feedback);
    Render = route.params.THEquiz.questList.map((quest, index) => {
      console.log("in map-->", quest);
      const ArrayShuffeld = BeforeShuffle(
        quest.questionCategory,
        quest.questionCurrectAnswer,
        quest.questionDistractingA,
        quest.questionDistractingB,
        quest.questionDistractingC
      );

      return (
        <Question
          key={index + 1}
          index={index}
          questNumber={index + 1 + "/6"}
          id={route.params.THEquiz.questIDs[index]}
          questionBody={quest.questionBody}
          answer1={ArrayShuffeld[0]}
          answer2={ArrayShuffeld[1]}
          answer3={ArrayShuffeld[2]}
          answer4={ArrayShuffeld[3]}
          cat={quest.questionCategory}
          feedback={route.params.feedback}
          PhotoID={quest.photoId}
          isShown={true}
        />
      );
    });
  }

  return (
    <View>
      <ImageBackground style={{ width: "100%", height: "100%" }} source={BG}>
        <View style={styles.con}>
          <ScrollView>
            {Renderstate ? Render : <Text>Loading...</Text>}

            <View style={styles.FeedbackCon}>
              <Text style={styles.scoreTitle}>ציונך בחידון הוא</Text>
              <Text style={styles.scoreTitle}>
                {route.params.feedback[route.params.feedback.length - 2]}
              </Text>
              <Text style={styles.scoreTitle}>
                הרווחת {route.params.feedback[route.params.feedback.length - 1]}{" "}
              </Text>
              <Image
                source={LeafIcon}
                style={{ height: 35, width: 35, bottom: 42, left: 218 }}
              ></Image>
              <TouchableOpacity
                style={styles.btnn}
                onPress={() => {
                  navigation.navigate("Identify");
                }}
              >
                <Text style={styles.tx}>חזור לדף הראשי</Text>
              </TouchableOpacity>
              {/* <Button style={styles.btn} title="חזור לדף הראשי"></Button> */}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  //   container: {
  //     backgroundColor: "rgba(177, 187, 125, 0.6)",
  //     borderWidth: 2,
  //     borderColor: "#3F493A",
  //     borderRadius: 30,
  //     width: 351,
  //     height: 230,
  //     marginTop: 15,
  //   },
  con: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreTitle: {
    fontSize: 28,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center",
  },
  FeedbackCon: {
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    padding: 12,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 15,
  },

  tx: {
    fontSize: 20,
    padding: 0,
    textAlign: "center",
    marginRight: 50,
    marginLeft: 30,
  },

  btnn: {
    backgroundColor: "rgba(247, 251, 225, 0.46)",
    padding: 10,
    borderRadius: 15,
    textAlign: "center",
    width: 300,
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
  },
});
