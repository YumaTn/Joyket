import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screen/Home/Home';
import Lastest from '../Category/Lastest'
import BestSeller from '../Category/BestSeller'
import Rated from '../Category/Rated'
const Drawer = createDrawerNavigator();

const Categorynavigation = () => {
  return (
    <Drawer.Navigator initialRouteName="Home"
    screenOptions={{
      tabBarLabelStyle: { color: 'black' },
      headerShown:false,
      tabBarStyle: {
        position: 'absolute',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: '#FFCA09',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    }}
    >
      <Drawer.Screen name="Tất cả sản phẩm" component={Home} />
      <Drawer.Screen name="Sản phẩm mới nhất" component={Lastest} />
      <Drawer.Screen name="Sản phẩm bán chạy nhất" component={BestSeller} />
      <Drawer.Screen name="Sản phẩm đánh giá tốt" component={Rated} />
    </Drawer.Navigator>
  );
};

export default Categorynavigation;
