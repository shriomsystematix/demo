import React, { Component } from 'react';
import { View, Text, TextInput,TouchableOpacity,SafeAreaView} from 'react-native';

import firebase from 'react-native-firebase';

export default class PhoneAuthTest extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            phoneNumber: '+',
            confirmResult: null,
        };
    }


    signIn = () => {
        const { phoneNumber } = this.state;
        firebase.auth().signInWithPhoneNumber(phoneNumber)
            .then(confirmResult => {
                this.props.navigation.navigate("otpVerify",{confirmResult:confirmResult})
            })
            .catch(error => {
                alert(`Sign In With Phone Number Error: ${error.message}`)
            });
    };


    render() {
        const { phoneNumber } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ padding: 25 }}>
                    <Text>Enter phone number:</Text>
                    <TextInput
                        autoFocus
                        style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                        onChangeText={value => this.setState({ phoneNumber: value })}
                        placeholder={'Phone number ... '}
                        value={phoneNumber}
                    />
                    <TouchableOpacity style={{height:30,width:120,backgroundColor:'black',alignSelf:'center',justifyContent:'center',}} onPress={this.signIn} >
                        <Text style={{color:'white',textAlign:'center'}}>Login </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}