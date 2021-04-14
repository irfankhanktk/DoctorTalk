import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView } from 'react-native';
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import MessageBox from '../MessageBox';
import PlayAudio from '../PlayAudio';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import FriendProfile from '../Navigators/FriendProfile';

import RNFS, { getAllExternalFilesDirs } from 'react-native-fs'
import DocumentPicker from 'react-native-document-picker';
import { WebView } from 'react-native-webview';
// import moment from 'moment'
// const image = require('C:/Users/Irfan/Desktop/ReactNative/DoctorTalk/DrTalk/src/images/logo.jpg');
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { height, width } = Dimensions.get('window');
const image = require('../assets/images/logo.jpg');
const Chat = ({ navigation, route }) => {
    const [state, dispatch] = useStateValue();
    const { messages, user } = state;
    const [DATA, SETDATA] = useState([]);
    const [xml, setXml] = useState('');
    const [uri, setUri] = useState(null);
    const [isUpload, setIsUpload] = useState(false);


    const setHeaderTitle = () => {
        navigation.setOptions({
            headerTitle:
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    {route && route.params.Image?<Image source={{ uri: `data:image/jpeg;base64,${route.params.Image}` }} style={styles.imgStyle} />:
                    <Image source={image} style={styles.imgStyle} />}
                    <Text style={{ left: 10 }}>{route.params.Name}</Text>
                </TouchableOpacity>
        })
    }
    const downloadBase64 = async (index, item) => {
        if (item.Message_Type !== 'audio' && item.Message_Type !== 'image') {
            alert('check type content hello');
            return;
        }

        if (item.Message_Type === 'audio') {
            const resp = await getData(`${ApiUrls.message._GetAudioString}?Audio_key=${item.Message_Content}`);
            if (resp && resp.data) {
                item.Is_download = true;
                item.Message_Content = resp.data.Audio1;
            }
        }
        else {
            const resp = await getData(`${ApiUrls.message._GetImageString}?Image_key=${item.Message_Content}`);
            if (resp && resp.data) {
                item.Is_download = true;
                item.Message_Content = resp.data.Image1;
            }
        }

        const items = [...messages];
        items[index] = item;

        dispatch({
            type: actions.SET_MESSAGES,
            payload: items
        });

    }

    useEffect(() => {
        if (route) {
            setHeaderTitle();
        }
    }, [])
    const get_file = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            if (res) {
                setIsUpload(true)
                setUri(res.uri);
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
                var str = text.join(' ');

                console.log('uri : ', RNFS.DocumentDirectoryPath);
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
    return (
        <View
            // behavior={'padding'}
            style={styles.container}
        >
                {isUpload ? (
                    <>
                        <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => setIsUpload(false)}>
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
                ) : <TouchableOpacity style={{ padding: 5, backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => get_file()}>
                    <Text>Pick CCD</Text>
                </TouchableOpacity>
                }
                <View style={styles.messagesStyle}>
                    {console.log('msges: ',messages[messages.length-1])}
                    <FlatList
                        data={messages}
                        renderItem={({ item, index }) => (
                            <View >{(item.From_ID === route.params.Phone) ?
                                <View style={{ marginVertical: 5, alignItems: 'flex-start', }}>
                                    {item.Message_Type === 'text' ?
                                        <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                            <Text style={{ fontSize: 20 }}>{item.Message_Content}</Text>
                                            <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                        </View>
                                        : item.Message_Type === 'image' ?
                                            <View style={{ borderRadius: 5, width: '30%' }}>
                                                {item.Is_download ?
                                                    <View>{console.log('saaad ka msg ', item.Message_Content)}
                                                        <Image source={{ uri: `data:image/jpeg;base64,${item.Message_Content}` }} style={{ width: 70, height: 70, }} />
                                                    </View>
                                                    :
                                                    <TouchableOpacity onPress={() => downloadBase64(index, item)}>
                                                        <MaterialCommunityIcons name={'download'} color='black' size={20} />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            :
                                            <View style={{ borderRadius: 5, }}>
                                                {item.Is_download ?
                                                    <PlayAudio item={item.Message_Content} />
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
                                : item.To_ID === route.params.Phone &&
                                <View style={{ marginVertical: 5, right: 0, alignItems: 'flex-end', }}>
                                    {item.Message_Type === 'text' ?
                                        <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                            <Text style={{ fontSize: 20 }}>{item.Message_Content}</Text>
                                            <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                        </View>
                                        : item.Message_Type === 'image' ?
                                            <View style={{ borderRadius: 5, width: '30%' }}>
                                                <Image source={{ uri: `data:image/jpeg;base64,${item.Message_Content}` }} style={{ width: 70, height: 70, }} />
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
            <MessageBox route={route}/>
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

});
export default Chat;