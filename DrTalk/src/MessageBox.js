import React, { createRef, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal'
const { height, width } = Dimensions.get('window');
import { useStateValue } from './Store/StateProvider';
import ActionSheet from "react-native-actions-sheet";
import { actions } from './Store/Reducer';
import Recorder from './Recorder';
import { postData, sendMessageToServer } from './API/ApiCalls';
import { ApiUrls } from './API/ApiUrl';
import { cos } from 'react-native-reanimated';
import { launchCamera ,launchImageLibrary} from 'react-native-image-picker';

const actionSheetRef = createRef();

const MessageBox = ({ route }) => {
    const [txtInputHeight, setTxtInputHeight] = useState(0.05);
    const [msg, setMsg] = useState('');
    const [state, dispatch] = useStateValue();
    const { token, messages, socket, user } = state;

    const sendImage = async (base64) => {
        const resp = await postData(ApiUrls.message._PostImageKey, { Image1: base64 });
        sendMessage(resp.data, 'image', base64);
    }
    const onCamera =async() => {
        launchCamera({
            includeBase64: true
        }, (response) => {
            response && response.base64 && sendImage(response.base64);
        });
    }

    const onGallery =async() => {
        launchImageLibrary({
            includeBase64: true
        }, (response) => {
            response && response.base64 && sendImage(response.base64);
        });
    }

    const sendMessage = async (content, messageType, base64) => {
        console.log('base64:', base64);
        const msgInfo = {
            Message_to: route.params.Friend_phone,
            Message_from: user.UPhone,
            Message_type: messageType,
            Message_content: content,
            Message_time: Date.now(),
            Is_download: false,
            isSeen: false,
        };
        sendMessageToServer(socket, msgInfo);
        console.log('base64 :', base64)
        if (base64) {
            msgInfo.Message_content = base64;
        }
      
        messages.push(msgInfo);
      
        
        dispatch({
            type: actions.SET_MESSAGES,
            payload: messages
        });
        setMsg('');
    }

    const updateSize = () => {
        if (msg.length === 0) {
            setTxtInputHeight(0.05);
        }
        else
            if (txtInputHeight <= 0.20) {
                setTxtInputHeight(txtInputHeight + 0.025);
            }

    }

    return (
        <View>
            <View style={{ borderTopEndRadius: 10, borderTopEndRadius: 10, backgroundColor: 'gray', width: '100%', flexDirection: 'row', height: height * txtInputHeight, justifyContent: 'center' }}>
                <TextInput onChangeText={text => setMsg(text)} value={msg} style={styles.InputTxt} width={'70%'} height={height * txtInputHeight} placeholder='type here' onContentSizeChange={() => updateSize()} numberOfLines={5} multiline />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%' }}>
                    <TouchableOpacity onPress={() => {
                        actionSheetRef.current?.setModalVisible();
                    }}>
                        <Entypo name='camera' size={25} />
                    </TouchableOpacity>
                    <Recorder route={route} />
                    <TouchableOpacity onPress={() => sendMessage(msg, 'text')}>
                        <MaterialIcon name='send' size={30} color='blue' />
                    </TouchableOpacity>
                </View>
            </View>
            <ActionSheet ref={actionSheetRef}>
                <View style={{ height: 200, padding: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Photo</Text>
                    <View style={{ height: 100, alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => onCamera()}>
                            <Image source={require('./assets/images/gallery.jpg')} style={styles.imgStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onGallery()}>
                            <Image source={require('./assets/images/camera.jpg')} style={styles.imgStyle} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheet>
        </View>
    );
};
export default MessageBox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    InputTxt: {
        borderTopEndRadius: 10,
        borderTopEndRadius: 10

    },
    footer: {
        flex: 1,
        // backgroundColor:'green',
        justifyContent: 'flex-end',
        // backgroundColor: 'black'
    },
    centeredView: {
        flex: 1,
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 5,
        padding: 5,
        elevation: 2,
        margin: 5,
    },
    buttonClose: {
        backgroundColor: "black",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    imgStyle: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
});
