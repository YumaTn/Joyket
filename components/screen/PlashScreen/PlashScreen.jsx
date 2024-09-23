import React, { useEffect } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import loader from '../../../loader.json';

const PlashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Navigation');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <LottieView
        source={loader}
        autoPlay
        loop
        resizeMode="contain"
        style={{ width: 400, height: 400 }}
      />
    </View>
  );
};

export default PlashScreen;
