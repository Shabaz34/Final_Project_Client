import { StatusBar } from "expo-status-bar";
import {
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View,
  I18nManager,
  BackHandler,
} from "react-native";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./functional componet/LogIn";
import Register from "./functional componet/Register";
import UserProfile from "./functional componet/UserProfile";
import ResetPassword from "./functional componet/ResetPassword";
import UserIdentification from "./functional componet/UserIdentification";
import UsersForum from "./functional componet/UsersForum";
import Push from "./functional componet/Push";
import Quiz from "./screens/Quiz";
import QuizFeedBackScreen from "./screens/QuizFeedBackScreen";
import QuizScreen from "./screens/QuizScreen";
import NavBar from "./functional componet/navBar";
import Identify from "./screens/Identify";
import IdentificationResults from "./screens/IdentificationResults";
import QuestExpertScreen from "./screens/QuestExpertScreen";
import UserSettings from "./functional componet/UserSettings";
import * as Notifications from "expo-notifications";
import SearchingPage from "./screens/SearchingPage";
import SearchResults from "./screens/SearchResults";
import ForumMain from "./screens/ForumMain";
import ForumPage from "./screens/ForumPage";
import Shop from "./functional componet/Shop";
import UserProduct from "./functional componet/UserProduct";
// import ReplayScreen from "./screens/replayScreen";
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
//web:222431351949-u9t6ooea1k530kli2d6tiqbk6cndm78n.apps.googleusercontent.com
//ios:222431351949-bf16s29kjk5uhqaamuf76bhln3o9ulq1.apps.googleusercontent.com
//android:222431351949-h1ulm3jsa1t5cmghgghtppfip4j67p6t.apps.googleusercontent.com
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});
export default function App() {
  useEffect(() => {
    I18nManager.forceRTL(true);
    I18nManager.allowRTL(true);
    //handle push for display on client phone
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        //user recived notification
        console.log("NOTIFICATION RECIVED");
        console.log(notification);
        //const user=notification.request.body.data.userName
        //console.log(user)
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        //user responsed to notification
        //here we can choose what to do when the user clicks on the notification
        console.log("NOTIFICATION RESPONSE RECIVED");
        navigator.navigate("Login");
        console.log(response);
      }
    );

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => {
      //release resources
      subscription1.remove();
      subscription2.remove();
      backHandler.remove();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Push"
          component={Push}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuestExpertScreen"
          component={QuestExpertScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="QuizScreen"
          component={QuizScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForumMain"
          component={ForumMain}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForumPage"
          component={ForumPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="NavBar" component={NavBar} />
        <Stack.Screen
          name="Quizquest"
          component={Quiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuizFeed"
          component={QuizFeedBackScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserIdentification"
          component={UserIdentification}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="Shop"
          component={Shop}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserProduct"
          component={UserProduct}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UsersForum"
          component={UsersForum}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Identify"
          component={Identify}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="IdentificationResults"
          component={IdentificationResults}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserSetting"
          component={UserSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen //new
          name="SearchingPage"
          component={SearchingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen //new
          name="SearchResults"
          component={SearchResults}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
