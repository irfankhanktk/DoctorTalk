// In App.js in a new project
import * as React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'

// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LogIn from '../AuthScreens/LogIn';
// import PatientList from '../Patient/PatientList';
// import { useStateValue } from '../Store/StateProvider';
// import { actions } from '../Store/Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions as s } from '../AuthScreens/Sessions';
// import { DrMainTabNavigator } from './DrMainTabNavigator';
import MainDrawerNavigator from './DrawerNavigator';
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import socketClient from "socket.io-client";
import ChatScreen from '../Doctor/ChatTab';
import PatientScreen from '../Doctor/Patient';
import DoctorScreen from '../Doctor/Doctor';
import RequestScreen from '../Doctor/Request';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from "react-native-vector-icons/Feather";
import Chat from '../Doctor/Chat';
import { CustomDrawerContent } from './DrawerContent';
import MessageBox from '../MessageBox';
import FriendProfile from './FriendProfile';
import Profile from './Profile';
import Admin from '../Patient/Admin';
import ApprovedDoctors from '../Patient/ApprovedDr';
import RejectedDoctors from '../Patient/RejectedDr';
// import Chat from "../Chat";
// // import {createDrawerNavigator} from "@react-navigation/drawer";
// import SocketChat from "../SocketChat";
// import Admin from '../Patient/Admin';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function RouteNavigator({ initialRoute }) {
  const [state, dispatch] = useStateValue();
  const { messages, token } = state;
  // const [text, setText] = useState('');
  const [socket, setSocket] = useState('');



  const getData = async () => {
    const res = await AsyncStorage.getItem(s.user);
    // console.log('getdata res', res);

    if (res) {
      let userData = JSON.parse(res);
      const ioClient = socketClient('http://192.168.1.107:3000');
      setSocket(ioClient);

      console.log('getdata user ', userData);
      ioClient.emit('auth', userData);
      dispatch({
        type: actions.SET_TOKEN,
        payload: userData
      });
      dispatch({
        type: actions.SET_USER,
        payload: userData
      });
    }
  };

  React.useEffect(() => {
    let is_mounted = true;
    if (is_mounted) {
      getData();
    }

  }, []);


  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ gestureEnabled: false }} initialRouteName={initialRoute} drawerContent={(props) => <CustomDrawerContent {...props} />}>
        {token ?
          <>
            {token.UType === 'Patient' ?
              <Drawer.Screen name="Patient" component={PatientMainDrawerNavigator} />
              :token.UType === 'Admin' ?<Drawer.Screen name='Admin' component={AdminMainDrawerNavigator}/>
              :<Drawer.Screen name='Doctor' component={DrMainDrawerNavigator} />
            }
          </>
          :
          <Drawer.Screen name="Login" component={LogIn} />
        }
      </Drawer.Navigator>
    </NavigationContainer>
  );

}

export default RouteNavigator;


const DrMainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={DrMainTabNavigator} />
      <Drawer.Screen name="Profile" component={Profile} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='edit' size={size} color={color}/>
        )
      }}/>
    </Drawer.Navigator>
  );
};
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
      <Tab.Screen name="Patients" component={PatientScreen} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Fontisto name='bed-patient' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Doctors" component={DoctorScreen} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons name='doctor' size={size} color={color} />
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
      <Drawer.Screen name="Home" component={PatientMainTabNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};
const PatientMainTabNavigator = () => {
  return (
    <Tab.Navigator tabBarOptions={{keyboardHidesTabBar:true}}>
      <Tab.Screen name="Chat" component={ChatStack} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='chat' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Doctors" component={DoctorScreen} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons name='doctor' size={size} color={color} />
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

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={'ChatScreen'} component={ChatScreen} options={{headerShown:false}}/>
      <Stack.Screen name={'ChatActivity'} component={Chat}         options={{ headerTitle: props => <FriendProfile {...props} /> }}/>
    </Stack.Navigator>
  );
};

const AdminMainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={AdminMainTabNavigator}/>
      <Drawer.Screen name="Profile" component={Profile} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='edit' size={size} color={color}/>
        )
      }}/>
    </Drawer.Navigator>
  );
};

const AdminMainTabNavigator = () => {
  return (
    <Tab.Navigator tabBarOptions={{keyboardHidesTabBar:true}}>
      <Tab.Screen name="Requests" component={Admin} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Feather name='user-plus' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Doctors" component={ApprovedDoctors} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons name='doctor' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Rejected" component={RejectedDoctors} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <AntDesign name='deleteusergroup' size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  );
};