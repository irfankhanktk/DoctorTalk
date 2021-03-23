import React from 'react'
import {
    DrawerContentScrollView,
    DrawerItemList,DrawerItem
  } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions as s } from '../AuthScreens/Sessions';
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';

export function CustomDrawerContent(props) {
    const [state, dispatch] = useStateValue();

    const logout = async () => {
    // console.log('state rem');
    AsyncStorage.removeItem(s.user);
    dispatch({
      type: actions.SET_TOKEN,
      payload: null
    });
    // console.log('state rem', state);
  };
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          onPress={() =>logout()}
        />
      </DrawerContentScrollView>
    );
  }