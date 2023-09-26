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

const LeafIcon = require("../assets/leaf_money_icon.png");

let saleIcon="https://img.favpng.com/14/16/1/sales-stock-photography-royalty-free-png-favpng-4pB56Z0MPNryj3hRUw9H1SaV0.jpg";

export default function Store({ route, navigation }) {
  const StoreIcon = require("../assets/Shop_icon.png");
  const BackGroundImageLocal = require("../assets/bg_userProfile.png");

  let userId = route.params.userId;
  let StoreId;
let userAsync;
console.log("shabaz shop =>> ", route.params.userId);
const [store, setStore] = useState(null);
  const [user, setUser] = useState(null);
  const [coin, setcoin] = useState(false);
  const rowContainers = [];


  
  useEffect(() => {
    fetch(`https://proj.ruppin.ac.il/cgroup41/prod/GetProduct`, {
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
            StoreId = result;
          if (store == null) {
            setStore(StoreId);
           
          }
          console.log("prod = ", StoreId);
        },
        (error) => {
          console.log("err post=", error);
        }
      );


      load();

  }, []);


  async function load() {
    try {
      userAsync = await AsyncStorage.getItem("user");
      userAsync = JSON.parse(userAsync);
      setcoin(userAsync.userCoins)
      console.log("74->>>>>>>>>>>>>>>>>>>>>>>>  ",userAsync );
    setUser(userAsync);
    } catch (error) {
      console.log("Error in load Function", error);
    }
  }
  //update leaf coin in store page
  async function SyncLeafCoins(coinSt) {
    try {
        console.log('84->>>>>>>>>>>>>>>>>>>>>>',coin);
     let userAs = await AsyncStorage.getItem("user");
     userAs = JSON.parse(userAs);
     userAs.userCoins =
        Number(userAs.userCoins) -
        Number(coinSt);
        console.log('93->>>>>>>>>>>>>>>>',userAs.userCoins)
        console.log('94->>>>>>>>>>>>>>>>',userAs)
        setcoin(userAs.userCoins)

        userAs = JSON.stringify(userAs);

      await AsyncStorage.setItem("user", userAs);
    } catch (error) {
      console.log("Error in load Function", error);
    }
  }


//enter this this func only if store exist, this nesecery for not stock in loop, and send to the scrollView all product
  if (store != null) {
    let sale=false;
    let prodSale={}
    let row = [];
    for (let i = 0; i < store.length; i++) {
      const item = store[i];
    //chose how is in sale  
  if(i==4){
sale=true
  }
  else{
    sale=false
  }

  row.push(       
<ProductCom item={item} sale={sale} user={user} coin={coin} SyncLeafCoins={SyncLeafCoins}></ProductCom>
      );
      if (row.length === 2 || i === store.length - 1) {
        rowContainers.push(
          <View style={{ flexDirection: "row" }} key={rowContainers.length}>
            {row}
          </View>
        );
        row = [];
      }
      
    }
    
  }



  
  if (store != null) {
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
                navigation.dispatch(StackActions.replace("UserProfile", {
                    isExpert: route.params.isExpert,
                    userID: route.params.userId,
               }))
               
              }
            >
              <Ionicons
                style={styles.iconBack}
                name="return-up-back-outline"
              ></Ionicons>
            </TouchableOpacity>

            <View
              style={{
                top: 85,
                left: 20,
                flexDirection: "row",
                alignItems: "flex-start",
                opacity: 0.7,
              }}
            >

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={LeafIcon}
                    style={{ height: 40, width: 40 }}
                  ></Image>
                  <Text style={{ fontWeight: "bold",fontSize:30}}>{coin}</Text>
                </View>

                <TouchableOpacity
                style={{position:'absolute',  alignItems: "center",right:30 }}
                onPress={() =>
                  navigation.navigate("UserProduct", {
                    userId: route.params.userId,
                    isExpert: route.params.isExpert,
                  })
                }
              >
               <View >
                  <Image
                    source={{uri:'https://icon-library.com/images/full-shopping-cart-icon/full-shopping-cart-icon-23.jpg'}}
                    style={{ height: 50, width: 50 }}
                  ></Image>
                </View>
              </TouchableOpacity>



            </View>

            <View
              style={{
                marginBottom: 100,
                top: 80,
                flexDirection: "column",
                alignItems: "center",
                opacity: 1,
              }}
            >
              <Image style={{ width: 140, height: 140 }} source={StoreIcon} />
              <Text style={{ fontWeight: "bold", fontSize: 25,textDecorationLine: 'underline' }}>
                חנות
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
    );
  }
}