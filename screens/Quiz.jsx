import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Question from "./Question";
const BG = require("./images/bg.png");

export default function Quiz({ route, navigation }) {
  console.log(route.params)
  const { quizName, Level,userId } = route.params;
  const [quizD, setQuizD] = useState({ name: quizName, level: Level });
  const [quiz, setQuiz] = useState(0);
  const [UserAnswerArray, setUserAnswerArray] = useState([]);

  let Render = 0;

  const GetAnswerUser = (AnswerValue, index) => {
    UserAnswerArray[index] = AnswerValue;
    console.log("Quiz Comp in GetAnswerUser function ---> ", UserAnswerArray, AnswerValue);
  };
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
  const BeforeShuffle = (cat,a,b,c,d) => {
    if (cat == "רב-ברירה") {
      var AnswerArray = [
        a,
        b,
        c,
        d,
      ];
    } else {
      var AnswerArray = [a, b];
    }
    console.log("in BeforeShuffle function", AnswerArray);
    return ShuffleArray(AnswerArray);
  };

  useEffect(() => {
    // happen only one time in the load of this comppent
    console.log("onload",quizName,userId,Level);
    //NOTE the user id is 1 const -> need to change it to the current User !
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/api/Quizs/CreateNewQuiz?name=${quizName}&userid=${userId}&level=${Level}`; 
    fetch(api, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        console.log("res= ", JSON.stringify(res));
        return res.json();
      })
      .then(
        (result) => {
          console.log("Quiz = ", result);

          setQuiz(result);
        },
        (error) => {
          console.log("ERROR 32 !=", error);
        }
      );
  }, []);

  if (quiz != 0) {
    //  console.log("XXXXXXXXXXXXX",quiz);
    Render = quiz.questList.map((quest, index) => {
      const ArrayShuffeld=BeforeShuffle(quest.questionCategory,quest.questionCurrectAnswer,quest.questionDistractingA,quest.questionDistractingB,quest.questionDistractingC);
      return (
        <Question
          key={index + 1}
          index={index}
          questNumber={index + 1 + "/6"}
          id={quiz.questIDs[index]}
          questionBody={quest.questionBody}
          answer1={ArrayShuffeld[0]}
          answer2={ArrayShuffeld[1]}
          answer3={ArrayShuffeld[2]}
          answer4={ArrayShuffeld[3]}
          cat={quest.questionCategory}
          PhotoID={quest.photoId}
          GetAns={GetAnswerUser}
          isShown={false}
        />
      );
    });
  }
  const SendquizToServer = () => {
    console.log("in SendquizToServer function");
    if (UserAnswerArray.length < 5) {
      Alert.alert("בבקשה תענה על כל השאלות");
    } else {
      console.log('in SendquizToServer function',quiz.quizId,userId)
      const api = `https://proj.ruppin.ac.il/cgroup41/prod/api/Quizs/Finish&SaveQuiz?quizID=${quiz.quizId}&UserId=${userId}`; //NOTE !! user id !!! NOTE//
      fetch(api, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        }),
        body: JSON.stringify(UserAnswerArray),
      })
        .then((res) => {
          console.log("res = ", JSON.stringify(res));
          return res.json();
        })
        .then(
          (result) => {
            console.log("Score = ", result);
            navigation.navigate("QuizFeed", { feedback: result, THEquiz: quiz });
          },
          (error) => {
            console.log("ERROR in SendquizToServer 32 !=", error);
          }
        );
    }
  };

  return (
    <View>
      <ImageBackground style={{ width: "100%", height: "100%" }} source={BG}>
        <View style={styles.con}>
          <ScrollView>
            {Render != 0 ? Render : <Text>Loading...</Text>}

            <TouchableOpacity
              onPress={() => SendquizToServer()}
              style={styles.btn}
            >
              <Text style={styles.tx}>סיים חידון</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 30,
    width: 351,
    height: 230,
    marginTop: 15,
  },
  con: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  Primarytxt: {
    // position: "absolute",
    // left: 8,
    // top: 6,
    // fontWeight: 400,
    fontSize: 18,
    // textAlign: "right",
    lineHeight: 30,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  title: {
    textDecorationLine: "underline",
    fontSize: 16,
    left: 12,
    marginTop: 15,
    // fontWeight: 700,
  },

  Answer: {
    flexDirection: "row",
  },
  AnswerTXT: {
    fontSize: 16,
    marginLeft: 5,
    marginTop: 12,
  },
  squer: {
    borderColor: "#000",
    borderWidth: 2,
    width: 18,
    height: 18,
    marginLeft: 20,
    marginTop: 15,
  },
  squerFill: {
    borderColor: "#000",
    borderWidth: 2,
    width: 18,
    height: 18,
    marginLeft: 20,
    marginTop: 15,
    backgroundColor: "#000",
  },
  btn: {
    backgroundColor: "rgba(247, 251, 225, 0.46)",
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
    textAlign: "center",
    width: 330,
    borderColor: "#3F493A",
    borderWidth: 2,

    shadowColor: "#77a068",
    shadowOffset: {
      width: 5,
      height: 14,
    },
    shadowOpacity: 0.94,
    shadowRadius: 95.38,
    elevation: 69,
  },
  tx: {
    fontSize: 20,
    padding: 0,
    textAlign: "center",
    // fontWeight: 600,
    marginRight: 50,
    marginLeft: 30,
  },
});
