import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls, IP } from '../API/ApiUrl';
import Color from '../assets/Color/Color';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { useStateValue } from '../Store/StateProvider';
// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('../assets/images/logo.jpg');
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { actions } from '../Store/Reducer';
import socketClient from "socket.io-client";

const ioClient = socketClient(`${IP}:3000`);


const Admin = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user,admin_requests,rejected_dr,approved_dr} = state;
    const [isloading, setIsloading] = useState(false);


    const getUnApprovedDoctors = async () => {
        setIsloading(true);
        const res = await getData(ApiUrls.User._admin._getUnApprovedDoctors);
        console.log('res:',res);
        if (res.status === 200) {
            console.log('res dr :', res);
            
            // setUnApprovedDr(res.data);
            dispatch({
                type:actions.SET_ADMIN_REQUESTS,
                payload:res?.data
            });
        }
        else{
            alert('Something went wrong')
        }
        setIsloading(false);
    }
    const alterRequest=async(item,index, type)=>{
        setIsloading(true);
        const res=await getData(`${ApiUrls.User._admin._alterDrRequest}?Phone=${item?.Phone}&Type=${type}`);
        if(res.status===200){
            let temp=[...admin_requests];
            temp.splice(index,1);
            dispatch({
                type:actions.SET_ADMIN_REQUESTS,
                payload:temp
            });
             if(type){
                dispatch({
                    type:actions.SET_APPROVED_DR,
                    payload:[...approved_dr,item]
                });
             }else{
                dispatch({
                    type:actions.SET_REJECTED_DR,
                    payload:[...rejected_dr,item]
                });
             }
        }else{
            alert('Something went wrong');
            throw new Error('Something went wrong');
        }
        setIsloading(false);

    }
    const quickActions = (index, item) => {
        return (
       
        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
    
            <TouchableOpacity onPress={() => alterRequest(item, index, 'Cancel')} style={styles.requestBtn}>
              <Text style={{ color: Color.white, fontWeight: 'bold', }}>Cancel</Text>
              <Entypo name={'circle-with-cross'} size={22} color={Color.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alterRequest(item, index, 'Confirm')} style={{ backgroundColor: Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: Color.white, fontWeight: 'bold', }}>Confirm</Text>
              <AntDesign name={'checkcircle'} size={20} color={Color.white} />
            </TouchableOpacity>
          </View>
        );
      }
      const getConnection = async () => {

        dispatch({
          type: actions.SET_SOCKET,
          payload: ioClient
        });
    
        ioClient.emit('auth', token);
    
    
        // ioClient.on('newUser', connectedUser => {
        //   console.log('connected User :  ', connectedUser);
    
    
        //   update('Friend', 'Status=?', 'where Phone=?', [1, connectedUser.Phone]);
        //   // dispatch({
        //   //   type: actions.SET_ONLINE,
        //   //   payload: isOnline,
        //   // });
        // });
      
      }
    useEffect(() => {
        if (user) {
            setIsloading(true);
            getUnApprovedDoctors();
        }

    }, [user]);
    // console.log('unappr', UnApprovedDr);
    return (
        <>
            <CustomActivityIndicator visible={isloading}/>
            <CustomHeader navigation={navigation} />
            <SwipeableFlatList
                data={admin_requests}
                keyExtractor={(item, index) => index + 'key'}
                renderItem={({ item }) => (
                    <CustomItem item={item} navigation={navigation} onPress={()=>{}} longPress={()=>{}}/>
                    // <View><Text>jjjj</Text></View>
                )}
                onEndReachedThreshold={0.5}
                maxSwipeDistance={wp('50%')}
                shouldBounceOnMount={false}
                renderQuickActions={({ index, item }) => quickActions(index, item)}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, }} />
                )}
            />
        </>
    );
};
export default Admin;
const styles = StyleSheet.create({
    txtStyle: {
        color: 'white'
    },
    requestBtn: {
        backgroundColor: '#800000',
        height: 80,
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
      }
});