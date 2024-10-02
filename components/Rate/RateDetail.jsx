import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // Import icon library

const RateDetail = ({ productId }) => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('http://192.168.2.18:8080/api/rates');
        const data = await response.json();
        const filteredRates = data.filter(rate => rate.product.productId === productId);
        if (filteredRates.length > 0) {
          setRates(filteredRates);
        } else {
          setError('Không có đánh giá nào cho sản phẩm này.');
        }
      } catch (error) {
        setError('Có lỗi xảy ra: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [productId]);

  const renderStars = (rating) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <MaterialIcons
            key={index}
            name={index < rating ? 'star' : 'star-border'} // Show filled star or outlined star
            size={20}
            color="gold"
          />
        ))}
      </View>
    );
  };

  // Calculate total rating and count of ratings
  const totalRating = rates.reduce((sum, rate) => sum + rate.rating, 0);
  const ratingCount = rates.length;
  const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0; // Calculate average rating

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <>
      <View style={styles.line}/>
      <View style={styles.container}>
        <Text style={styles.title}>Đánh giá sản phẩm</Text>
        <View style={styles.ratingSummary}>
        <Text>
          {renderStars(Math.round(averageRating))}
        </Text>
        <Text>({ratingCount} đánh giá)</Text>
        </View>
        <View style={styles.lineSmall}></View>
        {rates.length > 0 ? (
          rates.map((rate, index) => (
            <View key={index} style={styles.rateItem}>
              <View style={styles.userContainer}>
                <Image source={{ uri: rate.user.image }} style={styles.userImage} />
                <Text style={styles.userName}>{rate.user.name}</Text>
              </View>
              {renderStars(rate.rating)} 
              <Text style={styles.categoryTitle}>Phân loại:{rate.product.category.categoryName}</Text>
              <Text>{rate.comment}</Text>
            </View>
          ))
        ) : (
          <Text>Không có đánh giá nào.</Text>
        )}
      </View>
      <View style={styles.line}/>
    </>
  );
};

export default RateDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  line: {
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#EFEFEF',
    borderColor: '#EFEFEF',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
    marginLeft: 10,
  },
  ratingSummary: {
    fontSize: 14,
    marginVertical: 5,
    flexDirection:'row',
    marginLeft:10,
  },
  rateItem: {
    marginTop: 10,
    padding: 10,
    borderBottomWidth:0.5,
    borderColor:'#CCCCCC'
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 5, // Added left margin for better alignment
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items vertically
  },
  starsContainer: {
    flexDirection: 'row', // Align stars horizontally
    marginVertical: 5, // Space between stars and comment
  },
  lineSmall:{
    borderColor:'#CCCCCC',
    borderWidth:0.2,
  },
  categoryTitle:{
    color:'gray'
  }
});
