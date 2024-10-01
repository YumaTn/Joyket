import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View, Image, Alert, Keyboard } from 'react-native';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LogoIcon } from '../../assets/icon';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Phone1 from '../../assets/phone.webp';
import Laptop1 from '../../assets/Laptop.webp';
import Device1 from '../../assets/Device.jpg'
import Clock1 from '../../assets/Clock.jpeg'
import Tivi1 from '../../assets/Tivi.webp'
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Laptop = ({ navigation,route }) => {
  const {categoryId} =route.params;
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
      const response = await fetch('http://192.168.2.18:8080/api/products'); 
      const data = await response.json();
  
      // Lọc sản phẩm theo categoryId
      const filtered = data.filter(item => item.category.categoryId === categoryId);
      
      setFilteredProducts(filtered); // Set filtered products với các sản phẩm có categoryId tương ứng
      await AsyncStorage.setItem('productsData', JSON.stringify(filtered)); // Lưu dữ liệu đã lọc vào AsyncStorage
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
            <TouchableOpacity onPress={() => navigation.navigate('Navigation')}>
          <AntDesign style={{marginTop:15}} name="arrowleft" size={24} color="black" />
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
          <TouchableOpacity onPress={() => navigation.navigate('Navigation')}>
          <LogoIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.Title}>Danh mục</Text>
        </View>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Phone',{ categoryId: 1 })}>
          <View style={{alignItems:'center'}}>
            <Image style={styles.imageCategory} source={Phone1}/>
            <Text style={styles.categoryTitle}>Điện thoại</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Laptop',{ categoryId: 2 })}>
          <View style={{alignItems:'center'}}>
            <Image style={styles.imageCategory} source={Laptop1}/>
            <Text style={styles.categoryTitle}>Laptop</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Device',{ categoryId: 3 })}>
          <View style={{alignItems:'center'}}>
            <Image style={styles.imageCategory} source={Device1}/>
            <Text style={styles.categoryTitle}>Đồ điện gia dụng</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Clock',{ categoryId: 4 })}>
          <View style={{alignItems:'center'}}>
            <Image style={styles.imageCategory} source={Clock1}/>
            <Text style={styles.categoryTitle}>Đồng hồ</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Tivi',{ categoryId: 5 })}>
          <View style={{alignItems:'center'}}>
            <Image style={styles.imageCategory} source={Tivi1}/>
            <Text style={styles.categoryTitle}>Tivi</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
        <Text style={styles.Title}>Laptop</Text>
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

export default Laptop;

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
    marginRight:310,
    marginTop:10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    marginLeft:5
  },
  Title: {
    fontSize: 15,
    marginLeft: 5,
    fontWeight:'bold',
    color:'gray',
    alignSelf:'center'
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
  imageCategory: {
    marginTop:10,
    marginRight:20,
    borderColor:'gray',
    borderWidth:1,
    width: 40,
    height: 40,
    borderRadius: 25,
    marginBottom: 10,
    marginLeft: 20,
},
categoryTitle:{
  fontWeight:'bold'
}
});
