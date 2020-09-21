import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, AppState, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import ReactNativeBiometrics from 'react-native-biometrics'
import DeviceInfo from 'react-native-device-info';
import API from './api/Service'
import URLS from './api/urls';


const resetAction = (routeName) => StackActions.reset({
  index: 0,
  actions: ([NavigationActions.navigate({ routeName: routeName })]),
});

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
    };
  }

  _handleAppStateChange = nextAppState => {
    if (global.status != "") {
      Alert.alert(
        "",
        global.status,
        [

          { text: "OK", onPress: () => { global.status = ""; } }
        ],
        { cancelable: false }
      );
    }
  }

  componentDidMount() {
    if (global.status != "") {
      Alert.alert(
        "",
        global.status,
        [

          { text: "OK", onPress: () => { global.status = ""; } }
        ],
        { cancelable: false }
      );
    }

    this.appstatelistner = AppState.addEventListener('change', this._handleAppStateChange);
    this.Authstatchnage = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      }
    });

  }
  sendPublicKeyToServer(params, juxUserId) {
    var sendData = {
      "deviceBrand": DeviceInfo.getBrand(),
      "deviceModel": "test",
      "biometricPublicKey": params,
      "deviceId": DeviceInfo.getUniqueId(),
      "registrationToken": global.fcmToken
    }
    API.Post(URLS.getExisitingUser + juxUserId + '/device', JSON.stringify(sendData), (Response) => {
      alert(JSON.stringify(Response))
      if (Response.status) {
        alert("send Public Key To Server done")
      } else {
        alert(`Error: ${Response.error.message}`)
      }
    })
  }

  componentWillUnmount() {

    AppState.removeEventListener('change', this._handleAppStateChange);
    if (this.Authstatchnage) this.Authstatchnage();
  }

  signOut = () => {
    // AsyncStorage.setItem("logout",'true');
    this.props.navigation.dispatch(resetAction("Enterpin"));
  }

  render() {
    const { user } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>

        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 25 }}>Signed In!</Text>
            <Text>{JSON.stringify(user)}</Text>
            <TouchableOpacity style={{ height: 30, width: 120, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', marginTop: 40 }} onPress={this.signOut} >
              <Text style={{ color: 'white', textAlign: 'center' }}>Logout </Text>
            </TouchableOpacity> 
            <TouchableOpacity style={{ height: 30, width: 200, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', marginTop: 40 }} onPress={() => { this.props.navigation.navigate("QRcode") }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>QR Code </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{ height: 30, width: 200, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', marginTop: 40 }} onPress={() => { this.props.navigation.navigate("BiometricKeychain") }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>BiometricKeychain </Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={{ height: 30, width: 200, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', marginTop: 40 }} onPress={() => {
              firebase.auth().currentUser.getIdTokenResult(true).then(data => {
                ReactNativeBiometrics.createKeys()
                  .then((resultObject) => {
                    const { publicKey } = resultObject
                    console.log(publicKey)
                    this.sendPublicKeyToServer(publicKey, data.claims.juxUserId)
                  }).catch(error => {
                    alert(error)
                  });
              });
            }}>
              <Text style={{ color: 'white', textAlign: 'center' }}>createKeys </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }
}