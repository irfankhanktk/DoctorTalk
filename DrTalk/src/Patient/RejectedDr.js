import React from 'react';
import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList, StyleSheet,Dimensions} from 'react-native';
import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
import { useState } from 'react/cjs/react.development';
import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { CustomActivityIndicator } from '../CustomActivityIndicator';
import CustomHeader from '../CustomHeader';
import CustomItem from '../CustomScreens/CustomItem';
import { useStateValue } from '../Store/StateProvider';
// import {createDrawerNavigator} from '@react-navigation/drawer';
const image = require('../assets/images/logo.jpg');
const { height, width } = Dimensions.get('window');
const RejectedDoctors = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { clients, token, user } = state;
    const [isloading, setIsloading] = useState(false);
    const [UnApprovedDr, setUnApprovedDr] = useState([]);
   
    const rejectedDoctor = async () => {

      
        const res = await getData(`${ApiUrls.doctor._getRejectedDoctors}?uphone=${user.UPhone}`);
        console.log('res print ', res);
        if (res.status == 200) {
            console.log('res: ', res);
            // var arr = UnApprovedDr.filter(function (ele) {
            //     return ele.DPhone != user.UPhone;
            // });
            setUnApprovedDr(res.data);
        }

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
                keyExtractor={(item, index) => index + ''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { }} style={{ width:'100%', height: 80, flexDirection: 'row', alignItems: 'center',justifyContent:'space-between' }}>
                       <View style={{flexDirection:'row',alignItems:'center'}}>
                        {item.DImage ? <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={{ uri: `data:image/jpeg;base64,${item.DImage}` }} />
                            : <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        }
                           <View>
                           <Text style={{ left: 20 }}>{item.DName}</Text>
                            {/* {item&&item.UType&&<Text style={{ left: 20 }}>{item.}</Text>} */}
                            <Text style={{ color: 'gray', left: 20 }}>Swipe to Approve</Text>
                           </View>     
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>4:45 pm</Text>
                        </View>
                    </TouchableOpacity>
                )}
                renderRight={({ item }) => (
                    <View style={{ width: 100, height: 80, flexDirection: 'row',justifyContent: 'space-around', alignItems: 'center' }}>
                        
                        <TouchableOpacity onPress={() => { }} style={{ backgroundColor: '#800000',height: 80, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.txtStyle}>Approve</Text>
                        </TouchableOpacity>
                    </View>
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