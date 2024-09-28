import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
const Profile = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [image, setImage] = useState(null);
    const [phone, setPhone] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');

                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUsername(parsedUserData.name);
                    setImage(parsedUserData.image);
                    setPhone(parsedUserData.phone);
                    setIsLoggedIn(true); // Set logged in status to true
                }
            } catch (error) {
                console.error('Error loading data from storage', error);
            }
        };

        loadData();
    }, []);
    

    const handleLogout = async () => {
        try {
            // Clear all data from AsyncStorage
            await AsyncStorage.clear(); 
            setIsLoggedIn(false); // Set logged in status to false
            Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất khỏi tài khoản.'); // Success alert
            
            // Check the storage after clearing
            const remainingData = await AsyncStorage.getAllKeys(); // Get all keys remaining in AsyncStorage
            console.log('Remaining AsyncStorage keys after logout:', remainingData); // Log remaining keys
            
            navigation.navigate('login'); // Navigate to login screen
        } catch (error) {
            console.error('Error clearing storage', error);
            Alert.alert('Logout Failed', 'There was an error logging out. Please try again.');
        }
    };
    
    return (
        <View style={styles.container}>
            {isLoggedIn ? (
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
                                <FontAwesome5 name="history" size={15} color="black" /> Lịch sử thanh toán
                                </Text>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout}>
                            <View style={styles.logoutContainer}>
                                <Text style={styles.logoutText}>Đăng xuất</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Bạn chưa đăng nhập.</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('login')}>
                        <View style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Đăng nhập</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Added background color
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        paddingTop: 30,
        backgroundColor: '#FFCA09',
        paddingBottom:5,
    },
    info: {
        fontSize: 20,
        paddingLeft: 5,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,
        marginBottom: 10,
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
    phone: {
        paddingLeft: 5,
    },
    fontTitle: {
        fontSize: 20,
        marginLeft: 20,
        marginTop: 30,
    },
    informationOther: {
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
    logoutContainer: {
        backgroundColor: '#FF6347', // Added background color for logout button
        borderRadius: 5,
        padding: 10,
        margin: 20,
    },
    logoutText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 18,
        marginBottom: 20,
    },
    loginButton: {
        padding: 10,
        backgroundColor: '#FFCA09',
        borderRadius: 5,
    },
    loginButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export default Profile;
