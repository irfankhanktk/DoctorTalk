import React, { useEffect, useState} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, FlatList, } from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import { getData } from '../API/ApiCalls';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';
import { create, create_CCD_Table, create_Friend_Table, insert } from '../API/DManager';
import { openDatabase } from 'react-native-sqlite-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';
var db = openDatabase('Khan.db');
const image = require('../assets/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const RequestScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useStateValue();
  const { allRequests, token, user, allFriends } = state;
  const getRequestsData = async () => {
    setLoading(true);
    const res = await getData(`${ApiUrls.Friend._getFriendRequests}?Phone=${user.Phone}`);
    console.log('res of req :', res.status);
    if (res.status === 200) {
      if (res?.data.length > 0) {
        dispatch({
          type: actions.SET_All_REQUESTS,
          payload: res.data
        });

        res?.data?.forEach(f => {
          insert('Friend' + user.Phone, 'Friend_Type, Image, IsApproved ,IsBlock_ByFriend, IsBlock_ByMe,IsRejected, Name, Phone, Role, Status', [f.Friend_Type, f.Image, f.IsApproved, f.IsBlock_ByFriend, f.IsBlock_ByMe, f.IsRejected, f.Name, f.Phone, f.Role, f.Status], ' ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ');
        });
      } else {
        dispatch({
          type: actions.SET_All_REQUESTS,
          payload: []
        });
      }
    }
    else {
      alert('Check Your Internet Connection');
      select('Friend' + user.Phone);

    }
    setLoading(false);
  }
  useEffect(() => {
    if (user) {
      getRequestsData();
      //  select('Friend' + user.Phone);


    }
  }, [user]);
  const alterRequest = async (item, index, fType) => {

    const res = await getData(`${ApiUrls.Friend._alterRequest}?Friend_ID=${item.Friend_ID}&Friend_Type=${fType}`);
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

  const select = async (tableName) => {
    console.log("select * from " + tableName + " where Friend_Type='Requested'");
    db.transaction(function (tx) {
      tx.executeSql(
        "select * from " + tableName + " where Friend_Type='Requested'",
        [],
        (tx, results) => {

          const temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          console.log('temp : ', temp);
          temp.forEach(element => {
          });
          dispatch({
            type: actions.SET_All_REQUESTS,
            payload: temp
          });
        },
        (tx, error) => {
          throw new Error('Internal DB error :', error);
        }
      );
    });
  }
  const removeFriend = async (item, index) => {
    console.log('item: ', item);
    const res = await getData(`${ApiUrls.Friend._removeFriend}?Friend_ID=${item.Friend_ID}`);
    if (res.status === 200) {
      alert('Saved Successfully');
      let temp = [...allRequests];
      temp.splice(index, 1);
    } else {
      alert('Something went wrong');
      throw new Error('Something went wrong');
    }
  }
  const quickActions = (index, item) => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>

        <TouchableOpacity onPress={() => removeFriend(item, index)} style={styles.requestBtn}>
          <Text style={{ color: Color.white, fontWeight: 'bold', }}>Cancel</Text>
          <Entypo name={'circle-with-cross'} size={22} color={Color.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alterRequest(item, index, "Accepted")} style={{ backgroundColor: Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Color.white, fontWeight: 'bold', }}>Confirm</Text>
          <AntDesign name={'checkcircle'} size={20} color={Color.white} />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <>
      <CustomActivityIndicator visible={loading} />
      <CustomHeader navigation={navigation} />
      <SwipeableFlatList
        data={allRequests}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (
          <CustomItem item={item} navigation={navigation} longPress={() => { }} onPress={() => { }} />
        )}
        onEndReachedThreshold={0.5}
        maxSwipeDistance={wp('50%')}
        shouldBounceOnMount={false}
        renderQuickActions={({ index, item }) => quickActions(index, item)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
      {/* <FlatList
      data={allRequests}
      renderItem={({ item }) => (
        <View>
          <CustomItem item={{ phone: item.UPhone, name: item.UName, image: item.UImage, role: item.Friend_status }} screen={'ChatActivity'} navigation={navigation} />
        </View>
      )}/> */}
    </>
  );
};
export default RequestScreen;

const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: 'skyblue',
    borderRadius: 10, width: '40%',
    alignItems: 'center'
  },
  requestBtn: {
    backgroundColor: '#800000',
    height: 80,
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});