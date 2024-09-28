import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { LogoIcon } from '../../../assets/icon';

const { width } = Dimensions.get('window');

const ProductDetail = ({ route, navigation }) => {
  const [product, setProduct] = useState({});
  const { productId } = route.params;
  const [ProductDetailImage, setProductDetailImage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
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
    const checkIfFavorite = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          const email = parsedData.email;
    
          const response = await fetch(`http://192.168.1.16:8080/api/favorites/email/${email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${parsedData.token}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Error fetching favorites');
          }
    
          const favoritesData = await response.json();
          console.log('Favorites data:', favoritesData); // Debug line
    
          // Kiểm tra nếu productId trong favoritesData có trùng với productId hiện tại không
          const favoriteItem = favoritesData.find(fav => fav.product.productId === productId);
          console.log('Favorite item:', favoriteItem); // Debug line
    
          // Cập nhật trạng thái isFavorite và favoriteId
          if (favoriteItem) {
            setIsFavorite(true);
            setFavoriteId(favoriteItem.favoriteId); // Giả sử id là thuộc tính của item yêu thích
          } else {
            setIsFavorite(false);
            setFavoriteId(null); // Nếu không có, set về null
          }
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };
    loadProductData();
    loadProductDetailImage();
    checkIfFavorite();
  }, [productId]);

  const formatPrice = (price) => {
    if (price) {
      return price.toLocaleString('vi-VN');
    }
    return 'N/A';
  };

  const addToCart = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng dịch vụ.');
        navigation.navigate('login');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;
      const email = parsedUserData.email;

      if (!token || !email) {
        Alert.alert('Error', 'Token hoặc email không hợp lệ. Vui lòng đăng nhập lại.');
        navigation.navigate('login');
        return;
      }

      const cartResponse = await fetch(`http://192.168.1.16:8080/api/cart/user/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!cartResponse.ok) {
        const errorData = await cartResponse.json();
        throw new Error(errorData.message || 'Không thể lấy thông tin giỏ hàng.');
      }

      const cartData = await cartResponse.json();
      const cartId = cartData.cartId;

      const cartDetail = {
        quantity: 1,
        price: product.price,
        product: { productId: productId },
        cart: { cartId: cartId },
      };

      const postDetailResponse = await fetch(`http://192.168.1.16:8080/api/cartDetail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(cartDetail),
      });

      const postDetailData = await postDetailResponse.json();

      if (postDetailResponse.ok) {
        Alert.alert('Success', 'Thêm sản phẩm vào giỏ hàng thành công!');
        const allDetailsResponse = await fetch(`http://192.168.1.16:8080/api/cartDetail/cart/${cartId}`, {
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
        await AsyncStorage.setItem('cartLength', JSON.stringify(allDetailsData.length));
      } else {
        Alert.alert('Error', `Thêm sản phẩm vào giỏ hàng thất bại: ${postDetailData.message || 'Lỗi không xác định.'}`);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Error', `Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const addToFavorites = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng dịch vụ.');
        navigation.navigate('login');
        return;
      }
  
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;
      const email = parsedUserData.email;
      const userId = parsedUserData.userId; // Assuming userId is stored here
  
      if (!token || !email || !userId) {
        Alert.alert('Error', 'Token, email hoặc userId không hợp lệ. Vui lòng đăng nhập lại.');
        navigation.navigate('login');
        return;
      }
  
      // Tạo đối tượng yêu thích
      const favoriteDetail = {
        user: { userId: userId }, // Cấu trúc đối tượng cho người dùng
        product: { productId: productId }, // Cấu trúc đối tượng cho sản phẩm
      };
  
      // Gửi yêu cầu thêm sản phẩm vào yêu thích
      const favoriteResponse = await fetch(`http://192.168.1.16:8080/api/favorites/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(favoriteDetail),
      });
  
      const favoriteData = await favoriteResponse.json();
  
      if (favoriteResponse.ok) {
        Alert.alert('Success', 'Thêm sản phẩm vào danh sách yêu thích thành công!');
        setIsFavorite(true); // Cập nhật trạng thái ngay lập tức
        setFavoriteId(favoriteData.favoriteId); // Nếu có favoriteId từ phản hồi
      } else {
        Alert.alert('Error', `Thêm sản phẩm vào danh sách yêu thích thất bại: ${favoriteData.message || 'Lỗi không xác định.'}`);
      }
    } catch (error) {
      console.error('Error adding product to favorites:', error);
      Alert.alert('Error', `Đã xảy ra lỗi: ${error.message}`);
    }
  };
  
  const removeFromFavorites = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng dịch vụ.');
        navigation.navigate('login');
        return;
      }
  
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;
  
      const response = await fetch(`http://192.168.1.16:8080/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setIsFavorite(false); 
        setFavoriteId(null); // Reset favoriteId
      } else {
        const errorData = await response.json();
        Alert.alert('Error', `Xóa sản phẩm khỏi danh sách yêu thích thất bại: ${errorData.message || 'Lỗi không xác định.'}`);
      }
    } catch (error) {
      console.error('Error removing product from favorites:', error);
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
          <LogoIcon />
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
                <TouchableOpacity
                  onPress={() => {
                    if (isFavorite) {
                      // Gọi đến hàm xóa nếu sản phẩm đã yêu thích
                      removeFromFavorites(favoriteId); // Gọi hàm xóa với favoriteId
                    } else {
                      // Gọi đến hàm thêm nếu sản phẩm chưa yêu thích
                      addToFavorites();
                    }
                  }}>
                  <MaterialIcons
                    style={{ marginRight: 10 }}
                    name={isFavorite ? "favorite" : "favorite-border"} // Thay đổi biểu tượng dựa trên trạng thái yêu thích
                    size={24}
                    color={isFavorite ? "red" : "black"} // Thay đổi màu sắc dựa trên trạng thái yêu thích
                  />
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
