import React,{useEffect} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList,} from 'react-native';
import { getData } from '../API/ApiCalls';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
const image = require('E:/React_Native/DoctorTalk/DrTalk/src/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const PatientScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const {allPatients,user,} = state;
    // const [allPatients,setAllPatients]=useState([]);
    // console.log('dddd',allDoctors);
    const getPatientsData = async () => {
        const res_Patients = await getData(`${ApiUrls.user._getUnfriendPatients}?UPhone=${user.UPhone}`);
         console.log('res friends: ', res_Patients);
        if (res_Patients && res_Patients.data !== 'null') {
          dispatch({
            type: actions.SET_All_PATIENTS,
            payload: res_Patients.data
          });
    
        }
        else if (res_Patients && res_Patients.data === 'null') {
          // alert('no friends');
          dispatch({
            type: actions.SET_All_PATIENTS,
            payload: []
          });
        }
      }
      useEffect(() => {
        if (user) {
    
          console.log('chal gya Doctor [user]', user);
          getPatientsData();
        
        }
      }, [user]);
    return (
        <View>
            <FlatList
                data={allPatients}
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
export default PatientScreen;
