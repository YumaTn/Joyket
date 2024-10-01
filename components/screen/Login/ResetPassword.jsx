import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Image,
} from 'react-native';
import axios from 'axios';
import { LogoLoginIcon, YearIcon } from '../../../assets/icon';
import HeaderIcon from '../../../assets/HeaderIcon.png'
const ResetPassword = ({ route, navigation }) => {
    const { email, otp } = route.params; // Nhận email và otp từ params
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [enteredOtp, setEnteredOtp] = useState(''); // OTP nhập vào
    const [token, setToken] = useState(''); // Token từ API

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`http://192.168.2.18:8080/api/auth/email/${email}`);
                const user = response.data;

                setUserInfo(user);
                setToken(user.token); // Giả định token được trả về từ API
            } catch (error) {
                console.log('Error fetching user info:', error);
                Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng, vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, [email]);

    const handleResetPassword = async () => {
        if (String(enteredOtp).trim() !== String(otp).trim()) {
            Alert.alert('Lỗi', 'Mã OTP không khớp. Vui lòng kiểm tra lại.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            const response = await axios.post(`http://192.168.2.18:8080/forgot-password`, null, {
                params: {
                    email,
                    name: userInfo.name,
                    password,
                    confirm: confirmPassword,
                    token,
                },
            });

            if (response.status === 200) {
                Alert.alert('Thông báo', 'Đặt lại mật khẩu thành công!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('login'),
                    },
                ]);
            }
        } catch (error) {
            console.log('Error resetting password:', error);
            if (error.response) {
                Alert.alert('Lỗi', error.response.data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
            }
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container}>
            <View style={styles.header}>
                    <View style={styles.headerIconContainer}>
                        <YearIcon/>
                        <Image style={styles.headerImage} source={HeaderIcon} resizeMode="contain"/>
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <LogoLoginIcon />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>Reset mật khẩu</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập OTP"
                        onChangeText={setEnteredOtp}
                        value={enteredOtp}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu mới"
                        secureTextEntry
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Xác nhận mật khẩu"
                        secureTextEntry
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonCancelText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                            <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
                        </TouchableOpacity>
                    </View>
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
    inputContainer: {
        width: '80%',
        padding: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    title: {
        color: '#343a40',
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 5,
        marginVertical: 10,
        fontSize: 16,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '110%',
    },
    button: {
        flex: 1,
        padding: 10,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 5,
        marginRight:15
    },
    buttonCancel: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    buttonCancelText: {
        color: '#343a40',
        fontSize: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#F7C945',
        padding: 30,
        zIndex: 10,
    },
    headerIconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 10,
    },
    headerImage:{
        position: 'absolute',
        width: 200,  // Giảm kích thước của HeaderIcon
        height: 200,
        right:-70,
        top:-20,
    }  
});

export default ResetPassword;
