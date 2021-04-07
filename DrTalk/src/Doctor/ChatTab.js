import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View,TouchableOpacity, FlatList } from 'react-native';
import { ApiUrls } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import { getData } from '../API/ApiCalls'
import socketClient from "socket.io-client";
import CustomItem from '../CustomScreens/CustomItem';
import CustomHeader from '../CustomHeader';
const image = require('../assets/images/logo.jpg');
const ioClient = socketClient('http://192.168.1.106:3000');
const ChatTab = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allFriends, token, user,socket,messages} = state;
 
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


  const getConnection =async() => {
   
    console.log('io socket client ',ioClient);
    dispatch({
      type: actions.SET_SOCKET,
      payload: ioClient
    });
   
    console.log('token for connection :  ',token)
    ioClient.emit('auth', token);

    
    ioClient.on('clients', (allClients,n) => {
      const user = allClients[allClients.length - 1];
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
   
      messages.push(msg);

      console.log('message in main route: ', msg);
      dispatch({
        type: actions.SET_MESSAGES,
        payload: messages
      });
    });
   

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
  console.log('allfriends: ',allFriends);
  return (
    <>
      <CustomHeader navigation={navigation}/>
      <FlatList
        data={allFriends}
        keyExtractor={(item, index) => index + ''}
        itemBackgroundColor={'#fff'}
        renderItem={({ item }) => (
          <CustomItem item={{phone:item.Friend_phone,name:item.Friend_name,image:item.Friend_img,role:item.Friend_status}} screen={'ChatActivity'} navigation={navigation}/>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: 'lightgrey' }} />
        )}
      />
    </>
  );
};
export default ChatTab;
