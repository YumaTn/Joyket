import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { LogoIcon } from '../../../assets/icon';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Phone from '../../../assets/phone.webp'
import Laptop1 from '../../../assets/Laptop.webp';
import Device1 from '../../../assets/Device.jpg'
import Clock1 from '../../../assets/Clock.jpeg'
import Tivi1 from '../../../assets/Tivi.webp'
const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userData');
      setIsLoggedIn(!!token);
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.2.18:8080/api/products');
        const data = await response.json();
        await AsyncStorage.setItem('productsData', JSON.stringify(data));
        const formattedData = data.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          discount: item.discount,
          image: item.image,
          description: item.description,
          enteredDate: item.enteredDate,
          sold: item.sold,
          categoryId: item.category.categoryId,
          categoryName: item.category.categoryName,
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu sản phẩm.');
      }
    };
    
    checkLoginStatus();
    fetchProducts();
  }, []);

  // Sử dụng useMemo để tránh tính toán lại filteredProducts khi không cần thiết
  const filteredProducts = useMemo(() => {
    if (search) {
      return products.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return products;
  }, [search, products]);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  const handleSearch = (text) => {
    setSearch(text);
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
      onPress={() => navigation.navigate('ProductDetailOther', { productId: item.productId })} 
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.priceAndDiscount}>
        <Text style={styles.price}>{formatPrice(item.price)} Vnđ</Text>
        <View style={styles.discountContainer}>
        <Text style={styles.discount}>- {item.discount}%</Text>
        </View>
        </View>
        <Text style={styles.sold}>
          Đã bán {item.sold}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (products.length === 0) {
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
            <Image style={styles.imageCategory} source={Phone}/>
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
          <Text style={styles.Title}>Sản phẩm</Text>
        </View>
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId ? item.productId.toString() : Math.random().toString()}
          style={styles.flatList}
          numColumns={numColumns}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // Các style của component
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -100,
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    color: '#E95C77',
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
  titleContainer:{
    borderWidth:1,
    borderRadius:10,
    borderColor:'gray',
    padding:5,
    width:100,
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
},
discountContainer:{
  borderWidth:1,
  borderColor:'#652B37',
  paddingLeft:5,
  borderRadius:2,
  paddingRight:5,
  backgroundColor:'#652B37',
  marginLeft:5,
},
priceAndDiscount:{
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center'
}
});

export default Home;
