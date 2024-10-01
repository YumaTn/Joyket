import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LogoLoginIcon, YearIcon } from '../../../assets/icon';
import HeaderIcon from '../../../assets/HeaderIcon.png'
const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [name, setName] = useState('');

    const validateInput = () => {
        if (!email.endsWith('@gmail.com')) {
            Alert.alert('Error', 'Email must end with @gmail.com');
            return false;
        }

        if (phone.length !== 10 || isNaN(phone)) {
            Alert.alert('Error', 'Phone number must be exactly 10 digits');
            return false;
        }

        return true;
    };

    const handleSignUp = async () => {
        if (!validateInput()) return;
    
        const registerDate = new Date().toISOString(); // Current date in ISO format
        
        try {
            const response = await axios.post('http://192.168.2.18:8080/api/auth/signup', {
                email,
                name,
                password,
                phone,
                address,
                registerDate,
                status: true,
            });
    
            // Save user data into AsyncStorage after successful registration
            const userData = {
                email,
                name,
                phone,
                address,
                registerDate,
                token: response.data.token, // Assuming your API returns a token
            };
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
    
            Alert.alert('Đăng ký thành công!');
            navigation.goBack();    
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email already exists') {
                Alert.alert('Lỗi', 'Đăng ký thất bại');
            } else {
                console.error(error);
                Alert.alert('Lỗi', 'Email đã được đăng ký!');
            }
        }
    };
    

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            <View style={styles.header}>
                    <View style={styles.headerIconContainer}>
                        <YearIcon/>
                        <Image style={styles.headerImage} source={HeaderIcon} resizeMode="contain"/>
                    </View>
                </View>
                <View style={styles.logoContainer}>
                    <LogoLoginIcon/>
                </View>
                <View style={styles.inputContainer}>
                <View style={styles.textContainer2}>
                    <Text style={styles.text2}>Đăng Ký</Text>
                </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setName}
                        value={name}
                        placeholder="Họ và tên"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="default"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#CCCCCC"
                        secureTextEntry={true}
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPhone}
                        value={phone}
                        placeholder="Số điện thoại"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setAddress}
                        value={address}
                        placeholder="Địa chỉ"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="default"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.signinText}>Đăng Ký</Text>
                </TouchableOpacity>
                <Image source={require('../../../assets/Line 4.png')} style={styles.line} />
                    <TouchableOpacity style={styles.tk} onPress={() => navigation.goBack()}>
                        <Text style={styles.loginText}>Bạn đã có tài khoản?</Text>
                    </TouchableOpacity>
                </View>
                </View>
        </TouchableWithoutFeedback>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 80,
    },
    textContainer2: {
        alignItems: 'center',
    },
    text2: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
    },
    inputContainer: {
        width: '80%', 
        padding: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center', 
        marginBottom: 10,
        top:50,
    },
    input: {
        width: '80%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        marginVertical: 10,
        fontSize: 16,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    button: {
        width: '60%',
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        top:10,
    },
    loginText: {
        color: 'black',
    },
    tk: {
        marginTop:10,
        marginBottom:10
    },
    signinText: {
        color: 'white',
    },
    line: {
        width: '50%',
        height: 1,
        marginTop:20,
    },
    logoContainer: {
        marginBottom: 10,
        marginLeft:20,
        top:50,
        zIndex: 3
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#F7C945',
        padding: 10,
        zIndex: 10,
    },
    headerIconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 10,
    },
    headerImage:{
        position: 'absolute',
        width: 180, 
        height: 180,
        right:-40,
        top:-20,
    }
});
