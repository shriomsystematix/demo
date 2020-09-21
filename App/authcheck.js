import React, { useEffect, useState } from 'react';
import { View, AsyncStorage,Linking } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen';
 

const resetAction = (routeName) => StackActions.reset({
    index: 0,
    actions: ([NavigationActions.navigate({ routeName: routeName })]),
});
global.status = "";
let authFlag = false;
const Authcheck = ({ navigation }) => {
    function onAuthStateChange() {
        return firebase.auth().onAuthStateChanged(user => {
            if (user != null && authFlag == false) {
                authFlag = true;
                    firebase.auth().currentUser.getIdTokenResult(true).then((data) => {
                        if (data.claims.isRegisteredUser == true) {
                            navigation.dispatch(resetAction('Enterpin'));
                        } else {
                            navigation.dispatch(resetAction('RegisterPage'));
                        }

                    });
            }
        });
      }

    // Handle user state changes
    useEffect(() => {
        SplashScreen.hide();
        // firebase
        // .config()
        // .getValue("app_config")
        // .then(data => {
        //     console.log("data => ", data.val());
        // });
        firebase
        .config()
        .fetch()
        .then(() => firebase.config().activateFetched())
        .then(activated => {
          if (!activated) console.log('Fetched data not activated');
          return firebase.config().getValue('app_config');
        })
        .then(snapshot => {
          console.log('LOG ==> ', snapshot.val()); 
        })
        .catch(console.error);
        const unsubscribe = onAuthStateChange();
        return () => {
          unsubscribe();
        };
        
    }, []);

    useEffect(()=>{
        Linking.getInitialURL().then((url) => {
            if(url != null){
                console.log('1', url);
                let regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match
                while ((match = regex.exec(url))) {
                params[match[1]] = match[2]
                //   console.log(match[1], match[2])
                }
                const { transactionId, transactionStatus,transactionType } = params
                console.log(transactionId, transactionStatus,transactionType)
                global.status = transactionStatus;
            }
           
        });

        const callback = (event) => { 
             var url =  event.url;
             if(url != null){
                console.log('1', url);
                let regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match
                while ((match = regex.exec(url))) {
                params[match[1]] = match[2]
                //   console.log(match[1], match[2])
                }
                const { transactionId, transactionStatus,transactionType } = params
                console.log(transactionId, transactionStatus,transactionType)
                global.status = transactionStatus;
            }
        };
        Linking.addEventListener('url', callback);
    },[]);

     useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user == null) {
                navigation.dispatch(resetAction('MobileLogin'));
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
        </View>
    )
}

export default Authcheck;