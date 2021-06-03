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


const Admin = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user } = state;
    const [isloading, setIsloading] = useState(false);
    const [UnApprovedDr, setUnApprovedDr] = useState([]);


    const getUnApprovedDoctors = async () => {
        setIsloading(true);
        const res = await getData(ApiUrls.User._admin._getUnApprovedDoctors);
        console.log('res:',res);
        if (res.status === 200) {
            console.log('res dr :', res);
            
            setUnApprovedDr(res.data);
        }
        else{
            alert('Something went wrong')
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
            <TouchableOpacity onPress={() => alterRequest(item, index, "Accept")} style={{ backgroundColor:Color.primary, height: 80, width: '25%', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Accept</Text>
            </TouchableOpacity>
          </View>
        );
      }
 
    useEffect(() => {
        if (user) {
            setIsloading(true);
            getUnApprovedDoctors();
        }

    }, [user]);
    console.log('unappr', UnApprovedDr);
    return (
        <>
            <CustomActivityIndicator visible={isloading}/>
            <CustomHeader navigation={navigation} />
            <SwipeableFlatList
                data={UnApprovedDr}
                keyExtractor={(item, index) => index + 'key'}
                renderItem={({ item }) => (
                    <CustomItem item={item} navigation={navigation} />
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
    }
});