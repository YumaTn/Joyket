import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View, Image, Alert, Keyboard } from 'react-native';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LogoIcon } from '../../assets/icon';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Lastest = ({ navigation }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm định dạng giá
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };
  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userData'); // Kiểm tra token từ AsyncStorage
    setIsLoggedIn(!!token); // Nếu có token thì người dùng đã đăng nhập
  };
  // Hàm gọi API để lấy sản phẩm
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://192.168.2.18:8080/api/products/bestseller');
      const data = await response.json();
      
      setFilteredProducts(data); // Giả định rằng API trả về danh sách sản phẩm
      await AsyncStorage.setItem('productsData', JSON.stringify(data)); // Lưu sản phẩm vào AsyncStorage
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải sản phẩm');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    checkLoginStatus();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = filteredProducts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      fetchProducts(); // Tải lại tất cả sản phẩm nếu không có tìm kiếm
    }
  };

  // Hàm toggle focus cho ô tìm kiếm
  const toggleSearchFocus = () => {
    setIsSearchFocused(!isSearchFocused);
    if (!isSearchFocused) {
      searchInputRef.current.focus();
    } else {
      searchInputRef.current.blur();
    }
  };

  // Hàm xử lý nhấn vào giỏ hàng
  const handleCartPress = async () => {
    if (!isLoggedIn) {
      Alert.alert('Cảnh báo', 'Bạn cần đăng nhập để mua hàng.', [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.navigate('login'),
        },
        { text: 'Hủy', style: 'cancel' },
      ]);
    } else {
      navigation.navigate('Cart');
    }
  };

  // Hàm render mỗi sản phẩm
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.productId })} // Sử dụng productId
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={styles.discount}>Giảm giá: {item.discount}%</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setIsSearchFocused(false);
    }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.openDrawer()}>
              <Ionicons name="reorder-three-outline" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
              <TouchableOpacity onPress={toggleSearchFocus}>
                <AntDesign name="search1" size={24} color="black" style={styles.icon} />
              </TouchableOpacity>
              <TextInput
                ref={searchInputRef}
                placeholderTextColor="black"
                style={[styles.searchInput, isSearchFocused ? styles.searchInputFocused : {}]}
                value={search}
                onChangeText={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </View>
          </View>
          <TouchableOpacity onPress={handleCartPress}>
            <FontAwesome
              style={{ marginRight: 15, marginTop: 10 }}
              name="opencart"
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <LogoIcon />
        </View>
        <View style={styles.titleContainer}>
        <Text style={styles.Title}>Sản phẩm</Text>
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId.toString()} // Sử dụng productId
          style={styles.flatList}
          numColumns={numColumns}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Lastest;

const styles = StyleSheet.create({
  container: {
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
    paddingRight: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -100,
  },
  titleContainer:{
    borderWidth:1,
    borderRadius:10,
    borderColor:'gray',
    padding:5,
    marginRight:320,
    marginTop:10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    marginLeft:5
  },
  Title: {
    fontSize: 15,
    marginLeft: 5,
    fontWeight:'bold',
    color:'gray'
  },
  flatList: {
    marginTop: 10,
  },
  item: {
    width: cardWidth,     
    margin: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 30,
    paddingTop: 30,
    borderRadius: 10, 
  },
  image: {
    width: '50%',
    height: 120,
    borderRadius: 10, 
    resizeMode: 'cover', 
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: 'green',
    textAlign: 'center',
    marginBottom: 5,
  },
  discount: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
  },
  sold: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  category: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  enteredDate: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 10,
    width: '65%',
    alignSelf: 'center',
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  searchInputFocused: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  icon: {
    paddingRight: 1,
  },
});
