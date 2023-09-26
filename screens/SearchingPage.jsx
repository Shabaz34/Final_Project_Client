//new
import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import NavBar from "../functional componet/navBar";
import BackGroundImageLocal from "../assets/bg_userProfile.png";
import styles from "../App.module.js";
import Searching from "./Searching.jsx";

export default function SearchingPage({ navigation, route }) {
  const { isExpert, userID } = route.params;
  const [plants, setPlants] = useState([]);
  useEffect(() => {
    const allPlantsApi = "https://proj.ruppin.ac.il/cgroup41/prod/plant";
    fetch(allPlantsApi, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setPlants(result);
      })
      .catch((error) => {
        console.log("getAllPlantsSearchError ----- ", error);
      });
  }, []);

  const navigateToSearchResults = (item) => {
    navigation.navigate("SearchResults", {
      plant: item,
      userID: userID,
      isExpert: isExpert,
      plants: plants,
    });
  };

  return (
    <TouchableWithoutFeedback style={styles.container}>
      <>
      <ImageBackground
        style={styles.backgroundImage}
        source={BackGroundImageLocal}
      >
        <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
          <Searching
            plants={plants}
            navigateToSearchResults={navigateToSearchResults}
          />
        </SafeAreaView>
      </ImageBackground>
      <NavBar
        isExpert={route.params.isExpert}
        userID={route.params.userID}
      ></NavBar>
      </>

    </TouchableWithoutFeedback>
  );
}
