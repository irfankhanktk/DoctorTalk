import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import moment from 'moment'
// const image = require('C:/Users/Irfan/Desktop/ReactNative/DoctorTalk/DrTalk/src/images/logo.jpg');
const { height, width } = Dimensions.get('window');
const image = require('E:/React_Native/DoctorTalk/DrTalk/src/images/logo.jpg');
const Chat = ({ navigation, route }) => {
    // console.log('route : ',route);
    // console.log(route.params);
    const [txtInputHeight, setTxtInputHeight] = useState(0.05);
    const [msg, setMsg] = useState('');
    const [uri, setUri] = useState('');
    const [gUri, setGUri] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('');
    const [state, dispatch] = useStateValue();
    const { token, messages, socket, user } = state;
    // const {contact,name,}=route.params.token;

    const selectCamera = () => {
        setModalVisible(false);
        launchCamera({
            includeBase64: true
        }, (response) => {
            setUri(response.uri);
            setGUri(response.base64);
            // console.log('base64 : ',response.base64)


            const msgInfo = {
                toPhone: route.params.Friend_phone,
                toName: route.params.Friend_name,
                fromPhone: user.UPhone,
                fromName: user.UName,
                msg: response.base64,
                msgType: 'image',
            };
            messages.push(msgInfo);
            dispatch({
                type: actions.SET_MESSAGES,
                payload: messages
            });

        });
    };
    const selectGallery = () => {
        setModalVisible(false);
        launchImageLibrary({
            includeBase64: true
        }, (response) => {
            console.log('resp', response);
            setGUri(response.base64);
            console.log('uri :', response.uri);
            // console.log('base64 : ',response.base64)


            const msgInfo = {
                toPhone: route.params.Friend_phone,
                toName: route.params.Friend_name,
                fromPhone: user.UPhone,
                fromName: user.UName,
                msg: response.base64,
                msgType: 'image',
            };
            messages.push(msgInfo);
            dispatch({
                type: actions.SET_MESSAGES,
                payload: messages
            });
        });

    }


    const updateSize = () => {
        // console.log('msg: ', msg.length);
        // console.log('msg: ', msg);
        if (msg.length === 0) {
            setTxtInputHeight(0.05);
        }
        else
            if (txtInputHeight <= 0.20) {
                setTxtInputHeight(txtInputHeight + 0.025);
            }

    }

    const sendMessage = () => {
        // console.log('socket to send msg : ',socket);
        if (socket === {}) {
            alert('no internet connection');
            return;
        }
        const msgInfo = {
            toPhone: route.params.Friend_phone,
            toName: route.params.Friend_name,
            fromPhone: user.UPhone,
            fromName: user.UName,
            msg: msg,
            msgType: 'text',
        };
        messages.push(msgInfo);
        dispatch({
            type: actions.SET_MESSAGES,
            payload: messages
        });
        socket.emit('chat message', msgInfo);

        setMsg('');
    }
    return (
        <View style={styles.container}>
            <View style={{ width: width, height: height * 0.25, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: `data:image/jpeg;base64,${gUri}` }} style={{ width: 70, height: 70, borderRadius: 50 }} />
                {/* <Image source={{uri: `data:image/png;base64,${gUri}`}} style={{ width: 70, height: 70, borderRadius: 50 }} /> */}
                <Text>{route.params.Friend_name}</Text>
                <Text>{route.params.Friend_phone}</Text>
                <Text>{route.params.Friend_status}</Text>
            </View>
            {console.log('msgs; ',messages.length)}
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View>{console.log('item : ', item)}{(item.fromPhone === route.params.Friend_phone) ?
                        <View style={{ marginVertical: 5, left: 10 }}>
                            {item.msgType === 'text' ?
                                <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                    <Text style={{ fontSize: 20 }}>{item.msg}</Text>
                                    <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                </View>
                                :
                                <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                    <Text style={{ alignSelf: 'flex-end' }}>image part</Text>
                                    <Image source={{ uri: `data:image/jpeg;base64,${item.msg}`}} style={{ width: 70, height: 70, }} />
                                    <Text style={{ alignSelf: 'flex-end' }}>5:46</Text>
                                </View>
                            }
                        </View>
                        : item.toPhone === route.params.Friend_phone &&
                        <View style={{ marginVertical: 5, right: 10, alignItems: 'flex-end', }}>
                           {item.msgType === 'text' ?
                                <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                    <Text style={{ fontSize: 20 }}>{item.msg}</Text>
                                    <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                </View>
                                :
                                <View style={{borderRadius: 5, width: '30%' }}>
                                    
                                    <Image source={{ uri: `data:image/jpeg;base64,${item.msg}` }} style={{ width: 70, height: 70, }} />
                                    <Text style={{ alignSelf: 'flex-end' }}>5:46</Text>
                                </View>
                            }
                        </View>}
                    </View>
                )}
                keyExtractor={(item, index) => index + ''}
            />
            {/* <Image source={{ uri: uri }} style={{ height: 100, width: 100 }} />
            <Image source={{ uri: gUri }} style={{ height: 100, width: 100 }} /> */}
            <View style={styles.centeredView}>
                <Modal
                    onBackdropPress={() => setModalVisible(!modalVisible)}
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => selectCamera()}
                            >
                                <Text style={styles.textStyle}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => selectGallery()}
                            >
                                <Text style={styles.textStyle}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
            <View style={styles.footer}>
                <View style={{ borderTopEndRadius: 10, borderTopEndRadius: 10, backgroundColor: 'white', width: '100%', flexDirection: 'row', height: height * txtInputHeight, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TextInput onChangeText={text => setMsg(text)} value={msg} style={styles.InputTxt} width={'70%'} height={height * txtInputHeight} placeholder='type here' onContentSizeChange={() => updateSize()} numberOfLines={5} multiline />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '30%' }}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Entypo name='camera' size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{}} onPress={() => { }}>
                            <MaterialIcon name='keyboard-voice' size={25} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => sendMessage()}>
                            <MaterialIcon name='send' size={30} color='blue' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        width: width,
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
    }
});
export default Chat;