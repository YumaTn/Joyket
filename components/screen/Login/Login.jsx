import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LogoLoginIcon, YearIcon } from '../../../assets/icon';
import HeaderIcon from '../../../assets/HeaderIcon.png'
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.2.18:8080/api/auth/signin', {
                email,
                password,
            });
    
            const { name, phone, address, gender, registerDate, token, image, status, id } = response.data; // Updated here
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
                password
            }));
    
            navigation.replace('Navigation');
        } catch (error) {
            Alert.alert('Lỗi', 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
        }
    };
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <View style={styles.header}>
                    <View style={styles.headerIconContainer}>
                        <YearIcon/>
                        <Image style={styles.headerImage} source={HeaderIcon} resizeMode="contain"/>
                    </View>
                </View>
                    <View style={styles.logoContainer}>
                        <LogoLoginIcon />
                    </View>
                    <View style={styles.loginBox}> 
                    <Text style={styles.title}>Đăng Nhập</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#CCCCCC"
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('forgotpassword')}>
                        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Đăng Nhập</Text>
                    </TouchableOpacity>

                    <Image source={require('../../../assets/Line 4.png')} style={styles.line} />
                    <TouchableOpacity style={styles.signupContainer} onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.signupText}>Bạn chưa có tài khoản?</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#F7C945',
        padding: 30,
        zIndex: 10,
    },
    loginBox: {
        width: '80%', // Điều chỉnh kích thước của khung
        padding: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center', // Canh giữa các phần tử bên trong
        marginBottom: 10,
        top:80,
    },
    logoContainer: {
        marginBottom: 10,
        marginLeft:20,
        top:80
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginRight:35,
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: 'black',
    },
    button: {
        backgroundColor: 'black',
        width: '80%',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    line: {
        width: '50%',
        height: 1,
    },
    signupContainer: {
        marginTop: 10,
    },
    signupText: {
        color: 'black',
        fontSize: 16,
    },
    headerIconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 10,
    },
    headerImage:{
        position:'absolute',
        width:200,
        right:-30,
        top:-90,
    }
});

export default Login;
