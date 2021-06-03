import React, { useEffect } from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet, } from 'react-native';
import { getData } from '../API/ApiCalls';
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

const AllUser = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allUsers, user, } = state;

  const addFriend = async (item, index) => {
    alert('added');
    const res = await getData(`${ApiUrls.Friend._addFriend}?To_ID=${user.Phone}&From_ID=${item.Phone}&Friend_Type=${fType}`);
    if (res.status === 200) {
      let temp = [...allRequests];
      temp.splice(index, 1);
      dispatch({
        type: actions.SET_All_REQUESTS,
        payload: temp
      });
      if (fType === 'Accepted') {
        dispatch({
          type: actions.SET_All_FRIENDS,
          payload: [...allFriends, item]
        });
      }
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
        <TouchableOpacity onPress={() => addFriend(item, index, "Accepted")} style={{ backgroundColor: Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Color.white }}>Add</Text>
        </TouchableOpacity>
      </View>
    );
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

          dispatch({
            type: actions.SET_All_USERS,
            payload: temp
          });

          // dispatch({
          //   type: actions.SET_MESSAGES,
          //   payload: temp
          // });

        },
        (tx, error) => {
          console.log('error:', error);
          // res = error;
        }
      );
    });
  }
  const getUsersData = async () => {
    const res = await getData(`${ApiUrls.User._getAllUsers}?Phone=${user.Phone}`);
    create_User_Table(user.Phone);
    if (res.status === 200) {
      if (res?.data.length > 0) {
        dispatch({
          type: actions.SET_All_USERS,
          payload: res.data
        });

        res?.data?.forEach(f => {
          insert('User' + user.Phone, 'Image, Name, Phone, Role', [f.Image, f.Name, f.Phone, f.Role], ' ?, ?, ?, ? ');
        });
      } else {
        dispatch({
          type: actions.SET_All_USERS,
          payload: []
        });
      }
    }
    else {
      alert('Check Your Internet Connection');
      select('User' + user.Phone);

    }
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
        data={allUsers}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (item.Image === null && console.log(':::item:::::', item),
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
export default AllUser;
