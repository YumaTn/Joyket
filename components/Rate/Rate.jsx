import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Rate = ({ navigation, route }) => {
  const { productId, orderDetailId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [ratingId, setRatingId] = useState(null); // State to store the rating ID

  // Fetch userId from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserId(userData.id);
          await checkUserRating(userData.id, productId);
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };
    getUserData();
  }, []);

  // Check if the user has already rated the product
  const checkUserRating = async (userId, productId) => {
    try {
      const response = await axios.get('http://192.168.2.18:8080/api/rates');

      // Find the user's rating for the product
      const userRating = response.data.find(rate => 
        rate.user.userId === userId && rate.product.productId === productId
      );

      if (userRating) {
        setRating(userRating.rating);
        setComment(userRating.comment);
        setHasRated(true);
        setRatingId(userRating.id); // Store the rating ID
      }
    } catch (error) {
      console.error('Error checking user rating', error);
    }
  };

  const submitRating = async () => {
    if (!rating || !comment) {
      Alert.alert('Lỗi', 'Vui lòng điền đánh giá và bình luận.');
      return;
    }

    try {
      const data = {
        id: hasRated ? ratingId : null, // Include ID for updates
        rating,
        comment,
        user: { userId },
        product: { productId },
        orderDetail: { orderDetailId }
      };

      console.log('Submitting data:', data);

      // Check if the user has already rated the product and decide to use PUT or POST
      const response = hasRated
        ? await axios.put('http://192.168.2.18:8080/api/rates', data)
        : await axios.post('http://192.168.2.18:8080/api/rates', data);

      if (response.status === 200) {
        Alert.alert('Thành công', hasRated ? 'Đánh giá của bạn đã được sửa.' : 'Đánh giá của bạn đã được gửi.');
        navigation.navigate('Navigation');
      } else {
        console.log('Response:', response);
      }
    } catch (error) {
      console.error('Error submitting rating', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể gửi đánh giá.');
    }
  };

  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.titleContainer}>
            <MaterialIcons style={{ marginLeft: 10 }} name="keyboard-arrow-left" size={24} color="black" />
            <Text style={styles.info}>Đánh giá</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Rating Stars */}
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
              <FontAwesome5
                name="star"
                size={30}
                color={star <= rating ? '#FFD700' : '#ccc'} // Highlight selected stars
                style={styles.star}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Nhập bình luận"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity onPress={submitRating}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{hasRated ? 'Sửa đánh giá' : 'Gửi đánh giá'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Rate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 40,
    backgroundColor: '#FFCA09',
  },
  info: {
    fontSize: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginLeft: -5,
    marginBottom: 10,
    justifyContent: 'center',
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  button: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFCA09',
    backgroundColor: '#FFCA09',
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});
