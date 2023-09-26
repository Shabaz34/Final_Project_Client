import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const ZeroLowBar = require("../assets/0-25.png");
const LowMidBar = require("../assets/25-50.png");
const MidGoodBar = require("../assets/50-75.png");
const GoodBestBar = require("../assets/75-100.png");
const prefixPhoto = "https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/";

//props List:
// PlantName
//Date
//location
//photo
//precetage
//IdentificationId
// { uri: prefixPhoto + props.photo }

export default function IdeCard(props) {
  console.log('props of IdeCard---->',props)

  const Render=()=>{
    if (props.Answer==false || props.Answer==undefined) {
      return(
        <View style={styles.CardCon}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.img}
            source={{
              uri: props.photo,
            }}
          />
          <View>
            <Text style={styles.Nametitle}>
              שם הצמח מדעי:{"\n"}
              {props.PlantName}
            </Text>
            <Text style={{ fontSize: 8 }}>על פי אחוז הזיהוי הגבוה ביותר</Text>
  
            <Text style={{ marginTop: 10 }}>זוהה בתאריך: {props.TimeStamp}</Text>
  
            <View style={{ flexDirection: "row", marginTop: 0 }}>
              <Ionicons
                style={{ marginTop: 0 }}
                name="location-outline"
              ></Ionicons>
              <Text style={{ textDecorationLine: "underline" }}>מיקום</Text>
            </View>
            <View style={{marginLeft:85,marginTop:-8}}>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={{ width: 55, height: 30 }}
                  source={precentage(props.precetage)}
                />
                <Text style={{ fontSize: 12 }}>
                  אחוז זיהוי: {props.precetage}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      );
    }
    else{
      return(
        <View style={styles.CardConAn}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.img}
            source={{
              uri: props.photo,
            }}
          />
          <View>
            <Text style={styles.Nametitle}>
              שם הצמח מדעי:{"\n"}
              {props.PlantName}
            </Text>
            <Text style={{ fontSize: 8 }}>על פי אחוז הזיהוי הגבוה ביותר</Text>
  
            <Text style={{ marginTop: 10 }}>זוהה בתאריך:</Text>
  
            <View style={{ flexDirection: "row", marginTop: 0 }}>
              <Ionicons
                style={{ marginTop: 0 }}
                name="location-outline"
              ></Ionicons>
              <Text style={{ textDecorationLine: "underline" }}>מיקום</Text>
            </View>
            <View style={{marginLeft:85,marginTop:-8}}>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={{ width: 55, height: 30 }}
                  source={precentage(props.precetage)}
                />
                <Text style={{ fontSize: 12 }}>
                  אחוז זיהוי: {props.precetage}%
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.answerWrap,{alignItems:"center"}]}>
          <Text style={styles.answerText}><Text style={{textDecorationLine: 'underline'}}>תשובה ממשתמש מומחה: </Text> {props.Answer.expertAnswer} </Text>
        </View>
      </View>
      );
    }
  }

  const precentage = (precent) => {
    if (precent > 0 && precent <= 25) return ZeroLowBar;
    else if (precent > 25 && precent <= 50) return LowMidBar;
    else if (precent > 50 && precent <= 75) return MidGoodBar;
    else return GoodBestBar;
  };

  return (
    Render()
  );
}

const styles = StyleSheet.create({
  CardCon: {
    backgroundColor: "#90AE95",
    width: 350,
    height: 155,
    borderRadius: 20,
    borderColor: "#3F493A",
    borderWidth: 1,
    marginTop: 20,
    padding: 5,
    paddingBottom:55,
    opacity:0.7
  },
  CardConAn: {
    backgroundColor: "#90AE95",
    width: 350,
    height: 240,
    borderRadius: 20,
    borderColor: "#3F493A",
    borderWidth: 1,
    marginTop: 20,
    padding: 5,
    paddingBottom:55,
  },
  img: {
    borderColor: "#3F493A",
    borderWidth: 0.9,
    width: 150,
    height: 125,
    marginLeft: 5,
    marginRight: 10,
    borderRadius: 10,
    marginTop:5,
  },

  Nametitle: {
    textAlign: "left",
  },
  answerWrap:{
    marginTop:15,
    marginLeft:4,
    borderWidth:1,
    borderColor:'#3F493A',
    backgroundColor: "#E0E0E0",
    opacity: 0.6,
    padding:10,
    borderRadius:20,
    borderBottomRightRadius:0,
    height:67
    
    
  },
  answerText:{
   color:'#000',
   fontSize:15,
  }
});
