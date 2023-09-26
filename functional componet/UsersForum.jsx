import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "../App.module.js";
import NavBar from "./navBar";

export default function UsersForum({ route, navigation }) {
  const ForumIcon = require("../assets/Icon_navbar_forums.png");
  const BackGroundImageLocal = require("../assets/bg_userProfile.png");
  console.log("User Formus Route----->", route.params);

  let userId = route.params.userId;
  let ForumId;
  let ForumMap;
  console.log(userId, " 15 ");
  const [forum, setforum] = useState(null);
  useEffect(() => {
    console.log("26 - route params - userForum ",route.params)
    fetch(`https://proj.ruppin.ac.il/cgroup41/prod/getForumUser/${userId}`, {
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
          if (forum == null) {
            setforum(result);
          }
        },
        (error) => {
          console.log("err post=", error);
        }
      );
  }, []);

  if (forum != null) {
    ForumMap = forum.map((st) => {
      return (
        <View
          key={st.key}
          style={{
            backgroundColor: "#90AE95",
            width: 370,
            height: 175,
            opacity: 0.6,
            alignItems: "center",
            borderRadius: 20,
            borderColor: "black",
            borderWidth: 0.5,
            marginTop: 20,
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              {st.photoUri==""?<Image
                style={{
                  borderColor: "black",
                  borderWidth: 0.2,
                  width: 110,
                  height: 90,
                  marginLeft: 5,
                  marginRight: 10,
                  marginTop: 10,
                }}
                source={ForumIcon}
              />:<Image
                style={{
                  borderColor: "black",
                  borderWidth: 0.2,
                  width: 110,
                  height: 90,
                  marginLeft: 5,
                  marginRight: 10,
                  marginTop: 10,
                }}
                source={{uri:`https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/${st.photoUri}`}}
              />}
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginTop: 10,
                  width: "65%",
                  height: "100%",
                }}
              >
                <ScrollView
                  contentContainerStyle={{ alignItems: "flex-start" }}
                  nestedScrollEnabled={true}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      flexWrap: "wrap",
                      fontWeight: "bold",
                    }}
                  >
                    {st.socialForumName}
                  </Text>
                  <Text style={{ textAlign: "left", flex: 1 }}>
                     {st.socialForumDiscription}
                  </Text>
                </ScrollView>

                <View style={{ flexDirection: "row", paddingTop: 10 }}>
                  <Text style={{ textAlign: "left", flex: 1 }}>
                    מספר משתתפים: {st.numberOfParticipant}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: "center", marginBottom: 7 }}>
 


              <TouchableOpacity
                onPress={() => {
                  console.log(st)
                  
                 navigation.navigate("ForumPage", {
                   user: route.params,
                   forum: st,
                 });
              }}
                style={{
                  width: "75%",
                  height: 30,
                  left: 10,
                  marginTop: 10,
                  borderRadius: 15,
                  backgroundColor: "#889480",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  הכניסה מכאן
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    });
  }

  if (forum != null) {
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
                  userID: route.params.userId,
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
              <Image style={{ width: 136, height: 107 }} source={ForumIcon} />
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                קבוצות במעקב
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{ Top: 170, alignItems: "center" }}
            >
              {ForumMap}
              <View style={{ height: 50 }}></View>
            </ScrollView>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
