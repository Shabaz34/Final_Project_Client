import React from "react";
import styles from "../assets/styles";
import { Image, ScrollView, Text, View } from "react-native";
import above75 from "../assets/75-100.png";
import above0 from "../assets/0-25.png";
import above25 from "../assets/25-50.png";
import above50 from "../assets/50-75.png";

export default function SpecificIdentification(props) {
  console.log("SpecificIdentification Card props----->", props);
  const plantData = props.plant;
  const ready = props.ready;
  if (ready) {
    const stringLocation = props.location;
    location =
      stringLocation === "no permisions"
        ? (location = stringLocation)
        : (location = JSON.parse(stringLocation));
  }
  const probability = plantData.probability;

  const listImages = plantData.similar_images.map((image) => (
    <Image
      key={image.url}
      source={{ uri: image.url }}
      style={styles.plantsPhotos}
    />
  ));
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#3F493A",
        backgroundColor: "#79866E50",
        borderRadius: 25,
        marginTop: 5,
        marginBottom: 15,
        marginHorizontal: 5,
        paddingBottom: 20,
       
      }}
    >
      <View style={{backgroundColor: "#90AE95", borderRadius:50,width:25,height:25,alignItems:'center', alignContent:'center',position:'absolute',left:10,top:5}}>
        <Text style={{fontSize:18}}>{props.id+1}</Text>
      </View>


      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop:22
        }}
      >
        {listImages}
      </View>

      <View style={{ flexDirection: "row",justifyContent:'space-evenly' }}>
        <Text
          style={{
            alignItems: "center",
            paddingTop: 15,
            fontSize: 16,
            textDecorationLine: "underline",
            paddingRight: 5,
          }}
        >
          שם הצמח: {plantData.plant_details.scientific_name}
        </Text>
        <View style={{ alignItems: "center" }}>
          <Image
            source={
              probability > 0.75
                ? above75
                : probability > 0.5
                ? above50
                : probability > 0.25
                ? above25
                : above0
            }
            style={{ marginLeft: 10 }}
          ></Image>
          <Text style={{fontSize:12}}>{(probability * 100).toFixed(1)}% התאמה</Text>
        </View>
      </View>
    </View>
  );
}
