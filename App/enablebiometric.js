import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, AsyncStorage, ScrollView, BackHandler, Alert } from 'react-native';
import TouchID from 'react-native-touch-id';
import ReactNativeBiometrics from 'react-native-biometrics'
import DeviceInfo from 'react-native-device-info';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import API from './api/Service'
import URLS from './api/urls';
import { TextInput } from 'react-native-gesture-handler';

const resetAction = (routeName) => StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: routeName })],
});

const EnableBiometric = ({ navigation }) => {
    const optionalConfigObject = {
        title: 'Authentication Required', // Android
        imageColor: '#e00606', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Touch sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android,
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: true, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    const [btnEnabled, setBtnEnabled] = useState(false);
    const [supportedSensorName, setSupportName] = useState('')
    const [publickey, setPublickey] = useState('')

    useEffect(() => {
        checkSupport()
    }, [])

    function checkSupport() {
        ReactNativeBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject;
                if (available && biometryType === ReactNativeBiometrics.TouchID) {
                    setSupportName('TouchID')
                } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                    setSupportName('FaceID')
                } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                    setSupportName('Biometrics')
                } else {
                    alert('Biometrics not supported')
                    this.props.navigation.dispatch(resetAction("home"));
                }
            })
    }

    function sendPublicKeyToServer(params,juxUserId) {
        var sendData = {
            "deviceBrand": DeviceInfo.getBrand(),
            "deviceModel": DeviceInfo.getModel(),
            "biometricPublicKey": params,
            "deviceId": DeviceInfo.getUniqueId(),
            "registrationToken":  global.fcmToken
        }
        API.Post(URLS.getExisitingUser + juxUserId + '/device', JSON.stringify(sendData), (Response) => {
            alert(JSON.stringify(Response))
            if (Response.status) {
                alert("send Public Key To Server done");
                navigation.dispatch(resetAction("home"))
            } else {
                ReactNativeBiometrics.deleteKeys()
                .then((resultObject) => {
                    const { keysDeleted } = resultObject;
                    if (keysDeleted) {
                    alert('Successful deletion')
                    } else {
                    alert('Unsuccessful deletion because there were no keys to delete')
                    }
                })
                alert(`Error: ${Response.error.message}`)
            }
        })
    }

    function _touchSupportChheck(toggleButtonState) {
        firebase.auth().currentUser.getIdTokenResult(true).then(data => {
            ReactNativeBiometrics.createKeys()
                .then((resultObject) => {
                    const { publicKey } = resultObject
                    console.log(publicKey)
                    setPublickey(publicKey)
                    sendPublicKeyToServer(publicKey,data.claims.juxUserId)
                }).catch(error => {
                    alert(error)
                });
        })
    }

    return (
        <View style={styles.containerStyle}>
            <Text style={{ textAlign: 'center', alignSelf: "center" }} > {supportedSensorName} </Text>

            <TouchableOpacity style={{ height: 30, width: 270, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', marginTop: 40 }} onPress={() => _touchSupportChheck()} >
                <Text style={{ color: 'white', textAlign: 'center' }}>Enable Biometric</Text>
            </TouchableOpacity>

            <TextInput 
                value={publickey}
                style={{ height: 40, marginTop: 15, marginBottom: 15 }}
            />
            <TouchableOpacity
                
                onPress={() => { navigation.dispatch(resetAction("home")) }}
                style={ { backgroundColor: publickey.length ? 'black' : 'grey' ,height:30,width:270,alignSelf:'center',justifyContent:'center',marginTop:40}}>
                <Text style={[styles.btnTextStyle,]}>
                    <Text style={{color:'white',textAlign:'center',alignSelf:'center'}}>next</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );

}


export default EnableBiometric;
const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    }
})  