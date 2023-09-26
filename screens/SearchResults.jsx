import React, { useState } from "react";
import {
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import NavBar from "../functional componet/navBar";
import BackGroundImageLocal from "../assets/bg_userProfile.png";
import styles from "../App.module.js";
import Searching from "./Searching";
import medicalIcon from "../assets/health.png"
import eatableIcon from "../assets/spice.png"
import allergyIcon from "../assets/allergy.png"
import shieldIcon from "../assets/shield.png"
import distinctIcon from "../assets/distinct.png"
import dangerIcon from "../assets/danger.png"
import beeIcon from "../assets/bee.png"
export default function SearchResults({ navigation,route }) {
    const { plant,userID,isExpert,plants } =route.params;
    const [moreInfo,setMoreInfo]=useState(false);
    const arr = []
    const navigateToSearchResults=(item)=>{
        navigation.navigate("SearchResults", {
          plant: item,
          userID: userID,
          isExpert: isExpert,
          plants:plants
        })
      }
      const toggleSwitch = () => {
        setMoreInfo((previousState) => !previousState);
        console.log(moreInfo)
      };
      const similarByX=10
      const similarPlantsArray = plants.map((item) =>{
        let counter=0;
        if(item.plantName!==null&&item.plantScientificName!==plant.plantScientificName){
      item.plantFamily==plant.plantFamily?counter+=1:""
      item.plantNumOfPetals==plant.plantNumOfPetals?counter+=1:""
      item.plantLeafShape==plant.plantLeafShape?counter+=1:"";
      item.plantLeafMargin==plant.plantLeafMargin?counter+=1:"";
      item.plantHabitat==plant.plantHabitat?counter+=1:"";
      item.plantStemShape==plant.plantStemShape?counter+=1:""
      item.plantLifeForm==plant.plantLifeForm?counter+=1:""
      item.PlantMedic==plant.PlantMedic?counter+=1:""
      item.plantIsToxic==plant.plantIsToxic?counter+=1:""
      item.plantIsEatable==plant.plantIsEatable?counter+=1:""
      item.plantIsAllergenic==plant.plantIsAllergenic?counter+=1:""
      item.plantIsEndangered==plant.plantIsEndangered?counter+=1:""
      item.plantIsProtected==plant.plantIsProtected?counter+=1:""
      item.plantIsProvidedHoneydew==plant.plantIsProvidedHoneydew?counter+=1:""
      counter>=similarByX?arr.push(item):""
        }
return(
<View>
{counter>=similarByX?     
<Pressable style={{alignItems:"center",justifyContent:"center",padding:5,width:160}} onPress={()=>{navigateToSearchResults(item)}}>

  {item.plantImage===null?"":<Image source={{uri: item.plantImage}}
 style={{width:140,aspectRatio:1,borderRadius:20
}} />}
   <Text>{item.plantName}</Text>
  <Text>{item.plantScientificName}</Text>
 </Pressable>:""}

        
        </View>
      )})
      return (
        <TouchableWithoutFeedback style={styles.container}>
          <ImageBackground style={styles.backgroundImage} source={BackGroundImageLocal}>
        <SafeAreaView style={{flex: 1,alignItems:"center"}}>
   
   <Searching plants={plants} navigateToSearchResults={navigateToSearchResults}
       />
       <ScrollView contentContainerStyle={{alignItems:"center",paddingBottom:23}}>
         {plant.plantImage===null?"":<Image source={{uri: plant.plantImage}}
          style={{width: "90%",
      aspectRatio: 1,
      borderRadius: 20
  }} />}
  <View style={styles.plantInfo}>
  <Text style={{fontSize:28,textAlign:"right",textDecorationLine:"underline"
}}>מידע כללי:</Text>
  <Text> • שם הצמח: {plant.plantName}</Text>
  <Text> • שם מדעי: {plant.plantScientificName}</Text>
  {plant.plantIsToxic?<View style={styles.iconView}>
<Text> • צמח רעיל!</Text>
<Image source={dangerIcon} style={styles.searchResultsIcon}></Image></View>:""}

  <Text> • משפחה: {plant.plantFamily}</Text>
  <Text> • מס׳ עלי כותרת: {plant.plantNumOfPetals}</Text>
  <Text> • צורת העלה: {plant.plantLeafShape}</Text>
  <Text> • צורת שפת העלה: {plant.plantLeafMargin}</Text>
  <Text> • אזור גידול: {plant.plantHabitat}</Text>
  <Text> • צורת הגבעול: {plant.plantStemShape}</Text>
  <Text> • צורת חיים: {plant.plantLifeForm}</Text>
  <Text> • תקופת גידול: {plant.plantBloomingSeason}</Text>
  <View style={styles.iconView}>
</View>
{plant.PlantMedic?<View style={{flexDirection:"row",justifyContent:"center"}}>
<Text> • משמש לרפואה</Text>
<Image source={medicalIcon} style={styles.searchResultsIcon}></Image>
</View>:""}
{plant.plantIsEatable?<View style={styles.iconView}>
<Text> • צמח אכיל</Text>
<Image source={eatableIcon} style={styles.searchResultsIcon}></Image>
</View>:""}
{plant.plantIsAllergenic?<View style={styles.iconView}>
<Text> • צמח אלרגני</Text>
<Image source={allergyIcon} style={styles.searchResultsIcon}></Image>
</View>:""}
{plant.plantIsEndangered?<View style={styles.iconView}>
<Text> • צמח זה נמצא תחת סכנת הכחדה</Text>
<Image source={distinctIcon} style={styles.searchResultsIcon}></Image>
</View>:""}
{plant.plantIsProtected?<View style={styles.iconView}>
<Text> • צמח מוגן</Text>
<Image source={shieldIcon} style={styles.searchResultsIcon}></Image>
</View>:""}
{plant.plantIsProvidedHoneydew?
  <View style={styles.iconView}>
<Text> • מצמח זה ניתן להנפיק דבש</Text>
<Image source={beeIcon} style={styles.searchResultsIcon}></Image>
</View>:""}
<TouchableOpacity title="more info" onPress={toggleSwitch}>
{moreInfo?
<Text style={{textDecorationLine:"underline"}}> • הצג פחות</Text>
:<Text style={{textDecorationLine:"underline"}}> • מידע נוסף</Text>

}
</TouchableOpacity>
{moreInfo&&<Text style={{writingDirection: 'rtl',maxWidth:"99%"}}>{plant.plantMoreInfo}</Text>}
  </View>

{arr.length>0?<Text style={{textAlign:"center",fontSize:24}}>צמחים בעלי מאפיינים דומים</Text>:""}

  <>
  {arr.length>2?<ScrollView horizontal>
        <View style={{
          flexDirection: "row",
          justifyContent:"flex-start",
          height:200
          }}>
        {similarPlantsArray}
</View>
  </ScrollView>
  :(arr.length>0?<View style={{
          flexDirection: "row",
          justifyContent:"flex-start",
          height:200
          }}>
          {similarPlantsArray}
        </View>:"")}
  </>

</ScrollView>
      <NavBar
        isExpert={route.params.isExpert}
        userID={route.params.userID}
      ></NavBar>
   
         </SafeAreaView>
         </ImageBackground>
         </TouchableWithoutFeedback>
     );
};