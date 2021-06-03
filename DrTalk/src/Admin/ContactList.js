import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, Share, PermissionsAndroid} from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const image = require('../assets/images/logo.jpg');
import Contacts from 'react-native-contacts'
import CustomHeader from '../CustomHeader';
import { ApiUrls } from '../API/ApiUrl';
import { useStateValue } from '../Store/StateProvider';
import { getData } from '../API/ApiCalls';
import { CustomeSearchBar } from '../CustomScreens/CustomSearchBar';
import CheckBox from '@react-native-community/checkbox';
const Invite = (props) => {
  const [state, dispatch] = useStateValue();
  const {user}=state;
  const {Phone}=user;
  const [mblContacts, setMblContacts] = React.useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredMbl, setFilteredMbl] = useState([]);
  const [isSelected, setSelection] = useState(false);
  console.log('props : ',props);

  const addContact = () => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    ]).then(
    Contacts.getAll().then(contacts => {
      // console.log('hello',contacts);
      setMblContacts(contacts);
    }))
  }
  const onInvite = async (To_ID) => {
  //  console.log( Math.random()*10000);
    const res=await getData(`${ApiUrls.User._invite}?From_ID=${Phone}&To_ID=${To_ID}`);
    if(res.status===200 && res.data)
    {
       alert('Invited successfully');
    }

      try {
        const result = await Share.share({
          url:'fggh',
          message:
            'XYZ/jkdjfjhj/jfkdjkj/',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };
  //   const getAllPatient=async()=>{
  //       const res=await getData(ApiUrls.patient._getAllPatient);
  //       if(res.status===200){
  //          setAllPatients(res.data);
  //       }
  //   }
  useEffect(() => {
    //   getAllPatient();
    addContact();
  }, []);
  // const onInvite=(phone)=>{
  //   alert(phone);
  // }
  const quickActions = (index, item) => {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <TouchableOpacity onPress={ ()=>onInvite(item.phoneNumbers[0].number)} style={{ backgroundColor: '#8000ff', height: 80, width: wp('25%'), justifyContent: 'center', alignItems: 'center' }}>
          <Text>Invite</Text>
        </TouchableOpacity>
      </View>
    );
  }
  const searchContacts = (text) => {
    setSearchText(text);
    if (text.length > 0) {
      const temp = [...mblContacts];
      text = text.toLowerCase();
      const filteredData = temp.filter(item => {
        const name =item.displayName.toLowerCase();
        if (name.indexOf(text) >= 0) {
          return item;
        }
      });
      setFilteredMbl(filteredData);
    }
  }
  return (
    <View>
      <CustomHeader navigation={props.navigation}/>
      <CustomeSearchBar onChangeText={(t) => searchContacts(t)} value={searchText} />
      <SwipeableFlatList
        data={searchText.length > 0 ? filteredMbl : mblContacts}
        // keyExtractor={item => item.key}
        keyExtractor={(item, index) => index + 'key'}
        keyExtractor={item => item.displayName}
        renderItem={({ item }) => (
          <View style={{flexDirection:'row',alignItems:'center', backgroundColor:'#d0d0ff',}}>
           {/* <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          // style={styles.checkbox}
        /> */}
          <TouchableOpacity style={{  width: '90%',
          height: 80, 
        
          flexDirection: 'row',
          alignItems: 'center'}}>
            <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
            <Text style={{ left: 20 }}>{item.displayName}{item.phoneNumbers[0].number}</Text>
          </TouchableOpacity>
          </View>
        )}

        // renderRight={({ item }) => (

        //   <View style={{ top: 5, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: 200, backgroundColor: 'gray', height: 70, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', }}>
        //     <TouchableOpacity onPress={() => onInvite(item.phoneNumbers[0].number)} style={{ width: 80, alignItems: 'center', height: 40, justifyContent: 'center' }}>
        //       <Text>Invite</Text>
        //     </TouchableOpacity>
        //     <TouchableOpacity onPress={() => alert('removing ')} style={{ width: 80, alignItems: 'center', height: 40, justifyContent: 'center' }}>
        //       <Text>Remove</Text>
        //     </TouchableOpacity>
        //   </View>
        // )}
        onEndReachedThreshold={0.5}
        maxSwipeDistance={wp('25%')}
        shouldBounceOnMount={false}
        renderQuickActions={({ index, item }) => quickActions(index, item)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
    </View>
  );
};
export default Invite;
