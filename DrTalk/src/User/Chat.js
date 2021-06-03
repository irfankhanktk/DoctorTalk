import React, { useEffect, useState, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, Alert, Switch } from 'react-native';
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import MessageBox from '../MessageBox';
import PlayAudio from '../PlayAudio';
import { allowCCDToPatient, getData, postData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import Entypo from 'react-native-vector-icons/Entypo'
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import { WebView } from 'react-native-webview';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { create, deleteRow, dropTable, insert, update } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
import Slider from 'react-native-slider';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import BackArrow from '../assets/icons/backArrow.svg'
import moment from 'moment'
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
import {
    widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';

const Chat = ({ navigation, route }) => {
    const [state, dispatch] = useStateValue();
    const { messages, user, allFriends, socket, online } = state;
    const [DATA, SETDATA] = useState([]);
    const [isImport, setIsImport] = useState(false);
    const [isCCD, setIsCCD] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('30%');
    const [isEnabled, setIsEnabled] = useState(true);
    const [h, seth] = useState('50%');
    const flatlistRef = useRef();
    const SetHeight = (v) => {
        seth(v * 100 + '%');
    }

    let { Phone, Name, IsBlock_ByMe } = route.params;

    let _menu = null;

    //--------------------------------------DB Manager Starts here ---------------------
    const select = async () => {
        console.log('select * from Message' + route.params.Friend_ID,);
        db.transaction(function (tx) {

            tx.executeSql(
                'select * from Message' + route.params.Friend_ID,
                [],
                (tx, results) => {
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    dispatch({
                        type: actions.SET_MESSAGES,
                        payload: temp
                    });
                },
                (tx, error) => {
                    console.log('error:', error);
                    // res = error;
                }
            );
            tx.executeSql(
                'select * from CCD WHERE Friend_ID=?',
                [route.params.Friend_ID],
                (tx, results) => {
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i).CCD_Title + results.rows.item(i).CCD_Text);
                    }
                    if (temp.length > 0) {
                        setIsImport(true);
                        setIsCCD(true);
                    }
                    SETDATA(temp);
                },
                (tx, error) => {
                    console.log('error:', error);
                }
            );
        });
    }

    //--------------------------------------DB Manager ends here ---------------------


    const toggleSwitch = () => setIsImport(previousState => !previousState);

    // const setHeader = () => {
    //     navigation.setOptions({
    //         headerTitle:
    //             <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
    //                 {route && route.params.Image ? <Image source={{ uri: `data:image/jpeg;base64,${route.params.Image}` }} style={styles.imgStyle} /> :
    //                     <Image source={image} style={styles.imgStyle} />}
    //                 <Text style={{ left: 10 }}>{Name}</Text>
    //             </TouchableOpacity>,
    //         headerRight: () => (
    //             <View style={{ flexDirection: 'row', width: '100%' }}>
    //                 <Switch
    //                 style={{right:20}}
    //                    trackColor={{ false: "#767577", true: "#81b0ff" }}
    //                         thumbColor={isEnabled ? "white" : "#f4f3f4"}
    //                         ios_backgroundColor="#3e3e3e"
    //                         onValueChange={toggleSwitch}
    //                         value={isImport}
    //                 />
    //                 <View style={{ right: 20 }}>
    //                     <Menu
    //                         ref={(ref) => (_menu = ref)}
    //                         button={<TouchableOpacity onPress={() => _menu.show()}><Entypo name='dots-three-vertical' size={20} /></TouchableOpacity>}>
    //                         {IsBlock_ByMe ? <MenuItem onPress={() => { _menu.hide(), unBlockFriend(route.params) }}>UnBlock</MenuItem>
    //                             : <MenuItem onPress={() => { _menu.hide(), blockFriend(route.params) }}>Block</MenuItem>
    //                         }
    //                         <MenuDivider />
    //                         <MenuItem onPress={() => { _menu.hide(), navigation.navigate('Profile', route.params) }}>View Profile</MenuItem>
    //                         <MenuDivider />
    //                         {route.params.Role === 'Patient' && user.Role === 'Doctor' && (<><MenuItem onPress={() => { _menu.hide(), get_file() }}>Import CCD</MenuItem>
    //                             <MenuDivider />
    //                             <MenuItem onPress={() => { _menu.hide(), allowPatient() }}>Allow Patient</MenuItem>
    //                             <MenuDivider />
    //                         </>)}
    //                         <MenuItem onPress={() => { _menu.hide(), clearConversation() }}>Clear Conversation</MenuItem>
    //                     </Menu>
    //                 </View>

    //             </View>
    //         ),
    //     })
    // }
    const allowPatient = async () => {
        var ccd = DATA.join('$');
        const response = await postData(ApiUrls.Message._postCCD, { Patient_ID: route.params.Phone, Doctor_ID: user.Phone, CCD_File: ccd, Allow: true });
        if (response.status === 200) {
            alert('hahhahaha');
        }
    }
    const clearConversation = () => {
        dropTable('Message' + route.params.Friend_ID);
        dispatch({
            type: actions.SET_MESSAGES,
            payload: []
        });
        // select('Message'+route.params.Friend_ID);
    }
    const unBlockFriend = async (item) => {
        const res = await getData(`${ApiUrls.Friend._unBlockFriend}?Friend_ID=${item.Friend_ID}&User_Phone=${user.Phone}`);
        if (res.status === 200) {
            const temp = [...allFriends];
            const index = temp.indexOf(item);
            item.IsBlock_ByMe = 0;
            temp[index] = item;
            dispatch({
                type: actions.SET_All_FRIENDS,
                payload: temp
            });
            // navigation.goBack();
        }
    }
    const blockFriend = async (item) => {
        const res = await getData(`${ApiUrls.Friend._blockFriend}?Friend_ID=${item.Friend_ID}&User_Phone=${user.Phone}`);
        if (res.status === 200) {
            const temp = [...allFriends];
            const index = temp.indexOf(item);
            item.IsBlock_ByMe = 1;
            temp[index] = item;
            dispatch({
                type: actions.SET_All_FRIENDS,
                payload: temp
            });
            // navigation.goBack();
        }
    }
    const downloadBase64 = async (index, item) => {
        if (item.Message_Type !== 'audio' && item.Message_Type !== 'image') {
            alert('check type content hello');
            return;
        }

        const resp = await getData(`${ApiUrls.Message._getMessage}?Message_ID=${item.Message_Content}`);
        if (resp && resp.data) {
            item.Is_Download = 1;
            item.Message_Content = resp.data.Message_Content;

            update('Message' + route.params.Friend_ID, 'Is_Download=?,Message_Content=?', [1, resp.data.Message_Content, item.Message_ID]);
            select('Message' + route.params.Friend_ID);
            const items = [...messages];
            items[index] = item;

            dispatch({
                type: actions.SET_MESSAGES,
                payload: items
            });
        }
    }
    const getUnReadMessages = async () => {
        const res = await getData(`${ApiUrls.Message._getMessages}?To_ID=${user.Phone}&From_ID=${route.params.Phone}`)
        if (res.status === 200 && res.data.length > 0) {
            dispatch({
                type: actions.SET_MESSAGES,
                payload: [...messages, res.data]
            });
            const resp = await getData(`${ApiUrls.Message._deleteMessages}?To_ID=${user.Phone}&From_ID=${route.params.Phone}`);
            if (resp.status === 200) {
                console.log('deleted successfully');
            }
        }
        if (user.Role === 'Patient') {
            const response = await getData(`${ApiUrls.Message._getCCD}?Patient_ID=${user.Phone}`);
            if (response.status === 200) {
                SETDATA(response.data.CCD_File.split('$'));
            }
        }
    }
    const onDelete = (item) => {
        deleteRow('Message' + route.params.Friend_ID, 'WHERE Message_ID=?', [item.Message_ID]);
        const index = messages.indexOf(item);
        messages.splice(index, 1);
        // console.log(index);
        // dispatch({
        //     type: actions.SET_MESSAGES,
        //     payload: messages
        // });

    }
    const deleteMessage = (item) => {
        Alert.alert(
            '',
            'Are You Sure To Delete Message',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Delete', onPress: () => onDelete(item) }
            ]
        );
    }
    // useEffect(()=>{
    //     select();
    // },[messages])
    useEffect(() => {
        // setHeader();
        if (route) {
            create('Message' + route.params.Friend_ID);
            select();
            // getUnReadMessages();
        }
    }, [route, allFriends])
    const get_file = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res) {
                setIsImport(true)
                const xml = await RNFS.readFile(res.uri);
                const sections = xml.split('<section>')
                const temp = [];

                sections.forEach(ele => {
                    var text = '';
                    var title = '';
                    var start = ele.indexOf('<title>');
                    var end = ele.indexOf('</title>');

                    if (start > 0 && end > 0) {
                        title = ele?.slice(start, end) + '</h1>';
                        title = title?.split("title").join("h1");
                    }
                    start = ele?.indexOf('<text>');
                    end = ele?.indexOf('</text>');

                    if (start > 0 && end > 0) {
                        text = ele?.slice(start, end) + '</text>';
                        text = text?.split('border="1"').join("").split("<tr").join('<tr align="center"');

                    }
                    if (text != '') {
                        temp.push(title + text);
                        insert('CCD', 'Friend_ID,CCD_Title,CCD_Text', [route.params.Friend_ID, title, text], '?,?,?');
                    }


                });
                SETDATA(temp);
                // RNFS.writeFile(RNFS.DocumentDirectoryPath+'/irf.txt',str, 'utf8')
                //     .then((success) => {
                //         console.log('FILE WRITTEN!');
                //     })
                //     .catch((err) => {
                //         console.log(err.message);
                //     });
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }
    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //       headerRight: () => (
    //         <TouchableOpacity>
    //             <Entypo name='dots-three-vertical' size={20}/>
    //         </TouchableOpacity>
    //       ),
    //     });
    //   }, [navigation]);

    return (
        <View
            // behavior={'padding'}
            style={styles.container}
        >
            <View style={{ width: '100%', height: hp(7), justifyContent: 'center', backgroundColor: Color.primary }}>
                <View style={{ width: '95%', flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-around' }}>

                        <TouchableOpacity style={{ width: '25%' }} onPress={() => navigation.goBack()}>
                            <BackArrow
                                style={{ alignSelf: 'center' }}
                                width={30}
                                height={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '75%', flexDirection: 'row', alignItems: 'center', }}>
                            {route.params?.Image ? <Image source={{ uri: `data:image/jpeg;base64,${route.params.Image}` }} style={styles.imgStyle} /> :
                                <Image source={image} style={styles.imgStyle} />}
                            <Text>  {Name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '20%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        {isCCD && <Switch

                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "white" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isImport}
                        />}

                        <Menu
                            ref={(ref) => (_menu = ref)}
                            button={<TouchableOpacity onPress={() => _menu.show()}><Entypo name='dots-three-vertical' size={20} /></TouchableOpacity>}>
                            {IsBlock_ByMe === 1 ? <MenuItem onPress={() => { _menu.hide(), unBlockFriend(route.params) }}>UnBlock</MenuItem>
                                : <MenuItem onPress={() => { _menu.hide(), blockFriend(route.params) }}>Block</MenuItem>
                            }
                            <MenuDivider />
                            <MenuItem onPress={() => { _menu.hide(), navigation.navigate('Profile', route.params) }}>View Profile</MenuItem>
                            <MenuDivider />
                            {route.params.Role === 'Patient' && user.Role === 'Doctor' && (<><MenuItem onPress={() => { _menu.hide(), get_file() }}>Import CCD</MenuItem>
                                <MenuDivider />
                                <MenuItem onPress={() => { _menu.hide(), allowPatient() }}>Allow Patient</MenuItem>
                                <MenuDivider />
                            </>)}
                            <MenuItem onPress={() => { _menu.hide(), clearConversation() }}>Clear Conversation</MenuItem>
                        </Menu>
                    </View>

                </View>
            </View>
            {/* <Slider

                minimumValue={0}
                value={0.5}
                onValueChange={(v) => SetHeight(v)} /> */}
            {/* {!isImport && isCCD && <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsImport(true)}>
                <Text>show CCD</Text>
            </TouchableOpacity>} */}
            {isImport &&
                <>
                    {/* <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsImport(false)}>
                        <Text>Hide CCD</Text>
                    </TouchableOpacity> */}
                    <View style={[styles.ccdStyle, { height: selectedValue }]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                        }}>
                            {DATA &&
                                DATA.map((item, index) => (
                                    <WebView key={index} originWhitelist={['*']}
                                        source={{ html: item.replace('<text', '<text height=' + h + ' style="font-size:40"').replace('<table', '<table height=' + h + ' style="font-size:30"') }}
                                        // source={{ html: item.replace('<table', '<table height='+h+' style="font-size:20"').split('border="1"').join("")}}
                                        style={{ width: 350, marginHorizontal: 30 }}
                                    />
                                ))}
                        </ScrollView>
                        <Picker
                            style={{ width: '40%' }}
                            selectedValue={selectedValue}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedValue(itemValue)
                            }>
                            <Picker.Item label="30%" value="30%" />
                            <Picker.Item label="40%" value="40%" />
                            <Picker.Item label="50%" value="50%" />
                            <Picker.Item label="60%" value="60%" />
                            <Picker.Item label="70%" value="70%" />
                        </Picker>
                    </View>
                </>
            }
            <View style={styles.messagesStyle}>
                <FlatList
                    ref={flatlistRef}
                    onContentSizeChange={() => flatlistRef.current.scrollToEnd({ animating: true })}
                    data={messages}
                    renderItem={({ item, index }) => (
                        <View >{(item.From_ID === user.Phone) ?
                            <View onLongPress={() => deleteMessage(item)} style={{ marginVertical: 5, right: 0, alignItems: 'flex-end', }}>
                                {item.Message_Type === 'text' ?
                                    <View style={{ backgroundColor: 'skyblue', borderRadius: 5, minWidth: '20%', maxWidth: '70%', padding: 10 }}>
                                        <Text>{item.Message_Content}</Text>
                                        {/* <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Date && moment(new Date(item?.Created_Date)).fromNow()}</Text> */}
                                        <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Date && (new Date(item?.Created_Date)).toLocaleTimeString()}</Text>

                                    </View>
                                    : item.Message_Type === 'image' ?
                                        <View style={{ borderRadius: 5, width: '40%' }}>
                                            <Image source={{ uri: item.Message_Content }} style={{ width: '100%', height: 70, }} />
                                            <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Date && (new Date(item?.Created_Date)).toLocaleTimeString()}</Text>
                                        </View>
                                        :
                                        <View style={{ borderRadius: 5 }}>
                                            <PlayAudio item={item} />
                                            <Text style={{ alignSelf: 'flex-end' }}>12:45:30</Text>
                                            {/* <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Date && (new Date(item?.Created_Date)).toLocaleTimeString()}</Text> */}
                                        </View>
                                }

                            </View>

                            :
                            <View onLongPress={() => deleteMessage(item)} style={{ marginVertical: 5, right: 0, alignItems: 'flex-start', }}>

                                {item.Message_Type === 'text' ?
                                    <View style={{ backgroundColor: 'gray', borderRadius: 5, minWidth: '20%', maxWidth: '70%', padding: 10 }}>
                                        <Text>{item.Message_Content}</Text>
                                        <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Date && (new Date(item?.Created_Date)).toLocaleTimeString()}</Text>
                                    </View>
                                    : item.Message_Type === 'image' ?
                                        <View style={{ borderRadius: 5, }}>
                                            {item.Is_Download === 1 ?
                                                <View>
                                                    <Image source={{ uri: `data:image/jpeg;base64,${item.Message_Content}` }} style={{ width: 70, height: 70, }} />
                                                </View>
                                                :
                                                <TouchableOpacity onPress={() => downloadBase64(index, item)}>
                                                    <MaterialCommunityIcons name={'download'} color='black' size={20} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        : item.Message_Type === 'audio' &&
                                        <View style={{ borderRadius: 5, }}>
                                            {item.Is_Download === 1 ?
                                                <PlayAudio item={`data:audio/mp3;base64,${item.Message_Content}`} />
                                                :
                                                <View style={{ flexDirection: 'row', width: 150, justifyContent: 'space-around' }}>
                                                    <TouchableOpacity onPress={() => downloadBase64(index, item)}>
                                                        <MaterialCommunityIcons name={'download'} color='black' size={20} />
                                                    </TouchableOpacity>
                                                    <View style={{ justifyContent: 'center' }}>
                                                        <Progress.Bar progress={0} width={100} />
                                                    </View>

                                                </View>
                                            }
                                        </View>
                                }
                                {/* <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Date && moment(new Date(item?.Created_Date)).fromNow()}</Text> */}
                            </View>

                        }
                        </View>
                    )}
                    keyExtractor={(item, index) => index + 'key'}
                />
            </View>
            <View>
                <MessageBox route={route} />
            </View>
            {/* <View style={styles.menuStyle}>
            
            </View> */}
            {/* <Modal
                isVisible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
                onBackdropPress={() => setModalVisible(!modalVisible)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.modalView}>
                        <Text>I am the modal content!</Text>
                    </View>
                </View>
            </Modal> */}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgStyle: {
        width: 30,
        height: 30,
        borderRadius: 50
    },
    InputTxt: {
        borderTopEndRadius: 10,
        borderTopEndRadius: 10

    },
    ccdStyle: {
        width: '100%',
        // backgroundColor: 'black'
    },
    messagesStyle: {
        flex: 10,
        paddingHorizontal: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    menuStyle: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
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

});
export default Chat;