import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,Modal
} from "react-native";
import React, { useState,useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from "expo-blur";


import Quizquest from "./Quiz";
import NavBar from "../functional componet/navBar";
// import "@fontsource/assistant"; // Defaults to weight 400.

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


const BG = require("./images/bg.png");
let userId;
let userAsync;
let localuser ;
export default function QuizScreen({ navigation,route }) {
  const [quizName, setQuizName] = useState("");
  const [selectedValue, setSelectedValue] = useState("בחר רמה");
  const Stack = createNativeStackNavigator();
  const [localUser, setLocalUser] = useState(null);
  const dificultyOptions=["בחר רמה","קל","קשה"]
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option) => {
    setIsOpen(false);
    setSelectedValue(option)
  };

  useEffect(() => {
    console.log('Quiz Screen route--->',route.params)
    userId=route.params.userID;
    if (route.params==undefined) {
      async function load() {
        try {
           userAsync = await AsyncStorage.getItem("user");
           localuser = JSON.parse(userAsync);
            userId=localuser.userId;
            console.log('QuizScreen UserId------>',userId)
        } catch (error) {
          console.log("15");
        }
      }
      load();
    }

  }, [])
  


  const List = () => {
    return (
      <View style={styles.list}>

<TouchableOpacity style={[{ padding: 10},styles.Textinput]} onPress={toggleDropdown}>
                   <Text style={{textAlign:"center"}}>{selectedValue || "בחר רמה"}</Text>
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
            {dificultyOptions.map((option) => (
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
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={{ width: "100%", height: "100%" }} source={BG}>
        <View style={styles.minCon}>
          <View style={styles.form}>
            <List />
            <TextInput
              onChangeText={(name) => setQuizName(name)}
              style={styles.input}
              placeholder="בחר שם לחידון"
            />
            <TouchableOpacity
              onPress={() => {
                //need to pass user id

                console.log(quizName, selectedValue,userId);
                if (selectedValue!='בחר רמה' && quizName!='' && userId!=undefined) {
                  if(selectedValue=="קל"){
                    navigation.navigate("Quizquest", {
                    quizName: quizName,
                    Level: 1,
                    userId:userId,
                  });
                  }
                  if(selectedValue=="קשה"){
                  navigation.navigate("Quizquest", {
                    quizName: quizName,
                    Level: 2,
                    userId:userId,
                  });
                  }
                }
                else{
                  Alert.alert('נא הכנס את כל הפרטים')
                }
        
              }}
              style={styles.btn}
            >
              <Text style={styles.tx}>התחל חידון</Text>
              <Ionicons
                style={{ position: "absolute", bottom: 8, right: 70 }}
                name={"game-controller"}
                size={30}
                color={"#000"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <NavBar isExpert={route.params.isExpert} userID={route.params.userID}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "#000000",
    // borderWidth: 0,
  },
  tx: {
    fontSize: 20,
    padding: 0,
    textAlign: "center",
    // fontWeight: 600,
    marginRight: 50,
    
  },
  input: {
    borderWidth: 2,
    padding: 5,
    paddingLeft: 63,
    fontSize: 18,
    textAlign: "right",
    margin: 10,
    backgroundColor: "#ffffff80",
    marginBottom: 15,
    borderRadius: 22,
    width: 300,
    height: 50,
    
  },
  btn: {
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
  list: {
    borderColor: "#3F493A",
    backgroundColor: "#ffffff80",
    borderWidth: 2,
    padding: 5,
    borderRadius: 22,
    width: 300,
    height: 50,
    marginBottom: 15,

    
  },
  minCon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: "#000000",
    // borderWidth: 1,



  },
  form: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#000000",
    borderWidth: 1,
    padding: 0,
    borderRadius: 15,
    backgroundColor: "rgba(177, 187, 125, 0.5)",
    
  },
  pickerItem: {
    position: "absolute",
    left: 1,
    right: 0,
    // fontWeight: 400,
    fontSize: 18,
    lineHight: 24,
    textAlign: "right",
    color: "#7C7C7C",
  },
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
