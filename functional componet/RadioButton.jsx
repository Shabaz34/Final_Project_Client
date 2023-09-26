import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";

// props List :
// props.answer1 = the title or lable for the radio button
// props.TranferInfo(state) = uplifting function to tranfer info for the father comp
// props.Brcolor = the border color
// props.Bcolor = the background color of the mini squere
// props.Size = the font size of the label the size of the Squre etc....



export default function RadioButton(props) {
  const [On, setOn] = useState(false);
  console.log(props);
  console.log(On);

  const styles = StyleSheet.create({
    Answer: {
      flexDirection: "row",
      // paddingBottom: 9,
      // marginRight: 125,
      // marginTop: 6,
      marginBottom: 6,
      
    },
  
    AnswerTXT: {
      fontSize: props.Size+5,
      marginLeft: 5,
      marginTop: 12,
    },
    squer: {
      borderColor: props.Brcolor,
      borderWidth: 1,
      width: props.Size+8,
      height: props.Size+8,
      marginLeft: 20,
      marginTop: 4,
      borderRadius: 4,
    },
  
    minSqure: {
      width: props.Size,
      height: props.Size,
    },
    minSquresquerFill: {
      width: props.Size,
      height: props.Size,
      margin: 3,
      backgroundColor: props.Brcolor,
      borderRadius: 2,
    },
  });

  return (
    <TouchableOpacity
      onPress={() => {
        setOn((prev) => !prev);
        props.TranferInfo(!On);
        console.log('58 ', On)
      }}
      style={styles.Answer}
    >
      <View style={styles.squer}>
        <View style={On ? styles.minSquresquerFill : styles.minSqure}></View>
      </View>
      <Text style={styles.AnswerTXT}>{props.Label}</Text>
    </TouchableOpacity>
  );


}
