import React, { createRef, useState } from 'react';
const image = require('../assets/images/logo.jpg');
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useStateValue } from '../Store/StateProvider';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Appbar } from 'react-native-paper';
import ActionSheet from "react-native-actions-sheet";
// import { selectCamera, selectGallery } from '../CustomCameraAction';
import CustomHeader from '../CustomHeader';
import { getData, postData, postFormData } from '../API/ApiCalls';
import { ApiUrls, getImageUrl } from '../API/ApiUrl';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { actions } from '../Store/Reducer';
import Gallery from '../assets/icons/gallery.svg';
import Camera from '../assets/icons/camera.svg';
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';
import Color from '../assets/Color/Color';
const actionSheetRef = createRef();
const actionSheetRef2 = createRef();

const EditProfile = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { user } = state;
    const [selectField, setSelectField] = useState('');
    const [fieldTitle, setFieldTitle] = useState('');
    const [loading, setLoading] = useState(false);
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
            // includeBase64: true
        }, (response) => {
            response && updateImage(response);
        });
    }

    const onGallery = async () => {
        launchImageLibrary({
            // includeBase64: true
        }, (response) => {
            response && updateImage(response);
        });
    }
    const updateImage = async (file) => {
        setLoading(true);
        const fileToUpload = file;
        const body = new FormData();
        console.log('filetoupload: ', fileToUpload);
        //   data.append('name', 'Image Upload');
        body.append('img', { uri: fileToUpload.uri, name: fileToUpload.fileName, type: fileToUpload.type });
        // body.append('Phone','03457266093');
        // body.append('Name','iRFAN kHAN');
        // body.append('Role','DOCTOR');
        // body.append('Status','Online');
        actionSheetRef.current?.setModalVisible(false);
        const resp = await postFormData(`${ApiUrls.User._postImage}?Phone=${user.Phone}`, body);
        console.log('resp', resp);
        // user.Image=base64;
        // console.log(user);
        // const res = await postData(`${ApiUrls.User._updateImage}`,user)
        // console.log('res::::',res);

        if (resp.status === 200) {
            user.Image = resp.data;
            dispatch({
                type: actions.SET_USER,
                payload: user,
            });
        } else {
            throw new Error('Something went wrong ');
        }


        setLoading(false);


    }
    const rederActionSheet = (fieldTitle, fieldValue) => {
        setFieldTitle(fieldTitle);
        setSelectField(fieldValue);
        actionSheetRef2.current?.setModalVisible();
    }
    const updateName=async()=>{
        actionSheetRef2.current?.setModalVisible(false);
        if(selectField.length<=0){
            alert("fill the field properly");
            return;
        }
        setLoading(true);
        const res=await getData(`${ApiUrls.User._updateName}?Phone=${user?.Phone}&Name=${selectField}`);
        if(res.status===200){
            user.Name=res?.data?.Name;
            dispatch({
                type: actions.SET_USER,
                payload: user,
            });
          alert('Saved Successfully');
          
        }else{
            alert('Failed To Save Changes');
        }
        setLoading(false);
    }

    return (
        <>
            <CustomHeader navigation={navigation} />
            <CustomActivityIndicator visible={loading} />

            <View style={styles.constainer}>
                <View style={[styles.profileStyle,]}>

                    <View>
                        <ImageBackground source={user?.Image ? { uri: getImageUrl() + user.Image } : image} style={[styles.imgStyle, { overflow: 'hidden' }]} >
                        </ImageBackground>
                        <View style={{ top: -25, left: 50, zIndex: 10001, position: 'absolute', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => actionSheetRef.current?.setModalVisible()}>
                                <Entypo name='camera' size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.editBox} onPress={() => rederActionSheet('Name', user && user.Name)}>
                        <View style={{ flexDirection: 'row' }}>
                            <Entypo name='user' size={25} />
                            <View style={{ left: 10 }}>
                                <Text style={styles.titleStyle}>Name</Text>
                                {user && user.Name ? <Text>{user.Name}</Text>
                                    : <Text style={styles.titleStyle}>No Name</Text>}
                            </View>
                        </View>
                        <Entypo name='edit' size={25} />
                    </TouchableOpacity>
                    <View style={{ height: 1, backgroundColor: 'gray' }} />
                    {/* <TouchableOpacity style={styles.editBox} onPress={() => rederActionSheet('Phone', user && user.Phone)}>
                        <View style={{ flexDirection: 'row' }}>
                            <FontAwesome name='phone' size={25} />
                            <View style={{ left: 10 }}>
                                <Text style={styles.titleStyle}>Phone</Text>
                                {user && user.Phone ? <Text>{user.Phone}</Text>
                                    : <Text style={styles.titleStyle}>No Phone</Text>}
                            </View>
                        </View>
                        <Entypo name='edit' size={25} />
                    </TouchableOpacity> */}

                </View>
                <ActionSheet ref={actionSheetRef}>
                    <View style={{ height: 100, padding: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Photo</Text>
                        <View style={{ height: 50, width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => onGallery()}>
                                {/* <Image source={require('../assets/images/gallery.jpg')} style={styles.imgStyle} /> */}
                                <Gallery height={40} width={40} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onCamera()}>
                                <Camera height={45} width={43} />
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
                            <TouchableOpacity style={styles.btnStyle} onPress={() => updateName()}>
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
export default EditProfile;
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
        zIndex: 1000,
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
        backgroundColor: Color.btnPrimary, 
        padding: 5,
        borderRadius: 10
    },
    btnTextStyle: {
        color: '#ffffff'
    }
});