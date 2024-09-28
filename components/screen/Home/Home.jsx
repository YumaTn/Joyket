import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, ActivityIndicator, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { LogoIcon } from '../../../assets/icon';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.1.16:8080/api/products');
        const data = await response.json();

        const productsData = data.map(product => ({
          id: product.productId,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
        }));

        await AsyncStorage.setItem('productsData', JSON.stringify(productsData));

        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadStoredData = async () => {
      try {
        const storedProductsData = await AsyncStorage.getItem('productsData');
        if (storedProductsData) {
          const parsedData = JSON.parse(storedProductsData);
          setProducts(parsedData);
          setFilteredProducts(parsedData);
        } else {
          fetchData();
        }

        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setProfileImage(parsedData.image);
          setIsLoggedIn(true); // Set login status if user data exists
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
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
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
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
          <TouchableOpacity onPress={handleCartPress}>
            <FontAwesome
              style={{
                marginTop: 15,
                marginRight: 10
              }}
              name="opencart"
              size={24}
              color="black"
            />
          </TouchableOpacity>   
            <LogoIcon/>
        </View>
        <Text style={styles.Title}>Sản phẩm :</Text>
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
          numColumns={numColumns}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    paddingRight: 40
  },
  info: {
    fontSize: 30,
    paddingLeft: 20,
    paddingBottom: 10,
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
    borderColor: '#000000',
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
  },
  image: {
    width: cardWidth,
    height: 120,
    borderRadius: 5,
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
  description: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 15,
    marginRight: 10,
  },
});

export default Home;
