import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, TouchableOpacity, FlatList, Text, Settings, Alert } from 'react-native';
import { ApiUrls, IP } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import { getData } from '../API/ApiCalls'
import socketClient from "socket.io-client";
import CustomItem from '../CustomScreens/CustomItem';
import CustomHeader from '../CustomHeader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CustomeSearchBar } from '../CustomScreens/CustomSearchBar';
import { create, create_CCD_Table, create_Friend_Table, create_group, create_User_Table, insert, update } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
import { decryptData } from '../EncrypDecrypt';
import Color from '../assets/Color/Color';
import Foundation from 'react-native-vector-icons/Foundation'
import ArchiveRefer from '../CustomScreens/ArchiveReferModal';
import PushNotification from "react-native-push-notification";
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Sessions } from '../AuthScreens/Sessions';
import Groups from './Groups';
import { decrypt, encrypt } from './EncryDec';

var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
const ioClient = socketClient(`${IP}:3000`);



const MyFriends = ({ navigation }) => {


  const isFocus = useIsFocused();
  const [state, dispatch] = useStateValue();
  const { allFriends, token, user, socket, messages, groups } = state;
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [archiveReferModal, setArchiveReferModal] = useState({ item: {}, bool: false, index: 0 });

  const manageNotification = (Name) => {
    console.log('heloo');
    PushNotification.localNotification({
      channelId: "channel-id",
      title: 'Message',
      message: 'You have a new Message From ' + Name,
    });
    // PushNotification.localNotificationSchedule({
    //     channelId: "channel-id", 
    //     title:'title is here',
    //     message:'i am message after 20 sec',
    //     date:new Date(Date.now()+20*1000),
    //     allowWhileIdle:true,
    // });
  }
  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "Khan channel", // (required)
        //   channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        //   playSound: false, // (optional) default: true
        //   soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        //   importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  const getFriendsData = async () => {
    setLoading(true);
    const res_Friends = await getData(`${ApiUrls.Friend._getMyFriends}?Phone=${user.Phone}`);
    console.log('res of frnd: ', res_Friends.status);
    create_CCD_Table();
    if (res_Friends.status === 200) {
      create_Friend_Table(user.Phone);
      if (res_Friends?.data.length > 0) {
        dispatch({
          type: actions.SET_All_FRIENDS,
          payload: res_Friends?.data
        });

        res_Friends?.data.forEach(f => {
          insert('Friend' + user.Phone, 'Friend_Type, Image, IsApproved ,IsBlock_ByFriend, IsBlock_ByMe,IsRejected, Name, Phone, Role, Status, IsArchive', [f.Friend_Type, f.Image, f.IsApproved, f.IsBlock_ByFriend, f.IsBlock_ByMe, f.IsRejected, f.Name, f.Phone, f.Role, f.Status, f.Is_Archive], ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?');
        });
      }
      else {
        dispatch({
          type: actions.SET_All_FRIENDS,
          payload: []
        });
      }
    } else {
      alert('Check Your internet Connections');
      select('Friend' + user.Phone);

    }



    const res = await getData(`${ApiUrls.User._getAllUsers}?Phone=${user.Phone}`);
    console.log('res of doctor:', res.data);
    if (res.status === 200) {
      if (res?.data.length > 0) {
        create_User_Table(user.Phone);

        dispatch({
          type: actions.SET_All_DOCTORS,
          payload: res.data?.filter(item => item.Role === 'Doctor')
        });

        res?.data?.forEach(f => {
          insert('User' + user.Phone, 'Image, Name, Phone, Role, Friend_Type', [f.Image, f.Name, f.Phone, f.Role, f.Friend_Type], ' ?, ?, ?, ?, ?');
        });
      } else {
        dispatch({
          type: actions.SET_All_DOCTORS,
          payload: []
        });
      }
    }
    else {
      alert('Check Your Internet Connection');
      select('User' + user.Phone);

    }

    setLoading(false);
  }

  const select = async (tableName) => {

    db.transaction(function (tx) {
      tx.executeSql(
        tableName === 'Friend' + user.Phone ? "select * from " + tableName + " where Friend_Type='Accepted'"
          : 'select * from ' + tableName,
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
          else if (tableName === 'User' + user.Phone) {
            dispatch({
              type: actions.SET_All_DOCTORS,
              payload: temp
            });
          } else {
            console.log('mesges: ', temp);
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
          }


        },
        (tx, error) => {
          console.log('error:', error);
          // res = error;
        }
      );



    });
  }
  const select_Group_Messages = (To_ID) => {

    db.transaction(function (tx) {
      tx.executeSql(
        'select * from Group' + user.Phone+' where To_ID='+To_ID,
        [],
        (tx, results) => {
          const temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          console.log('temp: ', temp);
          let groupData = temp.reduce((acc, item) => {
            if (!acc[item.Created_Date])
              acc[item.Created_Date] = [];
            acc[item.Created_Date].push(item);
            return acc;
          }, {});

          dispatch({
            type: actions.SET_Group_Messages,
            payload: Object.values(groupData)
          });

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


    ioClient.on('newUser', connectedUser => {
      update('Friend', 'Status=?', 'where Phone=?', [1, connectedUser.Phone]);
      // dispatch({
      //   type: actions.SET_ONLINE,
      //   payload: isOnline,
      // });
    });
    ioClient.on('msg', msg => {
      create('Message' + msg.Friend_ID);
      (async () => {

        // if (msg.Message_Type === 'text')
        msg.Message_Content = await decryptData(JSON.parse(msg.Message_Content));
        insert('Message' + msg.Friend_ID, 'From_ID,To_ID,Sent_By,Message_Content,Message_Type,Is_Seen,Is_Download, Created_Date,Created_Time', [msg.From_ID, msg.To_ID, msg.Message_Content, msg.Message_Type, 0, 0, msg.Created_Date, msg.Created_Time], '?,?,?,?,?,?,?,?');
        // console.log(' msg.Friend_ID on ' + msg.Friend_ID);
        // console.log('old messages length: ', messages.length);
        // console.log('new icomming msg: ', msg);
        manageNotification(msg.From_ID);
        select_Group_Messages();
        // messages.push(msg);
        // dispatch({
        //   type: actions.SET_MESSAGES,
        //   payload: messages
        // });
      })();


    });
    ioClient.on('msg', msg => {
      create('Message' + msg.Friend_ID);
      (async () => {

        // if (msg.Message_Type === 'text')
        msg.Message_Content = await decryptData(JSON.parse(msg.Message_Content));
        insert('Message' + msg.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download, Created_Date,Created_Time', [msg.From_ID, msg.To_ID, msg.Message_Content, msg.Message_Type, 0, 0, msg.Created_Date, msg.Created_Time], '?,?,?,?,?,?,?,?');
        // console.log(' msg.Friend_ID on ' + msg.Friend_ID);
        // console.log('old messages length: ', messages.length);
        // console.log('new icomming msg: ', msg);
        manageNotification(msg.From_ID);
        select('Message' + msg.Friend_ID);
        // messages.push(msg);
        // dispatch({
        //   type: actions.SET_MESSAGES,
        //   payload: messages
        // });
      })();
    });

    //group mesage
    ioClient.on('Group', msg => {
      create_group('Group' + user.Phone);
      (async () => {
        // if (msg.Message_Type === 'text')
        msg.Message_Content = await decryptData(JSON.parse(msg.Message_Content));
        console.log(' msg.Friend_ID on msgggg ' + msg);
         
        insert('Group' + user.Phone, 'From_ID,To_ID,Sent_BY,Message_Content,Message_Type,Is_Seen,Is_Download, Created_Date,Created_Time', [msg.From_ID, msg.To_ID, msg.Sent_BY , msg.Message_Content, msg.Message_Type, 0, 0, msg.Created_Date, msg.Created_Time], '?,?,?,?,?,?,?,?,?');
        // console.log('old messages length: ', messages.length);
        // console.log('new icomming msg: ', msg);
        manageNotification(msg.From_ID);
        select_Group_Messages(msg.To_ID);
        // messages.push(msg);
        // dispatch({
        //   type: actions.SET_MESSAGES,
        //   payload: messages
        // });
      })();
    });
    ioClient.on('onGroupCreated', groupInfo => {
       console.log('group',groupInfo);
       getUserGroups();
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
  const addToArchive = async (item, index) => {

    const res = await getData(`${ApiUrls.Friend._alterArchive}?Friend_ID=${item?.Friend_ID}&Phone=${user?.Phone}&IsArchive=true`);
    // console.log('res of archive: ', res);
    if (res.status === 200) {
      let temp = [...allFriends];
      item.IsArchive = true;
      temp[index] = item;
      dispatch({
        type: actions.SET_All_FRIENDS,
        payload: temp
      });
    }
    else {
      alert('Something went wrong!')
    }
  }
  const logout = async () => {
    console.log('logout preessesd');
    AsyncStorage.removeItem(Sessions.user);
    dispatch({
      type: actions.SET_TOKEN,
      payload: null
    });
    dispatch({
      type: actions.SET_USER,
      payload: null
    });
  };
  const verifyDoctor = async () => {

    const res = await getData(`${ApiUrls.auth.signIn}?Phone=${user.Phone}`);

    if (res?.status === 200 && res?.data === "Not Approved") {
      alert("Your are not approved yet. Please Wait for Approval");
      logout();
    }
    else if (res?.status === 200 && res?.data === "Block") {
      alert("Your are rejected by admin. Please Wait for Approval");
      logout();
    }



  }
  const getUserGroups = async () => {
    const resp = await getData(`${ApiUrls.Group._getGroups}?Phone=${user.Phone}`);
    if (resp.status === 200) {
      dispatch({
        type: actions.SET_Groups,
        payload: resp?.data,
      })
    } else {
      alert('something went wrong');
    }
  }
  useEffect(() => {
    // if (user.Role === 'Doctor') {
      getUserGroups();
    // }
  }, [isFocus])
  useEffect(() => {

    if (user) {
      if (user.Role === 'Doctor')
        verifyDoctor();
      getConnection();
      getFriendsData();
      getUserGroups();
      createChannel();
    }
  }, [user]);
  return (
    <>
      <CustomActivityIndicator visible={loading} />
      <CustomHeader navigation={navigation} />
      <CustomeSearchBar onChangeText={(t) => searchFriends(t)} value={searchText} />
      {groups?.length > 0 &&
        <TouchableOpacity style={{ alignItems: 'center', flexDirection: 'row', paddingHorizontal: 20, height: 40, backgroundColor: 'white', marginBottom: 10 }} onPress={() => navigation.navigate('Groups')}>
          <MaterialIcons name={'groups'} size={25} Color={Color.btnPrimary} />
          <Text>  Groups</Text>
        </TouchableOpacity>}
      <FlatList
        data={searchText.length > 0 ? filteredFriends : allFriends}
        keyExtractor={(item, index) => index + ''}
        itemBackgroundColor={'#fff'}
        renderItem={({ item, index }) => (!item.IsArchive &&
          <CustomItem item={item} screen={'ChatActivity'} onPress={() => navigation.navigate('ChatActivity', item)} longPress={() => setArchiveReferModal({ ...archiveReferModal, bool: true, index: index, item: item })} flag={true} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
        ListFooterComponent={allFriends?.some(ele => ele?.IsArchive) &&
          <TouchableOpacity onPress={() => navigation.navigate('ArchiveChats')} style={{ alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 20, flexDirection: 'row', height: 30, backgroundColor: '#fffff', marginTop: 10 }}>
            <Foundation name={'archive'} size={20} /><Text>{'     '}Archive Chats</Text>
          </TouchableOpacity>
        }
      />
      <ArchiveRefer
        item={archiveReferModal.item}
        addToArchive={() => {
          addToArchive(archiveReferModal.item, archiveReferModal.index);
          setArchiveReferModal({ ...archiveReferModal, bool: false })
        }}
        referToDotor={() => {
          setArchiveReferModal({ ...archiveReferModal, bool: false });
          navigation.navigate('ReferTo', archiveReferModal.item);
        }}
        visible={archiveReferModal.bool}
        setVisible={() => { setArchiveReferModal({ ...archiveReferModal, bool: false }) }}
      />

    </>
  );
};
export default MyFriends;
