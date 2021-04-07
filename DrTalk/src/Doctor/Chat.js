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
const { height, width } = Dimensions.get('window');
const image = require('../assets/images/logo.jpg');
const Chat = ({ navigation, route }) => {
    const [state, dispatch] = useStateValue();
    const { messages, user } = state;
    const [DATA, SETDATA] = useState([]);
    const [xml, setXml] = useState('');
    const [uri, setUri] = useState(null);


   console.log(route);
   const setHeaderTitle=()=>{
        navigation.setOptions({ headerTitle: 
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
             {route&&route.params.image&&<Image source={{ uri: `data:image/jpeg;base64,${route.params.image}`}} style={styles.imgStyle}/>}
             <Text style={{left:10}}>{route.params.name}</Text>
        </TouchableOpacity>
        })
    }
    const downloadBase64 = async (index, item) => {
        console.log('tmitmtmtm  :', item);
        if (item.Message_type !== 'audio' && item.Message_type !== 'image') {
            alert('check type content hello');
            return;
        }


        if (item.Message_type === 'audio') {
            const resp = await getData(`${ApiUrls.message._GetAudioString}?Audio_key=${item.Message_content}`);
            if (resp && resp.data) {
                item.Is_download = true;
                item.Message_content = resp.data.Audio1;
            }
        }
        else {
            const resp = await getData(`${ApiUrls.message._GetImageString}?Image_key=${item.Message_content}`);
            if (resp && resp.data) {
                item.Is_download = true;
                item.Message_content = resp.data.Image1;
            }
        }

        const items = [...messages];
        items[index] = item;

        dispatch({
            type: actions.SET_MESSAGES,
            payload: items
        });

    }

useEffect(()=>{
    if(route){
        setHeaderTitle();
    } 
},[])
const onclickBtn = async () => {
    const xml = await RNFS.readFile(uri);// On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    // console.log('contents', xml);
    const sections = xml.split('<section>')
    const text = [];
    sections.forEach(ele => {
        // console.log('ele : ',ele);
        const start =ele.indexOf('<title>');
        const end =ele.indexOf('</text>');

    //    const secData= ele.split('</section>')
    //    const title=ele.split('<text>');
    //    console.log('[0]: ',secData[0].split('<text>')[0]);
    //    const start=secData&&secData[1].indexOf('<text>');
    //    const end=secData&&secData[1].indexOf('</text>');
    if(start>0&&end>0){
       const desired=ele&&ele.slice(start,end);
     
       var res = desired.replace("title", "h1");
       console.log('res: ',res);
       text.push(res+'</text>');
    }
    // text.join('</text>');
    console.log('------------------------------------------------',text);
    //    console.log('[1]: ',secData.split('<text>')[1]);

        // sec.push(secData);
    });
    SETDATA(text);
    // const sec=sections.split('</section>');
    // console.log('sec',sec);
}

const get_file = async () => {

    // fetch('content://com.coloros.filemanager.fileprovider/storage/emulated/0/GBWhatsApp/Media/GBWhatsApp%20Documents/Fahad.xml')
    // .then((response) => response.text())
    // .then((textResponse) => console.log('response is ', textResponse))
    // .catch((error) => {
    //     console.log(error);
    // });
    try {
       
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setUri(res.uri);
       

     onclickBtn();




        // var options = {ignoreComment: true, alwaysChildren: true};
        // var result = convert.xml2js(xml, options);
        // console.log('result : ',result);
        // console.log(xml.getElementsByTagName('section'));
        // var xml = new XMLParser().parseFromString(contents);    // Assume xmlText contains the example XML

        // console.log('getele table by parser id', xml.getElementsByTagName('section'));
        // console.log('xml: ', xml);
        // var obj = xml.getElementsByTagName('section');
        // // console.log(obj[0]);
        // // // myFun(obj);
        // const ar=[];
        // // console.log('0',obj[0].getElementsByTagName('table'));

        // for (let index = 0; index < obj.length; index++) {

        //     const title = obj[index].getElementsByTagName('title');
        //     var table = obj[index].getElementsByTagName('table');
        //     var tab = table[0];
        //     var tit = title[0];
        //     console.log(index, { tit, tab });
        //     var options = { compact:true,ignoreComment: true, spaces: 0,ignoreAttributes:true,fullTagEmptyElement:true,ignoreDeclaration:true};
        //     const thead=tab&&tab.getElementsByTagName('thead');
        //     const tr=thead&&thead.getElementsByTagName('tr');
        //     var headings='';
        //     tr&&tr.children.forEach(element => {
        //         headings.push(element.value);
        //     });
        //    console.log('headings : ',headings);
        //     var object={
        //         title:tit.value,
        //         // children:tab
        //     }

        //     var result = convert.js2xml(object, options);
        //     console.log('result :',result);

        // ar.push(result);

        // }

        // console.log('contents split on section ',contents.split('<section>'));
        // let arr = [];
        // contents.split('<section>').forEach(ele => {
        //     // arr.push(ele.split('</section>'));
        //     // console.log('element :');
        //     const item = ele.split('</section>')[0];

        //     const e = '<section>' + item + '</section>';
        //     arr.push(e);
        //     console.log('element :', e);
        // })
        // arr.forEach(ele=>{
        //     if(ele.includes('<table'))
        //     {
        //        console.log('[0]  : ',ele.split('<table')[0])
        //        console.log('[1]  : ',ele.split('<table')[1])

        //     }
        // })
        //  SETDATA(ar);
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
        } else {
            throw err;
        }
    }
    //   try {


    //   } catch (e) {
    //     alert("" + e);
    //   }




}
    return (
        <SafeAreaView style={styles.container} >
   
            <View style={styles.ccdStyle}>
            <TouchableOpacity style={{ padding: 5,backgroundColor: 'blue', justifyContent: 'center', alignItems: 'center' }} onPress={() => get_file()}>
                <Text>Click</Text>
            </TouchableOpacity>
            <FlatList
                // horizontal
                data={DATA}
                renderItem={({ item }) => (
                    <View>
                         <WebView originWhitelist={['*']}
                            source={{ html: item }}
                            style={{ height:100,width:'100%' }}
                        /> 
                    </View>
                )}
                keyExtractor={(item, index) => index + ''}
            />
            </View>
            <View style={styles.messagesStyle}>
                <FlatList
                    data={messages}
                    renderItem={({ item, index }) => (
                        <View >{(item.Message_from === route.params.Friend_phone) ?
                            <View style={{ marginVertical: 5, alignItems: 'flex-start', }}>
                                {item.Message_type === 'text' ?
                                    <View style={{ backgroundColor: 'skyblue', borderRadius: 5, width: '30%' }}>
                                        <Text style={{ fontSize: 20 }}>{item.Message_content}</Text>
                                        <Text style={{ alignSelf: 'flex-end' }}>5:40</Text>
                                    </View>
                                    : item.Message_type === 'image' ?
                                        <View style={{ borderRadius: 5, width: '30%' }}>
                                            {item.Is_download ?
                                                <View>{console.log('saaad ka msg ', item.Message_content)}
                                                    <Image source={{ uri: `data:image/jpeg;base64,${item.Message_content}` }} style={{ width: 70, height: 70, }} />
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
                                                <PlayAudio item={item.Message_content} />
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
            </View>
            <View style={{ flex: 1, justifyContent: 'center', }}>
                <MessageBox route={route} />
            </View>


        </SafeAreaView>
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
    ccdStyle:{
       flex:8,
    },
    messagesStyle: {
        flex: 10,
        // backgroundColor:'green'
    },   
    button: {
        borderRadius: 5,
        padding: 5,
        elevation: 2,
        margin: 5,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
   
});
export default Chat;