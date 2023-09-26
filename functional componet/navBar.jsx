import { Image, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../App.module.js";
import QuizScreen from "../screens/QuizScreen";
import { useNavigation } from "@react-navigation/native";
import Search from "../screens/SearchingPage.jsx"; //new

export default function NavBar(props) {
  const ForumIcon = require("../assets/Icon_navbar_forums.png");
  const ProfileIcon = require("../assets/Icon_navbar_profile.png");
  const SearchIcon = require("../assets/Icon_navbar_search.png");
  const triviaIcon = require("../assets/Icon_navbar_trivia.png");
  const HomePageIcon = require("../assets/logo_without_title.png");
  const navigation = useNavigation();
  console.log("NavBar props--->", props);
  return (
    <LinearGradient
      colors={["rgba(166, 184, 153, 0)", "rgba(88, 103, 77, 0.8)"]}
      start={[0.5, 0]}
      end={[0.5, 1]}
      style={styles.NavBar}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("QuizScreen", {
            userID: props.userID,
            isExpert: props.isExpert,
          })
        }
      >
        <Image style={styles.icon} source={triviaIcon} />
      </TouchableOpacity>

      <TouchableOpacity //new
        onPress={() =>
          navigation.navigate("SearchingPage", {
            userID: props.userID,
            isExpert: props.isExpert,
          })
        }
      >
        <Image style={styles.icon} source={SearchIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Identify", {
            userID: props.userID,
            isExpert: props.isExpert,
          })
        }
      >
        <Image style={styles.icon} source={HomePageIcon} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ForumMain", {
            userID: props.userID,
            isExpert: props.isExpert,
          })
        }
      >
        <Image style={styles.icon} source={ForumIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("UserProfile", {
            userID: props.userID,
            isExpert: props.isExpert,
          })
        }
      >
        <Image style={styles.icon} source={ProfileIcon} />
      </TouchableOpacity>
    </LinearGradient>
  );
}
