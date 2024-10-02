import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
const HistoryDetail = ({ navigation, route }) => {
  const { ordersId, orderDetailId } = route.params;
  const [email, setEmail] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  // Lấy email từ AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setEmail(userData.email);
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };
    getUserData();
  }, []);

  // Gọi API để lấy chi tiết đơn hàng và so sánh orderDetailId
  const fetchOrderDetails = async (ordersId) => {
    try {
      const response = await axios.get(`http://192.168.2.18:8080/api/orderDetail/order/${ordersId}`);
      const filteredDetails = response.data.filter(detail => detail.orderDetailId === orderDetailId);
      setOrderDetails(filteredDetails);
    } catch (error) {
      console.error('Error fetching order details', error);
    }
  };

  // Gọi API để lấy lịch sử đơn hàng và so sánh ordersId
  const fetchOrderHistory = async (email) => {
    try {
      const response = await axios.get(`http://192.168.2.18:8080/api/orders/user/${email}`);
      const filteredOrderHistory = response.data.filter(order => order.ordersId === ordersId);
      setOrderHistory(filteredOrderHistory);
    } catch (error) {
      console.error('Error fetching order history', error);
    }
  };

  // Gọi API sau khi lấy được ordersId và email
  useEffect(() => {
    if (ordersId) {
      fetchOrderDetails(ordersId);
    }
    if (email) {
      fetchOrderHistory(email);
    }
  }, [ordersId, email]);

  // Định dạng giá tiền
  const formatPrice = (price) => {
    if (price) {
      return price.toLocaleString('vi-VN');
    }
    return 'N/A';
  };
  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <View style={styles.titleContainer}>
            <MaterialIcons style={{ marginLeft: 10 }} name="keyboard-arrow-left" size={24} color="black" />
            <Text style={styles.info}>Chi tiết lịch sử giao dịch</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.historyIcon}>
          <FontAwesome5 name="history" size={20} color="black" />
        </View>
      </View>
      <ScrollView>
        {orderDetails.length > 0 ? (
          orderDetails.map((detail, index) => (
            <View>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>Đơn hàng đã thanh toán</Text>
              </View>
              <View key={index} style={styles.detailContainer}>
                <View key={index} style={styles.textContainer}>
                  <Text style={styles.productNameTitle}>{detail.product?.name || 'N/A'}</Text>
                  <Text style={styles.quantity}>Số lượng: {detail.quantity || 'N/A'}</Text>
                  <Text style={styles.productPrice}>Tổng tiền: {formatPrice(detail.product?.price) || 'N/A'} VNĐ</Text>
                </View>
              </View>
              <View style={styles.line} />
              {orderHistory.length > 0 ? (
                orderHistory.map((order, index) => (
                  <>
                    <View key={index} style={styles.orderHistoryContainer}>
                      <Text style={styles.orderTitle}>Địa chỉ nhận hàng</Text>
                      <View style={styles.orderHistoryContainerSmall}>
                        <EvilIcons name="location" size={24} color="black" />
                        <View>
                          <Text style={styles.orderInfo}>{order.user.name || 'N/A'} <Text style={styles.orderInfoPhone}>(+84) {order.phone || 'N/A'}</Text></Text>
                          <Text style={styles.orderInfo}>Địa chỉ: {order.address || 'N/A'}</Text>
                          <Text style={styles.orderInfo}>Thời gian đặt hàng:{formatDate(order.orderDate) || 'N/A'}</Text>
                        </View>
                      </View>
                    </View>
                  </>
                ))
              ) : (
                <Text style={styles.noOrdersText}>No order history available</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}>No order details available</Text>
        )}
        {orderDetails.length > 0 ? (
          orderDetails.map((detail, index) => (
            <View key={index} style={styles.detailProductContainer}>
              <View key={index} style={styles.textProductContainer}>
                {detail.product && detail.product.image ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: detail.product.image }} style={styles.image} />
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <View>
                  <Text
                    style={styles.productNameTitleSmall}
                    numberOfLines={1} // Giới hạn chỉ hiển thị 1 dòng
                    ellipsizeMode="tail" // Hiển thị "..." ở cuối nếu văn bản quá dài
                  >
                    {detail.product?.name || 'N/A'}
                  </Text>
                  <Text style={styles.quantityProduct}>x{detail.quantity || 'N/A'}</Text>
                  <Text style={styles.productPriceOrder}>{formatPrice(detail.product?.price) || 'N/A'} VNĐ</Text>
                  <Text style={styles.productPriceOrderContainer}>Thành tiền: <Text style={styles.productPriceOrder}>{formatPrice(detail.product?.price) || 'N/A'} VNĐ</Text></Text>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProductDetail', { productId: detail.product.productId })}>
                    <Text style={styles.buttonText}>Mua Lại</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noOrdersText}></Text>
        )}
        {orderDetails.length > 0 ? (
          orderDetails.map((detail, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('Rate', { productId: detail.product.productId, orderDetailId: detail.orderDetailId })}>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>Đánh giá</Text>
                <AntDesign style={{ color: 'orange' }} name="arrowright" size={24} color="black" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noOrdersText}></Text>
        )}
      </ScrollView>
    </View>
  );
};

export default HistoryDetail;

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
    marginLeft: -5,
    marginBottom: 10,
    justifyContent: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  productNameTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 16,
    color: 'green',
    textAlign: 'left',
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
  cardHeader: {
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: 'green',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  line: {
    borderWidth: 0.1,
    backgroundColor: '#EFEFEF',
    borderColor: '#EFEFEF',
  },
  orderHistoryContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  orderHistoryContainerSmall: {
    flexDirection: 'row'
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderInfoPhone: {
    fontSize: 16,
    marginBottom: 5,
    color: 'gray'
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailProductContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Đảm bảo align items không bị tràn
    padding: 15,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    width: 75,
    padding: 10,
    marginRight: 20,
    height: 75
  },
  textProductContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row'
  },
  quantityProduct: {
    fontSize: 16,
    color: 'gray',
    alignSelf: "flex-end",

  },
  productPriceOrder: {
    fontSize: 16,
    alignSelf: "flex-end",
    flex: 0.4,
  },
  productPriceOrderContainer: {
    fontSize: 16,
    alignSelf: "flex-end",
    flex: 0.4,
  },
  button: {
    fontSize: 16,
    alignSelf: "flex-end",
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFCA09',
    paddingVertical: 10,  // Thay đổi để padding đồng đều
    paddingHorizontal: 15, // Đảm bảo đủ khoảng trống
    borderRadius: 5,
    flex: 1, // Thêm để button chiếm không gian
    maxWidth: '90%', // Giới hạn chiều rộng tối đa
  },

  buttonText: {
    fontSize: 18,
    color: '#FFCA09',
    textAlign: 'center', // Giữa text
    flex: 1, // Đảm bảo text chiếm toàn bộ không gian
  },
  rating: {
    fontSize: 18,
    color: 'orange'
  },
  ratingContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginRight: 10,
    marginTop: 10,
  },
  productNameTitleSmall: {
    fontSize: 15,
    fontWeight: '500',
    maxWidth: '80%',

  }
});
