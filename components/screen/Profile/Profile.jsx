import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [image, setImage] = useState(null);
    const [phone,setPhone] = useState('');
    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');

                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUsername(parsedUserData.name);
                    setImage(parsedUserData.image); 
                    setPhone(parsedUserData.phone);
                }
            } catch (error) {
                console.error('Error loading data from storage', error);
            }
        };

        loadData();
    }, []);

    return (
        <View>
            <View style={styles.header}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder} />
                )}
                <View>
                <Text style={styles.info}>{username}</Text>
                <Text style={styles.phone}>+{phone}</Text>
                </View>
            </View>
            <View>
                <Text style={styles.fontTitle}>Tài khoản</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Info')}>
                <View style={styles.information}>
                    <Text style={styles.informationText}>
                        <Ionicons name="person" size={20} color="black" /> Thông tin cá nhân
                    </Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <Text style={styles.fontTitle}>Khác</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <View style={styles.informationOther}>
                    <Text style={styles.informationText}>
                        <Ionicons name="person" size={20} color="black" /> Lịch sử thanh toán
                    </Text>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <View style={styles.informationlogout}>
                    <Text style={styles.logoutText}>
                         Logout
                    </Text>
                </View>
            </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        paddingTop: 30,
        backgroundColor: '#FFCA09',
    },
    info: {
        fontSize: 20,
        paddingLeft: 5,
        
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginBottom:10,
        marginLeft: 20,
    },
    imagePlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 20,
        backgroundColor: '#CCCCCC',
    },
    information: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 20,
        backgroundColor: '#CCCCCC',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    informationText: {
        fontSize: 16,
    },
    phone:{
        paddingLeft: 5,
    },
    fontTitle:{
        fontSize:20,
        marginLeft:20,
        marginTop:30
    },
    informationOther:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        padding: 20,
        backgroundColor: '#CCCCCC',
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        marginTop: 10,
    },
    logoutText:{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center'
    }
});

export default Profile;
