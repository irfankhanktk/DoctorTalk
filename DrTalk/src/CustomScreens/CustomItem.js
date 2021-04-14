import React from 'react';
import { View, Text,TouchableOpacity,Image, StyleSheet} from 'react-native';


const image = require('../assets/images/logo.jpg');

const CustomItem = ({item,navigation,screen}) => {
    return (
        <TouchableOpacity onPress={() =>screen?navigation.navigate(screen, item):{}} style={styles.userInfo}>
            {item.Image ? <Image style={styles.imgStyle} source={{ uri: `data:image/jpeg;base64,${item.Image}` }} />
                : <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
            }
            <View>
                <Text style={{ left: 20 }}>{item.Name}</Text>
                <Text style={{ left: 20 }}>{item.Role}</Text>
            </View>
        </TouchableOpacity>
    );
};
export default CustomItem;
const styles = StyleSheet.create({
    userInfo:{
        width: '100%',
         height: 80, 
         backgroundColor:'#d0d0ff',
         flexDirection: 'row',
         alignItems: 'center' 
    },
    imgStyle:{
        left: 10,
        height: 50,
        width: 50,
        borderRadius: 50
    }
});