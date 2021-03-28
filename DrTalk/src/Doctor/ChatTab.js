import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import { getData } from '../API/ApiCalls'
import { Sessions } from '../AuthScreens/Sessions';
import socketClient from "socket.io-client";

const image = require('E:/React_Native/DoctorTalk/DrTalk/src/images/logo.jpg');
const ioClient = socketClient('http://192.168.1.109:3000');
// import Contacts from 'react-native-contacts'
const ChatScreen = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allFriends, token, user,socket,messages} = state;
  // const { UPhone, UType } = user;
  // const [allPatients,setAllPatients]=useState([]);
  //    console.log('my fr: ',allFriends);
  // console.log('uphone = ',UPhone);
  // console.log('user : ',user);
  // const setUser = async () => {
  //   const jsonValue = await AsyncStorage.getItem(Sessions.user);
  //   if (jsonValue != null) {
  //     let details = JSON.parse(jsonValue);
  //     if (details) {
  //       dispatch({ type: actions.SET_USER, payload: details });
  //     }
  //   }
  // };
  // const setToken = async () => {
  //   const jsonValue = await AsyncStorage.getItem(Sessions.user);
  //   if (jsonValue != null) {
  //     let details = JSON.parse(jsonValue);
  //     if (details) {
  //       dispatch({ type: actions.SET_TOKEN, payload: details });
  //     }
  //   }
  // };
  const getFriendsData = async () => {
    console.log('socket after con: ',socket)
    const res_Friends = await getData(`${ApiUrls.user._getMyFriends}?UPhone=${user.UPhone}`);
    //  console.log('res friends: ', res_Friends);
    if (res_Friends && res_Friends.data !== 'null') {
      dispatch({
        type: actions.SET_All_FRIENDS,
        payload: res_Friends.data
      });

    }
    else if (res_Friends && res_Friends.data === 'null') {
      // alert('no friends');
      dispatch({
        type: actions.SET_All_FRIENDS,
        payload: []
      });
    }
  }

  // useEffect(() => {
  //   console.log('user in useeffect :  ',user);
  // //  setLoading(true);
  //   setUser();
  //   setToken();
  //   // getFriendsData();
  // }, []);
  const getConnection =async() => {
    // const ioClient = socketClient('http://192.168.1.104:3000');
    console.log('io socket client ',ioClient);
    dispatch({
      type: actions.SET_SOCKET,
      payload: ioClient
    });
    // setSocket(ioClient);
    // let token='jkjk';
    console.log('token for connection :  ',token)
    ioClient.emit('auth', token);

    // console.log('your are connented');
    ioClient.on('clients', (allClients,n) => {
      const user = allClients[allClients.length - 1];
      console.log('user =====: ', n);
      console.log('cleints arr: ', allClients);
      dispatch({
        type: actions.SET_USER,
        payload: token
      });
      dispatch({
        type: actions.SET_ClIENTS,
        payload: allClients,
      });
    });


    ioClient.on('msg', msg => {
      console.log('msg received', msg);
      console.log('messages array===== :', messages);
      // setMessages(msg);
      messages.push(msg);

      console.log('message in main route: ', msg);
      dispatch({
        type: actions.SET_MESSAGES,
        payload: messages
      });
    });
    // ioClient.on('disconnect', function () {
    //   ioClient.emit('disconnected');
    // });

  }
  useEffect(() => {
    
  }, []);
  useEffect(() => {
    if (user) {

      console.log('chal gya [user]', user);
      getConnection();
      getFriendsData();
    
    }
  }, [user]);
  return (
    <View>
      <FlatList
        data={allFriends}
        keyExtractor={(item, index) => index + ''}
        itemBackgroundColor={'#fff'}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatActivity',item)} style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
            <View>
              <Text style={{ left: 20 }}>{item.Friend_name}</Text>
              <Text style={{ left: 20 }}>{item.Friend_status}</Text>
            </View>

          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: 'lightgrey' }} />
        )}
      />
    </View>
  );
};
export default ChatScreen;
