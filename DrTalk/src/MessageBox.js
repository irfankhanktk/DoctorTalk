import React, { createRef, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Modal from 'react-native-modal'
const { height, width } = Dimensions.get('window');
import { useStateValue } from './Store/StateProvider';
import ActionSheet from "react-native-actions-sheet";
import { actions } from './Store/Reducer';
import Recorder from './Recorder';
import { getData, postData, sendMessageToServer } from './API/ApiCalls';
import { ApiUrls } from './API/ApiUrl';
import { cos } from 'react-native-reanimated';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { insert } from './API/DManager';
import Color from './assets/Color/Color';
import { decryptData, encryptMyData } from './EncrypDecrypt';

const actionSheetRef = createRef();

const MessageBox = ({ route }) => {
    const [txtInputHeight, setTxtInputHeight] = useState(0.05);
    const [msg, setMsg] = useState('');
    const [state, dispatch] = useStateValue();
    const { token, messages, socket, user, allFriends, online} = state;
    const [modalVisible, setModalVisible] = useState(true);
    const sendImage = async (base64, uri) => {
        const msgInfo=await getMessageInfo(base64,'image');
        const resp = await postData(ApiUrls.Message._postMessage, msgInfo);
        // console.log('response fro napio: ',resp);
        if(resp.status==200){
            alert('sent');
            console.log('id:::::::',resp.data);
            sendMessage(resp.data, 'image', uri);
        }
    }
    const onCamera = async () => {
        launchCamera({
            includeBase64: true
        }, (response) => {
            response && response.base64 && sendImage(response.base64, response.uri);
        });
    }

    const onGallery = async () => {
        launchImageLibrary({
            includeBase64: true
        }, (response) => {
            response && response.base64 && sendImage(response.base64, response.uri);
        });
    }
    const unBlockFriend = async (item) => {
        const res = await getData(`${ApiUrls.Friend._unBlockFriend}?Friend_ID=${item.Friend_ID}&User_Phone=${user.Phone}`);
        if (res.status === 200) {
            const temp = [...allFriends];
            const index = temp.indexOf(item);
            item.IsBlock_ByMe = false;
            temp[index] = item;
            dispatch({
                type: actions.SET_All_FRIENDS,
                payload: temp
            });
            // navigation.goBack();
        }
    }
    const getMessageInfo =async(content, messageType) => {
        
            content= await encryptMyData(content);
           
        return ({
            Friend_ID: route.params.Friend_ID,
            From_ID: user.Phone,
            To_ID: route.params.Phone,
            Message_Type: messageType,
            Message_Content: JSON.stringify(content),
            Created_Date:(new Date()).toString(),
            Is_Download: 0,
            Is_Seen: 0,
        });
    }
    const sendMessage = async (content, messageType, uri) => {
        // if(online){
        //     alert('something went wrong');
        //     return;
        // }
        if (route.params.IsBlock_ByMe) {
            Alert.alert(
                "",
                "Unblock " + route.params.Name + ' to send message',
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "UnBlock", onPress: () => unBlockFriend(route.params) }
                ]
            );

            return;
        }
            const msgInfo =await getMessageInfo(content, messageType);
        
       
        sendMessageToServer(socket, msgInfo);
        // if (base64) {
        //     msgInfo.Message_Content = base64;
        // }
        if (uri) {
            content = uri;
            msgInfo.Message_Content=uri;
        }
       
        insert('Message' + route.params.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download,Created_Date', [user.Phone, route.params.Phone, content, messageType, 1,1,msgInfo.Created_Date], '?,?,?,?,?,?,?');
        msgInfo.Message_Content=content;
        messages.push(msgInfo);
        console.log('mesg.lenth',messages.length);
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
                        <MaterialIcon name='send' size={30} color={Color.primary} />
                    </TouchableOpacity>
                </View>
            </View>
            <ActionSheet ref={actionSheetRef}>
                <View style={{ height: 200, padding: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Photo</Text>
                    <View style={{ height: 100, alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => onCamera()}>
                            <Image source={require('./assets/images/camera.jpg')} style={styles.imgStyle} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onGallery()}>
                            <Image source={require('./assets/images/gallery.jpg')} style={styles.imgStyle} />
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
