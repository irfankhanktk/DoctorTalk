import React, { useEffect } from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet, } from 'react-native';
import { getData, postData } from '../API/ApiCalls';
import SwipeableFlatList from 'react-native-swipeable-list';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import Role from './Role';
import { create, create_CCD_Table, create_Friend_Table, create_User_Table, insert, update } from '../API/DManager';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';
import { openDatabase } from 'react-native-sqlite-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');

const AllUser = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { doctors, user, } = state;

  const addFriend = async (item, index) => {
    // alert('added');
    console.log('item to add',item);
    const res = await getData(`${ApiUrls.Friend._sendFriendRequest}?From_ID=${user.Phone}&To_ID=${item.Phone}`);
    console.log('res of dr frd : ',res);
    if (res.status === 200) {
      update('User' + user.Phone,'Friend_Type=?',' where Phone=?',[res?.data?.Friend_Type,user.Phone]);
      item.Friend_Type=res?.data?.Friend_Type;
      let temp = [...doctors];
      temp[index]=item;
      dispatch({
        type: actions.SET_All_DOCTORS,
        payload: temp
      });
    }else{
      throw new Error('Something Went Wrong');
    }
  }
  const quickActions = (index, item) => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        {/* <TouchableOpacity onPress={() => alterRequest(item, index, "Rejected")} style={{ backgroundColor: '#800000', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{color:Color.white}}>Cancel</Text>
          </TouchableOpacity> */}
        <TouchableOpacity onPress={() => item?.Friend_Type?addFriend(item, index):addFriend(item, index)} style={{flexDirection:'row',backgroundColor: Color.primary, height: 80, width: '25%', justifyContent: 'space-around', alignItems: 'center',borderTopLeftRadius:10,borderBottomLeftRadius:10 }}>
          <Text style={{ color: Color.white,fontWeight:'bold' }}>{item?.Friend_Type?'Cancel':'Join'}</Text>
          <FontAwesome5 name={item?.Friend_Type?'skull-crossbones':'user-friends'} size={20} color={Color.white}/>
        </TouchableOpacity>
      </View>
    );
  }

  const select = async (tableName) => {
    // alert(tableName);

    db.transaction(function (tx) {
      tx.executeSql(
        "select * from " + tableName+" where Role='Doctor'",
        [],
        (tx, results) => {

          const temp = [];

          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }

          dispatch({
            type: actions.SET_All_DOCTORS,
            payload: temp
          });

        },
        (tx, error) => {
          console.log('error:', error);
          // res = error;
        }
      );
    });
  }
  const getUsersData = async () => {
    // const res = await getData(`${ApiUrls.User._getAllUsers}?Phone=${user.Phone}`);
   
    // if (res.status === 200) {
    //   if (res?.data.length > 0) {
    //   create_User_Table(user.Phone);
        
    //     dispatch({
    //       type: actions.SET_All_USERS,
    //       payload: res.data?.filter(item=>item.Role==='Doctor')
    //     });
        
    //     res?.data?.forEach(f => {
    //       insert('User' + user.Phone, 'Image, Name, Phone, Role', [f.Image, f.Name, f.Phone, f.Role], ' ?, ?, ?, ? ');
    //     });
    //   } else {
    //     dispatch({
    //       type: actions.SET_All_USERS,
    //       payload: []
    //     });
    //   }
    // }
    // else {
    //   alert('Check Your Internet Connection');
      select('User' + user.Phone);

    // }
  }
  useEffect(() => {
    if (user) {

      getUsersData();

    }
  }, [user]);
  console.log(doctors);
  return (
    <>
      <CustomHeader navigation={navigation} />
      <SwipeableFlatList
        data={doctors}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (item.Image === null &&
          <CustomItem item={item} navigation={navigation} onPress={()=>{}} longPress={()=>{}}/>
        )}
        onEndReachedThreshold={0.5}
        maxSwipeDistance={wp('25%')}
        shouldBounceOnMount={false}
        renderQuickActions={({ index, item }) => quickActions(index, item)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
    </>
  );
};
export default AllUser;
