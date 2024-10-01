import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const History = ({ navigation }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [email, setEmail] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setEmail(userData.email);
          fetchOrderHistory(userData.email);
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };

    getUserData();
  }, []);

  const fetchOrderHistory = async (email) => {
    try {
      const response = await axios.get(`http://192.168.2.18:8080/api/orders/user/${email}`);
      
      // Sort the orders by date (assuming there's a date field like 'orderDate')
      const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrderHistory(sortedOrders);
  
      // Fetch details for each order
      sortedOrders.forEach(order => {
        fetchOrderDetails(order.ordersId);
      });
    } catch (error) {
      console.error('Error fetching order history', error);
    }
  };
  
  const fetchOrderDetails = async (ordersId) => {
    try {
      const response = await axios.get(`http://192.168.2.18:8080/api/orderDetail/order/${ordersId}`);

      // Assuming response.data contains an array of details
      setOrderDetails(prevDetails => [...prevDetails, ...response.data]); // Append to existing details
    } catch (error) {
      console.error('Error fetching order details', error);
    }
  };

  const formatPrice = (price) => {
    if (price) {
      return price.toLocaleString('vi-VN');
    }
    return 'N/A'; 
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.titleContainer}>
            <MaterialIcons style={{ marginLeft: 10 }} name="keyboard-arrow-left" size={24} color="black" />
            <Text style={styles.info}>History</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.historyIcon}>
          <FontAwesome5 name="history" size={20} color="black" />
        </View>
      </View>

      <ScrollView>
        {orderDetails.length > 0 ? (
          orderDetails.map((detail, index) => (
            <View key={index} style={styles.detailContainer}>
              {detail.product && detail.product.image ? (
                <Image source={{ uri: detail.product.image }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.productName}>Bạn đã đặt {detail.product?.name || 'N/A'}</Text>
                <Text style={styles.quantity}>Số lượng: {detail.quantity || 'N/A'}</Text>
              </View>
              <Text style={styles.productPrice}>-{formatPrice(detail.product?.price) || 'N/A'} VNĐ</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No order details available</Text>
        )}
      </ScrollView>
    </View>
  );
};

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
  historyIcon: {
    marginRight: 20,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginLeft: 5,
    marginBottom: 10,
    justifyContent: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Center elements vertically
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
  },
  textContainer: {
    flex: 1, // Take up the remaining space
    marginLeft: 10, // Adds space between image and text
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    textAlign: 'right', // Align price to the right
    flex: 0.4, // Ensure price stays to the right
  },
  quantity: {
    fontSize: 16,
    color: '#333',
  },
  noOrdersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
});

export default History;
