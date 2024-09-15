import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

const Data =[
    {id:'1' ,name:'product 1'},
    {id:'2' ,name:'product 1'},
    {id:'3' ,name:'product 1'},
    {id:'4' ,name:'product 1'},
]
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;
const Home = ({navigation}) => {
    const renderItem =({item}) =>(
        <TouchableOpacity style={styles.item}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    )
  return (
    <View>
    <View style={styles.header}>
        <Text style={styles.info}>
          <MaterialCommunityIcons name="face-man-profile" size={24} color="black" /> Nam
        </Text>
    </View>
            <Text style={styles.Title}>Sản phẩm :</Text>
            <TouchableOpacity onPress={() => Navigation.navigate('Detail')}>
            <FlatList
            data={Data}
            renderItem={renderItem}
            keyExtractor={item =>item.id}
            style={styles.flatList}
            >
            </FlatList>
            </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingTop: 30,
        backgroundColor: '#FFCA09',
    },
    info: {
        fontSize: 30,
        paddingLeft:20,
        paddingBottom:20,
    },
    Title:{
        marginTop:10,
        fontSize:15,
    },
    flatList:{
        marginTop:10,
        paddingHorizontal:10,
    },
    item:{
        cardWidth,
        height: 320, 
        borderRadius: 2,
        borderColor: '#000', 
        margin: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        justifyContent: 'flex-start',
        alignItems: 'center', 
    }
});

export default Home;
