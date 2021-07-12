import React, { useEffect, useState, useRef } from 'react';
import {
    Text, View, StyleSheet, Dimensions, TextInput, Image,
    TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, Alert, Switch, ImageBackground, Settings, Pressable
} from 'react-native';
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import MessageBox from '../MessageBox';
import PlayAudio from '../PlayAudio';
import { allowCCDToPatient, getData, postData } from '../API/ApiCalls';
import { ApiUrls, getFileUrl, getGroupFileUrl, getImageUrl } from '../API/ApiUrl';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import { WebView } from 'react-native-webview';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { create, deleteCCDRecords, deleteRow, dropTable, insert, update } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
import Slider from 'react-native-slider';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import BackArrow from '../assets/icons/backArrow.svg'
import Download from '../assets/icons/download.svg'
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
const bg = require('../assets/images/bg.jpg');
import {
    widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as lor,
    removeOrientationListener as rol
} from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';
import { set } from 'react-native-reanimated';
import { decryptData, encryptMyData } from '../EncrypDecrypt';
import GroupMessageBox from '../GroupMessageBox';
import { getContactById } from 'react-native-contacts';

const GroupChat = ({ navigation, route }) => {
    const [state, dispatch] = useStateValue();
    const { messages, user, socket, group_messages, allFriends } = state;
    const [isImport, setIsImport] = useState(false);
    const [isCCD, setIsCCD] = useState(false);
    const [visitedDate, setVisitedDate] = useState('2021-06-01');
    const [DATA, SETDATA] = useState([]);
    const [ccdIndex, setCcdIndex] = useState(0);

    const scrollViewRef = useRef();
    let { G_ID, G_Name, G_Image, G_MemberIDs } = route.params;


    console.log('G_ID', route.params);

    //--------------------------------------DB Manager Starts here ---------------------

    const select = async () => {
        db.transaction(function (tx) {
            tx.executeSql(
                'select * from Group' + user.Phone + ' where To_ID=' + G_ID,
                [],
                (tx, results) => {
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    console.log('temp: ', temp);
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
                }
            );
        });
    }

    //--------------------------------------DB Manager ends here ---------------------
    const selectCCD = async (pid) => {
        db.transaction(function (tx) {


            tx.executeSql(
                'select * from CCD WHERE Patient_ID=?',
                [pid],
                (tx, results) => {
                    setVisitedDate(results.rows.item(0)?.Visited_Date);
                    let temp = [];
                    for (let index = 0; index < results.rows.length; index++) {
                        let item = results.rows.item(index);
                        if (item?.CCD_Title?.toLowerCase().indexOf('allergies') > -1) {
                            temp[0] = '<section>' + item?.CCD_Table + '</section>';
                        }
                        else if (item?.CCD_Title?.toLowerCase().indexOf('immuni') > -1) {
                            temp[1] = '<section>' + item?.CCD_Table + '</section>';
                        }
                        else if (item?.CCD_Title?.toLowerCase().indexOf('procedures') > -1) {
                            temp[2] = '<section>' + item?.CCD_Table + '</section>';
                        }
                        else if (item?.CCD_Title?.toLowerCase().indexOf('medication') > -1) {
                            temp[3] = '<section>' + item?.CCD_Table + '</section>';
                        }
                    }
                    SETDATA(temp);
                    if (temp.length > 0) {
                        setIsImport(true);
                        // setIsCCD(true)
                    }
                },
                (tx, error) => {
                    console.log('error:', error);
                }
            );
        });
    }
    const getCCD = async () => {
        // let patientPhone=null;
        let mIDs = G_MemberIDs.split(',');
        // allFriends?.map(element => {
        //     const patient=mIDs?.find(Phone=>Phone===element?.Phone&&element.Role==='Patient');
        //     if(patient){
        //        patientPhone=patient;
        //     }
        // });
        if (mIDs.length == 3) {
            const res = await getData(`${ApiUrls.CCD._getCCD}?Patient_ID=${mIDs[1]}&Doctor_ID=${G_ID}`);
            console.log('res: ', res);
            if (res.status === 200) {
                deleteCCDRecords(route.params.Phone);
                res?.data?.forEach(item => {
                    insert('CCD', ' CCD_ID, Patient_ID, Visited_Date, CCD_Title, CCD_Table', [item?.CCD_ID, item.Patient_ID, visitedDate, item?.CCD_Title, item?.CCD_Table], '?, ?, ?, ?, ?');
                });
                selectCCD(mIDs[1]);
            } else {
                selectCCD(mIDs[1]);
            }
        }
    }
    const getUnReadGMessage = async () => {
        const res = await getData(`${ApiUrls.Group._getGMessages}?MG_ID=${G_ID}`);
        console.log('data::: ', res?.data);
        if (res?.status === 200) {
            
               

                // }, 500);


                // for (var item of res?.data) {
                    res?.data?.map(
                        item => {
                            if (item.Message_Content) {
                               let content = decryptData(item.Message_Content);
                                insert('Group' + user.Phone, 'From_ID,To_ID, Sent_By, Message_Content,Message_Type,Is_Seen,Is_Download,Created_Date,Created_Time', [item.From_ID, G_ID, item.Sent_By, content, item.Message_Type, 1, 1, (new Date(item.Created_Date)).toLocaleDateString() + '', item.Created_Time], '?,?,?,?,?,?,?,?,?');
                            }
                        }
                    );
         
            select();
        } else {
            select();
        }
    }
    useEffect(() => {

        if (route) {
            getCCD()
            select();
            // getUnReadGMessage();
        }
    }, [route]);




    return (
        <View
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
                            {G_Image ? <Image source={{ uri: `${getImageUrl()}${G_Image}` }} style={styles.imgStyle} />
                                :
                                <Image source={image} style={styles.imgStyle} />}
                            <Text style={{ color: 'white' }}>{G_Name}  </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            {isImport && <>

                <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {DATA[0] && <TouchableOpacity onPress={() => setCcdIndex(0)} style={{ backgroundColor: Color.btnPrimary, borderRadius: 10, height: 30, justifyContent: 'center', alignItems: 'center', width: '20%', }}>
                        <Text style={{ color: Color.white }}>Allergies</Text>
                    </TouchableOpacity>
                    }
                    {DATA[1] && <TouchableOpacity onPress={() => setCcdIndex(1)} style={{ backgroundColor: Color.btnPrimary, borderRadius: 10, height: 30, justifyContent: 'center', alignItems: 'center', width: '30%', }}>
                        <Text style={{ color: Color.white }}>Immunization</Text>
                    </TouchableOpacity>}
                    {DATA[2] && <TouchableOpacity onPress={() => setCcdIndex(2)} style={{ backgroundColor: Color.btnPrimary, borderRadius: 10, height: 30, justifyContent: 'center', alignItems: 'center', width: '24%', }}>
                        <Text style={{ color: Color.white }}>Procedures</Text>
                    </TouchableOpacity>}
                    {DATA[3] && <TouchableOpacity onPress={() => setCcdIndex(3)} style={{ backgroundColor: Color.btnPrimary, borderRadius: 10, height: 30, justifyContent: 'center', alignItems: 'center', width: '24%', }}>
                        <Text style={{ color: Color.white }}>RX</Text>
                    </TouchableOpacity>}
                </View>
                <Text style={{ fontWeight: 'bold', padding: 5 }}>Visited date: {visitedDate}</Text>






                <View style={[styles.ccdStyle]}>
                    {DATA?.length >= 0 && <WebView originWhitelist={['*']}
                        // source={{ html: DATA[ccdIndex] }}
                        // source={{ html: item.replace('<table', '<table height='+h+' style="font-size:20"').split('border="1"').join("")}}
                        source={{ html: DATA[ccdIndex]?.replace('<text', '<text height="100%" style="font-size:40"').replace('<table', '<table height=50% style="font-size:30"') }}
                        style={{ width: '100%', }}
                    />}




                </View>
            </>}





            <ImageBackground source={bg} style={{ flex: 1 }}>
                <ScrollView style={styles.messagesStyle}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                    {group_messages.map((arr, mIndex) =>
                        <View key={mIndex + "key1"}>
                            <View>
                                <Text style={{ alignSelf: 'center' }}>{arr[0]?.Created_Date}</Text>
                            </View>
                            {arr.map((item, index) =>
                                <View key={index + "key2"} style={{ backgroundColor: item?.selected ? 'white' : 'transparent', }}>
                                    {(item.From_ID === user.Phone) ?
                                        <Pressable onLongPress={() => { onSelectItem(item, index, mIndex); }} style={{ marginVertical: 5, right: 0, alignItems: 'flex-end', }}>
                                            <View style={{ backgroundColor: Color.milky }}>
                                                <Text style={{ color: 'black' }}>You</Text>
                                            </View>
                                            {item.Message_Type === 'text' ?
                                                <View style={{ backgroundColor: 'skyblue', borderRadius: 5, minWidth: '20%', maxWidth: '70%', padding: 10 }}>
                                                    <Text>{item.Message_Content}</Text>
                                                    {/* <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Date && moment(new Date(item?.Created_Date)).fromNow()}</Text> */}
                                                    <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Time}</Text>
                                                </View>
                                                : item.Message_Type === 'image' ?
                                                    <View style={{ borderRadius: 5, width: '50%' }}>
                                                        <Image source={{ uri: item.Message_Content }} style={{ width: '100%', height: 100, }} />
                                                        <Text suppressHighlighting selectable style={{ alignSelf: 'flex-end' }}>{item?.Created_Time}</Text>
                                                    </View>
                                                    :
                                                    <View style={{ borderRadius: 5 }}>
                                                        <PlayAudio item={item.Message_Content} />
                                                        <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Time}</Text>
                                                        {/* <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Date && (new Date(item?.Created_Date)).toLocaleTimeString()}</Text> */}
                                                    </View>
                                            }

                                        </Pressable>
                                        :
                                        <Pressable onLongPress={() => { onSelectItem(item, index, mIndex); }} style={{ marginVertical: 5, right: 0, alignItems: 'flex-start', padding: 10, }}>
                                            <View style={{ backgroundColor: Color.milky }}>
                                                <Text style={{ color: 'black' }}>{item?.Sent_By}</Text>
                                            </View>
                                            {item.Message_Type === 'text' ?
                                                <View style={{ backgroundColor: 'gray', borderRadius: 5, minWidth: '20%', maxWidth: '70%', padding: 10 }}>
                                                    <Text>{item.Message_Content}</Text>
                                                    <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Time}</Text>
                                                </View>
                                                : item.Message_Type === 'image' ?
                                                    <View style={{ borderRadius: 5, width: '50%' }}>
                                                        {item.Is_Download === 0 ?
                                                            <View style={{ width: '100%', height: 100, }}>
                                                                <Image source={{ uri: `${getGroupFileUrl()}${item.Message_Content}` }} style={{ width: '100%', height: 100, }} resizeMode='stretch' />
                                                            </View>
                                                            :
                                                            <TouchableOpacity onPress={() => downloadBase64(item)}>
                                                                <Download
                                                                    style={{ alignSelf: 'flex-start' }}
                                                                    width={60}
                                                                    height={60}
                                                                    fill={'black'}
                                                                />
                                                            </TouchableOpacity>
                                                        }
                                                        <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Time}</Text>
                                                    </View>
                                                    : item.Message_Type === 'audio' &&
                                                    <View style={{ borderRadius: 5, }}>
                                                        {item.Is_Download === 0 ?
                                                            // <PlayAudio item={`data:audio/mp3;base64,${item.Message_Content}`} />
                                                            <PlayAudio item={`${getGroupFileUrl()}${item.Message_Content}`} />
                                                            :
                                                            <View style={{ borderRadius: 10, width: '40%', justifyContent: 'center', alignItems: 'center', height: 30, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'gray' }}>
                                                                <TouchableOpacity onPress={() => downloadBase64(item)}>
                                                                    <MaterialCommunityIcons name={'download'} color='black' size={20} />
                                                                </TouchableOpacity>
                                                                <View style={{ justifyContent: 'center' }}>
                                                                    <Progress.Bar progress={0} width={100} />
                                                                </View>
                                                            </View>
                                                        }
                                                        <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Time}</Text>
                                                    </View>
                                            }
                                            {/* <Text style={{ alignSelf: 'flex-end' }}>{item?.Created_Date && moment(new Date(item?.Created_Date)).fromNow()}</Text> */}
                                        </Pressable>}
                                </View>
                            )}
                        </View>

                        // />

                    )}
                </ScrollView>
            </ImageBackground>

            <View>
                <GroupMessageBox route={route} />
            </View>
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
        borderRadius: 50,
        right: 10,
    },
    InputTxt: {
        borderTopEndRadius: 10,
        borderTopEndRadius: 10

    },
    ccdStyle: {
        width: '100%',
        // backgroundColor: 'black',
        height: '15%'
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
export default GroupChat;