import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo'
const image = require('../assets/images/logo.jpg');

const CustomItem = ({ item, navigation, screen }) => {
    return (
        <TouchableOpacity onPress={() => screen ? navigation.navigate(screen, item) : {}} style={styles.userInfo}>
            <View style={{ width: '20%', alignItems: 'center' }}>
                {item.Image ? <Image style={styles.imgStyle} source={{ uri: `data:image/jpeg;base64,${item.Image}` }} />
                    : <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={image} />
                }
            </View>
            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ width: '40%' }}>
                    <Text>{item.Name}</Text>
                    <Text>{item.Role}</Text>
                </View>
                {item.IsBlock_ByMe && <View style={{ width: '40%', flexDirection: 'row',alignItems:'center',justifyContent:'space-around'}}>
                    <Text>Blocked</Text>
                    <Entypo name='block' size={15} color='red'/>
                </View>}

            </View>


        </TouchableOpacity>
    );
};
export default CustomItem;
const styles = StyleSheet.create({
    userInfo: {
        width: '100%',
        height: 80,
        backgroundColor: '#d0d0ff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    imgStyle: {
        left: 10,
        height: 50,
        width: 50,
        borderRadius: 50
    }
});