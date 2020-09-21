/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert,View
} from 'react-native';
import AppStack from './App/route'
import firebase from 'react-native-firebase'

global.fcmToken = ''
const App = () => {

  requestPermission = async () => {
    try {
     await firebase.messaging().requestPermission();
     // User has authorised
     getFcmToken();

    } catch (error) {
      // User has rejected permissions
    }
   }

   async function checkPermission (){
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
       getFcmToken();
    } else {
       requestPermission();
    }
}

async function getFcmToken () {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      global.fcmToken=fcmToken
     console.log("fcmToken===>",fcmToken);
     
    } else {
        console.log("Failed", "No token received");
    }
   }
   


   async function messageListener  () {
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log("onNotification",notification)
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log("onNotificationOpened",notificationOpen)
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      console.log("getInitialNotification",notificationOpen)
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      alert("onMessage"+JSON.stringify(message));
    });
    
    this.onNotificationListener = firebase.notifications().onNotification((notification) => {
      if(notification){
        alert("onNotification"+JSON.stringify(notification));
      }
    });

  }
 
  
  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }

  useEffect (()=>{
   // SafeAreaView.setStatusBarHeight(0);


    checkPermission();
    messageListener();
    
  },[]);
  if (__DEV__) {
    console.log();
  }
  console.disableYellowBox = true;

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }} >
        <StatusBar barStyle="dark-content" />
          <AppStack />
      </View>
    </NavigationContainer>
  );
};
export default App;
