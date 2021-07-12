import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
import { getImageUrl } from '../API/ApiUrl';
import { actions } from '../Store/Reducer';
import { useStateValue } from '../Store/StateProvider';
const image = require('../assets/images/logo.jpg');

const CustomGroupItem = ({ item, navigation}) => {
    const [state, dispatch] = useStateValue();
    // const { messages, user, socket, group_messages } = state;
    return (
        <TouchableOpacity onPress={()=>{
            dispatch({
                type:actions.SET_Group_Messages,
                payload:[]
            });
            navigation.navigate("GroupChat",item);
         }} activeOpacity={1} style={{backgroundColor:'#d0d0ff'}}>
            <View style={styles.userInfo}>
            <View style={{ width: '20%', alignItems: 'center', }}>
                {item.G_Image ? <Image style={styles.imgStyle} source={{ uri:getImageUrl()+item.G_Image }} />
                    : <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={image} />
                }
            </View>
            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ width: '40%' }}>
                    <Text>{item.G_Name}</Text>
                </View>
            </View>
            </View>

        </TouchableOpacity>
    );
};
export default CustomGroupItem;
const styles = StyleSheet.create({
    userInfo: {
        width: '100%',
        height: 80,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imgStyle: {
        
        height: 50,
        width: 50,
        borderRadius: 50
    }
});