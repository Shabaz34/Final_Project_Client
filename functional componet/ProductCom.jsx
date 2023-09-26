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
import { StackActions } from "@react-navigation/native";
import NavBar from "./navBar";

const LeafIcon = require("../assets/leaf_money_icon.png");

let saleIcon="https://img.favpng.com/14/16/1/sales-stock-photography-royalty-free-png-favpng-4pB56Z0MPNryj3hRUw9H1SaV0.jpg";

export default function ProductCom(props) {

    console.log('line 31 ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',props)
    let item=props.item
    let sale=props.sale
    const [user, setUser] = useState(props.user);
    const [coin, setcoin] = useState(props.coin);


//buy product and add to user products
function Buy(st,saleP){
    console.log(st.productCoins, ' ', user.userCoins," ",st.productId)
 if (saleP==true){ 
if(st.productCoins>user.userCoins*0.7){
    Alert.alert('חסרים לך מטבעות לרכישת פריט זה, לך תרוויח עוד!');
    return 
}
 }
 else if(st.productCoins>user.userCoins){
    Alert.alert('חסרים לך מטבעות לרכישת פריט זה, לך תרוויח עוד!');
    return 
}


//confirm if user want to buy the product ans send to func to buy
Alert.alert('', `האם אתה בטוח שברצונך לרכוש את ${st.productName}`, [
  {
    text: 'Cancel',
    onPress: () => console.log('Cancel Pressed'),
    style: 'cancel',
  },
  {text: 'OK', onPress: () => BuyProd(st,saleP)},
]);


}
//this func is send to the server for buy and insert to user product
const BuyProd = (st,saleP) =>{
    let Pcoin=st.productCoins;
    if (saleP=true){
        Pcoin=st.productCoins*0.7
    }
  fetch(`https://proj.ruppin.ac.il/cgroup41/prod/InsertProductToUser?userId=${user.userId}&productId=${st.productId}`, {
    method: "POST",
    headers: new Headers({

      "Content-type": "application/json; charset=UTF-8", //very important to add the 'charset=UTF-8'!!!!
      Accept: "application/json; charset=UTF-8",
    }),
  })
    .then((response) => {
      console.log("136 res=>>>>>>>>>>", JSON.stringify(response));
      return response.text();
    })
    .then(
      (result) => {
        console.log("141 post=>>>>>>>>>>>", result);
        fetch(`https://proj.ruppin.ac.il/cgroup41/prod/UpdateRating_Coins?id=${user.userId}&value=-${Pcoin}&isAdd=true&AddCoins=true`, {
            method: "PUT",
            headers: new Headers({
        
              "Content-type": "application/json; charset=UTF-8", //very important to add the 'charset=UTF-8'!!!!
              Accept: "application/json; charset=UTF-8",
            }),
          })
            .then((response) => {
              console.log("151 res=>>>>>>>>>>", JSON.stringify(response));
              return response.text();
            })
            .then(
              (result) => {
                console.log("156 Put=>>>>>>>>>>>", result);
                props.SyncLeafCoins(Pcoin)
              },
              (error) => {
                console.log("159 err post=>>>>>>>>>", JSON.stringify(error));
              }
            );

      },
      (error) => {
        console.log("165 err post=>>>>>>>>>", JSON.stringify(error));
      }
    );
}
    


  return (
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
  {/* add sale to product */}
   {sale ? (<Image
            style={{
              width: 25,
              height: 30,
              // opacity:0.4,
              resizeMode:'stretch',
              top:6,
              left:6,
position:'absolute',
            }}
            source={{uri:saleIcon}}
          /> ) : (sale=false)} 
 
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

              {sale ? 
             (<View>
             <View style={{ flexDirection: "row", alignItems: "center",justifyContent: 'center', }}>
             <Image
               source={LeafIcon}
               style={{ height: 20, width: 20 }}
             ></Image>
             <Text style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid',color:'red'}} >{item.productCoins}</Text>
           </View>
           <View style={{ flexDirection: "row", alignItems: "center",justifyContent: 'center', }}>
             <Image
               source={LeafIcon}
               style={{ height: 20, width: 20 }}
             ></Image>
             <Text >{ Number(item.productCoins)*0.7}</Text>
             </View>
           </View>
           )
            :
            (<View>
              <View style={{ flexDirection: "row", alignItems: "center",justifyContent: 'center', }}>
              <Image
                source={LeafIcon}
                style={{ height: 20, width: 20 }}
              ></Image>
              <Text >{item.productCoins}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center",justifyContent: 'center', }}>
              <Text > </Text>
              </View>
            </View> )}              

              

        <View style={{ alignItems: "center", marginBottom: 7,justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              width: "75%",
              height: 30,
              marginTop: 10,
              borderRadius: 15,
              backgroundColor: "#889480",
            }} onPress={()=> Buy(item,sale)}         >
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                fontWeight: "bold",
                top:2
              }}
            >
               לחץ לקנייה
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
