import React, { useEffect } from 'react';
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
import { accessibilityProps } from 'react-native-paper/lib/typescript/components/MaterialCommunityIcon';

const image = require('../assets/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const RequestScreen = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allRequests, token, user, allFriends } = state;
  // const [allPatients,setAllPatients]=useState([]);
  // console.log('Request screen    ', allRequests);
  const getRequestsData = async () => {
    const res = await getData(`${ApiUrls.Friend._getFriendRequests}?Phone=${user.Phone}`);
    console.log('res requests: ', res);
    if (res.status === 200) {
      dispatch({
        type: actions.SET_All_REQUESTS,
        payload: res.data
      });
    }
    else {
      alert('Check Connection');
      dispatch({
        type: actions.SET_All_REQUESTS,
        payload: []
      });
    }
  }
  useEffect(() => {
    if (user) {

      console.log('chal gya Doctor [user]', user);
      getRequestsData();

    }
  }, [user]);
  const alterRequest = async (item, index, fType) => {
    alert('gul');
    const res = await getData(`${ApiUrls.Friend._alterRequest}?To_ID=${user.Phone}&From_ID=${item.Phone}&Friend_Type=${fType}`);
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
        <TouchableOpacity onPress={() => alterRequest(item, index, "Rejected")} style={{ backgroundColor: '#800000', height: 80, width: '50%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alterRequest(item, index, "Accepted")} style={{ backgroundColor: '#8000ff', height: 80, width: '50%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Confirm</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // console.log('allreq :',allRequests);
  return (
    <>
      <CustomHeader navigation={navigation} />
      <SwipeableFlatList
        data={allRequests}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (
          <CustomItem item={item} navigation={navigation} />
        )}
        onEndReachedThreshold={0.5}
        maxSwipeDistance={wp('100%')}
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
  }
});