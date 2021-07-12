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
import { ApiUrls, getFileUrl, getImageUrl } from '../API/ApiUrl';
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
import VisitedDatePicker from '../CustomScreens/VisitedDateModal';
import moment from 'moment'
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

const Chat = ({ navigation, route }) => {
    const [state, dispatch] = useStateValue();
    const [gRes, setGRes] = useState([]);
    const { messages, user, allFriends, socket, online } = state;
    const [DATA, SETDATA] = useState([]);
    const [isImport, setIsImport] = useState(false);
    const [isCCD, setIsCCD] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('30%');
    const [isEnabled, setIsEnabled] = useState(true);
    const [ccdIndex, setCcdIndex] = useState(0);
    const [fileName, setFileName] = useState('');
    const [h, seth] = useState('50%');
    const [file, setFile] = useState([{ title: '', text: '' }]);
    const flatlistRef = useRef();
    const scrollViewRef = useRef();
    const [visitedDate, setVisitedDate] = useState('2021-06-01');
    const [selectedColor, setSelectedColor] = useState(false);
    const [forwardedItems, setForwardedItems] = useState([]);
    let { Phone, Name, IsBlock_ByMe, Role } = route.params;

    let _menu = null;
    const SetHeight = (v) => {
        seth(v * 100 + '%');
    }



    //--------------------------------------DB Manager Starts here ---------------------

    // function groupBy(key) {
    //     return function group(array) {
    //         return array.reduce((acc, obj) => {
    //             const property = obj[key];
    //             acc[property] = acc[property] || [];
    //             acc[property].push(obj);
    //             return acc;
    //         }, {});
    //     };
    // }
    const select = async () => {
        db.transaction(function (tx) {
            tx.executeSql(
                'select * from Message' + route.params.Friend_ID,
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
                        type: actions.SET_MESSAGES,
                        payload: Object.values(groupData)
                    });

                },
                (tx, error) => {
                    console.log('error:', error);
                }
            );

            if (route.params.Role === 'Patient') {
                tx.executeSql(
                    'select * from CCD WHERE Patient_ID=?',
                    [route.params.Phone],
                    (tx, results) => {
                        setVisitedDate(results.rows.item(0)?.Visited_Date);
                        let temp = [];
                        for (let index = 0; index < results.rows.length; index++) {
                            let item = results.rows.item(index);
                            if (item?.CCD_Title?.toLowerCase().indexOf('allergies') > -1) {
                                temp[0] = '<section>' + item?.CCD_Title + item?.CCD_Table + '</section>';
                            }
                            else if (item?.CCD_Title?.toLowerCase().indexOf('immuni') > -1) {
                                temp[1] = '<section>' + item?.CCD_Title + item?.CCD_Table + '</section>';
                            }
                            else if (item?.CCD_Title?.toLowerCase().indexOf('procedures') > -1) {
                                temp[2] = '<section>' + item?.CCD_Title + item?.CCD_Table + '</section>';
                            }
                            else if (item?.CCD_Title?.toLowerCase().indexOf('medication') > -1) {
                                temp[3] = '<section>' + item?.CCD_Title + item?.CCD_Table + '</section>';
                            }
                        }
                        SETDATA(temp);
                        if (temp.length > 0) {
                            setIsImport(true);
                            setIsCCD(true)
                        }
                    },
                    (tx, error) => {
                        console.log('error:', error);
                    }
                );
            }

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
        }
    }
    const downloadBase64 = async (item) => {
        if (item.Message_Type !== 'audio' && item.Message_Type !== 'image') {
            alert('check type content hello');
            return;
        }
        const resp = await getData(`${ApiUrls.Message._getMessage}?Message_ID=${item.Message_Content}`);
        if (resp.status === 200) {
            // item.Is_Download = 1;
            // item.Message_Content = resp.data.Message_Content;

            update('Message' + route.params.Friend_ID, 'Is_Download=?,Message_Content=?', ' where Message_ID=?', [1, resp.data.Message_Content, item.Message_ID]);
            select('Message' + route.params.Friend_ID);
            const response = await getData(`${ApiUrls.Message._deleteMessage}?id=${item.Message_Content}`);
            if (response.status === 200) {
                console.log('deleted successfully');
            }
        }
    }
    const getUnReadMessages = async () => {
        const res = await getData(`${ApiUrls.Message._getMessages}?To_ID=${user.Phone}&From_ID=${route.params.Phone}`)
        if (res.status === 200) {
            let content = null;
            res?.data?.map(
                item => {
                    if (item.Message_Content) {
                        constent = decryptData(item.Message_Content);
                        insert('Message' + route.params.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download,Created_Date,Created_Time', [user.Phone, route.params.Phone, content, item.Message_Type, 0, 0, item?.Created_Date, item?.Created_Time], '?,?,?,?,?,?,?,?');
                    }

                }
            );
            select();
            // dispatch({
            //     type: actions.SET_MESSAGES,
            //     payload: [...messages, res.data]
            // });

            const resp = await getData(`${ApiUrls.Message._deleteMessages}?To_ID=${user.Phone}&From_ID=${route.params.Phone}`);
            if (resp.status === 200) {
                console.log('deleted successfully');
            }
        }
        // if (user.Role === 'Patient') {
        //     const response = await getData(`${ApiUrls.Message._getCCD}?Patient_ID=${user.Phone}`);
        //     if (response.status === 200) {
        //         SETDATA(response.data.CCD_File.split('$'));
        //     }
        // }
    }
    const onDelete = (item) => {
        deleteRow('Message' + route.params.Friend_ID, 'WHERE Message_ID=?', [item.Message_ID]);
        select('Message' + route.params.Friend_ID);
        // const index = messages.indexOf(item);
        // messages.splice(index, 1);

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
    const getPatientCCD = async () => {
        const res = await getData(`${ApiUrls.CCD._getCCD}?Patient_ID=${route.params.Phone}&Doctor_ID=${user.Phone}`);
        if (res.status === 200) {
            deleteCCDRecords(route.params.Phone);
            res?.data?.forEach(item => {
                insert('CCD', ' CCD_ID, Patient_ID, Visited_Date, CCD_Title, CCD_Table', [item?.CCD_ID, item.Patient_ID, visitedDate, item?.CCD_Title, item?.CCD_Table], '?, ?, ?, ?, ?');
            });
            select();
        } else {
            select();
        }
    }
    useEffect(() => {
        // setHeader();
        if (route) {
            dispatch({
                type: actions.SET_MESSAGES,
                payload: []
            });
            create('Message' + route.params.Friend_ID);
            select();
            if (route.params.Role === 'Patient')
                getPatientCCD();
            getUnReadMessages();
        }
    }, [route, allFriends]);

    const saveFile = async () => {
        if (visitedDate.length === 0 && file.length === 0) {
            alert('Select Required Credentials');
            return;
        }
        // let formData =new FormData();
        let temp = [];
        let title = null;
        let table = null;
        for (let item of file) {
            // title = await encryptMyData(item?.title);
            // table = await encryptMyData(item?.text);
            //    console.log(title);
            temp.push({ Patient_ID: Phone, Doctor_ID: user.Phone, CCD_Title: item?.title, CCD_Table: item?.text, Visited_Date: visitedDate });

        }
        console.log('temp: ', temp.length);
        // file.forEach((item) => {
        //     encryptMyData(item?.title).then(res => {
        //         // console.log('res', res)
        //         encryptMyData(item?.text).then(resp => {

        //             temp.push({ Patient_ID: Phone, Doctor_ID: user.Phone, CCD_Title: JSON.stringify(res), CCD_Table: JSON.stringify(resp), Visited_Date: visitedDate });
        //             // console.log({ Patient_ID: Phone, Doctor_ID: user.Phone, CCD_Title: JSON.stringify(res), CCD_Table: JSON.stringify(resp), Visited_Date: visitedDate });
        //             console.log(temp.length);
        //         });
        //     })
        // encryptMyData(item?.text);
        // temp.push({ Patient_ID: Phone, Doctor_ID: user.Phone, CCD_Title:JSON.stringify(title), CCD_Table:JSON.stringify(table), Visited_Date: visitedDate });
        // });
        const res = await postData(ApiUrls.CCD._addCCD, temp);
        console.log('res:', res);
        if (res.status === 200) {
            alert('Saved Successfully');
            deleteCCDRecords(Phone);
            // res?.data?.forEach(item => {
            //     insert('CCD', ' CCD_ID, Patient_ID, Visited_Date, CCD_Title, CCD_Table', [item?.CCD_ID, item.Patient_ID, visitedDate, item?.CCD_Title, item?.CCD_Table], '?, ?, ?, ?, ?');
            // });
            console.log('res of ccd: ',res?.data);
            for (let item of res?.data) {
                // title= await decryptData(item?.CCD_Title);
                // table= await decryptData(item?.CCD_Table);
                insert('CCD', ' CCD_ID, Patient_ID, Visited_Date, CCD_Title, CCD_Table', [item?.CCD_ID, item.Patient_ID, visitedDate,item?.CCD_Title,item?.CCD_Table], '?, ?, ?, ?, ?');
            }
            select();
        } else {
            alert('Something went wrong');
        }

    }
    const onSelectItem = (item, index, mIndex) => {
        let temp = [...forwardedItems];
        const ind = temp?.indexOf(item);
        if (ind < 0) {
            temp.push(item);
            setForwardedItems(temp);
        }
        else {
            temp.splice(ind, 1);
            setForwardedItems(temp);
        }

        let tmsgs = [...messages];


        // if(!flag){
        // item.selected=true;
        // setForwardedItems([...temp,item]);
        // }else{
        item.selected = !item.selected;
        // temp?.slice(index,1);
        // setForwardedItems(temp);
        // }

        tmsgs[mIndex][index] = item;
        dispatch({
            type: actions.SET_MESSAGES,
            payload: tmsgs
        });
        // const flag=temp?.some(ele=>item.Message_ID===ele.Message_ID);

    }
    const get_file = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res) {
                // setIsImport(true)

                const i = res?.uri?.lastIndexOf('/');
                setFileName(res?.uri?.slice(i + 1));
                try {
                    const xml = await RNFS.readFile(res.uri);
                    const sections = xml.split('<section>')
                    const temp = [];
                    let ccdFile = '';
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
                            temp.push({ title, text });
                            // ccdFile += '<section>' + title + text + '</section>';
                            // insert('CCD', 'Friend_ID,CCD_Title,CCD_Text', [route.params.Friend_ID, title, text], '?,?,?');
                        }

                    });
                    setFile(temp);

                } catch (error) {

                }
                // insert('CCD', 'Friend_ID,Visited_Date,CCD_File', [route.params.Friend_ID, title, text], '?,?,?');
                // SETDATA(temp);
                // RNFS.writeFile(RNFS.DocumentDirectoryPath+'/irf.txt',str, 'utf8')
                //     .then((success) => {
                //     })
                //     .catch((err) => {
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
                            {route.params?.Image ? <Image source={{ uri: `${getImageUrl()}${route.params.Image}` }} style={styles.imgStyle} />
                                :
                                <Image source={image} style={styles.imgStyle} />}
                            <Text style={{ color: 'white' }}>{Name}  </Text>
                            {Role === 'Doctor' && <Entypo name={'circle-with-plus'} size={20} color={Color.red} />}
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '20%', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                        {forwardedItems.length > 0 && <Entypo name={'forward'} size={20} />}
                        {isCCD && route.params.Role === 'Patient' && <Switch

                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabled ? "white" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isImport}
                        />}

                        <Menu
                            ref={(ref) => (_menu = ref)}
                            button={<TouchableOpacity onPress={() => _menu.show()}><Entypo name='dots-three-vertical' size={20} color='white' /></TouchableOpacity>}>
                            {IsBlock_ByMe === 1 ? <MenuItem onPress={() => { _menu.hide(), unBlockFriend(route.params) }}>UnBlock</MenuItem>
                                : <MenuItem onPress={() => { _menu.hide(), blockFriend(route.params) }}>Block</MenuItem>
                            }
                            <MenuDivider />
                            <MenuItem onPress={() => { _menu.hide(), navigation.navigate('Profile', route.params) }}>View Profile</MenuItem>
                            <MenuDivider />
                            {route.params.Role === 'Patient' && user.Role === 'Doctor' && (<><MenuItem onPress={() => { _menu.hide(), setModalVisible(f => !f) }}>Import CCD</MenuItem>
                                <MenuDivider />
                                <MenuItem onPress={() => { _menu.hide(), allowPatient() }}>Allow Patient</MenuItem>
                                <MenuDivider />
                            </>)}
                            <MenuItem onPress={() => { _menu.hide(), clearConversation() }}>Clear Conversation</MenuItem>
                        </Menu>
                    </View>

                </View>
            </View>
            {isImport && route.params.Role == 'Patient' && <>

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
                        <Text style={{ color: Color.white }}>Medication</Text>
                    </TouchableOpacity>}
                </View>
                <Text style={{ fontWeight: 'bold', padding: 5 }}>Visited date: {visitedDate}</Text>
                {/* <Slider

                minimumValue={0}
                value={0.5}
                onValueChange={(v) => SetHeight(v)} /> */}
                {/* {!isImport && isCCD && <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsImport(true)}>
                <Text>show CCD</Text>
            </TouchableOpacity>} */}


                {/* <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsImport(false)}>
                        <Text>Hide CCD</Text>
                    </TouchableOpacity> */}
                {/* <View style={[styles.ccdStyle, { height: selectedValue }]}> */}
                <View style={[styles.ccdStyle]}>
                    {DATA?.length >= 0 && <WebView originWhitelist={['*']}
                        // source={{ html: DATA[ccdIndex] }}
                        // source={{ html: item.replace('<table', '<table height='+h+' style="font-size:20"').split('border="1"').join("")}}
                        source={{ html: DATA[ccdIndex]?.replace('<text', '<text height="100%" style="font-size:40"').replace('<table', '<table height=' + h + ' style="font-size:30"') }}
                        style={{ width: '100%', }}
                    />}
                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
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
                        </ScrollView> */}
                    {/* <Picker
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
                        </Picker> */}
                    {/* <View style={{flexDirection:'row',alignSelf:'flex-end',right:10,}}>
                            <Feather name={'zoom-in'} size={25} />
                            <Feather name={'zoom-out'} size={25} />
                        </View> */}

                </View>
            </>}
            <ImageBackground source={bg} style={{ flex: 1 }}>
                <ScrollView style={styles.messagesStyle}
                    ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                >
                    {messages.map((arr, mIndex) =>
                        <View key={mIndex + "key1"}>
                            <View>
                                <Text style={{ alignSelf: 'center' }}>{arr[0]?.Created_Date}</Text>
                            </View>
                            {arr.map((item, index) =>
                                <View key={index + "key2"} style={{ backgroundColor: item?.selected ? 'white' : 'transparent', }}>
                                    {(item.From_ID === user.Phone) ?
                                        <Pressable onLongPress={() => { onSelectItem(item, index, mIndex); }} style={{ marginVertical: 5, right: 0, alignItems: 'flex-end', }}>
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

                                            {item.Message_Type === 'text' ?
                                                <View style={{ backgroundColor: 'gray', borderRadius: 5, minWidth: '20%', maxWidth: '70%', padding: 10 }}>
                                                    <Text>{item.Message_Content}</Text>
                                                    <Text style={{ alignSelf: 'flex-end' }}>{'\n'}{item?.Created_Time}</Text>
                                                </View>
                                                : item.Message_Type === 'image' ?
                                                    <View style={{ borderRadius: 5, width: '50%' }}>
                                                        {item.Is_Download === 0 ?
                                                            <View style={{ width: '100%', height: 100, }}>
                                                                <Image source={{ uri: `${getFileUrl()}${item.Message_Content}` }} style={{ width: '100%', height: 100, }} resizeMode='stretch' />
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
                                                            <PlayAudio item={`${getFileUrl()}${item.Message_Content}`} />
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
                <MessageBox route={route} />
            </View>
            <VisitedDatePicker
                visible={modalVisible}
                onClose={() => setModalVisible(f => !f)}
                uploadFile={() => get_file()}
                fileName={fileName}
                date={visitedDate}
                onChangeDate={(date) => setVisitedDate(date)}
                saveFile={() => saveFile()}
            />

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
export default Chat;