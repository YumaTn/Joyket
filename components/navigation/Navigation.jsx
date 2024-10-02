import React from 'react';
import Noti from '../screen/Notification/Noti.jsx';
import Profile from '../screen/Profile/Profile.jsx';
import SCREENS from './index.jsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Favorite from '../screen/Favorite/Favorite.jsx';
import Ionicons from '@expo/vector-icons/Ionicons';
import Categorynavigation from './Categorynavigation.jsx';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const Tab = createBottomTabNavigator();

const Navigation = () => { 
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { color: 'black' },
        headerShown:false,
        tabBarStyle: {
          position: 'absolute',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: '#ffffff',
          shadowColor: '#CCCCCC',
          paddingTop:5,
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
      <Tab.Screen
        name={SCREENS.HOME}
        component={Categorynavigation}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => ( 
            <Ionicons 
            name={focused ? "home" : "home-outline"} // Đổi icon khi nhấn
            size={24}
            color={focused ? "#FFCA09" : "black"}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.FAVORITE}
        component={Favorite}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons 
            name={focused ? "heart" : "cards-heart-outline"} // Đổi icon khi nhấn
            size={24}
            color={focused ? "#FFCA09" : "black"}
            
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name={SCREENS.NOTIFICATION}
        component={Noti}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="notifications" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      /> */}
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={Profile}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Ionicons
        name={focused ? "person" : "person-outline"} // Đổi icon khi nhấn
        size={24}
        color={focused ? "#FFCA09" : "black"} // Đổi màu icon khi nhấn
      />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Navigation;
