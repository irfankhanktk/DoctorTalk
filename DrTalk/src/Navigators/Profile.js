import React, { createRef, useState } from 'react';
const image = require('../assets/images/logo.jpg');
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useStateValue } from '../Store/StateProvider';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Appbar } from 'react-native-paper';
import ActionSheet from "react-native-actions-sheet";
// import { selectCamera, selectGallery } from '../CustomCameraAction';
import CustomHeader from '../CustomHeader';
import { getData,postData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { actions } from '../Store/Reducer';

const actionSheetRef = createRef();
const actionSheetRef2 = createRef();

const Profile = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { user } = state;
    const [selectField, setSelectField] = useState('');
    const [fieldTitle, setFieldTitle] = useState('');
    // const onCamera = async() => {
    //     const response =await selectCamera();
    //     console.log('hello resp: ',response);
    //     const res=await getData(`${ApiUrls.user._getUnfriendPatients}?user=${user}&base64=${response.base64}`)
    //     console.log('res: from api : ',res);
    // };

    // const onGallery =async() => {
    //     const response =await selectGallery();
    //     console.log('hello resp: ',response);
    //     const res=await getData(`${ApiUrls.user._getUnfriendPatients}?user=${user}&base64=${response.base64}`)
    //     console.log('res: from api : ',res);
    // }
    const onCamera = async () => {
        launchCamera({
            includeBase64: true
        }, (response) => {
            response && updateImage(response.base64);
        });
    }

    const onGallery = async () => {
        launchImageLibrary({
            includeBase64: true
        }, (response) => {
            response && updateImage(response.base64);
        });
    }
    const updateImage = async (base64) => {
        user.UImage=base64;
        console.log(user);
        const res = await postData(`${ApiUrls.user._updateImage}`,user)
        console.log('res::::',res);

        if(res&&res.data&&user.UType==='Patient')
        {
            user.UImage=res.data.PImage;
            dispatch({
                type:actions.SET_USER,
                payload:user,
            })
        }
        else if(res&&res.data&&user.UType==='Doctor')
        {
            user.UImage=res.data.DImage;
            dispatch({
                type:actions.SET_USER,
                payload:user,
            })
        }
        else if(res&&res.data&&user.UType==='Admin')
        {
            user.UImage=res.data.AImage;
            dispatch({
                type:actions.SET_USER,
                payload:user,
            })
        }
        actionSheetRef.current?.setModalVisible(false);

    }
    const rederActionSheet = (fieldTitle, fieldValue) => {
        setFieldTitle(fieldTitle);
        setSelectField(fieldValue);
        actionSheetRef2.current?.setModalVisible();
    }

    return (
        <>
            <CustomHeader navigation={navigation} />
            <View style={styles.constainer}>
                <View style={styles.profileStyle}>
                    <View style={{ bottom: -20, left: 20, zIndex: 5 }}>
                        <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible()}>
                            <Entypo name='camera' size={40} />
                        </TouchableOpacity>
                    </View>
    
                    {user && user.UImage ?
                        <Image source={{ uri: `data:image/jpeg;base64,${user.UImage}`}} style={styles.imgStyle} />
                        : <Image source={image} style={styles.imgStyle} />
                    }
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.editBox} onPress={() => rederActionSheet('Name', user && user.UName)}>
                        <View style={{ flexDirection: 'row' }}>
                            <Entypo name='user' size={25} />
                            <View style={{ left: 10 }}>
                                <Text style={styles.titleStyle}>Name</Text>
                                {user && user.UName ? <Text>{user.UName}</Text>
                                    : <Text style={styles.titleStyle}>No Name</Text>}
                            </View>
                        </View>
                        <Entypo name='edit' size={25} />
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: 'gray' }} />
                    <TouchableOpacity style={styles.editBox} onPress={() => rederActionSheet('Phone', user && user.UPhone)}>
                        <View style={{ flexDirection: 'row' }}>
                            <FontAwesome name='phone' size={25} />
                            <View style={{ left: 10 }}>
                                <Text style={styles.titleStyle}>Phone</Text>
                                {user && user.UPhone ? <Text>{user.UPhone}</Text>
                                    : <Text style={styles.titleStyle}>No Phone</Text>}
                            </View>
                        </View>
                        <Entypo name='edit' size={25} />
                    </TouchableOpacity>

                </View>
                <ActionSheet ref={actionSheetRef}>
                    <View style={{ height: 200, padding: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Photo</Text>
                        <View style={{ height: 100, alignItems: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => onGallery()}>
                                <Image source={require('../assets/images/gallery.jpg')} style={styles.imgStyle} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onCamera()}>
                                <Image source={require('../assets/images/camera.jpg')} style={styles.imgStyle} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ActionSheet>
                <ActionSheet ref={actionSheetRef2} gestureEnabled={true} bounceOnOpen animated>
                    <View style={{ height: 200, padding: 20 }}>
                        <View style={{ height: 40, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => actionSheetRef2.current?.setModalVisible(false)}>
                                <Text style={styles.btnTextStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle} onPress={() => alert('saved successfully')}>
                                <Text style={styles.btnTextStyle}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleStyle}>{fieldTitle}</Text>
                        <TextInput value={selectField} onChangeText={(t) => setSelectField(t)} style={{ borderWidth: 1 }} />
                    </View>
                </ActionSheet>
            </View>
        </>
    );
};
export default Profile;
const styles = StyleSheet.create({
    constainer: {
        flex: 1,

    },
    profileStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
    },
    imgStyle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        zIndex: -1,
        opacity: 0.8
    },
    editBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20, alignItems: 'center'
    },
    titleStyle: {
        color: 'gray'
    },
    btnStyle: {
        marginHorizontal: 10,
        backgroundColor: '#800080',
        padding: 5,
        borderRadius: 10
    },
    btnTextStyle: {
        color: '#ffffff'
    }
});