import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const API_URL_CART = 'http://192.168.1.16:8080/api/cart/user';
const API_URL_CART_DETAIL = 'http://192.168.1.16:8080/api/cartDetail/cart';
const API_URL_PRODUCTS = 'http://192.168.1.16:8080/api/products';
const API_URL_UPDATE_CART_DETAIL = 'http://192.168.1.16:8080/api/cartDetail'; 

const Cart = ({ navigation }) => {
  const [email, setEmail] = useState(null); 
  const [cartId, setCartId] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(0);
  const [amountReal, setAmountReal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setEmail(parsedUserData.email); 
        }
      } catch (error) {
        setError('Cannot retrieve user information from storage.');
      }
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    if (email) {
      const fetchCartId = async () => {
        try {
          const response = await axios.get(`${API_URL_CART}/${email}`);
          setCartId(response.data.cartId);
        } catch (error) {
          setError('Cannot retrieve cart information.');
          setLoading(false);
        }
      };

      fetchCartId();
    }
  }, [email]);

  useEffect(() => {
    if (cartId) {
      const fetchCartDetails = async () => {
        try {
          const response = await axios.get(`${API_URL_CART_DETAIL}/${cartId}`);
          const details = response.data;
          setCartDetails(details);

          const productIds = details.map(detail => detail.product.productId);
          const productsResponse = await axios.get(API_URL_PRODUCTS);
          const productsData = productsResponse.data.reduce((acc, product) => {
            if (productIds.includes(product.productId)) {
              acc[product.productId] = product;
            }
            return acc;
          }, {});
          setProducts(productsData);

          let totalAmount = 0;
          let totalAmountReal = 0;

          details.forEach(item => {
            totalAmountReal += item.product.price * item.quantity;
            totalAmount += item.price;
          });

          setAmount(totalAmount);
          setAmountReal(totalAmountReal);
          setDiscount(totalAmount - totalAmountReal);
        } catch (error) {
          setError('Cannot retrieve cart details.');
        } finally {
          setLoading(false);
        }
      };

      fetchCartDetails();
    }
  }, [cartId]);

  const updateQuantity = async (id, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await deleteCartDetail(id);
      } else {
        const detail = cartDetails.find(item => item.cartDetailId === id);
        if (detail) {
          detail.quantity = newQuantity;
          detail.price = (detail.product.price * (1 - detail.product.discount / 100)) * newQuantity;
          await axios.put(API_URL_UPDATE_CART_DETAIL, detail);
          setCartDetails(prevDetails => prevDetails.map(item => item.cartDetailId === id ? detail : item));
          recalculateAmounts();
        }
      }
    } catch (error) {
      setError('Error updating product quantity.');
    }
  };

  const deleteCartDetail = async (id) => {
    try {
      await axios.delete(`${API_URL_UPDATE_CART_DETAIL}/${id}`);
      setCartDetails(prevDetails => prevDetails.filter(item => item.cartDetailId !== id));
      recalculateAmounts();
    } catch (error) {
      setError('Error deleting product.');
    }
  };

  const recalculateAmounts = () => {
    let totalAmount = 0;
    let totalAmountReal = 0;
    cartDetails.forEach(item => {
      totalAmountReal += item.product.price * item.quantity;
      totalAmount += item.price;
    });
    setAmount(totalAmount);
    setAmountReal(totalAmountReal);
    setDiscount(totalAmount - totalAmountReal);
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  const selectedCartItems = cartDetails.filter(item => selectedItems[item.cartDetailId]);
  
  const handlePayment = () => {
    const selectedCartDetailIds = selectedCartItems.map(item => item.cartDetailId);
    const totalValue = selectedCartItems.reduce((total, item) => total + item.price, 0);
    const discountValue = discount;
    navigation.navigate('Checkout', { selectedCartDetailIds, totalValue, discountValue });
  };

  const renderItem = ({ item }) => {
    const product = products[item.product.productId] || {};
    const isSelected = selectedItems[item.cartDetailId] || false;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => toggleSelectItem(item.cartDetailId)} style={styles.checkbox}>
          <Text style={isSelected ? styles.checkboxSelected : styles.checkboxUnselected}>
            {isSelected ? '✔' : ''}
          </Text>
        </TouchableOpacity>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/80' }}
          style={styles.productImage}
          resizeMode="contain"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>Sản phẩm: {product.name || 'Không có thông tin'}</Text>
          <Text style={styles.productPrice}>Giá: {item.price.toLocaleString()} VND</Text>
          <Text style={styles.productQuantity}>Số lượng: {item.quantity}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateQuantity(item.cartDetailId, item.quantity - 1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateQuantity(item.cartDetailId, item.quantity + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => deleteCartDetail(item.cartDetailId)}
            >
              <Text style={styles.buttonText}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
            <Text style={styles.cartTitle}>Giỏ hàng</Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cartDetails}
        keyExtractor={(item) => item.cartDetailId.toString()}
        renderItem={renderItem}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryHeaderRow}>
          <Text style={styles.summaryHeaderText}>Sản phẩm</Text>
          <Text style={styles.summaryHeaderText}>Số lượng</Text>
          <Text style={styles.summaryHeaderText}>Giá</Text>
        </View>
        {cartDetails.map(item => {
          const product = products[item.product.productId] || {};
          const isSelected = selectedItems[item.cartDetailId] || false;

          return (
            <View key={item.cartDetailId} style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {isSelected ? product.name || 'Không có thông tin' : 'Không có thông tin'}
              </Text>
              <Text style={styles.summaryText}>
                {isSelected ? item.quantity : 0}
              </Text>
              <Text style={styles.summaryText}>
                {isSelected ? item.price.toLocaleString() : 0} VND
              </Text>
            </View>
          );
        })}
        <View style={styles.summaryFooter}>
          <Text style={styles.summaryFooterText}>Giảm giá: {discount.toLocaleString()} VND</Text>
          <Text style={styles.summaryFooterText}>Tổng: {amount.toLocaleString()} VND</Text>
        </View>
        <TouchableOpacity
          style={[styles.paymentButton, selectedCartItems.length === 0 && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={selectedCartItems.length === 0}
        >
          <Text style={styles.paymentButtonText}>
            {selectedCartItems.length === 0 ? 'Vui lòng chọn sản phẩm' : 'Thanh toán'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#FFCA09',
    paddingLeft: 10,
    paddingRight: 40
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxSelected: {
    color: 'green',
  },
  checkboxUnselected: {
    color: 'transparent',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
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
    textAlign:'center'
  },
  summaryFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 8,
  },
  summaryFooterText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Cart;
