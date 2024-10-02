import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const History = ({ navigation }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [email, setEmail] = useState([]);
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
      setOrderHistory(response.data);
      
      // Fetch order details for each order
      response.data.forEach(order => {
        fetchOrderDetails(order.ordersId);
      });
    } catch (error) {
      console.error('Error fetching order history', error);
    }
  };

  const fetchOrderDetails = async (ordersId) => {
    try {
      const response = await axios.get(`http://192.168.2.18:8080/api/orderDetail/order/${ordersId}`);
      setOrderDetails(prevDetails => [...prevDetails, ...response.data]);
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

  // Sắp xếp orderDetails trong render
  const sortedOrderDetails = [...orderDetails].sort((a, b) => {
    const orderA = orderHistory.find(order => order.ordersId === a.ordersId);
    const orderB = orderHistory.find(order => order.ordersId === b.ordersId);
    return new Date(orderB?.orderDate) - new Date(orderA?.orderDate);
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.titleContainer}>
            <MaterialIcons style={{ marginLeft: 10 }} name="keyboard-arrow-left" size={24} color="black" />
            <Text style={styles.info}>Lịch sử</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.historyIcon}>
          <FontAwesome5 name="history" size={20} color="black" />
        </View>
      </View>

      <ScrollView>
        {sortedOrderDetails.length > 0 ? (
          sortedOrderDetails.map((detail, index) => {
            // Tìm orderId tương ứng với detail
            const order = orderHistory.find(order => order.ordersId === detail.order.ordersId);
            return (
              <TouchableOpacity 
                key={index} 
                onPress={() => navigation.navigate('HistoryDetail', { 
                  ordersId: order?.ordersId, // Truyền ordersId vào HistoryDetail
                  orderDetailId: detail.orderDetailId 
                })}
              >
                <View style={styles.detailContainer}>
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
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.noOrdersText}>Không có chi tiết đơn hàng nào</Text>
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
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
    textAlign: 'right',
    flex: 0.4,
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
