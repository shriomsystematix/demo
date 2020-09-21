// HTTP Request file
import axios from 'axios'
import {DeviceEventEmitter} from 'react-native'
import firebase from 'react-native-firebase';

const httpConfig = {
  baseURL: '',
  headers: {},
  responseType: 'json',
}

const Request = axios.create(httpConfig)

/* eslint-disable no-underscore-dangle */

function InterceptorsRequest(config) {
  config.headers['Content-Type'] = 'application/json'
  config.headers['Accept'] = 'application/json'
  
  firebase.auth().currentUser.getIdTokenResult(true).then(
    data => {
      // console.log("data.token===>",data.token)
    config.headers['Authorization'] = "Bearer "+data.token;
  })
 
  console.log('API_REQUEST:', config)
  return config
}


const _handleCommonError = (errorResponse) => {
  // TODO: Handle Error
  if (errorResponse.message) {
  }
}

const _interceptorsResponseError = (error) => {
  switch (error.status) {
    case 401:
        DeviceEventEmitter.emit('callLogoutMethod',  {})  
        break
    default:
        _handleCommonError(error)
        break
  }
}

// Add a request interceptor
Request.interceptors.request.use(
  (config) => {
    return InterceptorsRequest(config)
  },
  (error) => {
    console.log('API_REQUEST_ERROR:', error)
    return Promise.reject(error.response)
  },
)

// Add a response interceptor
Request.interceptors.response.use(
  (response) => {
    console.log('API_RESPONSE:', response)
    return response
  },
  (error) => {
    console.log('API_RESPONSE_ERROR', JSON.stringify(error.response.data))
    _interceptorsResponseError(error.response)
    return Promise.reject(error)
  },
)

export default Request
