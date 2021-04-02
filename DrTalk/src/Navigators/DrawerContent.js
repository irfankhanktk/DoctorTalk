import React from 'react'
import {
    DrawerContentScrollView,
    DrawerItemList,DrawerItem
  } from '@react-navigation/drawer';
import {View,Image,StyleSheet,Text} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions as s } from '../AuthScreens/Sessions';
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import { CommonActions } from '@react-navigation/native';
const image = require('../assets/images/logo.jpg');
export function CustomDrawerContent(props) {
    const [state, dispatch] = useStateValue();
    const {user}=state;
    const logout = async () => {
   console.log('logout preessesd');
    AsyncStorage.removeItem(s.user);
    dispatch({
      type: actions.SET_TOKEN,
      payload: null
    });
  };
    return (
      <DrawerContentScrollView {...props}>
         <LinearGradient
          colors={['#ffafbd', '#ffc3a0','#2193b0','#fff']}
          style={{ flex: 1, marginTop:-25 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.profileStyle}>
         {user&&user.UImage?<Image source={image} style={styles.imgStyle}/>
         :<Image source={image} style={styles.imgStyle} />}
         {user&&user.UName?<Text>{user.UName}</Text>
         :<Text>No Name</Text>}
             {user&&user.UType?<Text>({user.UType})</Text>
         :<Text>No Role</Text>}
          </View>
        </LinearGradient>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={() =>logout()}
        />
      </DrawerContentScrollView>
    );
  }

 
const styles = StyleSheet.create({
  profileStyle:{
    height:200,
    justifyContent:'center',
    alignItems: 'center',
  },
  imgStyle: {
      width: 70,
      height: 70,
      borderRadius: 50
  },
  buttonClose: {
      backgroundColor: "black",
  },
});