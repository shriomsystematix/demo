import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, AsyncStorage ,Dimensions} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import API from './api/Service'
import URLS from './api/urls';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain'
import DeviceInfo from 'react-native-device-info';
import ReactNativeBiometrics from 'react-native-biometrics'
const {width,height} = Dimensions.get('window')

const resetAction = (routeName) => StackActions.reset({
    index: 0,
    actions: ([NavigationActions.navigate({ routeName: routeName })]),
});


export default class PhoneAuthTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeInput: '',
            confirmResult: null,
            payload: '',
            signature: '',
            supportedSensorName:'',
            enterpinffocus:false,
            
        };
        
        // this.checkSupport();
        this.authCheck();
    }

     checkSupport() {
        ReactNativeBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject;
                if (available && biometryType === ReactNativeBiometrics.TouchID) {
                    //this.authCheck();
                    this.setState({supportedSensorName:'TouchID'})
                } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                    //this.authCheck();
                    this.setState({supportedSensorName:'FaceID'})
                } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                    //this.authCheck();
                    this.setState({supportedSensorName:'Biometrics'})
                } else {
                    // alert('Biometrics not supported')
                    this.setState({enterpinffocus:true})
                    // this.props.navigation.dispatch(resetAction("home"));
                }
            })
    }

    verifySignatureWithServer(sign, payload, juxUserId) {
        sendData = {
            "signedSignature": sign
        }
        API.Post(URLS.getExisitingUser + juxUserId + '/signin', JSON.stringify(sendData), (Response) => {
            alert("RESPONCE:-  " + JSON.stringify(Response))
            if (Response.status) {
                this.props.navigation.dispatch(resetAction("home"));
            } else {
                this.setState({enterpinffocus:true})
                // alert(`Error: Sorry, authtentication failed. Use the PIN you setup for the app to login `)
            }
        })
    };

    authCheck() {
        ReactNativeBiometrics.biometricKeysExist()
            .then((resultObject) => {
                const { keysExist } = resultObject
                if (keysExist) {
                    // alert(keysExist)
                    firebase.auth().currentUser.getIdTokenResult(true).then(data => {
                        let payload = data.claims.user_id;
                        ReactNativeBiometrics.createSignature({
                            promptMessage: 'Sign in',
                            payload: payload
                        }).then((resultObject) => {
                                const { success, signature } = resultObject;
                                if (success) {
                                    console.log(signature)
                                    this.setState({ payload: payload, signature: signature })
                                    this.verifySignatureWithServer(signature, payload, data.claims.juxUserId)
                                }else{
                                    alert('signature not createds')
                                }
                            })
                    });
                } else {
                    this.setState({enterpinffocus:true})
                    // alert('Keys do not exist or were deleted')
                }
            })
    }

    confirmCode = () => {
        if (this.state.codeInput.length > 4) {
            firebase.auth().currentUser.getIdTokenResult(true).then((data) => {
                let hashValue = {
                    "currentPasscode": this.state.codeInput
                }
                API.Post(URLS.getExisitingUser + data.claims.juxUserId + URLS.signIn, JSON.stringify(hashValue), (Response) => {
                    console.log("ResponseResponseResponse=>>>>", Response)
                    if (Response.status) {
                        this.props.navigation.dispatch(resetAction("home"));
                    }
                    else {
                        alert("Please enter correct pin!");
                    }
                });
            })
        }

    };

    render() {
        const { codeInput, payload, signature } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ marginTop: 25, padding: 25 }}>
                    <Text>Enter passcode</Text>
                    <TextInput
                        autoFocus = {this.state.enterpinffocus}
                        style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                        onChangeText={value => this.setState({ codeInput: value })}
                        placeholder={'Code ... '}
                        maxLength={5}
                        value={codeInput}
                    />
                    <TouchableOpacity style={{ height: 30, width: 120, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', marginBottom: 20 }} onPress={() => this.confirmCode()} >
                        <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
                    </TouchableOpacity>
                    {payload.length > 0 && <>
                        <Text>Payload</Text>
                        <TextInput
                            style={{ height: 40, marginTop: 15, marginBottom: 15,width:width*0.85 }}
                            value={payload}
                        />
                        <Text>Signature</Text>
                        <TextInput
                            style={{ height: 40, marginTop: 15, marginBottom: 15,width:width*0.85 }}
                            value={signature}
                        />
                    </>}

                </View>
            </SafeAreaView>
        );
    }
}