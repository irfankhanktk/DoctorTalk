import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import Color from '../assets/Color/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getImageUrl } from '../API/ApiUrl';
const image = require('../assets/images/logo.jpg');

const ArchiveRefer = ({ visible, setVisible, referToDotor, addToArchive, item }) => {
    return (
        <Modal
            propagateSwipe
            isVisible={visible}
            onBackdropPress={() => setVisible(f => !f)}
            onSwipeComplete={() => setVisible(f => !f)}
            swipeDirection='up'
            style={{ margin: 0 }}>
            <View style={{ alignSelf: 'center', width: '80%', padding: 10, borderRadius: 20, alignItems: 'center' }}>
                {item.Image ? <Image style={styles.imgStyle} source={{ uri: getImageUrl() + item.Image }} />
                    : <Image style={styles.imgStyle} source={image} />
                }
                <View style={{borderRadius: 20, backgroundColor: Color.white,width:'90%',height:60,justifyContent:'center'}}>
                    <Text style={{alignSelf:'center',fontWeight:'bold',fontSize:20}}>{item.Name}</Text>
                </View>

                {item?.Role==='Patient'&&<TouchableOpacity style={styles.btnStyle} onPress={() => referToDotor()}>
                    <Text style={{ color: Color.white, fontWeight: 'bold', fontSize: 20 }}>Refer To Doctor</Text>
                    <MaterialIcons name={'arrow-forward-ios'} size={30} color={Color.white} />
                </TouchableOpacity>}
                <TouchableOpacity style={styles.btnStyle} onPress={() => addToArchive()}>
                    <Text style={{ color: Color.white, fontWeight: 'bold', fontSize: 20 }}>Archive Current Chat</Text>
                    <MaterialIcons name={'arrow-forward-ios'} size={30} color={Color.white} />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};
export default ArchiveRefer;
const styles = StyleSheet.create({
    btnStyle: {
        marginVertical: 10,
        borderRadius: 20,
        paddingHorizontal: 10,
        width: '90%', height: 60,
        backgroundColor: Color.btnPrimary, justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    imgStyle: {

        height: 200,
        width: 200,
        borderRadius: 100
    }
});
