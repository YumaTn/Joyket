import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Favorite = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          const { email, token } = parsedData;

          const response = await fetch(`http://10.87.3.218:8080/api/favorites/email/${email}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const favoritesData = await response.json();
            const updatedFavorites = favoritesData.map(fav => ({ ...fav, isFavorite: true }));
            setFavorites(updatedFavorites);
          } else {
            console.error('Failed to fetch favorites, status:', response.status);
          }
        }
      } catch (error) {
        console.error('Error loading stored data or fetching favorites:', error);
      } finally {
        setLoading(false); // Đặt loading về false sau khi hoàn tất
      }
    };

    const intervalId = setInterval(fetchFavorites, 5000); // Kiểm tra dữ liệu mới mỗi 5 giây
    fetchFavorites(); // Gọi ngay lần đầu tiên

    return () => clearInterval(intervalId); // Dọn dẹp interval khi unmount
  }, []);

  const removeFromFavorites = async (id) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        Alert.alert('Error', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng dịch vụ.');
        navigation.navigate('login');
        return;
      }

      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.token;

      const response = await fetch(`http://10.87.3.218:8080/api/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the state to set the isFavorite to false for the specific favorite
        setFavorites(prevFavorites => 
          prevFavorites.map(fav => 
            fav.favoriteId === id ? { ...fav, isFavorite: false } : fav
          )
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Error', `Xóa sản phẩm khỏi danh sách yêu thích thất bại: ${errorData.message || 'Lỗi không xác định.'}`);
      }
    } catch (error) {
      console.error('Error removing product from favorites:', error);
      Alert.alert('Error', `Đã xảy ra lỗi: ${error.message}`);
    }
  };

  const addToCart = async (product) => {
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
  
      const cartResponse = await fetch(`http://10.87.3.218:8080/api/cart/user/${email}`, {
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
        price: product.price, // Use the passed product's price
        product: { productId: product.productId }, // Use the passed product's ID
        cart: { cartId: cartId },
      };
  
      const postDetailResponse = await fetch(`http://10.87.3.218:8080/api/cartDetail`, {
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
        const allDetailsResponse = await fetch(`http://10.87.3.218:8080/api/cartDetail/cart/${cartId}`, {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.info}>Yêu thích</Text>
        <MaterialIcons style={{ marginRight: 20 }} name="favorite" size={30} color="black" />
      </View>

      {loading ? ( // Hiển thị loading nếu đang tải
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {favorites.length > 0 ? (
            favorites.map((favorite, index) => (
              <View key={index} style={styles.detailContainer}>
                {favorite.product && favorite.product.image ? (
                  <Image source={{ uri: favorite.product.image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <Text style={styles.productName}>{favorite.product?.name || 'No Product Name Available'}</Text>
                <View style={styles.FCartContainer}>
                  <TouchableOpacity onPress={() => removeFromFavorites(favorite.favoriteId)}>
                    <MaterialIcons
                      style={{ marginRight: 10 }}
                      name={favorite.isFavorite ? "favorite" : "favorite-border"}
                      size={24}
                      color={favorite.isFavorite ? "red" : "black"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => addToCart(favorite.product)}>
                    <FontAwesome name="opencart" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text>No favorites found</Text>
          )}
        </ScrollView>
      )}
    </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 30,
    backgroundColor: '#FFCA09',
    paddingBottom: 10,
  },
  info: {
    fontSize: 20,
    paddingLeft: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 1,
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
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  FCartContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});

export default Favorite;
