import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

export default function Question(props) {
  const [Answer1, setAnswer1] = useState(false);
  const [Answer2, setAnswer2] = useState(false);
  const [Answer3, setAnswer3] = useState(false);
  const [Answer4, setAnswer4] = useState(false);
  const prefixPhoto = "https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/";

  const RenderImgorQuest = () => {
    if (props.PhotoID > 0) {
      console.log("need to return here the image !");
      return (
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.img}
            source={{
              uri: prefixPhoto + props.questionBody,
            }}
          />
        </View>
      );
    } else {
      return <Text style={styles.Primarytxt}>{props.questionBody + "?"}</Text>;
    }
  };

  const RenderTo = () => {
    // console.log("LINE 11 Question Comp", props.id);
    // console.log(props.questionBody.length,props.questionBody)
    if (props.cat == "רב-ברירה") {
      return (
        <View style={{alignItems:"center"}}>
          <Text style={styles.title}>שאלה: {props.questNumber}</Text>
          <View
            style={
             props.PhotoID>0? styles.Megacontainer :props.questionBody.length > 44
                ? styles.Bigcontainer
                : styles.container
            }
          >
            {RenderImgorQuest()}
            <View>
              <TouchableOpacity
                onPress={() => {
                  setAnswer1((prev) => !prev);
                  setAnswer2(false);
                  setAnswer3(false);
                  setAnswer4(false);
                  !Answer1
                    ? props.GetAns(props.answer1, props.index)
                    : props.GetAns("", props.index);
                }}
                style={styles.Answer}
              >
                <View style={styles.squer}>
                  <View
                    style={Answer1 ? styles.minSquresquerFill : styles.minSqure}
                  ></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAnswer2((prev) => !prev);
                  setAnswer1(false);
                  setAnswer3(false);
                  setAnswer4(false);
                  !Answer2
                    ? props.GetAns(props.answer2, props.index)
                    : props.GetAns("", props.index);
                }}
                style={styles.Answer}
              >
                <View style={styles.squer}>
                  <View
                    style={Answer2 ? styles.minSquresquerFill : styles.minSqure}
                  ></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer2}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAnswer3((prev) => !prev);
                  setAnswer1(false);
                  setAnswer4(false);
                  setAnswer2(false);
                  !Answer3
                    ? props.GetAns(props.answer3, props.index)
                    : props.GetAns("", props.index);
                }}
                style={styles.Answer}
              >
                <View style={styles.squer}>
                  <View
                    style={Answer3 ? styles.minSquresquerFill : styles.minSqure}
                  ></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer3}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAnswer4((prev) => !prev);
                  setAnswer1(false);
                  setAnswer2(false);
                  setAnswer3(false);
                  !Answer4
                    ? props.GetAns(props.answer4, props.index)
                    : props.GetAns("", props.index);
                }}
                style={styles.Answer}
              >
                <View style={styles.squer}>
                  <View
                    style={Answer4 ? styles.minSquresquerFill : styles.minSqure}
                  ></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer4}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.title}>שאלה: {props.questNumber}</Text>
          <View style={styles.ShortContainer}>
            <Text style={styles.Primarytxt}>{props.questionBody + "?"}</Text>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setAnswer1((prev) => !prev);
                  setAnswer2(false);
                  setAnswer3(false);
                  setAnswer4(false);
                  !Answer1
                    ? props.GetAns(props.answer1, props.index)
                    : props.GetAns("", props.index);
                }}
                style={styles.Answer}
              >
                <View style={styles.squer}>
                  <View
                    style={Answer1 ? styles.minSquresquerFill : styles.minSqure}
                  ></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAnswer2((prev) => !prev);
                  setAnswer1(false);
                  setAnswer3(false);
                  setAnswer4(false);
                  !Answer2
                    ? props.GetAns(props.answer2, props.index)
                    : props.GetAns("", props.index);
                }}
                style={styles.Answer}
              >
                <View style={styles.squer}>
                  <View
                    style={Answer2 ? styles.minSquresquerFill : styles.minSqure}
                  ></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer2}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  const Styling = (correct, ans, userAns) => {
    // console.log("in Styling Function --->", correct, ans, userAns);
    if (correct == ans) {
      return styles.AnswerGreen;
    } else if (ans == userAns) {
      return styles.AnswerRed;
    }
  };

  const GiveFeedText = (correct, userAns) => {
    console.log("in GiveFeedText Function --->", correct, userAns);
    if (userAns == correct) {
      return " תשובתך נכונה !";
    } else {
      return " טעית, בירוק התשובה הנכונה";
    }
  };

  const RenderToisShown = () => {
    console.log("RENDER SHOWN COMP", props.feedback);
    if (props.cat == "רב-ברירה") {
      return (
        <View>
          <Text style={styles.title}>
            שאלה: {props.questNumber}{" "}
            {GiveFeedText(
              props.feedback[props.index].correctAnswer,
              props.feedback[props.index].userAnswer
            )}
          </Text>
          <View
            style={
              props.PhotoID > 0
                ? styles.Megacontainer
                : props.questionBody.length > 44
                ? styles.Bigcontainer
                : styles.container
            }
          >
            {RenderImgorQuest()}
            <View>
              <TouchableOpacity
                style={[
                  styles.Answer,
                  Styling(
                    props.feedback[props.index].correctAnswer,
                    props.answer1,
                    props.feedback[props.index].userAnswer
                  ),
                ]}
              >
                <View style={styles.squer}>
                  <View style={styles.minSqure}></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.Answer,
                  Styling(
                    props.feedback[props.index].correctAnswer,
                    props.answer2,
                    props.feedback[props.index].userAnswer
                  ),
                ]}
              >
                <View style={styles.squer}>
                  <View style={styles.minSqure}></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer2}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.Answer,
                  Styling(
                    props.feedback[props.index].correctAnswer,
                    props.answer3,
                    props.feedback[props.index].userAnswer
                  ),
                ]}
              >
                <View style={styles.squer}>
                  <View style={styles.minSqure}></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer3}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.Answer,
                  Styling(
                    props.feedback[props.index].correctAnswer,
                    props.answer4,
                    props.feedback[props.index].userAnswer
                  ),
                ]}
              >
                <View style={styles.squer}>
                  <View style={styles.minSqure}></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer4}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.title}>
            שאלה: {props.questNumber}{" "}
            {GiveFeedText(
              props.feedback[props.index].correctAnswer,
              props.feedback[props.index].userAnswer
            )}
          </Text>
          <View style={styles.ShortContainer}>
            <Text style={styles.Primarytxt}>{props.questionBody + "?"}</Text>
            <View>
              <TouchableOpacity
                style={[
                  styles.Answer,
                  Styling(
                    props.feedback[props.index].correctAnswer,
                    props.answer1,
                    props.feedback[props.index].userAnswer
                  ),
                ]}
              >
                <View style={styles.squer}>
                  <View style={styles.minSqure}></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer1}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.Answer,
                  Styling(
                    props.feedback[props.index].correctAnswer,
                    props.answer2,
                    props.feedback[props.index].userAnswer
                  ),
                ]}
              >
                <View style={styles.squer}>
                  <View style={styles.minSqure}></View>
                </View>
                <Text style={styles.AnswerTXT}>{props.answer2}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  const Menus = () => {
    if (props.isShown) {
      return <RenderToisShown />;
    } else {
      return <RenderTo />;
    }
  };

  return <Menus />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 30,
    width: 330,
    height: 305,
    marginTop: 15,
  },

  Bigcontainer: {
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 30,
    width: 330,
    height: 325,
    marginTop: 15,
  },
  Megacontainer: {
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 30,
    width: 330,
    height: 440,
    marginTop: 15,
  },

  ShortContainer: {
    backgroundColor: "rgba(177, 187, 125, 0.6)",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 30,
    width: 330,
    height: 175,
    marginTop: 15,
  },
  con: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  img: {
    borderColor: "#3F493A",
    borderWidth: 0.9,
    width: 235,
    height: 150,
    marginTop: 15,

    borderRadius: 10,
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
    writingDirection:"rtl"
  },
  title: {
    textDecorationLine: "underline",
    fontSize: 16,
    marginTop: 15,
    
    // fontWeight: 700,
  },

  Answer: {
    flexDirection: "row",
    paddingBottom: 9,
    marginRight: 125,
    marginTop: 6,
    marginBottom: 6,
  },

  AnswerGreen: {
    backgroundColor: "rgba(177, 255, 125, 0.4)",
    borderRadius: 50,
  },

  AnswerRed: {
    backgroundColor: "rgba(255, 50, 60, 0.4)",
    borderRadius: 50,
  },
  AnswerTXT: {
    fontSize: 16,
    marginLeft: 5,
    marginTop: 12,
  },
  squer: {
    borderColor: "#000",
    borderWidth: 1,
    width: 18,
    height: 18,
    marginLeft: 20,
    marginTop: 15,
    borderRadius: 4,
  },
  // squerFill: {
  //   borderColor: "#000",
  //   borderWidth: 2,
  //   width: 18,
  //   height: 18,
  //   marginLeft: 20,
  //   marginTop: 15,
  //   backgroundColor: "#000",
  // },
  minSqure: {
    width: 10,
    height: 10,
  },
  minSquresquerFill: {
    width: 10,
    height: 10,
    margin: 3,
    backgroundColor: "#000",
    borderRadius: 2,
  },

  minSquresquerFillGreen: {
    width: 10,
    height: 10,
    margin: 3,
    backgroundColor: "#0f0",
    borderRadius: 2,
  },
  minSquresquerFillRed: {
    width: 10,
    height: 10,
    margin: 3,
    backgroundColor: "#f00",
    borderRadius: 2,
  },
});
