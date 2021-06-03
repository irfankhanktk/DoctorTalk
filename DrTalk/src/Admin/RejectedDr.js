import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet,Dimensions} from 'react-native';
import  SwipeableFlatList from 'react-native-swipeable-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { CustomActivityIndicator } from '../CustomActivityIndicator';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { useStateValue } from '../Store/StateProvider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Color from '../assets/Color/Color';

// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('../assets/images/logo.jpg');
const { height, width } = Dimensions.get('window');
const RejectedDoctors = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user } = state;
    const [isloading, setIsloading] = useState(false);
    const [UnApprovedDr, setUnApprovedDr] = useState([]);
   
    const rejectedDoctor = async () => {

      
        const res = await getData(`${ApiUrls.User._admin._getRejectedDoctors}`);
        console.log('res print ', res);
        if (res.status == 200) {
            console.log('res: ', res);
            // var arr = UnApprovedDr.filter(function (ele) {
            //     return ele.DPhone != user.UPhone;
            // });
            setUnApprovedDr(res.data);
        }

    }
    const quickActions = (index, item) => {
        return (
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
            {/* <TouchableOpacity onPress={() => alterRequest(item, index, "Reject")} style={{ backgroundColor:'red', height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Reject</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => alterRequest(item, index, "Accept")} style={{ backgroundColor:Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Approve</Text>
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
            <CustomHeader navigation={navigation} />
        <SwipeableFlatList
        data={UnApprovedDr}
        keyExtractor={(item, index) => index + 'key'}
        renderItem={({ item }) => (
          <CustomItem item={item} navigation={navigation} />
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
    }
});