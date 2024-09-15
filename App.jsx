import { StyleSheet, Text, View } from 'react-native';
import PlashScreen from './components/screen/PlashScreen/PlashScreen';
import Navigation from './components/navigation/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Detail from './components/screen/Home/Detail';
import UserInfo from './components/screen/Profile/UserInfo';
import Login from './components/screen/Login/Login';

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
          name="Detail"
          component={Detail} />
          <Stack.Screen
          name="Info"
          component={UserInfo} />
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
