import React, { Component } from 'react';
import { View, Text, TouchableOpacity,SafeAreaView,Alert,AppState} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import * as Keychain from 'react-native-keychain'
import DeviceInfo from 'react-native-device-info'
import firebase from 'react-native-firebase'

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
    };
  }

  
  componentDidMount() {
    // firebase.auth().currentUser.getIdTokenResult(true).then((data) => {
    //   console.log("datatatata111111==>", data)
    // });
   
  }

  setGenericPasswordwithoutAuth=()=>{
    Keychain.setGenericPassword('Test', '11111').then(result=>{
        alert(JSON.stringify(result))
    }).catch(error =>{
        alert(JSON.stringify(error))
    })
  }

  setGenericPasswordwithAuth=()=>{
    Keychain.setGenericPassword('Test', '11111',{ service: "uk.co.juxapp.testapp",accessControl: 'BiometryAny', accessible: 'AccessibleWhenPasscodeSetThisDeviceOnly',}).then(result=>{
        alert(JSON.stringify(result))
    }).catch(error =>{
        alert(JSON.stringify(error))
    })
  }

  async getgenericPasswordwithoutAuth() {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      alert('Credentials successfully loaded for user ' + JSON.stringify(credentials) );
    } else {
      alert('No credentials stored')
    }
  } 

  getgenericPasswordwithAuth() {
   Keychain.getGenericPassword({ service: "uk.co.juxapp.testapp"}).then((credentials=>{
      if (credentials) {
        alert('Credentials successfully loaded for user ' + JSON.stringify(credentials) );
      } else {
        alert('No credentials stored')
      }
    }))
    
  } 
  
//   async setgetInternetCredentials() {
//     const username = 'adhithi';
//     const password = 'poniesRgr8';
//     const server = DeviceInfo.getBundleId()
  
//     // Store the credentials
//     await  Keychain.setInternetCredentials(server, username, password).then(() => {
  
//       // Retreive the credentials
//         Keychain.getInternetCredentials(server).then((credentials)=>{
//             if (credentials) {
//                 alert('Credentials successfully loaded for user ' + JSON.stringify(credentials) );
//             } else {
//                 alert('No credentials stored')
//             }
//         })
//     } )
// }

  render() {
    const { user } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>

          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              flex: 1,
            }}
          >
           
            <TouchableOpacity style={{height:30,width:270,marginBottom:20,backgroundColor:'black',alignSelf:'center',justifyContent:'center',marginTop:40}} onPress={()=>this.setGenericPasswordwithoutAuth()} >
                <Text style={{color:'white',textAlign:'center'}}>set Generic Password without Auth </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{height:30,width:270,backgroundColor:'black',alignSelf:'center',justifyContent:'center',marginTop:40}} onPress={()=> this.getgenericPasswordwithoutAuth()} >
                <Text style={{color:'white',textAlign:'center'}}>get generic Password without Auth </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{height:30,width:270,marginBottom:20,backgroundColor:'black',alignSelf:'center',justifyContent:'center',marginTop:40}} onPress={()=>this.setGenericPasswordwithAuth()} >
                <Text style={{color:'white',textAlign:'center'}}>set Generic Password with Auth </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{height:30,width:270,backgroundColor:'black',alignSelf:'center',justifyContent:'center',marginTop:40}} onPress={()=> this.getgenericPasswordwithAuth()} >
                <Text style={{color:'white',textAlign:'center'}}>get generic Password with Auth </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{height:30,width:270,backgroundColor:'black',alignSelf:'center',justifyContent:'center',marginTop:40}} onPress={()=> this.setgetInternetCredentials()} >
                <Text style={{color:'white',textAlign:'center'}}>set get Internet Credentials </Text>
            </TouchableOpacity> */}
            
          </View>
      </SafeAreaView>
    );
  }
}