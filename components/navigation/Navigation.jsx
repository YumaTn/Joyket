import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Home from '../screen/Home/Home.jsx';
import Noti from '../screen/Notification/Noti.jsx';
import Profile from '../screen/Profile/Profile.jsx';
import SCREENS from './index.jsx';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Favorite from '../screen/Favorite/Favorite.jsx';

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
      <Tab.Screen
        name={SCREENS.HOME}
        component={Home}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="home" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.FAVORITE}
        component={Favorite}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="favorite" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.NOTIFICATION}
        component={Noti}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="notifications" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.PROFILE}
        component={Profile}
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <Icon name="person" size={30} color={focused ? 'white' : 'black'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
 
export default Navigation;

