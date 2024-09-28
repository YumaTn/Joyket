import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LogoLoginIcon } from '../../../assets/icon';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

    const handleResetPassword = async () => {
      try {
          if (!email) {
              Alert.alert('Thông báo', 'Vui lòng nhập email');
              return;
          }
          
          const response = await axios.post(
              'http://10.87.3.218:8080/api/auth/send-mail-forgot-password-token',
              { email },
              { headers: { 'Content-Type': 'application/json' } }
          );
  
          if (response.status === 200) {
              Alert.alert('Thông báo', 'Một email xác nhận đã được gửi. Vui lòng kiểm tra hộp thư của bạn!');
          } else {
              Alert.alert('Lỗi', 'Không tìm thấy email này trong hệ thống!');
          }
      } catch (error) {
          if (error.response) {
              // Log detailed error data from the server
              console.error("Error Data:", error.response.data);
              console.error("Error Status:", error.response.status);
              
              if (error.response.status === 404) {
                  Alert.alert('Lỗi', 'Email này chưa đăng ký tài khoản!');
              } else {
                  Alert.alert('Lỗi', error.response.data.message || 'Có lỗi xảy ra khi gửi email, vui lòng thử lại.');
              }
          } else {
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi email, vui lòng thử lại.');
          }
      }
  };
  
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={styles.container}>
                <Image style={styles.image1} source={require('../../../assets/backgroundlogin.png')} />
                <View style={styles.textContainer}>
                    <LogoLoginIcon />
                </View>
                <View style={styles.textContainer2}>
                    <Text style={styles.text2}>Quên mật khẩu</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <TouchableOpacity style={styles.buttonCancel} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonCancelText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color="white" /> // Hiển thị spinner khi loading
                    ) : (
                        <Text style={styles.buttonText}>Reset mật khẩu</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>
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
        marginTop: 120,
    },
    textContainer2: {
        position: 'absolute',
        top: '43%',
        left: '24%',
        alignItems: 'center',
    },
    text2: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    },
    inputContainer: {
        position: 'absolute',
        top: '50%',
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
        top: '62%',
        right: '20%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: 'black',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCancel: {
        position: 'absolute',
        top: '62%',
        left: '20%',
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonCancelText: {
        color: 'black',
        fontSize: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ForgotPassword;
