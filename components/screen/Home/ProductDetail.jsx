import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const ProductDetail = ({ route, navigation }) => {
  const [product, setProduct] = useState({});
  const { productId } = route.params;
  const [ProductDetailImage, setProductDetailImage] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const productsData = await AsyncStorage.getItem('productsData');
        if (productsData) {
          const products = JSON.parse(productsData);
          const productDetail = products.find(p => p.id === productId);
          setProduct(productDetail);
        }
      } catch (error) {
        console.error('Error loading product data from storage', error);
      }
    };

    const loadProductDetailImage = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setProductDetailImage(parsedData.image);
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadProductData();
    loadProductDetailImage();
  }, [productId]);

  const formatPrice = (price) => {
    if (price) {
      return price.toLocaleString('vi-VN');
    }
    return 'N/A'; 
  };

  const addToCart = async () => {
    try {
      // Lấy dữ liệu người dùng từ AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng dịch vụ.');
        navigation.navigate('Login'); // Chuyển hướng đến trang đăng nhập
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;
      const email = parsedUserData.email;

      if (!token || !email) {
        Alert.alert('Error', 'Token hoặc email không hợp lệ. Vui lòng đăng nhập lại.');
        navigation.navigate('login'); // Chuyển hướng đến trang đăng nhập
        return;
      }

      // Lấy thông tin giỏ hàng hiện tại của người dùng
      const cartResponse = await fetch(`http://192.168.2.18:8080/api/cart/user/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Đính kèm token vào header
        },
      });

      if (!cartResponse.ok) {
        const errorData = await cartResponse.json();
        throw new Error(errorData.message || 'Không thể lấy thông tin giỏ hàng.');
      }

      const cartData = await cartResponse.json();
      const cartId = cartData.cartId;

      // Tạo đối tượng CartDetail
      const cartDetail = {
        quantity: 1,
        price: product.price, // Sử dụng giá sản phẩm từ state
        product: { productId: productId }, // Đảm bảo đúng tên trường như backend yêu cầu
        cart: { cartId: cartId },
      };

      // Gửi chi tiết giỏ hàng đến server
      const postDetailResponse = await fetch(`http://192.168.2.18:8080/api/cartDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Đính kèm token vào header
        },
        body: JSON.stringify(cartDetail),
      });

      const postDetailData = await postDetailResponse.json();

      if (postDetailResponse.ok) {
        Alert.alert('Success', 'Thêm sản phẩm vào giỏ hàng thành công!');
        
        // Lấy lại tất cả chi tiết giỏ hàng để cập nhật số lượng sản phẩm
        const allDetailsResponse = await fetch(`http://192.168.2.18:8080/api/cartDetail/cart/${cartId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!allDetailsResponse.ok) {
          const errorData = await allDetailsResponse.json();
          throw new Error(errorData.message || 'Không thể lấy chi tiết giỏ hàng.');
        }

        const allDetailsData = await allDetailsResponse.json();

        // Cập nhật số lượng sản phẩm trong giỏ hàng (ví dụ: lưu vào AsyncStorage hoặc cập nhật state)
        await AsyncStorage.setItem('cartLength', JSON.stringify(allDetailsData.length));
        // Nếu bạn muốn cập nhật state hoặc context, hãy thực hiện tại đây
        // Ví dụ: setCartLength(allDetailsData.length);
      } else {
        Alert.alert('Error', `Thêm sản phẩm vào giỏ hàng thất bại: ${postDetailData.message || 'Lỗi không xác định.'}`);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Error', `Đã xảy ra lỗi: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.titleContainer}>
            <MaterialIcons style={{ marginLeft: 10 }} name="keyboard-arrow-left" size={24} color="black" />
            {product ? (
              <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                {product.name}
              </Text>
            ) : (
              <Text>No product found</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.rightHeader}>
          {ProductDetailImage ? (
            <Image source={{ uri: ProductDetailImage }} style={styles.ProductDetailImage} />
          ) : (
            <MaterialCommunityIcons name="face-man-profile" size={24} color="black" />
          )}
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {product ? (
          <>
            <View style={styles.containerProduct}>
              <Image source={{ uri: product.image }} style={styles.image} />
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.priceAndCartContainer}>
              <Text style={styles.PriceTitle}>
                Giá: <Text style={styles.price}>{formatPrice(product.price)} VNĐ</Text>
              </Text>
              <View style={styles.FCartContainer}>
                <TouchableOpacity>
                  <MaterialIcons style={{ marginRight: 10 }} name="favorite-border" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={addToCart}>
                  <FontAwesome name="opencart" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.DescriptionTitle}>Mô tả:</Text>
            <Text style={styles.description}>{product.description}</Text>
          </>
        ) : (
          <Text>No product found</Text>
        )}
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
    marginBottom: 5,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFCA09',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    height: 40,
    marginLeft: 5,
    width: width * 0.5,
    justifyContent: 'center',
  },
  ProductDetailImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 15,
    marginRight: 10,
  },
  PriceTitle: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 5,
  },
  DescriptionTitle: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 5,
    fontWeight: 'bold',
  },
  containerProduct: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  FCartContainer: {
    flexDirection: 'row',
  },
  priceAndCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20,
  },
  rightHeader: {
    flexDirection: 'row',
  },
});

export default ProductDetail;
