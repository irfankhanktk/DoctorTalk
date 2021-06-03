import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { ApiUrls, IP } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import { getData } from '../API/ApiCalls'
import socketClient from "socket.io-client";
import CustomItem from '../CustomScreens/CustomItem';
import CustomHeader from '../CustomHeader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CustomeSearchBar } from '../CustomScreens/CustomSearchBar';
import { create, create_CCD_Table, create_Friend_Table, insert } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
import { decryptData } from '../EncrypDecrypt';
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
const ioClient = socketClient(`${IP}:3000`);
const MyFriends = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allFriends, token, user, socket, messages } = state;
  const [searchText, setSearchText] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const getFriendsData = async () => {
    const res_Friends = await getData(`${ApiUrls.Friend._getMyFriends}?Phone=${user.Phone}`);
    create_Friend_Table(user.Phone);
    create_CCD_Table();
    if (res_Friends.status === 200) {
    
      if (res_Friends?.data.length > 0) {
        dispatch({
          type: actions.SET_All_FRIENDS,
          payload: res_Friends?.data
        });
        
        res_Friends?.data.forEach(f => {
          insert('Friend' + user.Phone, 'Friend_Type, Image, IsApproved ,IsBlock_ByFriend, IsBlock_ByMe,IsRejected, Name, Phone, Role', [f.Friend_Type, f.Image, f.IsApproved, f.IsBlock_ByFriend, f.IsBlock_ByMe, f.IsRejected, f.Name, f.Phone, f.Role], ' ?, ?, ?, ?, ?, ?, ?, ?, ? ');
        });
        // insert()
      }
      else {
        // // alert('jsjjsjj');
        dispatch({
          type: actions.SET_All_FRIENDS,
          payload: []
        });
      }
    }
    else {
      alert('Check Your internet Connections');
      select('Friend' + user.Phone);

    }
  }

  const select = async (tableName) => {
    // alert(tableName);

    db.transaction(function (tx) {
      tx.executeSql(
        'select * from ' + tableName,
        [],
        (tx, results) => {

          const temp = [];

          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          if (tableName === 'Friend' + user.Phone) {
            dispatch({
              type: actions.SET_All_FRIENDS,
              payload: temp
            });
          }
          else {
            dispatch({
              type: actions.SET_MESSAGES,
              payload: temp
            });
          }

        },
        (tx, error) => {
          console.log('error:', error);
          // res = error;
        }
      );
    });
  }

  const getConnection = async () => {

    dispatch({
      type: actions.SET_SOCKET,
      payload: ioClient
    });

    ioClient.emit('auth', token);


    ioClient.on('clients', (allClients, isOnline) => {
      dispatch({
        type: actions.SET_ClIENTS,
        payload: allClients,
      });
      dispatch({
        type: actions.SET_ONLINE,
        payload: isOnline,
      });
    });
    ioClient.on('msg', msg => {
      create('Message' + msg.Friend_ID);
      (async () => {
        msg.Message_Content = await decryptData(JSON.parse(msg.Message_Content));
        insert('Message' + msg.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download, Created_Date', [msg.From_ID, msg.To_ID, msg.Message_Content, msg.Message_Type, 0, 0, msg.Created_Date?.toString()], '?,?,?,?,?,?,?');
        console.log(' msg.Friend_ID on ' + msg.Friend_ID);
        console.log('old messages length: ', messages.length);
        console.log('new icomming msg: ', msg);
        select('Message' + msg.Friend_ID);
        // messages.push(msg);
        // dispatch({
        //   type: actions.SET_MESSAGES,
        //   payload: messages
        // });
      })();


    });

  }

  const searchFriends = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const temp = [...allFriends];
      text = text.toLowerCase();
      const filteredData = temp.filter(item => {
        const name = item.Name.toLowerCase();
        if (name.indexOf(text) >= 0) {
          return item;
        }
      });
      setFilteredFriends(filteredData);
    }
  }
  useEffect(() => {
    if (user) {
      getConnection();
      getFriendsData();
    }
  }, [user]);
  return (
    <>
      <CustomHeader navigation={navigation} />
      <CustomeSearchBar onChangeText={(t) => searchFriends(t)} value={searchText} />
      <FlatList
        data={searchText.length > 0 ? filteredFriends : allFriends}
        keyExtractor={(item, index) => index + ''}
        itemBackgroundColor={'#fff'}
        renderItem={({ item }) => (
          <CustomItem item={item} screen={'ChatActivity'} navigation={navigation} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
    </>
  );
};
export default MyFriends;
