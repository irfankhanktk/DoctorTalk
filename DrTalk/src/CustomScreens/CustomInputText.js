import React from 'react';
import { View, TextInput, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from "react-native-vector-icons/FontAwesome";
const CustomInputText = ({setOnChangeText,secureTextEntry, placeholder, iconName }) => {

    return (
        <View style={styles.container}>
             <FontAwesome name={iconName} size={25} color='black'/>
            <TextInput onChangeText={(t)=>setOnChangeText(t)} secureTextEntry={secureTextEntry} placeholder={placeholder} style={{ width: '100%', color: 'black', fontSize: 16, paddingLeft: 10 }} />
        </View>
    );
};
export default CustomInputText;
const styles = StyleSheet.create({
    container: {
        width: '90%',
        // backgroundColor: '#273751',
        // borderRadius: 20,
        marginVertical: 10,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10

    }
});