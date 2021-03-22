// In App.js in a new project
import * as React from 'react';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from '../AuthScreens/LogIn';
// import PatientList from '../Patient/PatientList';
// import { useStateValue } from '../Store/StateProvider';
// import { actions } from '../Store/Reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions as s } from '../AuthScreens/Sessions';
import { DrMainTabNavigator } from './DrMainTabNavigator';
// import socketClient from "socket.io-client";
// import Chat from "../Chat";
// // import {createDrawerNavigator} from "@react-navigation/drawer";
// import SocketChat from "../SocketChat";
// import Admin from '../Patient/Admin';

const Stack = createStackNavigator();
function Home(){
   return(
     <View style={{justifyContent:'center',alignItems:'center'}}>
       <Text>hi</Text>
     </View>
   )
}
function RouteNavigator() {
  // const [state, dispatch] = useStateValue();
  // const { messages, token } = state;
  // const [text, setText] = useState('');
  // const [socket, setSocket] = useState('');
  // const [messages, setMessages] = useState('helo oo');

  const getData = async () => {
    const res = await AsyncStorage.getItem(s.user);
    console.log('getdata res', res);
    if (res) {
      dispatch({
        type: actions.SET_TOKEN,
        payload: res
      });
    }
  };
  React.useEffect(() => {
    getData();
    // const ioClient = socketClient('http://192.168.0.115:3000');
    // setSocket(ioClient);
    // ioClient.emit('auth', token);
    // console.log('your are connented');
    // ioClient.on('clients', (allClients) => {
      // const user = allClients[allClients.length-1]
      // console.log('user : ', user);
      // console.log('cleints arr: ', allClients);
      // dispatch({
      //   type: actions.SET_USER,
      //   payload: user
      // });
    //   dispatch({
    //     type: actions.SET_ClIENTS,
    //     payload: allClients,
    //   });
    // });
    // dispatch({
    //   type: actions.SET_Socket,
    //   payload: ioClient
    // });

    // ioClient.on('msg', msg => {
    //   console.log('msg received', msg);
    //   console.log('messages array :', messages);
    //   // setMessages(msg);
    //   messages.push(msg);

    //   console.log('message in main route: ', msg);
    //   dispatch({
    //     type: actions.SET_MESSAGES,
    //     payload: messages
    //   });
    // });
    // ioClient.on('disconnect', function () {
    //   ioClient.emit('disconnected');
    // });

  }, []);
  // const logout = async () => {
  //   // console.log('state rem');
  //   AsyncStorage.removeItem(s.user);
  //   dispatch({
  //     type: actions.SET_TOKEN,
  //     payload: null
  //   });
  //   // console.log('state rem', state);
  // };
  return (
    <NavigationContainer>
      <Stack.Navigator>
               <Stack.Screen name='DrMainTabNavigator' component={DrMainTabNavigator}/>
                <Stack.Screen name='Login' component={LogIn}/>
            
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RouteNavigator;