import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    ActivityIndicator,
    Image,
} from 'react-native';
import axios from 'axios';
import { LogoLoginIcon, YearIcon } from '../../../assets/icon';
import HeaderIcon from '../../../assets/HeaderIcon.png';
const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        try {
            if (!email) {
                Alert.alert('Thông báo', 'Vui lòng nhập email');
                return;
            }

            setIsLoading(true);
            try {
                const response = await axios.post('http://192.168.2.18:8080/api/send-mail/otp', { email }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const otp = response.data; // Lấy trực tiếp phản hồi

                if (response.status === 200) {
                    if (otp !== undefined) {
                        Alert.alert('Thông báo', `Mã OTP của bạn là: ${otp}`, [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('ResetPassword', { email, otp }), // Chuyển đến màn hình xác nhận OTP
                            },
                        ]);
                    } else {
                        Alert.alert('Lỗi', 'Mã OTP không hợp lệ.');
                    }
                }
            } catch (error) {
                console.log('Error:', error.response);
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi OTP, vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    Alert.alert('Lỗi', 'Email này chưa đăng ký tài khoản!');
                } else {
                    Alert.alert('Lỗi', error.response.data.message || 'Có lỗi xảy ra khi gửi email, vui lòng thử lại.');
                }
            } else {
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi email, vui lòng thử lại.');
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                    <View style={styles.textContainer2}>
                        <Text style={styles.text2}>Quên mật khẩu</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonCancelText}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Nhận mã OTP</Text>
                            )}
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
        backgroundColor: '#f8f9fa', // Màu nền nhẹ nhàng
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
        padding: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff', // Nền trắng cho ô nhập liệu
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    textContainer2: {
        alignItems: 'center',
        marginBottom: 20,
    },
    text2: {
        color: '#343a40',
        fontSize: 30,
        fontWeight: 'bold',
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
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonCancel: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
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
        width: 250,  // Giảm kích thước của HeaderIcon
        height: 250,
        right:-80,
        top:-20,
    }
});

export default ForgotPassword;
