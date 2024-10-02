import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const PaymentScreen = ({ route, navigation }) => {
  const { selectedCartDetailIds, discount = 0 } = route.params;
  const [name, setname] = useState('');
  const [phone, setphone] = useState('');
  const [address, setAddress] = useState('');
  const [cartDetails, setCartDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [cartId, setCartId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const API_URL_CART = 'http://192.168.2.18:8080/api/cart/user';
  const API_URL_CART_DETAIL = 'http://192.168.2.18:8080/api/cartDetail/cart';

  useEffect(() => {
    const fetchUserDataFromStorage = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData !== null) {
          const parsedUserData = JSON.parse(userData);
          setEmail(parsedUserData.email);
          setname(parsedUserData.name || '');  // Set name
          setphone(parsedUserData.phone || '');  // Set phone
          setAddress(parsedUserData.address || '');  // Set address
        }
      } catch (error) {
        console.error('Error retrieving user data from storage:', error);
      }
    };

    fetchUserDataFromStorage();
  }, []);

  // Fetch cartId using email
  useEffect(() => {
    if (email) {
      const fetchCartId = async () => {
        try {
          const response = await axios.get(`${API_URL_CART}/${email}`);
          setCartId(response.data.cartId);
        } catch (error) {
          console.error('Cannot retrieve cart information:', error);
          setLoading(false);
        }
      };

      fetchCartId();
    }
  }, [email]);

  // Fetch cart details after getting cartId
  useEffect(() => {
    if (cartId) {
      const fetchCartDetails = async () => {
        try {
          const response = await axios.get(`${API_URL_CART_DETAIL}/${cartId}`);
          const details = response.data.filter(item => selectedCartDetailIds.includes(item.cartDetailId));
          
          // Calculate total price
          const total = details.reduce((sum, item) => sum + item.price, 0);
          const discountedTotal = total - discount;
          setCartDetails(details);
          setTotalPrice(discountedTotal < 0 ? 0 : discountedTotal);
        } catch (error) {
          console.error('Error fetching cart details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCartDetails();
    }
  }, [cartId, selectedCartDetailIds, discount]);

  const handleConfirmPayment = async () => {
    try {
      const cartResponse = await axios.get(`${API_URL_CART}/${email}`);
      const cart = cartResponse.data;

      if (cart.cartId === cartId) {
        const updatedCart = {
          ...cart,
          address: address,
          phone: phone,
        };

        const updateResponse = await axios.put(`http://192.168.2.18:8080/api/cart/user/${email}`, updatedCart);
        
        if (updateResponse.status === 200) {
          const orderData = {
            cartId: cartId,
            address: address,
            phone: phone,
            discount: discount,
          };

          const orderResponse = await axios.post(`http://192.168.2.18:8080/api/orders/${email}`, orderData);
          
          if (orderResponse.status === 200) {
            alert('Đã thanh toán thành công và cập nhật thông tin!');
            navigation.navigate('Navigation');
          } else {
            alert('Có lỗi xảy ra khi tạo đơn hàng.');
          }
        } else {
          alert('Cập nhật thông tin không thành công.');
        }
      } else {
        alert('Cart ID không khớp. Không thể cập nhật thông tin.');
      }
    } catch (error) {
      console.error('Error updating cart information:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
            <Text style={styles.cartTitle}>Thanh toán</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <Text style={styles.textTitle}>Họ và tên</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={name}
        onChangeText={setname}
      />
      <Text style={styles.textTitle}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setphone}
        keyboardType="phone-pad"
      />
      <Text style={styles.textTitle}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeaderRow}>
          <Text style={styles.summaryHeaderText}>Sản phẩm</Text>
          <Text style={styles.summaryHeaderText}>Số lượng</Text>
          <Text style={styles.summaryHeaderText}>Giá</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          cartDetails.map((item) => (
            <View key={item.cartDetailId} style={styles.summaryRow}>
              <Text style={styles.summaryText}>{item.product.name}</Text>
              <Text style={styles.summaryText}>{item.quantity}</Text>
              <Text style={styles.summaryText}>{item.price.toLocaleString()} VND</Text>
            </View>
          ))
        )}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng giá:<Text style={styles.summaryNumber}>{totalPrice.toLocaleString()} VNĐ</Text></Text>
        </View>
      </View>

      <TouchableOpacity style={styles.paymentButton} onPress={handleConfirmPayment}>
        <Text style={styles.paymentButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFCA09',
    paddingLeft: 10,
    paddingRight: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 8,
  },
  summaryHeaderText: {
    flex: 3,
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryText: {
    flex: 3,
    fontSize: 16,
    textAlign: 'center',
  },
  paymentButton: {
    backgroundColor: 'black',
    padding: 15,
    margin: 40,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalContainer: {
    marginTop: 20,
    padding: 16,
    paddingLeft: 0,
    paddingBottom: 0,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryNumber: {
    fontWeight: 'bold',
  },
  textTitle:{
    fontWeight:'bold',
    marginLeft:5,
  },
});

export default PaymentScreen;
