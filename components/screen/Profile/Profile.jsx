import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Profile = ({navigation}) => {
  return (
    <View>
    <View style={styles.header}>
        <Text style={styles.info}>
         Profile: Nam
        </Text>
        
    </View>
    <TouchableOpacity onPress={() => navigation.navigate('Info')}>
    <View style={styles.Information}>
        <Text style={styles.InformationText}><Ionicons style={{top:50}} name="person" size={20} color="black" /> Thong tin ca nhan</Text>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
    </View>
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
        fontSize: 20,
        paddingLeft:20,
        paddingBottom:20,
    },
    Information:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 20,
    
        backgroundColor: '#999999',
        marginLeft:20,
        marginRight:20,
        borderRadius:10
    },
    InformationText:{
        
    }
});

export default Profile;
