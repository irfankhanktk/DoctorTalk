import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from "react-native-vector-icons/Feather";
import Chat from '../User/Chat';
import { CustomDrawerContent } from './DrawerContent';
import EditProfile from './EditProfile';
import RequestScreen from '../User/Request';
import AllUser from '../User/AllUser';
import MyFriends from '../User/MyFriends';
import Profile from './Profile';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
  const PatientMainTabNavigator = () => {
    return (
      <Tab.Navigator tabBarOptions={{keyboardHidesTabBar:true}}>
        <Tab.Screen name="Chat" component={ChatStack} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name='chat' size={size} color={color} />
          )
        }} />
        <Tab.Screen name="Users" component={AllUser} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons name='users' size={size} color={color} />
          )
        }} />
        <Tab.Screen name="Request" component={RequestScreen} options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Feather name='user-plus' size={size} color={color} />
          )
        }} />
      </Tab.Navigator>
    );
  };
  const PatientMainDrawerNavigator = () => {
    return (
      <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={PatientMainTabNavigator} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='home' size={size} color={color}/>
        )
      }} />
        <Drawer.Screen name="EditProfile" component={EditProfile} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='edit' size={size} color={color}/>
        )
      }} />
      </Drawer.Navigator>
    );
  };
const Stack = createStackNavigator();
const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={'ChatScreen'} component={MyFriends} options={{headerShown:false}}/>
      <Stack.Screen name={'ChatActivity'} component={Chat}/>
      <Stack.Screen name={'Profile'} component={Profile}/>
    </Stack.Navigator>
  );
};
  export default PatientMainDrawerNavigator;