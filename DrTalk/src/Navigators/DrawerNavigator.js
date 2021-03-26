import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LogIn from '../AuthScreens/LogIn';
// import { DrMainTabNavigator } from './DrMainTabNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomDrawerContent } from './DrawerContent';
// import Chat from '../Doctor/Chat';
// import ChatScreen from '../Doctor/ChatTab';
// import PatientScreen from '../Doctor/Patient';
import DoctorScreen from '../Doctor/Doctor';
// import RequestScreen from '../Doctor/Request';

// import { NavigationContainer } from '@react-navigation/native';


const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Login" drawerContent={(props) => <CustomDrawerContent {...props} />}>
       <Drawer.Screen name="Chat" component={DoctorScreen} />
       {/* <Drawer.Screen name="Home" component={DrMainDrawerNavigator} /> */}
    </Drawer.Navigator>
  );
};

const DrMainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chatss" component={ChatScreen} />
      <Tab.Screen name="Patients" component={PatientScreen} />
      <Tab.Screen name="Doctors" component={DoctorScreen} />
      <Tab.Screen name="Request" component={RequestScreen} />
    </Tab.Navigator>
  );
};

