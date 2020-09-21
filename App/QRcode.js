import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Picker, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
const { width, height } = Dimensions.get('window')
import Barcode from "react-native-barcode-builder";
import QRCode from 'react-native-qrcode-svg';
import { ScrollView } from 'react-native-gesture-handler';
let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';
export default class PhoneAuthTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrValue: '',
            show: false,
            codetype: "CODE128"
        };
        // this.checkSupport();s
    }

    render() {
        const { qrValue, payload, signature } = this.state;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "white",  }}>
                <ScrollView style={{alignSelf:'center',flex:1}}>
                <View style={{flex:1, padding: 15 ,alignSelf: "center",justifyContent:'center'}}>
                    <TextInput
                        autoFocus={this.state.enterpinffocus}
                        style={{ height: 40, marginTop: 15, marginBottom: 15, width: width * 0.90, backgroundColor: "#edf1f5", borderRadius: 6, textAlign: "center" }}
                        onChangeText={value => this.setState({ qrValue: value, show: false })}
                        placeholder={'Enter value of QR/Barcode'}
                        value={qrValue}
                    />
                    <View style={{ flexDirection: "row", justifyContent: 'space-around', margin: 20 }}>
                        <Picker
                            selectedValue={this.state.codetype}
                            style={{ height: 40, width: width * 0.43, }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ codetype: itemValue })
                            }>
                            <Picker.Item label="CODE128" value="CODE128" />
                            <Picker.Item label="EAN" value="EAN" />
                            <Picker.Item label="CODE39" value="CODE39" />
                            <Picker.Item label="ITF" value="ITF" />
                            <Picker.Item label="MSI" value="MSI" />
                            <Picker.Item label="Pharmacode" value="Pharmacode" />
                            <Picker.Item label="Codabar" value="Codabar" />
                        </Picker>
                        <TouchableOpacity disabled={qrValue.length>0?false:true} onPress={() => this.setState({ show: true })} style={{ justifyContent: 'center', backgroundColor: "#1666ec", width: width * 0.43, height: 40, borderRadius: 6 }}>
                            <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>genrate</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.show  &&
                        <View style={{justifyContent:'space-between',flexDirection:"column"}}>
                            <View style={{alignSelf:'center',width:width*0.90,marginTop:70}}>
                                <Barcode width={1.5} value={this.state.qrValue} format={this.state.codetype} />
                            </View>
                           
                            <View style={{alignSelf:'center',marginTop:70}}>
                                <QRCode
                                    value={this.state.qrValue}
                                    logo={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRpIenI_781esNrq_L85dQqmDqCaoWtr49a_PCdT1-7-IPSeyDZ&usqp=CAU" }}
                                    logoSize={200}
                                    size={200}
                                    logoBackgroundColor='transparent'
                                />
                            </View>
                            
                        </View>
                    }
                 

                </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}