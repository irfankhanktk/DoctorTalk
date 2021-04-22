import React from 'react';
const image = require('../assets/images/logo.jpg');
import { View, Text, StyleSheet, Image,} from 'react-native';
import { useStateValue } from '../Store/StateProvider';
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


const Profile = ({ navigation,route}) => {
    const [state, dispatch] = useStateValue();
    const { user } = state;
    const {Phone,Name}=route.params;
  console.log('route',route);
    return (
            <View style={styles.constainer}>
                <View style={styles.profileStyle}>
                    {route.params.Image?
                        <Image source={{ uri: `data:image/jpeg;base64,${route.params.Image}` }} style={styles.imgStyle} />
                        : <Image source={image} style={styles.imgStyle} />
                    }
                </View>
                <View style={styles.footer}>
                    <View style={{ flexDirection: 'row',paddingVertical:10}}>
                            <FontAwesome name='phone' size={25} />
                            <View style={{ left: 10 }}>
                                <Text style={styles.titleStyle}>Phone</Text>
                                {Phone ? <Text>{Phone}</Text>
                                    : <Text style={styles.titleStyle}>No Phone</Text>}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row',paddingVertical:10 }}>
                            <Entypo name='user' size={25} />
                            <View style={{ left: 10 }}>
                                <Text style={styles.titleStyle}>Name</Text>
                                {Name ? <Text>{Name}</Text>
                                    : <Text style={styles.titleStyle}>No Name</Text>}
                            </View>
                        </View>
                </View>
            </View>
    );
};
export default Profile;
const styles = StyleSheet.create({
    constainer: {
        flex: 1,

    },
    profileStyle: {
        flex: 1,
    },
    footer: {
        flex: 1,
        padding:20
    },
    imgStyle: {
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.8
    },

    titleStyle: {
        color: 'gray'
    },
});