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
import { insert } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
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
    if (res_Friends.status === 200) {
      dispatch({
        type: actions.SET_All_FRIENDS,
        payload: res_Friends.data
      });
    }
    else {
      alert('Check Your internet Connections');
      dispatch({
        type: actions.SET_All_FRIENDS,
        payload: []
      });
    }
  }

  const select = async (tableName) => {
    alert(tableName);
  
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

  const getConnection = async () => {

    dispatch({
      type: actions.SET_SOCKET,
      payload: ioClient
    });

    ioClient.emit('auth', token);


    ioClient.on('clients', (allClients, n) => {
      dispatch({
        type: actions.SET_ClIENTS,
        payload: allClients,
      });
    });
    ioClient.on('msg', msg => {
      insert('Message' + msg.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download', [msg.From_ID, msg.To_ID, msg.Message_Content, msg.Message_Type, 0, 0], '?,?,?,?,?,?');
      select('Message' + msg.Friend_ID);
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
