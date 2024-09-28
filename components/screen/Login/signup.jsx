import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LogoLoginIcon } from '../../../assets/icon';

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
            const response = await axios.post('http://10.87.3.218:8080/api/auth/signup', {
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

            Alert.alert('Success', 'Registration successful!');
            navigation.goBack();    
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Registration failed!');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image style={styles.image1} source={require('../../../assets/backgroundlogin.png')} />
                <View style={styles.textContainer}>
                    <LogoLoginIcon/>
                </View>
                <View style={styles.textContainer2}>
                    <Text style={styles.text2}>Đăng Ký</Text>
                </View>
                <View style={styles.inputContainer}>
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
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.signinText}>Đăng Ký</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tk} onPress={() => navigation.goBack()}>
                    <Text style={styles.loginText}>Bạn đã có tài khoản?</Text>
                </TouchableOpacity>
                </View>
        </TouchableWithoutFeedback>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCA09',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        top: '20%',
        left: '15%',
    },
    image1: {
       marginTop: 140,
    },
    text: {
        color: 'white',
        fontSize: 80,
    },
    textContainer2: {
        position: 'absolute',
        top: '30%',
        left: '36%',
        alignItems: 'center',
    },
    text2: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
    },
    inputContainer: {
        position: 'absolute',
        top: '37%',
        width: '80%',
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        marginVertical: 10,
    },
    button: {
        position: 'absolute',
        top: '83%',
        width: '60%',
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
    },
    loginText: {
        color: 'black',
    },
    tk: {
        position: 'absolute',
        top: '92%',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: 'black',
        paddingTop: 20,
    },
    signinText: {
        color: 'white',
    }
});
