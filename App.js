import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, Text, Button, View, FlatList } from 'react-native';

export default function App() {

  // Keeping track of index to traverse through cards in the Pokemon API
  const [index,setIndex] = useState(0);
  // Keeping track of the image variable to display on the screen as user goes through pokemons
  const [img, setImg] = useState(null);
  // Keeps track of users pokemon
  const [favPoke, setFavPoke] = useState([]);
  // When False: Displays All pokemons
  // When True: Displays users favorite pokemon
  const [displayFavs, setDisplayFavs] = useState(false);

  // Displaying favorite pokemons
  const FavoritePokes = ({image}) => {
    return (

      <>
        <View style={{flex:1, margin: 10}}>          
            <Image 
              source={{uri:image.image}}
              style={styles.image}
              
            />
          <Text>Card {image.id}/146</Text>
          <Button title='Dislike' onPress={dislikedPoke.bind(this,image.id)} /> 
        </View>
      </>

    )
  }

  // Grabbing a pokemon from the API
  function getPoke (direction) {

    let url = '';
    if (direction === 'prev'){
      // Wrap around back if user will go out of bounds
      url = index <=1 ? `https://api.pokemontcg.io/v2/cards/xy1-${index+145}` : `https://api.pokemontcg.io/v2/cards/xy1-${index-1}`
    }
    else{
      // Wrap around forward if user will go out of bounds
      url = index >= 146 ? `https://api.pokemontcg.io/v2/cards/xy1-${index-145}` : `https://api.pokemontcg.io/v2/cards/xy1-${index+1}`
    }

    fetch(url)
    .then(function(response) { 

      // If you get a valid response, else something went wrong
      if (response.ok){
        return response.json()
      }
      else{
        console.log('Oops. Something went wrong')
      }
    })
    .then(data => {
      setImg(data.data.images.small)
    })
    .catch((error) => {
      // Printing out error if there was one
      console.log('Error is: ',error)
    })

    // Setting index variable
    if (direction === 'prev'){
      if (index === 1){
        setIndex(146);
      }
      else{
        setIndex(index - 1);
      }
    }
    else {
      if(index === 146){
        setIndex(1);
      }
      else{
        setIndex(index + 1);

      }
    }

  }

  // Adds pokemon to the favorite pokemon list
  const likedPoke = () => {
    setFavPoke(favPoke => [...favPoke,{'id':index, 'image':img}])
  }

  // Removes pokemon from pokemon list
  function dislikedPoke (theindex) {
    setFavPoke(favPoke => favPoke.filter(poke => poke.id !== theindex))
  }

  // Displaying favorite pokemon
  const favoritePokes = () => {
    setDisplayFavs(true);
  }

  // Displaying all the pokemon
  const PokeAPI = () => {
    setDisplayFavs(false);
  }

  // Displaying Pokemon API screen, or Favorites screen, whichever users chooses
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {displayFavs === false 
      ?
      <> 

        <View style={{alignSelf:'flex-end', margin:20}}>
            <Button title='Favorites' onPress={favoritePokes} /> 
        </View>

        <Text style={styles.title}>PokeDex</Text>
        <View style={styles.imgContainer}>
          {img !== null && <Image style={styles.image} source={{uri: img}} />}
        </View>

        <Text>{index > 0 && `Card ${index}/146` }</Text>

        <View style={styles.buttonContainer} >
          <View style={{margin:20}}>
              <Button title='Next' onPress={getPoke.bind(this,'next')} /> 
          </View>
          
          <View style={{margin:20}}>
              <Button title='Previous' onPress={getPoke.bind(this,'prev')} /> 
          </View>

        </View>

        <View style={styles.buttonContainer} >
          <View style={{flex:1}}>
            <Button title='Like' onPress={likedPoke} /> 
          </View>

          <View style={{flex:1}}>
            <Button title='Dislike' onPress={dislikedPoke.bind(this, index)} /> 
          </View>
        </View>
      </>

      :

      <>
        <View style={{alignSelf:'flex-end', marginTop: 100,marginRight:20}}>
          <Button title='Pokemons' onPress={PokeAPI} /> 
        </View>

        <Text style={styles.title}>Your PokeDex</Text>
        <Text style={styles.title}>{favPoke.length} out of 146 cards</Text>

        <FlatList
          data={favPoke}
          keyExtractor={poke => poke.id}
          renderItem={({item}) => <FavoritePokes image={item} />}
          horizontal={true}
        />
      </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  imageContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  image: {
    height: 350,
    width: 250
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50
    
  },
  button: {
    padding: 20
  }
  
});
