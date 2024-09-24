import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Favorite = () => {
  return (

    <View style={styles.header}>
        <Text style={styles.info}>
         Favorite
        </Text>
        <MaterialIcons style={{marginRight:20}} name="favorite" size={30} color="black" />
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
        fontSize: 20,
        paddingLeft:20,
        paddingBottom:20,
    },

});

export default Favorite;
