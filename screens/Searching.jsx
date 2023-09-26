//new
import React, { useState } from "react";
import {
  Text,
  FlatList,
  Image, 
  View, 
  TouchableOpacity,
  TextInput
} from "react-native";
import SearchIcon from "../assets/Icon_navbar_search.png"
import styles from "../App.module.js";

export default function Searching(props) {
  const { plants,navigateToSearchResults} = props;
  const [input,setInput]=useState("");
  const [filteredPlants, setFilteredPlants] = useState([]);

  const onChangeText = async (text)=>{
    setInput(text);
    findPlant(text);
  }

  const findPlant = (text) => {
    if (text) {

      // Making a case insensitive regular expression
      const regex = new RegExp(`${text.trim()}`, 'i');
      // Setting the filtered plants array according the query
      setFilteredPlants(
          plants.filter((plant) => plant.plantName && (plant.plantName.search(regex) >= 0||plant.plantScientificName.search(regex) >= 0))
          .map((plant) => plant)
      );    } else {
        // If the query is null then return blank
        setFilteredPlants([]);
      }
  };

  return (
<View

 style={filteredPlants.length>6?{width:'100%',marginBottom:140}:{width:'100%'}}>
  {console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',filteredPlants.length)}
    <TextInput style={styles.autocomplete}
      placeholder="חפש צמח"
      value={input}
      onChangeText={onChangeText}
      />
      {filteredPlants.length>0&&
        <FlatList style={[styles.flatList,filteredPlants.length>10?{marginBottom:100}:""]}
          data={filteredPlants}
          renderItem={({item}) =>(
        <TouchableOpacity style={styles.pressable} onPress={()=>{navigateToSearchResults(item)
        setInput("")
        setFilteredPlants([])}}>
                <Text>{item.plantName}</Text>
                <Text>{item.plantScientificName}</Text>
                {item.plantImage===null?"":<Image source={{uri: item.plantImage}}
   style={{width: 50, height: 50,position:"absolute",left:20,borderRadius:10}} />}
              </TouchableOpacity>)
}
        />}
      
    </View>
  );
}





