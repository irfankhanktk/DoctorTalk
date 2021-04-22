import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import MessageBox from '../MessageBox';
import PlayAudio from '../PlayAudio';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import Entypo from 'react-native-vector-icons/Entypo'
import RNFS from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import { WebView } from 'react-native-webview';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { create, dropTable, update } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
const Chat = ({ navigation, route }) => {
    const [state, dispatch] = useStateValue();
    const { messages, user, allFriends } = state;
    const [DATA, SETDATA] = useState([]);
    const [isImport, setIsImport] = useState(false);
    let { Phone, Name, IsBlock_ByMe } = route.params;

    let _menu = null;

    //--------------------------------------DB Manager Starts here ---------------------
    const select = async (tableName) => {
        db.transaction(function (tx) {

            tx.executeSql(
                'select * from ' + tableName,
                [],
                (tx, results) => {
                    console.log('select * from ' + tableName, results);
                    const temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        // console.log('row' + i, results.rows.item(i));
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
        });
        //    console.log('end res: ',res);
    }

    //--------------------------------------DB Manager ends here ---------------------



    const setHeader = () => {
        navigation.setOptions({
            headerTitle:
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    {route && route.params.Image ? <Image source={{ uri: `data:image/jpeg;base64,${route.params.Image}` }} style={styles.imgStyle} /> :
                        <Image source={image} style={styles.imgStyle} />}
                    <Text style={{ left: 10 }}>{Name}</Text>
                </TouchableOpacity>,
            headerRight: () => (
                <View style={{ right: 20 }}>
                    <Menu
                        ref={(ref) => (_menu = ref)}
                        button={<TouchableOpacity onPress={() => _menu.show()}><Entypo name='dots-three-vertical' size={20} /></TouchableOpacity>}>
                        {IsBlock_ByMe ? <MenuItem onPress={() => { _menu.hide(), unBlockFriend(route.params) }}>UnBlock</MenuItem>
                            : <MenuItem onPress={() => blockFriend(route.params)}>Block</MenuItem>
                        }
                        <MenuDivider />
                        <MenuItem onPress={() => { _menu.hide(), navigation.navigate('Profile', route.params) }}>View Profile</MenuItem>
                        <MenuDivider />
                       {route.params.Role==='Patient'&&user.Role==='Doctor'&&(<><MenuItem onPress={() => { _menu.hide(), get_file() }}>Import CCD</MenuItem>
                        <MenuDivider /></>)}
                        <MenuItem onPress={() => { _menu.hide(), clearConversation() }}>Clear Conversation</MenuItem>
                    </Menu>
                </View>
            ),
        })
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
            item.IsBlock_ByMe = false;
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
            item.IsBlock_ByMe = true;
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
    const getUnReadMessages=async()=>{
        const res= await getData(`${ApiUrls.Message._getMessages}?To_ID=${user.Phone}&From_ID=${route.params.Phone}`)
        if(res.status===200&&res.data.length>0){
        console.log('res of messages: ',res.data);
        dispatch({
          type: actions.SET_MESSAGES,
          payload: [...messages,...res.data]
        });
        const resp= await getData(`${ApiUrls.Message._deleteMessages}?To_ID=${user.Phone}&From_ID=${route.params.Phone}`);
        if(resp.status===200){
          console.log('deleted successfully');
        }
      }
    }
    useEffect(() => {
        if (route) {
            setHeader();
            create('Message' + route.params.Friend_ID);
            select('Message' + route.params.Friend_ID);
            getUnReadMessages();
        }
    }, [route])
    const get_file = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res) {
                setIsImport(true)
                const xml = await RNFS.readFile(res.uri);
                const sections = xml.split('<section>')
                const text = [];
                sections.forEach(ele => {
                    const start = ele.indexOf('<title>');
                    const end = ele.indexOf('</text>');
                    if (start > 0 && end > 0) {
                        const desired = ele && ele.slice(start, end);
                        var result = desired.split("<title>").join("<h1>");
                        result = result.split("<td>").join("<td style='padding:5px;color:red;font-size:30px;'>");
                        // console.log('res: ', result);
                        text.push(result + '</text>');
                    }
                });
                SETDATA(text);
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
    // console.log('msges: ', messages);

    return (
        <View
            // behavior={'padding'}
            style={styles.container}
        >
         
            {/* <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => select('Message' + route.params.Friend_ID)}>
                <Text>show</Text>
            </TouchableOpacity> */}
            {isImport &&
                <>
                    <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsImport(false)}>
                        <Text>Hide</Text>
                    </TouchableOpacity>
                    <View style={styles.ccdStyle}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
                            flexDirection: 'row',
                            paddingHorizontal: 10,
                        }}>
                            {DATA &&
                                DATA.map((item, index) => (
                                    <WebView originWhitelist={['*']}
                                        source={{ html: item }}
                                        style={{ width: 350, marginHorizontal: 30 }}
                                    />
                                ))}
                        </ScrollView>
                    </View>
                </>
            }
            <View style={styles.messagesStyle}>
                <FlatList
                    data={messages}
                    renderItem={({ item, index }) => (
                        <View >{(item.From_ID === Phone) ?
                            <View style={{ marginVertical: 5, alignItems: 'flex-start', }}>
                                {item.Message_Type === 'text' ?
                                    <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                        <Text style={{ fontSize: 20 }}>{item.Message_Content}</Text>
                                        <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                    </View>
                                    : item.Message_Type === 'image' ?
                                        <View style={{ borderRadius: 5, width: '30%' }}>
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
                                            <Text style={{ alignSelf: 'flex-start' }}>5:46</Text>
                                        </View>
                                }
                            </View>
                            : item.To_ID === Phone &&
                            <View style={{ marginVertical: 5, right: 0, alignItems: 'flex-end', }}>
                                {item.Message_Type === 'text' ?
                                    <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                        <Text style={{ fontSize: 20 }}>{item.Message_Content}</Text>
                                        <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                    </View>
                                    : item.Message_Type === 'image' ?
                                        <View style={{ borderRadius: 5, width: '30%' }}>
                                            <Image source={{ uri: item.Message_Content }} style={{ width: 70, height: 70, }} />
                                            <Text style={{ alignSelf: 'flex-end' }}>5:46</Text>
                                        </View>
                                        :
                                        <View style={{ borderRadius: 5 }}>
                                            <PlayAudio item={item.Message_Content} />
                                            <Text style={{ alignSelf: 'flex-end' }}>5:46</Text>
                                        </View>
                                }
                            </View>
                        }
                        </View>
                    )}
                    keyExtractor={(item, index) => index + ''}
                />
            </View>
            <View>
                <MessageBox route={route} />
            </View>
            {/* <View style={styles.menuStyle}>
            
            </View> */}
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
        flex: 3,
        backgroundColor: 'black'
    },
    messagesStyle: {
        flex: 10,
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
    }

});
export default Chat;