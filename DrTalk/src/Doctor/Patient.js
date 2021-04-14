import React,{useEffect} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList,} from 'react-native';
import { getData } from '../API/ApiCalls';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import Role from './Role';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const image = require('../assets/images/logo.jpg');

const PatientScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const {allPatients,user,} = state;

    const getPatientsData = async () => {
        const res = await getData(`${ApiUrls.User._getUsersBYRole}?Role=${Role.Patient}`);
         console.log('res res: ', res);
        if (res.status===200) {
         console.log('res res.data: ', res.data);

          dispatch({
            type: actions.SET_All_PATIENTS,
            payload: res.data
          });
    
        }
        else{
          alert('Check Your Internet Connection');
          dispatch({
            type: actions.SET_All_PATIENTS,
            payload: []
          });
        }
      }
      useEffect(() => {
        if (user) {
    
          getPatientsData();
        
        }
      }, [user]);
      console.log('allPatients',allPatients);
    return (
        <>
      <CustomHeader navigation={navigation}/>
            <FlatList
                data={allPatients}
                keyExtractor={(item,index) =>index+''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <CustomItem item={item}/>
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: 'lightgray' }} />
                )}
            />
        </>
    );
};
export default PatientScreen;
