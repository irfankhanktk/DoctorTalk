import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity,Share,PermissionsAndroid} from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import {useStateValue} from '../Store/StateProvider';
const image = require('C:/Users/Irfan/Desktop/ReactNative/DrPatient/src/images/logo.jpg');
import Contacts from 'react-native-contacts'
const PatienList = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const {clients,token}=state;
    const [allPatients,setAllPatients]=useState([]);
    const [mblContacts,setMblContacts]=useState([]);

  const addContact=()=>{
    PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      ])
      Contacts.getAll().then(contacts => {
        // console.log('hello',contacts);
        setMblContacts(contacts);
    })
    }
    const onInvite = async (pPhone) => {

      const res=await getData(`${ApiUrls.patient.invitation._invitePatient}?Dphone=${JSON.parse(token).contact}&Pphone=${pPhone}`);
      if(res.status===200 && res.data)
      {
         alert('Invited successfully');
      }

        try {
          const result = await Share.share({
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
      const getAllPatient=async()=>{
          const res=await getData(ApiUrls.patient._getAllPatient);
          if(res.status===200){
             setAllPatients(res.data);
          }
      }
      useEffect(()=>{
        //   getAllPatient();
          addContact();
          console.log('STATE :',JSON.parse(token).contact);
      },[]);
    return (
        <View>
            <SwipeableFlatList
                data={mblContacts}
                // keyExtractor={item => item.key}
                itemBackgroundColor={'#fff'}
                keyExtractor={item => item.displayName}
                renderItem={({ item }) => (
                    <TouchableOpacity   style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        <Text style={{ left: 20 }}>{item.displayName}{item.phoneNumbers[0].number}</Text>
                    </TouchableOpacity>
                 )}
                renderRight={({ item }) => (
                   
                        <View style={{ top: 5, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: 200, backgroundColor: 'gray', height: 70, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', }}>
                            <TouchableOpacity onPress={() => onInvite(item.phoneNumbers[0].number)} style={{ width: 80, alignItems: 'center', height: 40, justifyContent: 'center' }}>
                                <Text>Invite</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => alert('removing ')} style={{ width: 80, alignItems: 'center', height: 40, justifyContent: 'center' }}>
                                <Text>Remove</Text>
                            </TouchableOpacity>
                        </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'lightgrey' }} />
                )}
                onEndReached={() =>{}}
                onEndReachedThreshold={0.5}
            />
        </View>
    );
};
export default PatienList;
