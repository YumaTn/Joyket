import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const fetchUserId = async (userEmail) => {
        try {
            const response = await axios.get(`http://192.168.2.18:8080/api/auth/email/${userEmail}`);
            const { userId } = response.data; // Giả sử API trả về userId
            console.log('User ID:', userId);
            
            // Lưu userId vào AsyncStorage, đảm bảo là chuỗi
            await AsyncStorage.setItem('userId', JSON.stringify(userId));
        } catch (error) {
            console.error('Error fetching userId:', error);
            Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
        }
    };
    

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.2.18:8080/api/auth/signin', {
                email,
                password,
            });
    
            console.log('API response:', response.data);
    
            const { name, phone, address, gender, registerDate, token, image, status, id } = response.data;
    
            // Lấy userId từ API
            const userIdResponse = await axios.get(`http://192.168.2.18:8080/api/auth/email/${email}`);
            const userId = userIdResponse.data.userId; 
            console.log('User ID:', userId);
            console.log('Password:', password);
            // Lưu thông tin người dùng vào AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify({
                email,
                name,
                phone,
                address,
                gender,
                registerDate,
                token,
                image,
                status,
                id,
                userId,
                password // Lưu mật khẩu (không khuyến khích)
            }));
    
            navigation.replace('Navigation'); 
    
        } catch (error) {
            if (error.response) {
                console.log('Server responded with status:', error.response.status);
                console.log('Error details:', error.response.data);
                Alert.alert('Lỗi', `Đăng nhập thất bại. ${error.response.data.message || 'Vui lòng kiểm tra lại email và mật khẩu.'}`);
            } else if (error.request) {
                console.log('No response received:', error.request);
                Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.');
            } else {
                console.log('Error:', error.message);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thực hiện yêu cầu. Vui lòng thử lại sau.');
            }
        }
    };
    
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Image style={styles.image1} source={require('../../../assets/Line.png')} />
                <Image style={styles.image2} source={require('../../../assets/Line2.png')} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Joyket</Text>
                </View>
                <View style={styles.textContainer2}>
                    <Text style={styles.text2}>Đăng Nhập</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="black"
                    />
                </View>
                <View style={styles.inputContainer2}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mật khẩu"
                        placeholderTextColor="black"
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text>Đăng Nhập</Text>
                </TouchableOpacity>
                <Image source={require('../../../assets/Line 4.png')} />
                <TouchableOpacity style={styles.Signup} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.SignuUpText}>Bạn chưa có tài khoản?</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

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
        alignSelf: 'flex-start',
    },
    image2: {
        alignSelf: 'flex-end',
    },
    text: {
        color: 'white',
        fontSize: 80,
    },
    textContainer2: {
        position: 'absolute',
        top: '33%',
        left: '30%',
        alignItems: 'center',
    },
    text2: {
        color: 'white',
        fontSize: 30,
    },
    inputContainer: {
        position: 'absolute',
        top: '40%',
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
    inputContainer2: {
        position: 'absolute',
        top: '48%',
        width: '80%',
        paddingHorizontal: 20,
    },
    button: {
        position: 'absolute',
        top: '58%',
        width: '30%',
        padding: 15,
        backgroundColor: 'orange',
        borderRadius: 40,
        alignItems: 'center',
    },
    Signup: {
        position: 'absolute',
        top: '70%',
        lineHeight: 1,
    },
    SignuUpText: {
        color: 'white',
    },
});

export default Login;
