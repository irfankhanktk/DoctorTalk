import React,{useEffect} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet,} from 'react-native';
import { getData } from '../API/ApiCalls';
import SwipeableFlatList from 'react-native-swipeable-list';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import Role from './Role';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const image = require('../assets/images/logo.jpg');

const AllUser = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const {allUsers,user,} = state;

    const addFriend=async(item,index)=>{
      alert('added');
      const res = await getData(`${ApiUrls.Friend._addFriend}?To_ID=${user.Phone}&From_ID=${item.Phone}&Friend_Type=${fType}`);
    if (res.status === 200) {
      let temp = [...allRequests];
      temp.splice(index, 1);
      dispatch({
        type: actions.SET_All_REQUESTS,
        payload: temp
      });
      console.log('all friends in req :', [...allFriends, item]);
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
          <TouchableOpacity onPress={() => alterRequest(item, index, "Rejected")} style={{ backgroundColor: '#800000', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addFriend(item, index, "Accepted")} style={{ backgroundColor: '#8000ff', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Add</Text>
          </TouchableOpacity>
        </View>
      );
    }
    const getPatientsData = async () => {
        const res = await getData(`${ApiUrls.User._getAllUsers}?Phone=${user.Phone}`);
         console.log('res res: ', res);
        if (res.status===200) {
         console.log('res res.data: ', res.data);
          dispatch({
            type: actions.SET_All_USERS,
            payload: res.data
          });
    
        }
        else{
          alert('Check Your Internet Connection');
          dispatch({
            type: actions.SET_All_USERS,
            payload: []
          });
        }
      }
      useEffect(() => {
        if (user) {
    
          getPatientsData();
        
        }
      }, [user]);
      console.log('allUsers',allUsers);
    return (
        <>
      <CustomHeader navigation={navigation}/>
      <SwipeableFlatList
        data={allUsers}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (
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
