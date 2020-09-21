import React, { Component } from 'react';
import { View, Text, TextInput,TouchableOpacity,SafeAreaView} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';

const resetAction = (routeName) => StackActions.reset({
    index: 0,
    actions: ([NavigationActions.navigate({ routeName: routeName })]),
});
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class PhoneAuthTest extends Component {
    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            codeInput: '',
            confirmResult: null,
        };
    }


    confirmCode = () => {
        const { confirmResult } = this.props.navigation.state.params;
        const { codeInput } = this.state;
        console.log(confirmResult)
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    firebase.auth().currentUser.getIdTokenResult(true).then((data) => {
                        if (data.claims.isRegisteredUser == true) {
                            this.props.navigation.dispatch(resetAction('home'));
                        } else {
                            this.props.navigation.dispatch(resetAction('RegisterPage'));
                        }
    
                    });
                })
                .catch(error => {
                    alert(`Code Confirm Error: ${error.message}`)
                });
        }
    };

    render() {
        const { codeInput } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>

                <View style={{ marginTop: 25, padding: 25 }}>
                    <Text>Enter verification code below:</Text>
                    <TextInput
                        autoFocus
                        style={{ height: 40, marginTop: 15, marginBottom: 15 }}
                        onChangeText={value => this.setState({ codeInput: value })}
                        placeholder={'Code ... '}
                        maxLength={6}
                        value={codeInput}
                    />
                    <TouchableOpacity style={{height:30,width:120,backgroundColor:'black',alignSelf:'center',justifyContent:'center',}} onPress={this.confirmCode} >
                        <Text style={{color:'white',textAlign:'center'}}>Confirm Code  </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}