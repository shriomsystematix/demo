import React, { Component } from 'react';
import { View, Text, SafeAreaView,TouchableOpacity } from 'react-native';
import API from './api/Service'
import URLS from './api/urls';
import DeviceInfo from 'react-native-device-info';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';

const resetAction = (routeName) => StackActions.reset({
    index: 0,
    actions: ([NavigationActions.navigate({ routeName: routeName })]),
});

export default class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            codeInput: '',
            confirmResult: null,
        };
    }


    Register = () => {
        firebase.auth().currentUser.getIdTokenResult(true).then(data =>{
            var senddata = {
                "firstName": "test",
                "lastName": "test test",
                "phoneNumber": data.claims.phone_number,
                "email": "testing@mailinator.com",
                "dateOfBirth": "1982-04-01",
                "country": "UK",
                "postcode": "GH1 1DF",
                "city": "London",
                "addressLine1": "16 something",
                "addressLine2": "testing test",
                "bankAccount": {
                    "bankProviderId": "testing",
                    "accountNumber": "12312312",
                    "sortCode": "201213"
                },
                "device": {
                    "deviceId": DeviceInfo.getUniqueId(),
                    "registrationToken":  global.fcmToken
                },
                "passCode": "11111",
            }
            API.Post(URLS.Register, JSON.stringify(senddata), (Response) => {
            
                console.log("ResponseResponseResponse=>>>>", Response)
                if (Response.status) {
                    this.props.navigation.dispatch(resetAction("EnableBiometric"));
                } else {
                    alert(`Error: ${Response.error.message}`)
                }
            })
        });
    };

    render() {
        const { codeInput } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ marginTop: 25, padding: 25 }}>
                    <TouchableOpacity style={{height:30,width:120,backgroundColor:'black',alignSelf:'center',justifyContent:'center',}} onPress={this.Register} >
                        <Text style={{color:'white',textAlign:'center'}}>Register</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}



