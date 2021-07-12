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
import { getData, postData, postFormData, sendGMessageToServer, sendMessageToServer } from './API/ApiCalls';
import { ApiUrls } from './API/ApiUrl';
import { cos } from 'react-native-reanimated';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { create, create_group, create_User_Table, insert } from './API/DManager';
import Color from './assets/Color/Color';
import Camera from './assets/icons/camera.svg'
import Gallery from './assets/icons/gallery.svg'

import { decryptData, encryptMyData } from './EncrypDecrypt';
import { openDatabase } from 'react-native-sqlite-storage';
import GroupRecorder from './GroupRecord';
var db = openDatabase('Khan.db');
const actionSheetRef = createRef();

const GroupMessageBox = ({ route }) => {
    const { G_ID, G_Image, G_MemberIDs } = route.params;

    console.log(route.params);
    const [txtInputHeight, setTxtInputHeight] = useState(0.05);
    const [msg, setMsg] = useState('');
    const [state, dispatch] = useStateValue();
    const { token, messages, socket, user, allFriends, online } = state;
    const [modalVisible, setModalVisible] = useState(true);
    const sendImage = async (imageData) => {
        create_group('Group' + user.Phone);
        const msgInfo = await getMessageInfo(imageData.fileName, 'image');
        console.log('msg :', msgInfo);
        const body = new FormData();
        body.append('file', { uri: imageData.uri, name: imageData.fileName, type: imageData.type });
        body.append('From_ID', user.Phone);
        body.append('To_ID', G_ID + '');
        body.append('Sent_BY', user.Name);
        body.append('Message_Content', msgInfo?.Message_Content);
        body.append('Message_Type', msgInfo?.Message_Type);
        body.append('Created_Time', msgInfo?.Created_Time);
        body.append('Created_Date', msgInfo?.Created_Date);
        const resp = await postFormData(`${ApiUrls.Group._uploadFile}`, body);
        console.log('resp', resp);
        if (resp.status === 200) {
            sendGMessageToServer(socket, msgInfo);
            insert('Group' + user.Phone, 'From_ID, To_ID, Sent_By,Message_Content,Message_Type,Is_Seen,Is_Download,Created_Date,Created_Time', [user.Phone, G_ID, user.Name, imageData.uri, msgInfo.Message_Type, 1, 1, msgInfo.Created_Date, msgInfo.Created_Time], '?,?,?,?,?,?,?,?,?');
            select_Group_Messages('Group' + user.Phone);
        } else {
            alert('Something went wrong');
            throw new Error('Something went wrong ');
        }
    }
    const onCamera = async () => {
        launchCamera({
            // includeBase64: true
        }, (response) => {
            response && sendImage(response);
        });
    }

    const onGallery = async () => {
        launchImageLibrary({
            includeBase64: true
        }, (response) => {
            response && sendImage(response);
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
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const getMessageInfo = async (content, messageType) => {

        content = await encryptMyData(content);

        return ({
            // Friend_ID: route.params.Friend_ID,
            From_ID: user.Phone,
            To_ID: G_ID,
            Sent_BY: user.Name,
            G_MemberIDs: G_MemberIDs,
            Message_Type: messageType,
            // Message_Content:messageType === 'text'? JSON.stringify(con):content,
            Message_Content: JSON.stringify(content),
            Created_Date: (new Date()).toLocaleDateString(),
            Created_Time: formatAMPM(new Date),
            Is_Download: 0,
            Is_Seen: 0,
        });
    }
    const select_Group_Messages = async (tableName) => {
        db.transaction(function (tx) {
            tx.executeSql(
                'select * from ' + tableName + ' where To_ID=' + G_ID,
                [],
                (tx, results) => {
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }

                    let groupData = temp.reduce((acc, item) => {
                        if (!acc[item.Created_Date])
                            acc[item.Created_Date] = [];
                        acc[item.Created_Date].push(item);
                        return acc;
                    }, {});

                    dispatch({
                        type: actions.SET_Group_Messages,
                        payload: Object.values(groupData)
                    });

                },
                (tx, error) => {
                    console.log('error:', error);
                    // res = error;
                }
            );
        });
    }
    const sendMessage = async (content, messageType) => {
        create_group('Group' + user.Phone);
        console.log('content :', content);
        const msgInfo = await getMessageInfo(content, messageType);

        sendGMessageToServer(socket, msgInfo);

        insert('Group' + user.Phone, 'From_ID,To_ID, Sent_By, Message_Content,Message_Type,Is_Seen,Is_Download,Created_Date,Created_Time', [user.Phone, G_ID, user.Name, content, messageType, 1, 1, msgInfo.Created_Date, msgInfo.Created_Time], '?,?,?,?,?,?,?,?,?');
        select_Group_Messages('Group' + user.Phone);
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
            <View style={{ borderRadius: 20, width: '88%', backgroundColor: '#fffff0', flexDirection: 'row', justifyContent: 'center' }}>
                <TextInput onChangeText={text => setMsg(text)} value={msg} style={styles.InputTxt} width={'80%'} height={height * txtInputHeight} placeholder='type here' onContentSizeChange={() => updateSize()} multiline />
                <TouchableOpacity onPress={() => {
                    actionSheetRef.current?.setModalVisible();
                }} style={{ alignSelf: 'flex-end', alignItems: 'center', width: '20%', height: 30, bottom: 5 }}>
                    <Entypo name='camera' size={25} />
                </TouchableOpacity>
            </View>
            {msg.length > 0 ? <TouchableOpacity onPress={() => sendMessage(msg, 'text')} style={{ position: 'absolute', right: 10, bottom: 6 }}>
                <MaterialIcon color={'blue'} name={'send'} size={25} />
            </TouchableOpacity> : <GroupRecorder route={route} />}
            <ActionSheet ref={actionSheetRef}>
                <View style={{ height: 120, padding: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Photo</Text>
                    <View style={{ height: 100, width: '30%', alignItems: 'center', flexDirection: 'row', bottom: 20, justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => onGallery()}>
                            <Gallery height={40} width={40} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onCamera()}>
                            <Camera height={45} width={43} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ActionSheet>
        </View>
    );
};
export default GroupMessageBox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    InputTxt: {
        //    borderWidth:1,
        //    borderRadius:20,
        maxHeight: 100,
        paddingHorizontal: 10
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
        width: 50,
        height: 50,
        borderRadius: 50,
    },
});
