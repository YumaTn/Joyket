import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

const Noti = () => {
  return (

    <View style={styles.header}>
        <Text style={styles.info}>
         Notification:
        </Text>
        <Ionicons style={{marginBottom:10,marginRight:30}} name="notifications-sharp" size={25} color="black" />
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

export default Noti;
