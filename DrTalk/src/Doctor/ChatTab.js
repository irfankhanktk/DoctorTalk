import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
import {getData} from '../API/ApiCalls'
import { Sessions } from '../AuthScreens/Sessions';
const image = require('E:/React_Native/DoctorTalk/DrTalk/src/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const ChatScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { allFriends, token ,user} = state;
    // const { UPhone, UType } = user;
    // const [allPatients,setAllPatients]=useState([]);
//    console.log('my fr: ',allFriends);
// console.log('uphone = ',UPhone);
// console.log('user : ',user);
const setUser = async () => {
    const jsonValue = await AsyncStorage.getItem(Sessions.user);
    if (jsonValue != null) {
      let details = JSON.parse(jsonValue);
      if (details) {
        dispatch({ type: actions.SET_USER, payload: details });
      }
    }
  };
  const setToken = async () => {
    const jsonValue = await AsyncStorage.getItem(Sessions.user);
    if (jsonValue != null) {
      let details = JSON.parse(jsonValue);
      if (details) {
        dispatch({ type: actions.SET_TOKEN, payload: details });
      }
    }
  };
  const getFriendsData=async()=>{
   
      const res_Friends = await getData(`${ApiUrls.user._getMyFriends}?UPhone=${user.UPhone}`);
          //  console.log('res friends: ', res_Friends);
        if (res_Friends && res_Friends.data !== 'null') {
            dispatch({
                type: actions.SET_All_FRIENDS,
                payload: res_Friends.data
            });

        }
        else if (res_Friends && res_Friends.data === 'null') {
            // alert('no friends');
            dispatch({
                type: actions.SET_All_FRIENDS,
                payload: []
            });
        }
  }
  
  // useEffect(() => {
  //   console.log('user in useeffect :  ',user);
  // //  setLoading(true);
  //   setUser();
  //   setToken();
  //   // getFriendsData();
  // }, []);

  useEffect(() => {
    if (user) {

        console.log('chal gya [user]',user);
        getFriendsData();
    }
  }, [user]);
    return (
        <View>
            <FlatList
                data={allFriends}
                keyExtractor={(item,index) =>index+''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>navigation.navigate('ChatActivity')} style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        <View>
                        <Text style={{ left: 20 }}>{item.Friend_name}</Text>
                        <Text style={{ left: 20 }}>{item.Friend_status}</Text>
                        </View>
                       
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'lightgrey'}} />
                )}
            />
        </View>
    );
};
export default ChatScreen;
