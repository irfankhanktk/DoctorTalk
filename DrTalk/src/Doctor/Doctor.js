import React,{useEffect} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList,} from 'react-native';
import { getData } from '../API/ApiCalls';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
const image = require('../assets/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const DoctorScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const {allDoctors,user,} = state;
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
    return (
        <View>
            <FlatList
                data={allDoctors}
                keyExtractor={(item,index) =>index+''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        <Text style={{ left: 20 }}>{item.Un_name}{item.Un_phone}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'lightgrey'}} />
                )}
            />
        </View>
    );
};
export default DoctorScreen;
