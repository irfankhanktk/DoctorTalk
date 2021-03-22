import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { CustomActivityIndicator } from '../CustomActivityIndicator';
import {useStateValue} from '../Store/StateProvider';
// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('C:/Users/Irfan/Desktop/ReactNative/DrPatient/src/images/logo.jpg');

const Admin = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const {clients,token}=state;
    const [isloading,setIsloading]=useState(false);
    const [UnApprovedDr,setUnApprovedDr]=useState([]);
    const getUnApprovedDoctors=async()=>{
         setIsloading(true);
         const res=await getData(ApiUrls.doctor._getUnApprovedDoctors);
         if(res.status===200){
             console.log('res dr :',res);

            setUnApprovedDr(res.data);
         }
        setIsloading(false);
    }
    const rejectDoctor=async(phone)=>{

        console.log('phone : ',phone);
        // console.log('phone ',phone);
        setIsloading(true);
        const res=await getData(`${ApiUrls.doctor._rejectDoctor}?uphone=${phone}`);
        console.log('res print ',res);
        if(res.status==200)
        {
            console.log('res: ',res);
            var arr=UnApprovedDr.filter(function(ele){ 
                return ele.DPhone != phone; 
            });
            setUnApprovedDr(arr);
          alert('rejected');
        }
        setIsloading(false);
    }
    const approveDoctor=async(phone)=>{
        console.log('phone : ',phone);
        // console.log('phone ',phone);
        setIsloading(true);
        const res=await getData(`${ApiUrls.doctor._approveDoctor}?uphone=${phone}`);
        console.log('res print ',res);
        if(res.status==200)
        {
            console.log('res: ',res);
            var arr=UnApprovedDr.filter(function(ele){ 
                return ele.DPhone != phone; 
            });
            setUnApprovedDr(arr);
          alert('approved');
        }
        setIsloading(false);

    }
    useEffect(()=>{
        getUnApprovedDoctors();
    },[]);
   
    return (
        <View>
            <CustomActivityIndicator visible={isloading}/>
            <SwipeableFlatList
                data={UnApprovedDr}
                itemBackgroundColor={'#fff'}
                renderItem={({item,index}) => (
                    <View style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        <Text style={{ left: 20 }}>{item.DName} {item.DPhone}{index}</Text>
                    </View>
                 )}
                 keyExtractor={item => item.DPhone}
                renderRight={({ item }) => (
                   
                        <View style={{ top: 5, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: 200, backgroundColor: 'gray', height: 70, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', }}>
                            <TouchableOpacity onPress={() => approveDoctor(item.DPhone)} style={{ width: 80, alignItems: 'center', height: 40, justifyContent: 'center' }}>
                                <Text>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => rejectDoctor(item.DPhone)} style={{ width: 80, alignItems: 'center', height: 40, justifyContent: 'center' }}>
                                <Text>Reject</Text>
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
export default Admin;
