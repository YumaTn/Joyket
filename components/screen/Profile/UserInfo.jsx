import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const UserInfo = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState(''); // State for gender

    return (
        <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.header}>
                    <Text style={styles.info}>
                        <SimpleLineIcons name="arrow-left" size={16} color="black" /> Thong tin ca nhan
                    </Text>
                </View>
                <Ionicons style={{ marginLeft: 200 }} name="person-circle-outline" size={30} color="black" />
            </TouchableOpacity>
            <SafeAreaView>
                <View>
                    <Text style={styles.title}>Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="email"
                        placeholderTextColor="#CCCCCC"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Name"
                        placeholderTextColor="#CCCCCC"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Address</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Address"
                        placeholderTextColor="#CCCCCC"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Phone number</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUsername}
                        value={username}
                        placeholder="Phone number"
                        placeholderTextColor="#CCCCCC"
                    />
                </View>
                <View>
                    <Text style={styles.title}>Gender</Text>
                    <View style={styles.radioContainer}>
                        {/* Male Radio Button */}
                        <TouchableOpacity onPress={() => setGender('male')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, gender === 'male' && styles.radioButtonSelected]}>
                                {gender === 'male' && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.radioButtonText}>Male</Text>
                        </TouchableOpacity>

                        {/* Female Radio Button */}
                        <TouchableOpacity onPress={() => setGender('female')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, gender === 'female' && styles.radioButtonSelected]}>
                                {gender === 'female' && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={styles.radioButtonText}>Female</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text>Chỉnh sửa</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
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
    inputContainer: {
        position: 'absolute',
        top: '40%',
        width: '80%',
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    title: {
        marginLeft: 5,
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
        backgroundColor: 'red', // Inner circle màu trắng
    },
    radioButtonText: {
        marginLeft: 10,
    },
});

export default UserInfo;
