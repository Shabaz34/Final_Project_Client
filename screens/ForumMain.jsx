import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import bg from "../assets/ForumsBG.png";
import NavBar from "../functional componet/navBar";
import point from "../assets/point.png";
import check from "../assets/check.png";
import galleryIcon from "../assets/Icon_gallery.png";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default function ForumMain({ navigation, route }) {
  const [ForumsList, setForumsList] = useState(0);
  const [Modal, setModal] = useState(false);
  const [modalwindow, setmodalwindow] = useState("");
  const [SelectedImage, setSelectedImage] = useState(null);
  const [NameInput, setNameInput] = useState("");
  const [DiscInput, setDiscInput] = useState("");
  const [render, setrender] = useState(false);

  console.log("Forum Main Route --->", route.params);
  let CreateForumApi = ``;
  const api = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/GetForumsById&Follow?userID=${route.params.userID}`;
  let RenderCompenent = 0;
  let profilePhotoURI = "";
  let photoID = -1;
  const prefixPhoto = "https://proj.ruppin.ac.il/cgroup41/prod/uploadedFiles/";
  let forumname = ``;
  let forumdisc = ``;
  const apiToUpload = "https://proj.ruppin.ac.il/cgroup41/prod/api/Upload";
  const apiToTable = "https://proj.ruppin.ac.il/cgroup41/prod/addPhoto";

  useEffect(() => {
    console.log("onload in Forum Main");
    fetch(api, {
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
          console.log("result before state", result);
          setForumsList(result);
        },
        (error) => {
          console.log("err get Forums ---> =", error);
        }
      );

    return () => {};
  }, []);

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
      setSelectedImage(result.assets[0].uri);
      return result.assets[0].uri;
    }
  };

  const pickImageDor = async () => {
    let uriName = SelectedImage;
    let uriNameToUp = uriName;
    uriName = uriName.split("ImagePicker");
    uriName = uriName[1];
    uriName = uriName.replace("/", "");
    console.log("the path before first fetch ---> ", uriName);

    profilePhotoURI = uriName;
    const formData = new FormData();
    formData.append("files", {
      uri: uriNameToUp,
      type: "image/png",
      name: `${uriName}`,
    });

    fetch(apiToUpload, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log("response= ", JSON.stringify(response));
        return response.json();
      })
      .then(
        (result) => {
          console.log(
            "fetch POST---> Upload Photo respon ---->= ",
            JSON.stringify(result)
          );
          let d = new Date();

          const s = {
            PhotoUri: profilePhotoURI,
            PhotoTimestamp: 0,
            PostId: 0,
            UserId: 0,
            Latitude: 0,
            Longitude: 0,
            PhotoTimestamp:
              d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(),
          };

          fetch(apiToTable, {
            method: "POST",
            body: JSON.stringify(s),
            headers: new Headers({
              "Content-type": "application/json; charset=UTF-8", //very important to add the 'charset=UTF-8'!!!!
              Accept: "application/json; charset=UTF-8",
            }),
          })
            .then((response) => {
              console.log("res=", JSON.stringify(response));
              return response.json();
            })
            .then(
              (result) => {
                let res = result;

                console.log(
                  "good result from fetch insert photo to table ---> ",
                  res
                );
                console.log("the photo id is -->", res.photoId);
                photoID = res.photoId;
                console.log(
                  "Print the parameters before fetch -->",
                  route.params.userID,
                  forumname,
                  forumdisc,
                  photoID
                );
                CreateForumApi = `https://proj.ruppin.ac.il/cgroup41/prod/api/SocialForums/CreateNewForum?userID=${route.params.userID}&forumName=${forumname}&forumDis=${forumdisc}&photoID=${photoID}`;
                fetch(CreateForumApi, {
                  method: "POST",
                  headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                    Accept: "application/json; charset=UTF-8",
                  }),
                })
                  .then((res) => {
                    console.log("res= ", JSON.stringify(res));
                    return res.text();
                  })
                  .then(
                    (result) => {
                      console.log(
                        "good result from fetch create forum-->",
                        result
                      );
                      Alert.alert("פורום נוצר בהצלחה");
                      navigation.navigate("ForumPage", {
                        user: route.params,
                        forum_v2: result,
                      });
                    },
                    (error) => {
                      console.log("ERROR in create forum fetch !=", error);
                    }
                  );
              },
              (error) => {
                console.log("err post=", JSON.stringify(error));
              }
            );
        },
        (error) => {
          console.log("err post in upload photo fetch=", error);
        }
      );
  };

  const handleSelectImage = async (from) => {
    const uri = await pickImage(from);
    if (uri) {
      setSelectedImage(uri);
    }
  };

  const ModalCompenent = () => {
    return (
      <View style={{alignItems:"center",zIndex:2}}>
      <View style={styles.modal}>
        <Text style={styles.titleModal}>יצירת פורום חדש</Text>

        {SelectedImage == null ? (
          <TouchableOpacity
            style={styles.galleryButton}
            title="Pick an image from camera roll"
            onPress={() => {
              handleSelectImage("gallery");
            }}
          >
            <Image source={galleryIcon} style={styles.galleryIcon}></Image>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.galleryButton}
            title="Pick an image from camera roll"
            onPress={() => {
              handleSelectImage("gallery");
            }}
          >
          <Image
            style={{ width: 95, height: 95, borderRadius: 95 }}
            source={{ uri: SelectedImage }}
          />
                    </TouchableOpacity>

        )}
        <TextInput
          onChangeText={(name) => (forumname = name)}
          style={styles.input}
          placeholder="בחר שם לפורום"
        />
        <TextInput
          onChangeText={(name) => (forumdisc = name)}
          style={styles.input}
          placeholder="תיאור הפורום בקצרה"
        />
        <TouchableOpacity
          onPress={() => {
            CreateForum();
          }}
          style={styles.btn2}
        >
          <Text style={styles.txtbtn2}>צור פורום חדש</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  };
  const CreateForum = () => {
    console.log("Create Forum !!!!");
    console.log(SelectedImage, forumname, forumdisc);

    pickImageDor();
  };
  const scalbleContent = (text, num) => {
    // console.log("the length of the txt -- >", text.length);
    if (text.length >= num) {
      console.log(text.slice(0, num) + "...");
      return text.slice(0, num) + "...";
    } else {
      return text;
    }
  };

  if (ForumsList != 0) {
    RenderCompenent = ForumsList.map((forum, index) => {
      return (
        <View key={forum.socialForumId} style={styles.ForumCard}>
          {forum.follow == "yes" ? (
            <Image style={styles.iconFollow} source={check} />
          ) : (
            ""
          )}
          <View style={styles.imgView}>
            <Image
              source={{
                uri: prefixPhoto + forum.photoUri.replace('"', ""),
              }}
              style={styles.img}
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{forum.socialForumName}</Text>
            <Text style={styles.disc}>
              {scalbleContent(forum.socialForumDiscription, 78)}
            </Text>
            <Text style={styles.activtxt}>
              נוצר בתאריך: {forum.socialForumCreatedAt.slice(0, 9)}
            </Text>
          </View>
          <View style={styles.btnWrap}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ForumPage", {
                  user: route.params,
                  forum: forum,
                });
              }}
              style={styles.btn}
            >
              <Text style={styles.txtbtn}>הכניסה מכאן</Text>
              <Image style={styles.iconbtn} source={point} />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }

  return (
    <>
      <ImageBackground style={{ width: "100%", height: "100%" }} source={bg}>
        <View style={{ flexDirection: "column", alignContent: "center",paddingHorizontal:50,marginBottom:80 }}>
          {Modal === true ? <ModalCompenent /> : ""}
          <TouchableOpacity
            style={styles.btnadd}
            onPress={() => {
              setModal((prev) => !prev);
            }}
          >
            <Text style={styles.btntitle}>{Modal === true ? "X" : "+"}</Text>
          </TouchableOpacity>
          <View style={styles.con}>
            <ScrollView style={styles.scrolView}>
              {RenderCompenent != 0 ? RenderCompenent : <Text>Loading...</Text>}
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
      <NavBar
        isExpert={route.params.isExpert}
        userID={route.params.userID}
      ></NavBar>
    </>
  );
}

const styles = StyleSheet.create({
  scrolView: {
    width: "100%",
    // borderColor: "#000",
    // borderWidth: 2,
    // display: "flex",
    flexDirection: "column",
    alignContent: "center",
    paddingHorizontal: 45,
    alignItems:"center"

  },
  con: {
    marginTop: 5,
    // marginHorizontal: 15,
    marginBottom: 150,
    flexDirection: "column",
    alignItems: "center",
  },
  ForumCard: {
    backgroundColor: "#EBFDEB75",
    borderWidth: 2,
    borderColor: "#3F493A",
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    width: "100%",
    paddingVertical: 25,
    height: 350,
    marginVertical: 30,
  },
  img: {
    borderColor: "#3F493A",
    borderWidth: 0.9,
    borderRadius: 50,
    height: 135,
    width: 135,
  },
  imgView: {
    // marginLeft: 25,
    // borderWidth:2,
    // borderColor:'#000',
    alignItems: "center",
  },
  content: {
    // marginHorizontal: 5,
    // display: "flex",
    // flexDirection: "column",
    // alignContent: "center",
    // marginLeft: 25,
    // marginBottom: 15,
    // borderWidth: 2,
    // borderColor: "#000",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  disc: {
    fontSize: 12,
    marginTop: 15,
    textAlign: "center",
    marginHorizontal: 5,
    alignItems:"center"
  },
  activ: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    position: "relative",
    top: 5,
  },
  galleryButton: {
    width: 100,
    height: 100,
    padding: 10,
    borderRadius: 150,
    backgroundColor: "#9EB98B",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#000",
  },
  galleryIcon: {
    width: "80%",
    height: "80%",
    textAlign: "center",
    justifyContent: "center",
    position: "absolute",
  },
  activtxt: {
    fontSize: 12,
    marginRight: 15,
    textAlign: "center",
    marginTop: 25,
  },
  btnWrap: {
    // borderWidth: 2,
    // borderColor: "#000",
    alignItems: "center",
    marginVertical: 10,
  },
  btn: {
    borderBottomColor: "#3F493A",
    borderBottomWidth: 2,
    backgroundColor: "#9EB98B75",
    opacity: 0.8,
    width: 200,
    paddingVertical: 10,
    borderRadius: 15,
  },
  btn2: {
    borderColor: "#9EB98B75",
    borderWidth: 1,
    backgroundColor: "#3F493A",
    opacity: 0.8,
    width: 300,
    paddingVertical: 10,
    borderRadius: 25,
  },
  txtbtn: {
    fontSize: 18,
    textAlign: "center",
  },
  txtbtn2: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  modal: {
    position: "absolute",
    flex:1,
    top: 100,
    width: 325,
    height: 450,
    backgroundColor: "#9EB98B",
    zIndex: 5,
    borderRadius: 25,
    alignItems: "center",
    justifyContent:"center",
  },
  input: {
    borderWidth: 2,
    padding: 5,
    fontSize: 18,
    textAlign: "center",
    margin: 10,
    backgroundColor: "#ffffff80",
    marginBottom: 15,
    borderRadius: 22,
    width: 300,
    height: 50,
  },
  iconbtn: {
    width: 25,
    height: 25,
    position: "absolute",
    top: 11,
    left: 13,
  },
  iconFollow: {
    width: 25,
    height: 25,
    position: "absolute",
    right: 15,
    top: 10,
  },
  btnadd: {
    backgroundColor: "#3F493A",
    width: 45,
    height: 45,
    borderRadius: 100,
    marginTop: 35,
    position: "relative",
    top: 15,
    //left: 285,
    marginBottom: 15,
  },
  btntitle: {
    fontSize: 35,
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 5,
    marginTop: -2,
  },
  titleModal: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
});
