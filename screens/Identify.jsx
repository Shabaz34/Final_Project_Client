import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import styles from "../assets/styles";
import {
  Text,
  View,
  Image,
  PermissionsAndroid,
  Switch,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import mainLogo from "../assets/icon_title.png";
import backgroundImage from "../assets/background_reconize.png";
import galleryIcon from "../assets/Icon_gallery.png";
import NavBar from "../functional componet/navBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

let userId;
let userAsync;
let localuser;
export default function Identify({ navigation, route }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [isLocationEnabled, setisLocationEnabled] = useState(true);
  const [isExpert, setisExpert] = useState(false);
  console.log("Identify Route----->", route.params);

  // //   //camera/gallery permissions
  useEffect(() => {
    setSelectedImage(null);
    async function load() {
      try {
        userAsync = await AsyncStorage.getItem("user");
        localuser = JSON.parse(userAsync);
        userId = localuser.userId;
        console.log("YXYXYXYXYXYX------>", userId);
        if (userId != undefined || userId != null) {
          fetch(`https://proj.ruppin.ac.il/cgroup41/prod/isExpert?id=${userId}`)
            .then((response) => response.json())
            .then((json) => {
              console.log("isExperts ?", "UserID: " + userId, JSON.parse(json));
              setisExpert(JSON.parse(json));
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } catch (error) {
        console.log("15");
      }
    }
    load();
    getGPS();
    (async () => {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
        Permissions.CAMERA
      );
      if (status !== "granted") {
        alert("Permission to access camera and camera roll is required!");
      }
    })();
  }, []);

  // //   //upload image function from gallery/camera
  const pickImage = async (from) => {
    let settings = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };
    let result =
      from === "gallery"
        ? await ImagePicker.launchImageLibraryAsync(settings)
        : from === "camera"
        ? await ImagePicker.launchCameraAsync(settings)
        : "";

    if (!result.cancelled) {
      // console.log("result--- ", result);
      return result.assets[0].uri;
    }
  };

  const handleSelectImage = async (from) => {
    const uri = await pickImage(from);
    if (uri) {
      setSelectedImage(uri);
    }
  };

  // //    gps button
  const toggleSwitch = () => {
    setisLocationEnabled((previousState) => !previousState);
  };

  const getGPS = async () => {
    if (isLocationEnabled) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setIsLocationReady(true);
    }
  };
  useEffect(() => {
    if (selectedImage !== null) {
      navigation.navigate("IdentificationResults", {
        selectedImage: selectedImage,
        location: locationString,
        userId: userId,
        locationReady: isLocationReady,
        isExpert: isExpert,
      });
    }
  }, [selectedImage]);

  let locationString = isLocationReady
    ? JSON.stringify(location)
    : "no permisions";
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage} source={backgroundImage}>
        <View style={styles.location}>
          <Switch
            trackColor={{ false: "#767567", true: "#5ea652" }}
            thumbColor={isLocationEnabled ? "#d7ecc3" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isLocationEnabled}
          />
          <Text>{isLocationEnabled ? "מיקום פעיל" : "מיקום כבוי"}</Text>
        </View>
        <View style={styles.uploadButtons}>
          <TouchableOpacity
            style={styles.cameraButton}
            title="Take a picture"
            onPress={() => {
              handleSelectImage("camera");
            }}
          >
            <Image source={mainLogo} style={styles.mainLogo}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.galleryButton}
            title="Pick an image from camera roll"
            onPress={() => {
              handleSelectImage("gallery");
            }}
          >
            <Image source={galleryIcon} style={styles.galleryIcon}></Image>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <NavBar
        isExpert={isExpert}
        userID={userId == undefined ? route.params.userId : userId}
      ></NavBar>
    </View>
  );
}
