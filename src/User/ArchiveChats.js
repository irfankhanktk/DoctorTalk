import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList ,Text,Alert} from 'react-native';
import { ApiUrls, IP } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import { getData } from '../API/ApiCalls'
import socketClient from "socket.io-client";
import CustomItem from '../CustomScreens/CustomItem';
import CustomHeader from '../CustomHeader';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CustomeSearchBar } from '../CustomScreens/CustomSearchBar';
import { create, create_CCD_Table, create_Friend_Table, create_User_Table, insert } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
import { decryptData } from '../EncrypDecrypt';
import Color from '../assets/Color/Color';
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
const ioClient = socketClient(`${IP}:3000`);
const ArchiveChats = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allFriends, token, user, socket, messages } = state;
  const [searchText, setSearchText] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);


  const UnArchive=async(item,index)=>{
      // alert('jjj')
      // const res=await getData(`${ApiUrls.Friend._alterArchive}?Friend_ID=${item?.Friend_ID}&Phone=${user?.Phone}&IsArchive=false`);
      // console.log('res of archive: ',res);
      // if(res.status===200){
      //   let temp=[...allFriends];
      //   item.IsArchive=false;
      //   temp[index]=item;
      //   dispatch({
      //     type: actions.SET_All_FRIENDS,
      //     payload: temp
      //   });
      // }
      // else{
      //   alert('Something went wrong!')
      // }
      Alert.alert(
        ' ',
        'Are You Sure To UnArchive this Chat',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'UnArchive', onPress: async() => {
              const res = await getData(`${ApiUrls.Friend._alterArchive}?Friend_ID=${item?.Friend_ID}&Phone=${user?.Phone}&IsArchive=false`);
              console.log('res of archive: ', res);
              if (res.status === 200) {
                let temp = [...allFriends];
                item.IsArchive = false;
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
          }
        ]
      );
  }

//   const getFriendsData = async () => {

//     const res_Friends = await getData(`${ApiUrls.Friend._getArchiveChats}?Phone=${user.Phone}`);
    
//     create_CCD_Table();
//     if (res_Friends.status === 200) {
//       create_Friend_Table(user.Phone);
//       if (res_Friends?.data.length > 0) {
//         dispatch({
//           type: actions.SET_All_FRIENDS,
//           payload: res_Friends?.data
//         });
        
//         res_Friends?.data.forEach(f => {
//           insert('Friend' + user.Phone, 'Friend_Type, Image, IsApproved ,IsBlock_ByFriend, IsBlock_ByMe,IsRejected, Name, Phone, Role, Status, IsArchive', [f.Friend_Type, f.Image, f.IsApproved, f.IsBlock_ByFriend, f.IsBlock_ByMe, f.IsRejected, f.Name, f.Phone, f.Role, f.Status,f.Is_Archive], ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?');
//         });
//         // insert()
//       }
//       else {
//         // // alert('jsjjsjj');
//         dispatch({
//           type: actions.SET_All_FRIENDS,
//           payload: []
//         });
//       }






//       const res = await getData(`${ApiUrls.User._getAllUsers}?Phone=${user.Phone}`);
   
//       if (res.status === 200) {
//         if (res?.data.length > 0) {
//         create_User_Table(user.Phone);
          
//           dispatch({
//             type: actions.SET_All_USERS,
//             payload: res.data?.filter(item=>item.Role==='Doctor')
//           });
          
//           res?.data?.forEach(f => {
//             insert('User' + user.Phone, 'Image, Name, Phone, Role', [f.Image, f.Name, f.Phone, f.Role], ' ?, ?, ?, ? ');
//           });
//         } else {
//           dispatch({
//             type: actions.SET_All_USERS,
//             payload: []
//           });
//         }
//       }
//       else {
//         alert('Check Your Internet Connection');
//         select('User' + user.Phone);
  
//       }






//     }
//     else {
//       alert('Check Your internet Connections');
//       select('Friend' + user.Phone);

//     }
//   }

//   const select = async (tableName) => {
//     // alert(tableName);

//     db.transaction(function (tx) {
//       tx.executeSql(
//        tableName.indexOf('Friend')>=0?  "select * from " + tableName +" where Friend_Type='Accepted'":'select * from ' + tableName,
//         [],
//         (tx, results) => {

//           const temp = [];

//           for (let i = 0; i < results.rows.length; ++i) {
//             temp.push(results.rows.item(i));
//           }
//           if (tableName === 'Friend' + user.Phone) {
//             dispatch({
//               type: actions.SET_All_FRIENDS,
//               payload: temp
//             });
//           }
//           else {
//             dispatch({
//               type: actions.SET_MESSAGES,
//               payload: temp
//             });
//           }

//         },
//         (tx, error) => {
//           console.log('error:', error);
//           // res = error;
//         }
//       );
//     });
//   }

//   const getConnection = async () => {

//     dispatch({
//       type: actions.SET_SOCKET,
//       payload: ioClient
//     });

//     ioClient.emit('auth', token);


//     ioClient.on('newUser', (connectedUser, ) => {
//       console.log('connectedUser :  ',connectedUser);
//       dispatch({
//         type: actions.SET_ClIENTS,
//         payload: ConnectedUser,
//       });



//       dispatch({
//         type: actions.SET_ONLINE,
//         payload: isOnline,
//       });
//     });
//     ioClient.on('msg', msg => {
//       create('Message' + msg.Friend_ID);
//       (async () => {
//         msg.Message_Content = await decryptData(JSON.parse(msg.Message_Content));
//         insert('Message' + msg.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download, Created_Date', [msg.From_ID, msg.To_ID, msg.Message_Content, msg.Message_Type, 0, 0, msg.Created_Date?.toString()], '?,?,?,?,?,?,?');
//         // console.log(' msg.Friend_ID on ' + msg.Friend_ID);
//         // console.log('old messages length: ', messages.length);
//         // console.log('new icomming msg: ', msg);
//         select('Message' + msg.Friend_ID);
//         // messages.push(msg);
//         // dispatch({
//         //   type: actions.SET_MESSAGES,
//         //   payload: messages
//         // });
//       })();


//     });

//   }

//   const searchFriends = (text) => {
//     setSearchText(text);
//     if (text.length > 0) {
//       const temp = [...allFriends];
//       text = text.toLowerCase();
//       const filteredData = temp.filter(item => {
//         const name = item.Name.toLowerCase();
//         if (name.indexOf(text) >= 0) {
//           return item;
//         }
//       });
//       setFilteredFriends(filteredData);
//     }
//   }
//   useEffect(() => {
//     if (user) {
//       getConnection();
//       getFriendsData();
//     }
//   }, [user]);
  console.log(allFriends[allFriends.length-1]);
  return (
    <>
      {/* <CustomHeader navigation={navigation} /> */}
      {/* <CustomeSearchBar onChangeText={(t) => searchFriends(t)} value={searchText} /> */}
      <FlatList
        data={searchText.length > 0 ? filteredFriends : allFriends}
        keyExtractor={(item, index) => index + ''}
        itemBackgroundColor={'#fff'}
        renderItem={({ item,index }) => (item.IsArchive&&
          <CustomItem item={item} screen={'ChatActivity'} onPress={() => navigation.navigate('ChatActivity', item)} longPress={()=>UnArchive(item,index)} flag={true} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
    </>
  );
};
export default ArchiveChats;
