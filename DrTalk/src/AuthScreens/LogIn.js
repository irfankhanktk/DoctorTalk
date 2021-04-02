import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import CustomInputText from '../CustomScreens/CustomInputText';
const { height, width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal'
import { Sessions as s } from './Sessions'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import { CustomActivityIndicator } from '../CustomActivityIndicator';
import { ApiUrls } from '../API/ApiUrl';
import { getData, postData } from '../API/ApiCalls'
const image = require('../assets/images/logo.jpg');
// E:\React_Native\DrTalk\src\images\logo.jpg

const LogIn = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [isloading, setIsloading] = useState(false);
    const [code, setCode] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const setData = async (data) => {
        // console.log('data    :', data);
        dispatch({
            type: actions.SET_USER,
            payload: data,
        });
        dispatch({
            type: actions.SET_TOKEN,
            payload: data,
        });
        await AsyncStorage.setItem(s.user, JSON.stringify(data));

        //socket.emit('auth',{name:name,contact:contact});
    }
    const onSignUp = async () => {

        if (contact === '') {
            alert('fill the required field');
            // console.log('code :', code);
            return;
        }
        else {
            setIsloading(true);
            if (code === '') {
               
                const res = await postData(`${ApiUrls.doctor._addDoctor}`, { DName: name, DPhone: contact, isApproved: false, isReject: false });
                console.log('post res ', res);
                if (res && res.data !== 'null') {
                    setData(res.data);  
                }
                else {
                   
                    alert('something went wrong');
                }

            }
            else {
                const res = await postData(`${ApiUrls.patient.invitation._addPatient}`, { Pphone: contact, code: code });
                if (res.status === 200 && res.data.PPhone !== null) {
                    alert('you may sign in now');
                }
            }
            setIsloading(false);
        }
    };
    const onsignIn = async () => {
        // setIsShowApprove(true);

        if (contact === '') {
            alert('fill the required field');
            return;
        }
        else {
            setIsloading(true);
            const res = await getData(`${ApiUrls.auth.getUserIfExist}?uphone=${contact}`);
            // console.log('res in login press :', res);

            if (res && res.data !== 'null') {
                setData(res.data);  
            }
            else{
                alert('invalid account');
            }
            setIsloading(false);
        }
    }

    return (
        <View style={styles.container}>

            <CustomActivityIndicator visible={isloading} />
            <View style={styles.header}>
                <Image source={image} style={{ height: 100, width: 100, borderRadius: 50, bottom: 80 }} />
                <View style={{ width: width, alignItems: 'center', height: '40%', }}>
                    {isSignUp && (
                        <CustomInputText setOnChangeText={(t) => setName(t)} placeholder='Name here' iconName='user' />
                    )}
                    <CustomInputText setOnChangeText={(t) => setContact(t)} iconName='phone' placeholder='Mobile Number' />
                </View>
            </View>
            {isSignUp ? (<View style={{ height: '50%', width: width, alignItems: 'center', }}>
                <TouchableOpacity onPress={() => onSignUp()} style={{ marginTop: 20, width: '90%', marginHorizontal: 10, height: 40, backgroundColor: 'blue', alignItems: 'center', borderRadius: 20, justifyContent: 'center' }}>
                    <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 18 }}>Sign Up</Text>
                </TouchableOpacity>
                <View style={{ width: '80%', marginTop: 40, justifyContent: 'space-between', flexDirection: 'row' }} onPress={() => setIsSignUp(false)}>
                    <TouchableOpacity onPress={() => setIsSignUp(false)}>
                        <Text style={{ color: 'blue' }}>Sign-In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={{ color: 'blue' }}>Sign-Up Via Link</Text>
                    </TouchableOpacity>

                </View>
            </View>) :
                (<View style={{ height: '50%', width: width, alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => onsignIn()} style={{ marginTop: 40, width: '90%', height: 40, backgroundColor:'#7B39ED', marginHorizontal: 20, alignItems: 'center', borderRadius: 20, justifyContent: 'center' }}>
                        <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 18 }}>LogIn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 40, }} onPress={() => setIsSignUp(true)}>
                        <View style={{ borderBottomWidth: 1, backgroundColor: '1177bb' }}>
                            <Text style={{ color: 'blue' }}>Create New Account</Text>
                        {/* jkdkflk */}
                        </View>
                    </TouchableOpacity>
                </View>
                )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                onBackdropPress={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Enter 4 digit Code</Text>
                        <TextInput onChangeText={(t) => setCode(t)} maxLength={4} style={{ paddingLeft: 10, borderBottomWidth: 2, width: '25%', }} />
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
};
export default LogIn;
const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        // backgroundColor: '#32415e'
    },
    header: {
        height: '50%',
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    centeredView: {
        height: height * 0.50,
        width: width * 0.80,
        justifyContent: 'center',
        margin: 20,
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: '#e7e7e7',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        top: 10,
        width: '50%',
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
