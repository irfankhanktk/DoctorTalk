import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
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
import Color from '../assets/Color/Color';
const image = require('../assets/images/logo.jpg');
import { widthPercentageToDP as wp, heightPercentageToDP as hp,listenOrientationChange as lor,
    removeOrientationListener as rol } from 'react-native-responsive-screen';
// E:\React_Native\DrTalk\src\images\logo.jpg

const LogIn = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [isloading, setIsloading] = useState(false);
    const [code, setCode] = useState('');
    const [isPatient, setIsPatient] = useState(false);
    const setData = async (data) => {
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
            if (isPatient) {
                const res = await postData(`${ApiUrls.patient.invitation._addPatient}`, { Pphone: contact, code: code });
                if (res.status === 200 && res.data.PPhone !== null) {
                    alert('you may sign in now');
                }
            }
            else {
                const res = await postData(`${ApiUrls.User._addUser}`, { Name: name, Phone: contact,Role:'Doctor', isApproved: false, isRejected: false });
                console.log('post res ', res);
                if (res && res.status===200) {
                    setData(res.data);
                }
                else {

                    alert('something went wrong');
                }

            }

            setIsloading(false);
        }
    };
    const onSignIn = async () => {
        // setIsShowApprove(true);

        if (contact === '') {
            alert('fill the required field');
            return;
        }
        else {
            setIsloading(true);
            const res = await getData(`${ApiUrls.auth.signIn}?Phone=${contact}`);
            console.log('res in login press :', res);

            if (res.status === 200 && res.data) {

                setData(res.data);
            }
            else {
                alert('invalid account');
            }
            setIsloading(false);
        }
    }
    const setViaLink = () => {
        setIsPatient(true);
    }
    const setSignInScreen = () => {

        setIsSignUp(false);
        setIsPatient(false);
    }
   useEffect(()=>{
    //    setTimeout(() => {
    //        setIsloading(false);
    //    }, 2000);
    return(()=>{});
   },[]);
    return (
        <ScrollView style={styles.container}>
            <CustomActivityIndicator visible={isloading}/>
            <View style={styles.ImgContainer}>
                <Image source={image} style={{ height: hp('30%'), width: wp('100%') }} />
            </View>
            <View style={styles.footer}>
                <CustomInputText setOnChangeText={(t) => setContact(t)} iconName='phone' placeholder='Mobile Number' />
                {isSignUp && (
                    <>
                        <CustomInputText setOnChangeText={(t) => setName(t)} placeholder='Name here' iconName='user' />
                        {isPatient &&
                            <CustomInputText setOnChangeText={(t) => setContact(t)} iconName='phone' placeholder='Mobile Number' />
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
                                <TouchableOpacity style={[styles.linkStyle, { marginTop: 0 }]} onPress={() => setViaLink()}>
                                    <Text style={{ color: 'blue' }}>Via Link(Patient)</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </>
                )
                }
                {!isSignUp &&
                    <>
                        <TouchableOpacity onPress={() => onSignIn()} style={{ marginTop: hp(10), width: wp('90%'), height: hp(5), backgroundColor: Color.btnPrimary, alignItems: 'center', borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#ffff', fontWeight: 'bold', fontSize: 18 }}>SignIn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkStyle} onPress={() => setIsSignUp(true)}>
                            <Text style={{ color: Color.primary }}>Create New Account</Text>
                        </TouchableOpacity>
                    </>
                }
            </View>
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
        alignItems: 'center'
    },
    linkStyle: {
        marginTop: hp(5),
        borderBottomWidth: 1,
    }
});
