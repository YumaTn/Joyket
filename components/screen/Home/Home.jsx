import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { LogoIcon } from '../../../assets/icon';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userData'); // Kiểm tra token từ AsyncStorage
      setIsLoggedIn(!!token); // Nếu có token thì người dùng đã đăng nhập
    };
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://10.87.3.218:8080/api/products');
        const data = await response.json();
        
        // Lưu dữ liệu vào AsyncStorage
        await AsyncStorage.setItem('productsData', JSON.stringify(data));
        
        // Lưu sản phẩm và in ra thông tin
        const formattedData = data.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          discount: item.discount,
          image: item.image,
          description: item.description,
          enteredDate: item.enteredDate,
          sold: item.sold,
          categoryName: item.category.categoryName,
        }));

        console.log(formattedData); // In ra thông tin sản phẩm
        setProducts(formattedData);
        setFilteredProducts(formattedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu sản phẩm.');
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const toggleSearchFocus = () => {
    setIsSearchFocused(!isSearchFocused);
    if (!isSearchFocused) {
      searchInputRef.current.focus();
    } else {
      searchInputRef.current.blur();
    }
  };

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
        <Text style={styles.discount}>Giảm giá: {item.discount}%</Text>
        <Text style={styles.sold}>Đã bán: {item.sold}</Text>
        <Text style={styles.category}>Danh mục: {item.categoryName}</Text>
        <Text style={styles.enteredDate}>Ngày nhập: {new Date(item.enteredDate).toLocaleDateString()}</Text>
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
        <Text style={styles.Title}>Sản phẩm :</Text>
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId ? item.productId.toString() : Math.random().toString()} // Sử dụng Math.random() làm fallback nếu productId không có
          style={styles.flatList}
          numColumns={numColumns}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // Các style của component
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 20,
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
  Title: {
    marginTop: 10,
    fontSize: 15,
    marginLeft: 5,
  },
  flatList: {
    marginTop: 10,
  },
  item: {
    width: cardWidth,
    borderColor: '#000', 
    borderWidth: 1,      
    margin: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 30,
    paddingTop: 30,
    borderRadius: 10, 
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10, 
    resizeMode: 'cover', 
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: cardWidth,
    height: 120,
    borderRadius: 5,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: 'black',
    borderBottomWidth:1,
  },
  icon: {
    marginRight: 5,
  },
});

export default Home;
