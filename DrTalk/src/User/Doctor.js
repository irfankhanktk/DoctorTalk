import React, { useEffect } from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, } from 'react-native';
import { getData } from '../API/ApiCalls';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import Role from './Role';
import SwipeableFlatList from 'react-native-swipeable-list';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const image = require('../assets/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const DoctorScreen = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allDoctors, user,allFriends} = state;
  // const [allPatients,setAllPatients]=useState([]);
  const removeFriend=(item)=>{
     
  }
  const quickActions = (index, item) => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        {allFriends&&allFriends.findIndex(ele=>ele.Phone==item.Phone)>=0?
          <TouchableOpacity onPress={() =>removeFriend(item)} style={{ backgroundColor: '#800000', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Remove</Text>
         </TouchableOpacity>:
         <TouchableOpacity onPress={() => {}} style={{ backgroundColor: '#8000ff', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
         <Text>Add</Text>
        </TouchableOpacity>
        }
      </View>
    );
  }
  const getDoctorsData = async () => {
    const res = await getData(`${ApiUrls.User._getUsersBYRole}?Role=${Role.Doctor}&Phone=${user.Phone}`);
    if (res.status==200) {
      dispatch({
        type: actions.SET_All_DOCTORS,
        payload: res.data
      });
    }
    else{
      // alert('no friends');
      dispatch({
        type: actions.SET_All_DOCTORS,
        payload: []
      });
    }
  }
  useEffect(() => {
    if (user) {

      getDoctorsData();

    }
  }, [user]);
  return (
    <>
      <CustomHeader navigation={navigation}/>
      <SwipeableFlatList
        data={allDoctors}
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
export default DoctorScreen;
