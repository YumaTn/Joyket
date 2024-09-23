import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UserInfo = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    setUsername(parsedData.name);
                    setUserEmail(parsedData.email);
                    setPhone(parsedData.phone);
                    setAddress(parsedData.address);
                    setGender(parsedData.gender === true ? 'male' : 'female');
                    setImage(parsedData.image);
                    setUserId(parsedData.userId); // Giả sử 'userId' được lưu trữ
                    setToken(parsedData.token); // Giả sử 'token' được lưu trữ
                }
            } catch (error) {
                console.error('Error loading data from storage', error);
            }
        };

        loadData();
    }, []);

    // Hàm xử lý cập nhật thông tin người dùng
    const handleUpdate = async () => {
        // Chuyển đổi giới tính thành boolean
        const genderBoolean = gender === 'male' ? true : false;

        // Kiểm tra xem userId đã được lấy chưa
        if (!userId) {
            Alert.alert('Lỗi', 'Không tìm thấy ID người dùng.');
            return;
        }

        const updatedUser = {
            userId: userId, // Thêm trường userId
            name: username,
            email: userEmail,
            phone: phone,
            address: address,
            gender: genderBoolean,
            image: image, // Giả sử hình ảnh là URL hoặc đã được xử lý
            // Thêm các trường khác nếu cần
        };

        console.log('User ID:', userId);
        console.log('Updated User:', updatedUser);

        if (token && userId) {
            setLoading(true);
            try {
                const response = await axios.put(`https://api.yourdomain.com/api/auth/${userId}`, updatedUser, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`, // Thêm header Authorization nếu backend yêu cầu
                    },
                });

                if (response.status === 200) {
                    // Cập nhật AsyncStorage với dữ liệu mới
                    const updatedUserData = { ...response.data };
                    await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
                    Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật.');
                    // Có thể thêm logic để làm mới dữ liệu hoặc điều hướng
                } else {
                    Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin.');
                }
            } catch (error) {
                console.error('Error updating user info', error);
                if (error.response && error.response.data && error.response.data.message) {
                    Alert.alert('Lỗi', error.response.data.message);
                } else {
                    Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin.');
                }
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert('Lỗi', 'Người dùng chưa được xác thực.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.header}>
                    <Text style={styles.info}>
                        <SimpleLineIcons name="arrow-left" size={16} color="black" /> Thông tin cá nhân
                    </Text>
                </View>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                    />
                ) : (
                    <Text style={{ textAlign: 'center', marginVertical: 10 }}>No profile image available</Text>
                )}
                
                <View>
                    <Text style={styles.title}>Email<Text style={styles.iconMust}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUserEmail}
                        value={userEmail}
                        placeholder="Email"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Name<Text style={styles.iconMust}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Name"
                        placeholderTextColor="#CCCCCC"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Address<Text style={styles.iconMust}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setAddress}
                        value={address}
                        placeholder="Address"
                        placeholderTextColor="#CCCCCC"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Phone number<Text style={styles.iconMust}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPhone}
                        value={phone}
                        placeholder="Phone number"
                        placeholderTextColor="#CCCCCC"
                        keyboardType="phone-pad"
                        maxLength={10} // Giới hạn nhập tối đa 10 chữ số
                    />
                </View>
                <View>
                    <Text style={styles.title}>Gender<Text style={styles.iconMust}>*</Text></Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity onPress={() => setGender('male')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]}>
                                {gender === 'male' && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.radioButtonText}>Male</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setGender('female')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]}>
                                {gender === 'female' && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.radioButtonText}>Female</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Chỉnh sửa</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingTop: 30,
    },
    info: {
        fontSize: 20,
        paddingLeft: 20,
        paddingBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    title: {
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    button: {
        borderWidth: 1,
        borderColor: 'orange',
        padding: 12,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 120,
        marginRight: 120,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        backgroundColor: 'white',
    },
    innerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: 'red',
    },
    radioButtonText: {
        marginLeft: 10,
    },
    iconMust: {
        color: 'red',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 10,
    },
    scrollViewContent: {
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
});

export default UserInfo;
