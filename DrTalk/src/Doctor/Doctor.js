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
const image = require('../assets/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const DoctorScreen = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allDoctors, user, } = state;
  // const [allPatients,setAllPatients]=useState([]);
  // console.log('dddd',allDoctors);
  const getDoctorsData = async () => {
    const res_Doctors = await getData(`${ApiUrls.user._getUnfriendDoctors}?UPhone=${user.UPhone}`);
    console.log('res friends: ', res_Doctors);
    if (res_Doctors && res_Doctors.data !== 'null') {
      dispatch({
        type: actions.SET_All_DOCTORS,
        payload: res_Doctors.data
      });

    }
    else if (res_Doctors && res_Doctors.data === 'null') {
      // alert('no friends');
      dispatch({
        type: actions.SET_All_DOCTORS,
        payload: []
      });
    }
  }
  useEffect(() => {
    if (user) {

      console.log('chal gya Doctor [user]', user);
      getDoctorsData();

    }
  }, [user]);
  console.log('doctors : ',allDoctors);
  return (
    <>
      <CustomHeader navigation={navigation}/>
      <FlatList
        data={allDoctors}
        keyExtractor={(item, index) => index + ''}
        itemBackgroundColor={'#fff'}
        renderItem={({ item }) => (
          <CustomItem item={{ phone: item.Un_phone, name: item.Un_name, image: item.Un_image, role: item.Friend_status }} screen={'ChatActivity'} navigation={navigation} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: 'lightgrey' }} />
        )}
      />
    </>
  );
};
export default DoctorScreen;
