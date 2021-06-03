import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import Color from '../assets/Color/Color';
import { CustomActivityIndicator } from '../CustomActivityIndicator';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { useStateValue } from '../Store/StateProvider';
// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('../assets/images/logo.jpg');
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ApprovedDoctors = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user } = state;
    const [isloading, setIsloading] = useState(false);
    const [UnApprovedDr, setUnApprovedDr] = useState([]);
    const getApprovedDoctors = async () => {
        setIsloading(true);
        const res = await getData(ApiUrls.User._admin._getApprovedDoctors);
        console.log('res dr :', res);
        if (res.status === 200) {
           

            setUnApprovedDr(res.data);
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
            <TouchableOpacity onPress={() => alterRequest(item, index, "Reject")} style={{ backgroundColor:'red', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Reject</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => alterRequest(item, index, "Accept")} style={{ backgroundColor:Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Accept</Text>
            </TouchableOpacity> */}
          </View>
        );
      }
    // const rejectDoctor = async () => {


    //     // console.log('phone ',phone);
    //     setIsloading(true);
    //     const res = await getData(`${ApiUrls.doctor._rejectDoctor}?uphone=${user.UPhone}`);
    //     console.log('res print ', res);
    //     if (res.status == 200) {
    //         console.log('res: ', res);
    //         var arr = UnApprovedDr.filter(function (ele) {
    //             return ele.DPhone != phone;
    //         });
    //         setUnApprovedDr(arr);
    //         alert('rejected');
    //     }
    //     setIsloading(false);
    // }
    // const approveDoctor = async () => {
    //     // console.log('phone : ',phone);
    //     // console.log('phone ',phone);
    //     setIsloading(true);
    //     const res = await getData(`${ApiUrls.User._admin._getApprovedDoctors}?uphone=${user.UPhone}}`);
    //     console.log('res print ', res);
    //     if (res.status == 200) {
    //         console.log('res: ', res);
    //         var arr = UnApprovedDr.filter(function (ele) {
    //             return ele.DPhone != phone;
    //         });
    //         setUnApprovedDr(arr);
    //         alert('approved');
    //     }
    //     setIsloading(false);

    // }
    useEffect(() => {
        if (user) {
            getApprovedDoctors();
        }

    }, [user]);
    console.log('unappr', UnApprovedDr);
    return (
        <>
            <CustomHeader navigation={navigation} />
            <SwipeableFlatList
                data={UnApprovedDr}
                keyExtractor={(item, index) => index + ''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <CustomItem item={item} navigation={navigation} />
                    // <TouchableOpacity onPress={() => { }} style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
                    //    <View style={{flexDirection:'row',alignItems:'center'}}>
                    //     {item.DImage ? <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={{ uri: `data:image/jpeg;base64,${item.DImage}` }} />
                    //         : <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                    //     }
                    //        <View>
                    //        <Text style={{ left: 20 }}>{item.DName}</Text>
                    //         {/* {item&&item.UType&&<Text style={{ left: 20 }}>{item.}</Text>} */}
                    //         <Text style={{ color: 'gray', left: 20 }}>Doctor Requested</Text>
                    //        </View>     
                    //     </View>
                    //     <View style={{ flexDirection: 'row' }}>
                    //         <Text>4:45 pm</Text>
                    //     </View>
                    // </TouchableOpacity>
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
export default ApprovedDoctors;
const styles = StyleSheet.create({
    txtStyle: {
        color: 'white'
    }
});