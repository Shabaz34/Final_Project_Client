import {
  ActivityIndicator,
  Image,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import styles from "../assets/styles";
import React, { useEffect, useState } from "react";
import NavBar from "../functional componet/navBar";
import SpecificIdentification from "../functional componet/SpecificIdentification";
import * as FileSystem from "expo-file-system";
import backgroundImage from "../assets/background_reconize.png";

//import data1 from "../functional componet/TempPlantApi";

export default function IdentificationResults({ navigation, route }) {
  // let selectedImage = route.params.selectedImage; //the image the user upload
  // let userId = route.params.userId;
  // let locationReady = route.params.locationReady;
  // let location = route.params.location;
  let { isExpert, selectedImage, userId, locationReady, location } =
    route.params;
  console.log("IdentificationResults Route---->", route.params);

  const [path, setPath] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isUploaded, setUploded] = useState(false);
  const [plantIdentificationSaved, setplantIdentificationSaved] =
    useState(false);

  const [plantData, setPlantData] = useState("");
  const [plantScientificName, setPlantScientificName] = useState("");
  const [identificationData, setIdentificationData] = useState({
    userId: userId,
    photoId: -1,
  });

  const [identificationId, setIdentificationId] = useState(-1);
  const [plantId, setPlantId] = useState(-1);
  const [identificationPercentage, setIdentificationPercentage] = useState(-1);

  useEffect(() => {
    getPlantApi();
  }, []);
  const getPlantApi = () => {
    const imgArr = [];
    const apiKeyCGroup41 = "kip0Z1E82eAOoH35RroCeUJIGoMKGMitMehj1NahjUAUgCdYCk"; //77 remining
    const apoKeyGilad = "dMF9bxaLq8dcblg5CE5kGqgFKlJ63VYPF3cKD24u9p9KOenUxU"; //30 remining
    const RuppinServer2Key =
      "XLqfiYmJSFnBAOinTtoLHI4pGeJRPoCBuX4xA8wQNX5ugDdPdT"; //100 remining
    const bestGroupKey = "P9nJ90ECdH2fdvYOxG2eQaJb0PHakmLT9uH8c8Pz9xdWt3oCXQ"; //100 remining
    const DorGuyGiladKey = "wWpQR2dgYzxJhLOhSAoB9O3go3tQhkmJMHttEXfDJahfAykbhs"; //100 remiing

    const api = "https://api.plant.id/v2/identify";
    FileSystem.readAsStringAsync(selectedImage, {
      encoding: FileSystem.EncodingType.Base64,
    }).then((base64String) => {
      imgArr.push(base64String);
      const data = {
        api_key: Math.random() > 0.5 ? RuppinServer2Key : bestGroupKey,
        //api_key: "yMUTWGPue7vkkVZaKQnX2RjWpweqJ7TTbuOpkevPlR1OAXIAWI",
        // api_key: "8mq1p9sPwdlA5XvhdCDdbFMW4skwbAm5FJw83DkdrBhKjwkeGS",
        // api_key: "nhNh2OGxj4hGUDsNvqggk4dwdJXtIjz0gTCU7OZ4BbXEiSRwdK",
        images: imgArr,
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: [
          "common_names",
          "url",
          "name_authority",
          "wiki_description",
          "taxonomy",
          "synonyms",
        ],
      };
      fetch(api, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPlantData(data);
          setPlantScientificName(
            (scientificName = data.suggestions[0].plant_details.scientific_name)
          );
          setIdentificationPercentage(
            (data.suggestions[0].probability * 100).toFixed(1)
          );
          setLoading(false);
        })
        .catch((error) => {
          console.log("ERR1 --- ", error);
        });
    });
  };
  useEffect(() => {
    if (
      isUploaded === false &&
      plantData.is_plant === true &&
      selectedImage &&
      (locationReady || location === "no permisions")
    ) {
      uploadFile();
    }
  }, [locationReady, location, selectedImage, isUploaded, plantData.is_plant]);

  const uploadFile = () => {
    setUploded(true);
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/api/Upload`;
    const formData = new FormData();
    formData.append("files", {
      uri: selectedImage,
      type: "image/png",
      name: `${selectedImage.split("/").pop()}`,
    });

    fetch(api, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    })
      .then((response) => {
        //console.log("response= ", JSON.stringify(response));
        return response.json();
      })
      .then(
        (result) => {
          //console.log("fetch POST= ", JSON.stringify(result));
          setPath(JSON.stringify(result).split("/").pop());
        },
        (error) => {
          console.log("err post=", error);
        }
      );
  };
  useEffect(() => {
    if (path !== "") {
      savePhoto();
    }
  }, [path]);

  const savePhoto = () => {
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/addPhoto`;
    let d = new Date();

    const formData = {
      photoUri: path,
      userId: userId,
      photoTimestamp:
        d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
    };

    if (locationReady === true && location !== "no permisions") {
      location = JSON.parse(location);
      formData.latitude = location.coords.latitude;
      formData.longitude = location.coords.longitude;
      //formData.Timestamp = location.Timestamp;
    }

    fetch(api, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("QQQ-", data);
        setIdentificationData({
          ...identificationData,
          photoId: data.photoId,
        });
        // console.log("data save image--- ", data);
      })
      .catch((error) => {
        console.log("ERR save image------ ", error);
      });
  };
  useEffect(() => {
    if (identificationData.photoId !== -1) {
      saveIdenfication();
    }
  }, [identificationData]);

  const saveIdenfication = () => {
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/identification`;
    fetch(api, {
      method: "POST",
      body: JSON.stringify(identificationData),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("DATA----", data);
        setIdentificationId(data.identificationId);
      })
      .catch((error) => {
        console.log("ERR2 ----- ", error);
      });
  };
  useEffect(() => {
    if (plantScientificName !== "" && identificationId != "") {
      savePlant();
    }
  }, [plantScientificName, identificationId]);
  const savePlant = () => {
    const api = `https://proj.ruppin.ac.il/cgroup41/prod/plant/${plantScientificName}`;
    fetch(api, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        console.log("response= ", JSON.stringify(response));
        return response.json();
      })
      .then((data) => {
        console.log("savePlant data ---", data);

        setPlantId(data);
      })
      .catch((error) => {
        console.log("ERR3 ----- ", error);
      });
  };

  useEffect(() => {
    if (
      plantIdentificationSaved === false &&
      identificationId !== -1 &&
      plantId !== -1 &&
      identificationPercentage !== -1
    ) {
      savePlant_Identification();
    }
  }, [
    identificationId,
    plantId,
    identificationPercentage,
    plantIdentificationSaved,
  ]);
  const savePlant_Identification = () => {
    setplantIdentificationSaved(true);
    console.log(
      "666666666",
      "identificationId",
      identificationId,
      "plantId",
      plantId,
      identificationPercentage
    );
    //api has been changed

    const api = `https://proj.ruppin.ac.il/cgroup41/prod/plantIdentification?plantId=${plantId}&identificationId=${identificationId}&probability=${identificationPercentage}`;
    fetch(api, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        console.log("response= ", response);
        return response.text();
      })
      .catch((error) => {
        console.log("ERR4 ----- ", error);
      });
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <View style={styles.container}>
        <View>
          <View style={{ alignItems: "center", marginTop: 15 }}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            ></Image>
          </View>

          {plantData == undefined ? (
            <View style={styles.header}>
              <Text style={{ fontSize: 24 }}>אנא נסה שנית מאוחר יותר</Text>
            </View>
          ) : isLoading ? (
            <ActivityIndicator />
          ) : plantData.is_plant ? (
            <View>
              <View style={styles.header}>
                <Text style={{ fontSize: 24 }}>
                  זיהינו עבורך את התוצאות הבאות
                </Text>
              </View>
              <View style={{ height: 300 }}>
                <ScrollView style={{ marginTop: 15 }}>
                  {plantData.suggestions.map((plant, index) => (
                    <SpecificIdentification
                      id={index}
                      key={index}
                      plant={plant}
                      location={location}
                      ready={locationReady}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          ) : (
            <View style={styles.header}>
              <Text style={{ fontSize: 24 }}>
                אנא הכנס תמונות של צמחים בלבד{" "}
              </Text>
            </View>
          )}
        </View>
        <NavBar userID={route.params.userId} isExpert={route.params.isExpert} />
      </View>
    </ImageBackground>
  );
}
