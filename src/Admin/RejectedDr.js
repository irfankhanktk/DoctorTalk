import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet,Dimensions} from 'react-native';
import  SwipeableFlatList from 'react-native-swipeable-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { useStateValue } from '../Store/StateProvider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';
import { actions } from '../Store/Reducer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';
// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('../assets/images/logo.jpg');
const { height, width } = Dimensions.get('window');
const RejectedDoctors = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user,admin_requests,rejected_dr,approved_dr} = state;
    const [isloading, setIsloading] = useState(false);
    const [UnApprovedDr, setUnApprovedDr] = useState([]);
   
    const rejectedDoctor = async () => {
       setIsloading(true);
        const res = await getData(`${ApiUrls.User._admin._getRejectedDoctors}`);
        console.log('res print ', res);
        if (res.status == 200) {
            dispatch({
              type:actions.SET_REJECTED_DR,
              payload:res?.data
          });
        }
      setIsloading(false);
    }

    const alterRequest=async(item,index, type)=>{
      setIsloading(true);
      const res=await getData(`${ApiUrls.User._admin._alterDrRequest}?Phone=${item?.Phone}&Type=${type}`);
      if(res.status===200){
          let temp=[...rejected_dr];
          temp.splice(index,1);
          dispatch({
              type:actions.SET_REJECTED_DR,
              payload:temp
          });
           if(type==='Confirm'){
              dispatch({
                  type:actions.SET_APPROVED_DR,
                  payload:[...approved_dr,item]
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
    
            <TouchableOpacity onPress={() => alterRequest(item, index, 'Confirm')} style={styles.requestBtn}>
              <Text style={{ color: Color.white, fontWeight: 'bold', }}>Approve</Text>
              <AntDesign name={'checkcircle'} size={20} color={Color.white} />
            </TouchableOpacity>
          </View>
        );
      }
    useEffect(() => {
        if (user) {
            rejectedDoctor();
        }

    }, [user]);
    console.log('Rejected dr ', UnApprovedDr);
    return (
        <>
        <CustomActivityIndicator visible={isloading}/>
        <CustomHeader navigation={navigation} />
        <SwipeableFlatList
        data={rejected_dr}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (
          <CustomItem item={item} navigation={navigation} onPress={()=>{}} longPress={()=>{}}/>
        )}
        onEndReachedThreshold={0.5}
        maxSwipeDistance={wp('25%')}
        shouldBounceOnMount={false}
        renderQuickActions={({ index, item }) => quickActions(index, item)}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, }} />
        )}
      />
        </>
    );
};
export default RejectedDoctors;
const styles = StyleSheet.create({
    txtStyle: {
        color: 'white'
    },
    requestBtn: {
      backgroundColor:Color.primary,
      height: 80,
      width: '25%',
      justifyContent: 'center',
      alignItems: 'center'
    }
});