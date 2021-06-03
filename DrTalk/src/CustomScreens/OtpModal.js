import React, { useRef } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import OTPTextInput from 'react-native-otp-textinput';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import Color from '../assets/Color/Color';
const OptModal = (props) => {
    const { visible, generateCode,onCodeComplete} = props;
    return (

        <Modal
            isVisible={visible}
            avoidKeyboard={false}
        >
            <View style={{flex:1,justifyContent: 'center', alignItems: 'center',}}>
                <View style={styles.modalView}>
                <Text>Enter 4 digit Code</Text>
                    <OTPInputView
                        style={{ width: '60%', height: 100, }}
                        pinCount={4}
                        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged = {code => {console.log('code :'+code);}}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={styles.underlineStyleHighLighted}
                        onCodeFilled={(code) =>onCodeComplete(code)}
                    />
                    <TouchableOpacity onPress={()=>generateCode()} style={{backgroundColor:Color.primary,borderRadius:5,height:30,width:70,alignItems:'center',justifyContent:'center'}}>
                        <Text>Resend</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
};
export default OptModal;

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        height: '30%',
        width: '90%',
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    borderStyleBase: {
        width: 30,
        height: 45
      },
    
      borderStyleHighLighted: {
        borderColor: "#03DAC6",
      },
    
      underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
      },
    
      underlineStyleHighLighted: {
        borderColor: "#03DAC6",
      },
});