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
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const image = require('../assets/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const DoctorScreen = ({ navigation }) => {
  const [state, dispatch] = useStateValue();
  const { allDoctors, user, } = state;
  // const [allPatients,setAllPatients]=useState([]);
  // console.log('dddd',allDoctors);
  const getDoctorsData = async () => {
    const res = await getData(`${ApiUrls.User._getUsersBYRole}?Role=${Role.Doctor}`);
    console.log('res friends: ', res);
    if (res && res.data !== 'null') {
      dispatch({
        type: actions.SET_All_DOCTORS,
        payload: res.data
      });
    }
    else if (res && res.data === 'null') {
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
        keyExtractor={(item, index) => index + 'key'}
        itemBackgroundColor={'#fff'}
        renderItem={({ item }) => (item.Phone!==user.Phone&&
          <CustomItem item={item} screen={'ChatActivity'} navigation={navigation} />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
    </>
  );
};
export default DoctorScreen;
