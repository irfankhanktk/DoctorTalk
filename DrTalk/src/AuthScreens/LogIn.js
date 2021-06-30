import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import CustomInputText from '../CustomScreens/CustomInputText';
const { height, width } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal'
import { Sessions as s } from './Sessions'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import { ApiUrls } from '../API/ApiUrl';
import { getData, postData } from '../API/ApiCalls'
import Color from '../assets/Color/Color';
import CheckBox from '@react-native-community/checkbox';
const image = require('../assets/images/logo.jpg');
import {
    widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import OptModal from '../CustomScreens/OtpModal';
import {decryptData, encryptMyData} from '../EncrypDecrypt';
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';
// E:\React_Native\DrTalk\src\images\logo.jpg
const LogIn = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [isloading, setIsloading] = useState(false);
    const [otp, setOtp] = useState('');
    const [isPatient, setIsPatient] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [userData, setUserData] = useState();
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [code, setCode] = useState();
    const setData = async () => {
        dispatch({
            type: actions.SET_USER,
            payload: userData,
        });
        dispatch({
            type: actions.SET_TOKEN,
            payload: userData,
        });
        await AsyncStorage.setItem(s.user, JSON.stringify(userData));

        //socket.emit('auth',{name:name,contact:contact});
    }
    const generateCode = async () => {
        const otp = Math.floor(Math.random() * 10000);
        console.log('your code : ', otp);
        // alert('your code : '+otp);
        setOtp(otp)

    }

    const onSignUp = async () => {

        if (contact === '') {
            alert('fill the required field');
            return;
        }
        else {
            setIsloading(true);
            if (isPatient) {
                const res = await getData(`${ApiUrls.User._invitationCode}?Phone=${contact}&Code=${code}&name=${name}`);
                if (res.status === 200) {
                    setOtpModalVisible(true);
                    generateCode();
                    setUserData(res.data);
                    // setData();
                }
                else {
                    alert('Something went wrong');
                }
            }
            else {
                const res = await postData(`${ApiUrls.User._addUser}`, { Name: name, Phone: contact, Role: 'Doctor', isApproved: false, isRejected: false });
                if (res && res.status === 200) {
                    alert('wait for approval');
                    // setData(res.data);
                }
                else {

                    alert('something went wrong');
                }

            }

            setIsloading(false);
        }
    };
    const onCodeComplete = (code) => {
        console.log('entered:', code, otp);
        if (otp == code) {
            //   alert('successfully');
            setData();
            setOtpModalVisible(false);
        } else {
            alert('did not match');
        }
    }
    const onSignIn = async () => {
        // setIsShowApprove(true);
        dispatch({
            type: actions.SET_All_FRIENDS,
            payload: []
        });
        dispatch({
            type: actions.SET_All_REQUESTS,
            payload: []
        });
        dispatch({
            type: actions.SET_All_USERS,
            payload: []
        });
        if (contact === '') {
            alert('fill the required field');
            return;
        }
        else {
            setIsloading(true);
            const res = await getData(`${ApiUrls.auth.signIn}?Phone=${contact}`);

            if (res.status === 200 && res.data) {
                setOtpModalVisible(true);
                generateCode();
                setUserData(res.data);

            }
            else {
                alert('invalid account');
            }
            setIsloading(false);
        }
    }
  
    const setSignInScreen = () => {

        setIsSignUp(false);
        setIsPatient(false);
    }
    return (
        <ScrollView style={styles.container}>
            <CustomActivityIndicator visible={isloading}/>
            <View style={styles.ImgContainer}>
                <Image source={image} style={{ height: hp('30%'), width: wp('100%') }} />
            </View>
            <View style={styles.footer}>
                <CustomInputText setOnChangeText={(t) => setContact(t)} iconName='phone' placeholder='Mobile Number'  />
                {isSignUp && (
                    <>
                        <CustomInputText setOnChangeText={(t) => setName(t)} placeholder='Name here' iconName='user' />
                        {isPatient &&
                            <CustomInputText setOnChangeText={(t) => setCode(t)} iconName='codepen' placeholder='Invitation Code' />
                        }
                        <TouchableOpacity onPress={() => onSignUp()} style={{ marginTop: hp(10), width: wp('90%'), height: hp(5), backgroundColor: Color.btnPrimary, alignItems: 'center', borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 18 }}>SignUp</Text>
                        </TouchableOpacity>
                        <View style={{ width: '80%', marginTop: hp(5), justifyContent: 'space-between', flexDirection: 'row' }} onPress={() => setSignInScreen()}>
                            <TouchableOpacity style={[styles.linkStyle, { marginTop: 0 }]} onPress={() => setSignInScreen()}>
                                <Text style={{ color: 'blue' }}>Sign-In</Text>
                            </TouchableOpacity>
                            {isPatient ?
                                <TouchableOpacity style={[styles.linkStyle, { marginTop: 0 }]} onPress={() => setIsPatient(false)}>
                                    <Text style={{ color: 'blue' }}>Back</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity style={[styles.linkStyle, { marginTop: 0 }]} onPress={() => setIsPatient(true)}>
                                    <Text style={{ color: 'blue' }}>Via Link(Patient)</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </>
                )
                }
                {!isSignUp &&
                    <>
                        <View style={{marginTop:30,flexDirection: 'row', alignItems: 'center',width:'90%'}}>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                            />
                            <Text>Remember me</Text>
                        </View>
                        <TouchableOpacity onPress={() => onSignIn()} style={{ marginTop: hp(10), width: wp('90%'), height: hp(5), backgroundColor: Color.btnPrimary, alignItems: 'center', borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 18 }}>SignIn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkStyle} onPress={() => setIsSignUp(true)}>
                            <Text style={{ color: Color.primary }}>Create New Account</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
            <OptModal visible={otpModalVisible} generateCode={() => generateCode()} onCodeComplete={(otp) => onCodeComplete(otp)} />
        </ScrollView>

    );
};
export default LogIn;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //    width:'100%'
        // backgroundColor: '#32415e'

    },
    ImgContainer: {
        height: hp('30%'),
        width: wp('100%'),
    },
    footer: {
        height: hp('70%'),
        width: wp('100%'),
        paddingTop:40,
        alignItems: 'center'
    },
    linkStyle: {
        marginTop: hp(5),
        borderBottomWidth: 1,
    }
});
