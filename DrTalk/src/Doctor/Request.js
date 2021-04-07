import React,{useEffect} from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity ,StyleSheet, FlatList,} from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { getData } from '../API/ApiCalls';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
const image = require('../assets/images/logo.jpg');
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

// console.log('allreq :',allRequests);
    return (
      <>
      <CustomHeader navigation={navigation}/>
        <SwipeableFlatList
            data={allRequests}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() =>{}} style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
              {item.UImage ? <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={{ uri: `data:image/jpeg;base64,${item.UImage}` }} />
                  : <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
              }
              <View>
                  <Text style={{ left: 20 }}>{item.UName}</Text>
                  {item&&item.UType&&<Text style={{ left: 20 }}>{item.UType}</Text>}
              </View>
          </TouchableOpacity>              
            )}
            renderRight={({ item }) => (
                <View style={{ width: 200,height:80,backgroundColor:'gray',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                   <TouchableOpacity onPress={()=>{}} style={{backgroundColor:'#800000',height:80,width:'50%',justifyContent:'center',alignItems:'center'}}>
                     <Text>Cancel</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{}} style={{backgroundColor:'#8000ff',height:80,width:'50%',justifyContent:'center',alignItems:'center'}}>
                     <Text>Confirm</Text>
                   </TouchableOpacity>
                </View>
            )}
            backgroundColor={'white'}
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