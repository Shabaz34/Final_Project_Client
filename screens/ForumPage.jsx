import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import bg from "../assets/ForumsBG.png";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TextInput } from "react-native-paper";

export default function ForumPage({ navigation, route }) {
  const [ForumsList, setForumsList] = useState(0);
  const prefixPhoto = "https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/";
  const [TheForum, setTheForum] = useState(0);
  const [ReRender, setReRender] = useState(false);
  const [PostList, setPostList] = useState(0);
  const [ModalToggle, setModalToggle] = useState(false);
  const [PostUpload, setPostUpload] = useState(0);
  const [ReplayList, setReplayList] = useState(0);
  const [REplayCon, setREplayCon] = useState(0)
  let ContentPost = ``;
  let ContentReplay=``;

  let forumDetail = {};
  useEffect(() => {
    console.log("onload in ForumPage this is the Route", route.params);
    console.log("route.params.forum: --->", route.params.forum);
    console.log("Forum_v2?--->", route.params.forum_v2);
    if (route.params.forum_v2 == undefined) {
      forumDetail = route.params.forum;
      setTheForum(route.params.forum);
      setForumsList(1);
      console.log("sucsses parameters suckit -->", forumDetail);
      if (forumDetail.follow == "no") {
        setReRender(false);
      } else {
        setReRender(true);
      }
      GetPost(forumDetail.socialForumId);
    } else {
      let localforumid = route.params.forum_v2.split("forumID:");
      console.log("what is this ? -->", localforumid[1]);
      const apiGetForum = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/GetForumsById&Follow?userID=${route.params.user.userID}`;
      fetch(apiGetForum, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then(
          (result) => {
            //console.log("fetch POST= ", JSON.stringify(result));
            setForumsList(result);
            for (let i = 0; i < result.length; i++) {
              const forum = result[i];
              // console.log('what is this 2  ? -->',forum);
              if (forum.socialForumId == localforumid[1]) {
                // console.log("Found forum! -->", forum);
                forumDetail = forum;
                setTheForum(forum);
                if ((forum.follow = "yes")) {
                  setReRender(true);
                }
                GetPost(forum.socialForumId);
              }
            }
          },
          (error) => {
            console.log("err get Forums ---> =", error);
          }
        );
    }
  }, []);

  const GetPost = (forumid) => {
    console.log("is undefind ?", forumid);
    const PostApi = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/GetPosts?forumID=${forumid}`;
    fetch(PostApi, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(
        (result) => {
          console.log("Good result from Get Post -->", JSON.stringify(result));
          setPostList(result);
        },
        (error) => {
          console.log("err get Post of Forum ! ---> ", error);
        }
      );
  };

  const scalbleFontText = (text) => {
    // console.log(text.length);
    if (text.length <= 8) {
      return (
        <Text
          style={{
            fontSize: 25,
            backgroundColor: "#90AE9580",
            padding: 7,
            borderRadius: 12,
          }}
        >
          {text}
        </Text>
      );
    } else if (text.length > 24) {
      return (
        <Text
          style={{
            fontSize: 14,
            backgroundColor: "#90AE9580",
            padding: 7,
            borderRadius: 12,
          }}
        >
          {text}
        </Text>
      );
    } else if (text.length > 18) {
      return (
        <Text
          style={{
            fontSize: 17,
            backgroundColor: "#90AE9580",
            padding: 7,
            borderRadius: 12,
          }}
        >
          {text}
        </Text>
      );
    } else if (text.length > 14) {
      return (
        <Text
          style={{
            fontSize: 20,
            backgroundColor: "#90AE9580",
            padding: 7,
            borderRadius: 12,
          }}
        >
          {text}
        </Text>
      );
    } else if (text.length > 8) {
      return (
        <Text
          style={{
            fontSize: 22,
            backgroundColor: "#90AE9580",
            padding: 7,
            borderRadius: 12,
          }}
        >
          {text}
        </Text>
      );
    }
  };
  const isFollow = (state) => {
    if (state) {
      return <Text style={styles.BTNtitle}>הסר מעקב</Text>;
    } else {
      return <Text style={styles.BTNtitle}>הצטרפות</Text>;
    }
  };
  const FolloworUnfollow = (userid, forumid) => {
    const FolApi = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/FollowThis?userID=${userid}&forumID=${forumid}`;
    fetch(FolApi, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        return response.text();
      })
      .then(
        (result) => {
          //console.log("fetch POST= ", JSON.stringify(result));
          console.log(
            "Good result from the server about the follow need to render the button",
            result
          );
          //change state !
          setReRender((prev) => !prev);
          if (!ReRender) {
            Alert.alert("הצטרפת בהצלחה");
          } else {
            Alert.alert("המעקב הוסר בהצלחה");
          }
        },
        (error) => {
          console.log("err from Follow or unFollow Fetch ---> =", error);
        }
      );
  };
  const AddPost = () => {
    setModalToggle((prev) => !prev);
  };

  const AddPostBtn = () => {
    return (
      <TouchableOpacity
        style={styles.BTN}
        onPress={() => {
          AddPost();
        }}
      >
        <Text style={styles.BTNtitle}>שתף פוסט</Text>
      </TouchableOpacity>
    );
  };
  const SendPost = () => {
    console.log(
      "Parametes to send post  --->",
      TheForum.socialForumId,
      route.params.user.userID,
      ContentPost
    );
    if (ContentPost == `` || ContentPost == " " || ContentPost == "  ") {
      Alert.alert("ההודעה שלך ריקה.\nבבקשה הכנס ערך לתיבת הטקסט");
    } else {
      //fetch !!
      const PostApi = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/SendPost?userID=${route.params.user.userID}&forumID=${TheForum.socialForumId}&content=${ContentPost}`;
      fetch(PostApi, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        }),
      })
        .then((response) => {
          return response.text();
        })
        .then(
          (result) => {
            //console.log("fetch POST= ", JSON.stringify(result));
            console.log("result before state", result);
            setPostUpload(result);
            Alert.alert("הפוסט שלך הועלה בהצלחה.");
            GetPost(TheForum.socialForumId);
          },
          (error) => {
            console.log("err Send Post fetch ---> =", error);
          }
        );
    }
  };
  const SendReplay=(PostId)=>{
    setREplayCon(ContentReplay);
    const replayApi=`https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/SendReplay?postID=${PostId}&userID=${route.params.user.userID}&content=${ContentReplay}`
    console.log('the Parmetes for send replay -->',ContentReplay,PostId,route.params.user.userID);
    if (ContentReplay==''||ContentReplay==' '|| ContentReplay=='   ') {
      Alert.alert('התגובה שלך ריקה!');
    }
    else{
      fetch(replayApi, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json; charset=UTF-8",
        }),
      })
        .then((response) => {
          return response.text();
        })
        .then(
          (result) => {
            //console.log("fetch POST= ", JSON.stringify(result));
            Alert.alert("התגובה שלך הועלתה בהצלחה");
            setREplayCon('');
            
          },
          (error) => {
            console.log("err Send Replay fetch ---> =", error);
          }
        );
    }
  }

  const ModalCompenent = () => {
    return (
      <View style={{alignItems:"center",justifyContent:"center"
     ,zIndex:2}}>
      <View style={styles.modal2}>
        <Text style={{ fontSize: 25, marginTop: 35 }}>שיתוף פוסט חדש</Text>
        <TouchableOpacity
          style={styles.backx}
          onPress={() => {
            setModalToggle((prev) => !prev);
          }}
        >
          <Text style={{ fontSize: 40, color: "#F09898" }}>x</Text>
        </TouchableOpacity>

        <TextInput
          multiline={true}
          numberOfLines={5}
          style={styles.input2}
          placeholder="רשום כאן את השיתוף שלך..."
          onChangeText={(text) => {
            ContentPost = text;
          }}
        />
        <TouchableOpacity
          style={styles.BTN3}
          onPress={() => {
            SendPost();
          }}
        >
          <Text style={styles.BTNtitle}>שלח פוסט</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  };

  const HeaderCompenent = () => {
    if (TheForum != 0) {
      console.log("is need to Render -->", TheForum);
      return (
        <View style={styles.HeaderForum}>
          <View style={styles.Row}>
            <View style={styles.Col}>
              {/* <Image
                style={styles.Image}
                source={{
                  uri: prefixPhoto + TheForum.photoUri.replace('"', ""),
                }}
              /> */}
            </View>
            <View style={styles.Col}>
              <Text style={styles.Greet}>ברוכים הבאים לפורום</Text>
              {scalbleFontText(TheForum.socialForumName)}
            </View>
          </View>
          <View style={styles.content}>
            <Text style={{textAlign:'center'}}>{TheForum.socialForumDiscription}</Text>
          </View>
          <View style={styles.Col}>
            <TouchableOpacity
              style={!ReRender ? styles.BTN : styles.BTN2}
              onPress={() => {
                console.log(
                  "you pressed it -->",
                  TheForum.socialForumId,
                  route.params.user.userID
                );
                FolloworUnfollow(
                  route.params.user.userID,
                  TheForum.socialForumId
                );
              }}
            >
              {isFollow(ReRender)}
            </TouchableOpacity>
            {ReRender ? <AddPostBtn /> : null}
          </View>
        </View>
      );
    }
  };
  const GetReplay = (postId) => {
    const ReplayApi = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/GetReplays?PostID=${postId}`;
    fetch(ReplayApi, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then(
        (result) => {
          console.log(
            "Good result from Get Replay -->",
            JSON.stringify(result)
          );
          setReplayList(result);
        },
        (error) => {
          console.log("err get replay of post ! ---> ", error);
        }
      );
  };

  const ReplayCompnenet = (props) => {
    console.log("props of replay list compnenet--->", props);
    console.log("Replay List need to renderd -- >", ReplayList);
    let compnent = [];
    ReplayList.forEach((replay, i) => {
      console.log("This is replay -->", replay);

      if (props.postID == replay.postId) {
        compnent.push(
          <SingleReplay
            key={i}
            uri={replay.photoUri}
            content={replay.replayContent}
            id={replay.postId}
            username={replay.userName}
            usertitle={replay.userType}
          />
        );
      }
    });
    return compnent;
  };

  const SingleReplay = (props) => {
    console.log("the props of singleReplay compnent -->", props);
    let photoAdress=''
    if (props.uri=='') {
      photoAdress=`https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/AnonymosProfile.png`
    }
    else{
      // photoAdress=prefixPhoto + props.uri.replace('\"', "")+'.png'
    }
    console.log(photoAdress);
    return (
      <View style={styles.cardReplay}>
        <View style={styles.imgViewre}>
          <Image
            style={styles.profilePhotore}
            source={{ uri: photoAdress }}
          />
        </View>
        <View style={styles.content2}>
          <Text style={styles.content2txtreplay}>{props.content}</Text>
        </View>
        <View style={styles.userdetailre}>
          <Text style={{ textAlign: "center", fontSize: 14 }}>
            {props.username}
          </Text>
          <Text style={{ textAlign: "center", fontSize: 14 }}>
            {props.usertitle}
          </Text>
        </View>
      </View>
    );
  };

  const SinglePost = (props) => {
    console.log("this is props of singlepost -->", props);
    let photoAdress=''
    if (props.uri=='') {
      photoAdress=`https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/AnonymosProfile.png`
    }
    else{
      // photoAdress=prefixPhoto + props.uri.replace('\"', "")+'.png'
    }
    return (
      <View style={styles.cardPost}>
        <View style={styles.imgView}>
          <Image
            style={styles.profilePhoto}
            source={{ uri: photoAdress}}
          />
        </View>
        <View style={styles.content3}>
          <Text style={styles.content2txt}>{props.content}</Text>
        </View>
        <View style={styles.userdetail}>
          <Text style={{ textAlign: "center" }}>{props.username}</Text>
          <Text style={{ textAlign: "center" }}>{props.usertitle}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            console.log("the post Id is -->", props.id, route.params.user);
            if (!ReRender) {
              Alert.alert("המעבר לתגובות למשתתפי הפורום בלבד.");
            } else {
              // navigation.navigate("ReplayScreen", {
              //   postID: props.id,
              //   user: route.params.user,
              // });
              if (ReplayList != 0) {
                setReplayList(0);
              } else {
                GetReplay(props.id);
              }
            }
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 17,
              color: "darkgreen",
              marginTop: 25,
              marginBottom: 5,
            }}
          >
            תגובות
          </Text>
        </TouchableOpacity>
        <View style={styles.Col}>
          {ReplayList != 0 ? <ReplayCompnenet postID={props.id} /> : null}
          {/* {ReplayList != 0 ? <TouchableOpacity style={styles.BTN}><Text style={styles.BTNtitle}></Text></TouchableOpacity> : null} */}
          <View style={styles.Col}>
            <TextInput onChangeText={(text)=>{ContentReplay=text}} style={styles.input} placeholder="הגב כאן..."/>
            <TouchableOpacity onPress={() => {SendReplay(props.id)}} style={styles.BTN}>
              <Text style={styles.BTNtitle}>הגב</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const PostCompenent = () => {
    //console.log('List of post need to renderd -->',PostList);
    let compnent = [];
    PostList.forEach((post, i) => {
      console.log("Post -->", post);
      // compnent.push(<View key={i} style={styles.cardPost}></View>);
      compnent.push(
        <SinglePost
          key={i}
          uri={post.photouri}
          content={post.postContent}
          id={post.postId}
          username={post.userName}
          usertitle={post.userType}
        />
      );
    });
    return compnent;
  };

  return (
    <>
      <ImageBackground
        style={{ width: "100%", height: "100%", zIndex: -1 }}
        source={bg}
      >
        <TouchableOpacity
          style={styles.back}
          onPress={() => {
            navigation.goBack({
              isExpert: route.params.user.isExpert,
              userID: route.params.user.userID,
            });
          }}
        >
          <Ionicons
            style={styles.iconBack}
            name="return-up-back-outline"
            color="#127533"
          ></Ionicons>
        </TouchableOpacity>
        {ModalToggle ? <ModalCompenent /> : null}
        <ScrollView>
          {ForumsList != 0 ? <HeaderCompenent /> : ""}
          <View style={styles.Col}>
            {PostList != 0 ? <PostCompenent /> : <Text>Error</Text>}
          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  iconBack: {
    fontSize: 50,
    fontWeight: 900,
  },
  BTN: {
    paddingHorizontal: 35,
    paddingVertical: 5,
    backgroundColor: "#9EB98B75",
    borderRadius: 12,
    borderBottomColor: "#90AE95",
    borderBottomWidth: 2,
    // position:'relative',
    // bottom:-35,
    marginTop: 15,
  },
  BTN2: {
    paddingHorizontal: 35,
    paddingVertical: 5,
    backgroundColor: "#F0989885",
    borderRadius: 12,
    borderBottomColor: "#90AE95",
    borderBottomWidth: 2,
    // position:'relative',
    // bottom:-35,
    marginTop: 15,
  },
  BTN3: {
    paddingHorizontal: 35,
    paddingVertical: 5,
    backgroundColor: "#62C9F565",
    borderRadius: 12,
    borderBottomColor: "#404a42",
    borderBottomWidth: 3,
    // position:'relative',
    // bottom:-35,
    marginTop: 15,
    marginBottom: 15,
  },
  BTNtitle: {
    fontSize: 18,
  },
  back: {
    position: "absolute",
    right: 10,
    top: 26,
    height: 50,
    width: 50,
    zIndex: 55,
    alignItems: "center",
    verticalAlign: "middle",
    alignContent: "flex-end",
    justifyContent: "center",
  },
  backx: {
    position: "absolute",
    right: -5,
    top: 19,
    height: 50,
    width: 50,
    zIndex: 55,
    alignItems: "center",
    verticalAlign: "middle",
    alignContent: "flex-end",
    justifyContent: "center",
  },
  HeaderForum: {
    backgroundColor: "#EBFDEB70",
    borderColor: "#90AE95",
    borderWidth: 2,
    width: window.innerWidth,
    // height: 265,
    marginTop: 75,
    marginHorizontal: 5,
    borderRadius: 25,
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardPost: {
    backgroundColor: "#77AC7C55",
    borderColor: "#90AE95",
    borderWidth: 3,
    width: 350,
    marginTop: 35,
    borderRadius: 25,
    paddingBottom: 15,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  cardReplay: {
    backgroundColor: "#77AC7C55",
    borderColor: "#90AE95",
    borderWidth: 3,
    width: 310,
    marginTop: 35,
    borderRadius: 25,
    paddingBottom: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    position: "relative",
  },
  Row: {
    // borderColor: "#000",
    // borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 20,
  },
  Image: {
    width: 110,
    height: 110,
    borderRadius: 25,
    borderColor: "#889480",
    borderWidth: 1.1,
  },

  Col: {
    alignItems: "center",
    flexDirection: "column",
  },
  content: {
    // borderColor: "#000",
    // borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 15,
    alignItems:"center"
  },
  content2: {
    // borderColor: "#000",
    // borderWidth: 1,
    // marginHorizontal: 10,
    // marginTop: 15,
    width: "45%",
    left: 138,
    bottom: 85,
    marginTop: 25,
  },
  content3: {
    // borderColor: "#000",
    // borderWidth: 1,
    // marginHorizontal: 10,
    // marginTop: 15,
    // position: "absolute",
    width: "53%",
    left: 148,
    bottom: 85,
  },
  content2txt: {
    textAlign: "left",
    fontSize: 18,
  },
  content2txtreplay: {
    textAlign: "left",
    fontSize: 16,
  },
  Greet: {
    fontSize: 12,
    textAlign: "center",
    // position:'relative',
    // top:55,
    // left:35,
    marginBottom: 10,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 500,
    // borderColor: "#889480",
    // borderWidth:1,
    // borderBottomWidth:13,
    // padding:5,
  },
  profilePhotore: {
    width: 60,
    height: 60,
    borderRadius: 500,
    // borderColor: "#889480",
    // borderWidth:1,
    // borderBottomWidth:13,
    // padding:5,
  },
  imgView: {
    width: 125,
    height: 125,
    borderRadius: 500,
    borderColor: "#889480",
    borderWidth: 1.2,
    borderBottomWidth: 5.5,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  imgViewre: {
    width: 85,
    height: 85,
    borderRadius: 500,
    borderColor: "#889480",
    borderWidth: 1.2,
    borderBottomWidth: 5.5,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  userdetail: {
    // borderColor: "#000",
    // borderWidth: 1,
    width: "25%",
    position: "absolute",
    top: 140,
    left: 28,
  },
  userdetailre: {
    // borderColor: "#000",
    // borderWidth: 1,
    width: "25%",
    position: "absolute",
    top: 95,
    left: 15,
  },

  modal2: {
    position: "absolute",
    top: 100,
    //left: 18,
    width: 325,
    height: 350,
    backgroundColor: "#9EB98B",
    zIndex: 5,
    borderRadius: 25,
    justifyContent:"center",
    alignItems:"center"
  },

  input2: {
    borderWidth: 2,
    padding: 5,
    // paddingLeft: 63,
    fontSize: 18,
    textAlign: "right",
    marginTop: 15,
    backgroundColor: "#ffffff80",
    marginBottom: 15,
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    width: 250,
    maxHeight: 150,
    // height: 50,
  },
  input: {
    width: 300,
    borderWidth: 2,
    padding: 5,
    height:25,
    paddingLeft: 25,
    fontSize: 18,
    textAlign: "right",
    margin: 10,
    backgroundColor: "#ffffff80",
    marginBottom: 15,
    borderRadius: 22,
    borderTopLeftRadius:22,
    borderTopRightRadius:22,


  },
});
