
import Request,{uploadImage,Submit} from './request'
import firebase from 'react-native-firebase';
import axios from 'axios'
let token ;
// const API_URL = 'https://dev.1cardsolutions.com/user-service/v1/' // real
const API_URL =  'https://juxservices.dev.1cardsolutions.com/user-service/v1/' // duplicate
export default class Service {
    static Get(Urls,data,callback) {

        firebase.auth().currentUser.getIdTokenResult(true).then(
            tokendata => {
                // console.log("datadatadatadata=======>",tokendata)
            token = tokendata.token;
            
            axios.get(API_URL+Urls,{
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                redirect: 'follow'
            }).then(async (result) => {
                console.log("resultresultresult",result);
                callback({status:true,result:result});
            }).catch((error) => {
                callback({status:false,error:error})
            });
        });
    }

    static Post(Urls,data,callback) {
        firebase.auth().currentUser.getIdTokenResult(true).then(
            tokendata => {
                // console.log("datadatadatadata=======>",tokendata)
            token = tokendata.token;
            
            axios.post(API_URL+Urls, data, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                redirect: 'follow'
            }).then(async (result) => {
                console.log("resultresultresult",result);
                callback({status:true,result:result});
            }).catch((error) => {
                callback({status:false,error:error})
            });
        });
    }
    static Patch(Urls,data,callback) {
        firebase.auth().currentUser.getIdTokenResult(true).then(
            tokendata => {
                // console.log("datadatadatadata=======>",tokendata)
            token = tokendata.token;
            
            axios.patch(API_URL+Urls, data, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                redirect: 'follow'
            }).then(async (result) => {
                console.log("resultresultresult",result);
                callback({status:true,result:result});
            }).catch((error) => {
                callback({status:false,error:error})
            });
        });
    }
    static Put(Urls,data) {
        return Request.put(API_URL+Urls,data)
    }
    static Delete(Urls,data) {
        return Request.delete(API_URL+Urls,data)
    }

    static userUpdateProfile(Urls, params) {
        console.log('params==>', params);
        console.log('api==>', Urls);
        return uploadImage(API_URL+Urls,params);
    };
    
    static formSubmit(Urls, params) {
        console.log('params==>', params);
        console.log('api==>', Urls);
        return Submit(API_URL+Urls,params);
    };
}
