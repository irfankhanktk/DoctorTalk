import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal'
import Entypo from 'react-native-vector-icons/Entypo'
import * as Progress from 'react-native-progress';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import MessageBox from '../MessageBox';
import PlayAudio from '../PlayAudio';
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
    const { token, messages, socket, user, audio } = state;
    const [isDownload, setIsDownload] = useState(false);

    const getFile = (contentKey, contentType) => {
        if (contentType === '')
            setIsDownload(true);
    }
    // const {contact,name,}=route.params.token;




    return (
        <View style={styles.container}>
            <View style={{ width: width, height: height * 0.25, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={image} style={styles.imgStyle} />
                {/* <Image source={{uri: `data:image/png;base64,${gUri}`}} style={{ width: 70, height: 70, borderRadius: 50 }} /> */}
                <Text>{route.params.Friend_name}</Text>
                <Text>{route.params.Friend_phone}</Text>
                <Text>{route.params.Friend_status}</Text>
            </View>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View>{console.log('item : ', item)}{(item.Message_from === route.params.Friend_phone) ?
                        <View style={{ marginVertical: 5, alignItems: 'flex-start', }}>
                            {item.Message_type === 'text' ?
                                <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                    <Text style={{ fontSize: 20 }}>{item.Message_content}</Text>
                                    <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                </View>
                                : item.Message_type === 'image' ?
                                    <View style={{ borderRadius: 5, width: '30%' }}>
                                        {isDownload ?
                                            <Image source={{ uri: `data:image/jpeg;base64,${item.Message_content}` }} style={{ width: 70, height: 70, }} />
                                            :
                                            <TouchableOpacity onPress={() => getFile(item.Message_content, item.Message_type)}>
                                                <MaterialCommunityIcons name={'download'} color='black' size={20} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    :
                                    <View style={{ borderRadius: 5, }}>
                                        {isDownload ?
                                            <PlayAudio item={item.Message_content} />
                                            :
                                            <View style={{flexDirection:'row',width:150,justifyContent:'space-around'}}>
                                                <TouchableOpacity onPress={() => getFile(item.Message_content, item.Message_type)}>
                                                    <MaterialCommunityIcons name={'download'} color='black' size={20} />
                                                </TouchableOpacity>
                                                <View style={{justifyContent:'center'}}>
                                                <Progress.Bar progress={0} width={100} />
                                                </View>
                                             
                                            </View>
                                        }
                                        <Text style={{ alignSelf: 'flex-start' }}>5:46</Text>
                                    </View>
                            }
                        </View>
                        : item.Message_to === route.params.Friend_phone &&
                        <View style={{ marginVertical: 5, right: 0, alignItems: 'flex-end', }}>
                            {item.Message_type === 'text' ?
                                <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                    <Text style={{ fontSize: 20 }}>{item.Message_content}</Text>
                                    <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                </View>
                                : item.Message_type === 'image' ?
                                    <View style={{ borderRadius: 5, width: '30%' }}>
                                        <Image source={{ uri: `data:image/jpeg;base64,${item.Message_content}` }} style={{ width: 70, height: 70, }} />
                                        <Text style={{ alignSelf: 'flex-end' }}>5:46</Text>
                                    </View>
                                    :
                                    <View style={{ borderRadius: 5 }}>
                                        {console.log('hello audio:::: ', item.Message_content)}
                                        <PlayAudio item={item.Message_content} />
                                        <Text style={{ alignSelf: 'flex-end' }}>5:46</Text>
                                    </View>
                            }
                        </View>
                    }
                    </View>
                )}
                keyExtractor={(item, index) => index + ''}
            />
            {/* <Image source={{ uri: uri }} style={{ height: 100, width: 100 }} />
            <Image source={{ uri: gUri }} style={{ height: 100, width: 100 }} /> */}
            <View style={styles.footer}>
                <MessageBox route={route} />
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
    imgStyle: {
        width: 70,
        height: 70,
        borderRadius: 50
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