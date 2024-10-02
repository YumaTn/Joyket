import { View, Text, ActivityIndicator, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { React, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardWidth = (width - (numColumns + 1) * 10) / numColumns;

const BestSellerInDetail = ({ navigation }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://192.168.2.18:8080/api/products/bestseller');
                const data = await response.json();
                setFilteredProducts(data);
                await AsyncStorage.setItem('productsData', JSON.stringify(data));
                setLoading(false);
            } catch (error) {
                console.error(error);
                Alert.alert('Lỗi', 'Không thể tải sản phẩm');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN');
    };

    const renderItem = (item) => (
        <TouchableOpacity
            key={item.productId}
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
                <Text style={styles.sold}>Đã bán {item.sold}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.OtherProduct}>
                <Text style={styles.OtherProductTitle}>Các sản phẩm khác</Text>
            </View>
            <View style={styles.productsContainer}>
                {filteredProducts.map(renderItem)}
            </View>
        </ScrollView>
    );
};

export default BestSellerInDetail;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        width: cardWidth,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
        borderRadius: 10,
        paddingBottom: 10,
        paddingTop: 10,
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
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountContainer: {
        borderWidth: 1,
        borderColor: '#652B37',
        paddingLeft: 5,
        borderRadius: 2,
        paddingRight: 5,
        backgroundColor: '#652B37',
        marginLeft: 5,
    },
    priceAndDiscount: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    OtherProduct: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'gray',
        padding: 5,
        marginRight:240,
        backgroundColor:'white',
        alignItems: 'center',
        marginVertical: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
    },
    OtherProductTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'gray'
    },
    productsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    }
});
