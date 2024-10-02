import { StyleSheet, Text, View } from 'react-native';
import PlashScreen from './components/screen/PlashScreen/PlashScreen';
import Navigation from './components/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import UserInfo from './components/screen/Profile/UserInfo';
import Login from './components/screen/Login/Login';
import ProductDetail from './components/screen/Home/ProductDetail';
import Cart from './components/Cart/Cart';
import Checkout from './components/Cart/Checkout';
import HistoryTrans from './components/History/HistoryTrans';
import SignUp from './components/screen/Login/SignUp';
import ForgotPassword from './components/screen/Login/ForgotPassword';
import Categorynavigation from './components/navigation/Categorynavigation'
import ResetPassword from './components/screen/Login/ResetPassword';
import Phone from './components/Category/Phone';
import Laptop from './components/Category/Laptop';
import Tivi from './components/Category/Tivi';
import Device from './components/Category/Device';
import Clock from './components/Category/Clock';
import HistoryDetail from './components/History/HistoryDetail';
import Rate from './components/Rate/Rate';
import ProductDetailOther from './components/screen/Home/ProductDetailOther';
import ChatboxAl from './components/ChatboxAI/ChatboxAl';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        style={styles.container}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="PlashScreen"
          component={PlashScreen} />
        <Stack.Screen
          name="login"
          component={Login} />
        <Stack.Screen
          name="Navigation"
          component={Navigation} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail} />
        <Stack.Screen
          name="Info"
          component={UserInfo} />
        <Stack.Screen
          name="Cart"
          component={Cart} />
        <Stack.Screen
          name="Checkout"
          component={Checkout} />
        <Stack.Screen
          name="History"
          component={HistoryTrans} />
        <Stack.Screen
          name="SignUp"
          component={SignUp} />
        <Stack.Screen
          name="forgotpassword"
          component={ForgotPassword} />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword} />
          <Stack.Screen
          name="Phone"
          component={Phone} />
          <Stack.Screen
          name="Laptop"
          component={Laptop} />
          <Stack.Screen
          name="Tivi"
          component={Tivi} />
          <Stack.Screen
          name="Device"
          component={Device} />
          <Stack.Screen
          name="Clock"
          component={Clock} />
          <Stack.Screen
          name="HistoryDetail"
          component={HistoryDetail} />
          <Stack.Screen
          name="Rate"
          component={Rate} />
          <Stack.Screen
          name="ProductDetailOther"
          component={ProductDetailOther} />
          <Stack.Screen
          name="ChatboxAl"
          component={ChatboxAl} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
