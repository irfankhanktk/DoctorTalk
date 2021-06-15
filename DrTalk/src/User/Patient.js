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
import { create, create_CCD_Table, create_Friend_Table, create_User_Table, insert } from '../API/DManager';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');

const Patient = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { patients, user, } = state;

  const addFriend = async (item, index) => {
    // alert('added');
    console.log('item to add',item);
    const res = await postData(`${ApiUrls.Friend._sendFriendRequest}?From_ID=${user.Phone}&To_ID=${item.Phone}`);
    console.log('res : ',res);
    if (res.status === 200) {
      let temp = [...patients];
      //
      temp.splice(index, 1);
      dispatch({
        type: actions.SET_All_USERS,
        payload: temp
      });
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
        <TouchableOpacity onPress={() => addFriend(item, index)} style={{ backgroundColor: Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Color.white }}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const select = async (tableName) => {
    // alert(tableName);

    db.transaction(function (tx) {
      tx.executeSql(
        "select * from " + tableName+" where Role='Patient'",
        [],
        (tx, results) => {

          const temp = [];

          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }

          dispatch({
            type: actions.SET_All_PATIENTS,
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
  return (
    <>
      <CustomHeader navigation={navigation} />
      <SwipeableFlatList
        data={patients}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (item.Image === null &&
          <CustomItem item={item} navigation={navigation} />
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
export default Patient;
