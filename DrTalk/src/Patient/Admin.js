import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { CustomActivityIndicator } from '../CustomActivityIndicator';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { useStateValue } from '../Store/StateProvider';
// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('../assets/images/logo.jpg');

const Admin = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user } = state;
    const [isloading, setIsloading] = useState(false);
    const [UnApprovedDr, setUnApprovedDr] = useState([]);
    const getUnApprovedDoctors = async () => {
        setIsloading(true);
        const res = await getData(ApiUrls.doctor._getUnApprovedDoctors);
        if (res.status === 200) {
            console.log('res dr :', res);

            setUnApprovedDr(res.data);
        }
        setIsloading(false);
    }
    const rejectDoctor = async () => {


        // console.log('phone ',phone);
        setIsloading(true);
        const res = await getData(`${ApiUrls.doctor._rejectDoctor}?uphone=${user.UPhone}`);
        console.log('res print ', res);
        if (res.status == 200) {
            console.log('res: ', res);
            var arr = UnApprovedDr.filter(function (ele) {
                return ele.DPhone != phone;
            });
            setUnApprovedDr(arr);
            alert('rejected');
        }
        setIsloading(false);
    }
    const approveDoctor = async () => {
        // console.log('phone : ',phone);
        // console.log('phone ',phone);
        setIsloading(true);
        const res = await getData(`${ApiUrls.doctor._getUnApprovedDoctors}?uphone=${user.UPhone}}`);
        console.log('res print ', res);
        if (res.status == 200) {
            console.log('res: ', res);
            var arr = UnApprovedDr.filter(function (ele) {
                return ele.DPhone != phone;
            });
            setUnApprovedDr(arr);
            alert('approved');
        }
        setIsloading(false);

    }
    useEffect(() => {
        if (user) {
            getUnApprovedDoctors();
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
                    <TouchableOpacity onPress={() => { }} style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
                       <View style={{flexDirection:'row',alignItems:'center'}}>
                        {item.DImage ? <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={{ uri: `data:image/jpeg;base64,${item.DImage}` }} />
                            : <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        }
                           <View>
                           <Text style={{ left: 20 }}>{item.DName}</Text>
                            {/* {item&&item.UType&&<Text style={{ left: 20 }}>{item.}</Text>} */}
                            {/* <Text style={{ color: 'gray', left: 20 }}>Doctor Requested</Text> */}
                           </View>     
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {/* <Text>4:45 pm</Text> */}
                        </View>
                    </TouchableOpacity>
                )}
                renderRight={({ item }) => (
                    <View style={{ width: 200, height: 80, backgroundColor: 'gray', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { }} style={{ backgroundColor: '#800000', height: 80, width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.txtStyle}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { }} style={{ backgroundColor: '#8000ff', height: 80, width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.txtStyle}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
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