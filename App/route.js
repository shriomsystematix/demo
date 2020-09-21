import React, { Component } from 'react'
import { createAppContainer, withNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Image, View } from 'react-native'

import MobileLogin from './mobilelogin'
import RegisterPage from './registerpage'
import BiometricKeychain from './biometrickeychain'
import EnableBiometric from './enablebiometric'
import AuthCheck from './authcheck'
import otpVerify from './otpverify'
import home from './home'
import Enterpin from './enterpin'
import QRcode from './QRcode'


const AppNavigator = createStackNavigator(
  
  {  

    AuthCheck:AuthCheck,  

    QRcode:QRcode,
    MobileLogin:MobileLogin,
    otpVerify:otpVerify,
    RegisterPage:RegisterPage,
    BiometricKeychain:BiometricKeychain,
    EnableBiometric:EnableBiometric,
    Enterpin:Enterpin,
    home:home
  },
  
  {
    headerMode: 'none',
  }
);



const AppStack = createAppContainer(AppNavigator)
export default class AppNavigation extends Component {
  render() {
    return (
      <AppStack />
    );
  }
}

