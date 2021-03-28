import React,{useEffect} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity ,StyleSheet,} from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { getData } from '../API/ApiCalls';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
const image = require('E:/React_Native/DoctorTalk/DrTalk/src/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const RequestScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { allRequests, token,user} = state;
    // const [allPatients,setAllPatients]=useState([]);
    // console.log('Request screen    ', allRequests);
    const getRequestsData = async () => {
        const res_Requests = await getData(`${ApiUrls.user._getMyFriendsFrequests}?UPhone=${user.UPhone}`);
         console.log('res friends: ', res_Requests);
        if (res_Requests && res_Requests.data !== 'null') {
          dispatch({
            type: actions.SET_All_REQUESTS,
            payload: res_Requests.data
          });
    
        }
        else if (res_Requests && res_Requests.data === 'null') {
          // alert('no friends');
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


    return (
        <View>
            <SwipeableFlatList
                data={allRequests}
                keyExtractor={(item, index) => index + ''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <View style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                            <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={image} />
                            <Text style={{ left: 20 }}>{item.UName}{item.UPhone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity style={styles.btnStyle}>
                                <Text>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnStyle}>
                                <Text>Reject</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'lightgrey' }} />
                )}
            />
        </View>
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