import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
// import moment from 'moment'
import { useStateValue } from './Store/StateProvider';
import { actions } from './Store/Reducer';
const image = require('C:/Users/Irfan/Desktop/ReactNative/DrPatient/src/images/logo.jpg');
// import socketClient from "socket.io-client";
//const SERVER = "http://192.168.0.126:8080";
const SocketChat = ({navigation,route}) => {
    const [text, setText] = useState('');
    // const [socket, setSocket] = useState('');
    const [messages, setMessages] = useState('helo oo');

    const [state, dispatch] = useStateValue();
    const {user,msg,socket} = state;
    const {contact,name,}=route.params.token;

    const onsubmit = () => {
        if(socket==={}){
            alert('no internet connection');
            return;
        }
        console.log('socket in onsubmit',socket);
        socket.emit('chat message', {
            toId:route.params.id,
            fromId:user.id,
            fromName:user.token.name,
            fromContact:user.token.contact,
            msg:text});
        // socket.on('msg', msg => {
        //     console.log('msg received',msg);
        //     setMessages(msg);
        // });
        setText('');
    };
    const receiveMessages = async () => {
        // console.log('socket in useeffect ',socket);
        // if (socket!='') {
        //     socket.on('chat message', msg => {
        //         console.log('msg received',msg);
        //         setMessages(msg);
        //     });
        // }
    };
    useEffect(() => {
        console.log('route params token:  ',route.params.token);
        // const ioClient=socketClient('http://192.168.1.110:3000');
        // setSocket(ioClient);
        // receiveMessages();
        // ioClient.emit('chat message', 'hi');
        // ioClient.on('msg', msg => {
        //     // console.log('msg received',msg);
        //     setMessages(msg);
        // });
        // ioClient.on('disconnect', function () {
        //     ioClient.emit('disconnected');
        // });
    }, []);
           
    return (
        <View>
            <TextInput value={text} placeholder='write something' onSubmitEditing={() => onsubmit()} onChangeText={(t) => setText(t)} />
            <View style={{ borderBottomWidth: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', }}>
                <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={image} />
                <Text>{name}</Text>
            </View>
            <View style={{ borderBottomWidth: 1, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', }}>
                {/* <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={require('C:/Users/Irfan/Desktop/ReactNative/ChatApp/src/component/download2.jpg')} /> */}
            </View>
           <Text>msg : {msg}</Text>
           <Text>messages : {messages}</Text>
        </View>

    );
};

export default SocketChat;
