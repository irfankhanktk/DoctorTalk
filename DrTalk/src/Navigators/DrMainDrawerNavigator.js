import React, { useRef, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { CustomDrawerContent } from './DrawerContent';
import EditProfile from './EditProfile';
import Invite from '../Admin/ContactList';
import Profile from './Profile';
import RequestScreen from '../User/Request';
import Chat from '../User/Chat';
import MyFriends from '../User/MyFriends';
import AllUser from '../User/AllUser';
import Patient from '../User/Patient';
import { useStateValue } from '../Store/StateProvider';
import ArchiveChats from '../User/ArchiveChats';
import Color from '../assets/Color/Color';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={'DrMainTabNavigator'} component={DrMainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name={'ChatActivity'} component={Chat} options={{ headerShown: false }} />
      <Stack.Screen name={'Profile'} component={Profile} />
      <Stack.Screen name={'ArchiveChats'} component={ArchiveChats} options={{
       headerStyle: {
        backgroundColor: Color.primary
      },  
      }}/>

    </Stack.Navigator>
  );
};
const DrMainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={ChatStack} options={{
        drawerIcon: ({ focused, size, color }) => (
          <FontAwesome name='home' size={size} color={color} />
        )
      }} />
      <Drawer.Screen name="EditProfile" component={EditProfile} options={{
        drawerIcon: ({ focused, size, color }) => (
          <FontAwesome name='edit' size={size} color={color} />
        )
      }} />
      <Drawer.Screen name="Invite" component={Invite} options={{
        drawerIcon: ({ focused, size, color }) => (
          <Entypo name='users' size={size} color={color} />
        )
      }} />
    </Drawer.Navigator>
  );
};
export default DrMainDrawerNavigator;
const Tab = createBottomTabNavigator();
const DrMainTabNavigator = () => {
  const [state,dispatch]=useStateValue();
  const {user}=state;
  return (
    <Tab.Navigator tabBarOptions={{ keyboardHidesTabBar: true }}>
      <Tab.Screen name="Chat" component={MyFriends} options={{
        // tabBarVisible:false,
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='chat' size={size} color={color} />
        )
      }} />
      {user.Role === 'Doctor' &&
        <>
          <Tab.Screen name="Patients" component={Patient} options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Fontisto name='bed-patient' size={size} color={color} />
            )
          }} />
          <Tab.Screen name="Doctor" component={AllUser} options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name='doctor' size={size} color={color} />
            )
          }} />
        </>}
      <Tab.Screen name="Request" component={RequestScreen} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name='notifications' size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  );
};
