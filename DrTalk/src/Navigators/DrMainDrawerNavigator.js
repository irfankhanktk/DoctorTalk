

// In App.js in a new project
import  React,{useState} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CustomDrawerContent } from './DrawerContent';
import EditProfile from './EditProfile';
import Invite from '../Patient/ContactList';
import Profile from './Profile';
import RequestScreen from '../User/Request';
import Chat from '../User/Chat';
import MyFriends from '../User/MyFriends';
import AllUser from '../User/AllUser';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
  const ChatStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name={'ChatScreen'} component={MyFriends} options={{headerShown:false}}/>
        <Stack.Screen name={'ChatActivity'} component={Chat} options={{headerShown:false}}/>
        <Stack.Screen name={'Profile'} component={Profile}/>
      </Stack.Navigator>
    );
  };
const DrMainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={DrMainTabNavigator} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='home' size={size} color={color}/>
        )
      }}/>
      <Drawer.Screen name="EditProfile" component={EditProfile} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='edit' size={size} color={color}/>
        )
      }}/>
       <Drawer.Screen name="Invite" component={Invite} options={{
        drawerIcon:({focused,size,color})=>(
          <Entypo name='users' size={size} color={color}/>
        )
      }}/>
    </Drawer.Navigator>
  );
};
export default DrMainDrawerNavigator;
const Tab = createBottomTabNavigator();
const DrMainTabNavigator = () => {
  return (
    <Tab.Navigator tabBarOptions={{keyboardHidesTabBar:true}}>
      <Tab.Screen name="Chat" component={ChatStack} options={{
        // tabBarVisible:false,
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='chat' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Users" component={AllUser} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Entypo name='users' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Request" component={RequestScreen} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name='notifications' size={size} color={color}/>
        )
      }} />
    </Tab.Navigator>
  );
};
