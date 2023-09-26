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
  TouchableHighlight
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../App.module.js";
import Login from "./LogIn";
import ProductCom from "./ProductCom";

import { StackActions } from "@react-navigation/native";
import NavBar from "./navBar";

const BackGroundImageLocal = require("../assets/bg_userProfile.png");
export default function UserProduct({ route, navigation }) {
    let userId = route.params.userId;
    console.log("shabaz UserProduct=>>>>  ", route.params.userId);

    let ProductId;
    const rowContainers = [];

      const [Product, setProduct] = useState(null);
    useEffect(() => {
        fetch(`https://proj.ruppin.ac.il/cgroup41/prod/getProductsByUserId/${userId}`, {
          method: "GET",
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
                ProductId = result;
              if (Product == null) {
                setProduct(ProductId);
               
              }
              console.log("prod = ", ProductId);
            },
            (error) => {
              console.log("err post=", error);
            }
          );
    
        
      }, []);
    
      if (Product != null) {
        let sale=false;
        let row = [];
        for (let i = 0; i < Product.length; i++) {
          const item = Product[i];
        //chose how is in sale  

      row.push(       
        <View
        key={item.key}
        style={{
          backgroundColor: "white",
          height: "90%",
          alignItems: "center",
          borderRadius: 20,
          opacity:0.85,
          borderColor: "black",
          borderWidth: 0.5,
          marginTop: 20,
          margin:10,
          flex: 1,
        }}
      >
     
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View>
              <Image
                style={{
                  borderColor: "black",
                  borderWidth: 0.2,
                  width: 120,
                  height: 100,
                  marginLeft: 5,
                  marginRight: 10,
                  marginTop: 10,
                }}
                source={{uri:item.productUri}}
              />
    </View>
    
                  <Text style={{ textAlign: "center" }}>
                    {item.productName}
                  </Text>
          </View>
        </View>          );
          if (row.length === 2 ) {
            rowContainers.push(
              <View style={{ flexDirection: "row" }} key={rowContainers.length}>
                {row}
              </View>
            );
            row = [];
          }
          if (i === Product.length - 1) {
            rowContainers.push(
              <View style={{flexDirection: "row",width: '50%'}} key={rowContainers.length}>
                {row}
              </View>
            );
            row = [];
          }
          
        }
        
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
                userId: userId,
              })
              }
            >
              <Ionicons
                style={styles.iconBack}
                name="return-up-back-outline"
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
              <Text style={{ fontWeight: "bold", fontSize: 25,textDecorationLine: 'underline' }}>
                המוצרים שלי
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{ Top: 170, alignItems: "center",paddingBottom:60}}
            >
              {rowContainers}
            </ScrollView>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
  )
}
