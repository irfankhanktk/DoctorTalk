import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from "react-native";
import LogIn from "../AuthScreens/LogIn";
import ChatScreen from '../Doctor/ChatTab'
import PatientScreen from "../Doctor/Patient";
import DoctorScreen from "../Doctor/Doctor";
import RequestScreen from "../Doctor/Request";
import { getData } from "../API/ApiCalls";
import { ApiUrls } from "../API/ApiUrl";
import { useStateValue } from "../Store/StateProvider";
import { actions } from "../Store/Reducer";
import socketClient from "socket.io-client";
import { CustomActivityIndicator } from '../CustomActivityIndicator'
import { Sessions } from "../AuthScreens/Sessions";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createStackNavigator } from "@react-navigation/stack";
// import Chat from "../Doctor/Chat";
// import Chat from "../Chat";

const Tab = createMaterialTopTabNavigator();

export function DrMainTabNavigator() {
    const [isloading, setIsloading] = useState(false);
    const [state, dispatch] = useStateValue();
    const { user } = state;
    const [socket, setSocket] = useState('');
    const { UPhone, UType } = user;



    const getAllMainTabData = async () => {
        // console.log('token in func: ', UPhone + '   ' + UType + '   ' + user);
        setIsloading(true); 

        // const res_Friends = await getData(`${ApiUrls.user._getMyFriends}?UPhone=${UPhone}`);
        // const res_Requests = await getData(`${ApiUrls.user._getMyFriendsFrequests}?UPhone=${UPhone}`);
        // const res_Patients = await getData(`${ApiUrls.user._getUnfriendPatients}?UPhone=${UPhone}`);
        // const res_Doctors = await getData(`${ApiUrls.user._getUnfriendDoctors}?UPhone=${UPhone}`);
        // console.log('res friends: ', res_Friends);
        // if (res_Friends && res_Friends.data !== 'null') {
        //     dispatch({
        //         type: actions.SET_All_FRIENDS,
        //         payload: res_Friends.data
        //     });

        // }
        // else if (res_Friends && res_Friends.data === 'null') {
        //     // alert('no friends');
        //     dispatch({
        //         type: actions.SET_All_FRIENDS,
        //         payload: []
        //     });
        // }

       
        // // console.log('res patients ----------------------------------: ',res_Patients);
        // // console.log('res patients ----------------------------------');
        // if (res_Patients && res_Patients.data !== 'null') {
        //     dispatch({
        //         type: actions.SET_All_PATIENTS,
        //         payload: res_Patients.data
        //     });
        // } else if (res_Patients && res_Patients.data === 'null') {

        //     dispatch({
        //         type: actions.SET_All_PATIENTS,
        //         payload: []
        //     });
        // }

        // if (res_Friends && res_Friends.data !== 'null') {
        //     dispatch({
        //         type: actions.SET_All_FRIENDS,
        //         payload: res_Friends.data
        //     });

        // }
        // else if (res_Friends && res_Friends.data === 'null') {
        //     dispatch({
        //         type: actions.SET_All_FRIENDS,
        //         payload: []
        //     });
        // }

        
        // console.log('res Drs==== : ', res_Doctors);

        // if (res_Doctors && res_Doctors.data !== 'null') {
        //     dispatch({
        //         type: actions.SET_All_DOCTORS,
        //         payload: res_Doctors.data
        //     });
        // } else if (res_Doctors && res_Doctors.data === 'null') {

        //     dispatch({
        //         type: actions.SET_All_DOCTORS,
        //         payload: []
        //     });
        // }
       
        // // console.log('res res_Requests==== : ',res_Requests);

        // if (res_Requests && res_Requests.data !== 'null') {

        //     dispatch({
        //         type: actions.SET_All_REQUESTS,
        //         payload: res_Requests.data
        //     });
        // } else if (res_Requests && res_Requests.data === 'null') {
        //     dispatch({
        //         type: actions.SET_All_REQUESTS,
        //         payload: []
        //     });
        // }
        // if (!(res_Doctors && res_Patients)) {
        //     alert('check your connections');
        // }
        setIsloading(false);
    }
    const setUser = async () => {
        const jsonValue = await AsyncStorage.getItem(Sessions.user);
        if (jsonValue != null) {
          let details = JSON.parse(jsonValue);
          if (details) {
            dispatch({ type: actions.SET_USER, payload: details });
          }
        }
      };
      const setToken = async () => {
        const jsonValue = await AsyncStorage.getItem(Sessions.user);
        if (jsonValue != null) {
          let details = JSON.parse(jsonValue);
          if (details) {
            dispatch({ type: actions.SET_TOKEN, payload: details });
          }
        }
      };
      useEffect(() => {
        console.log('user:  '.user);
      //  setLoading(true);
        setUser();
        setToken();
       
      }, []);
    
      useEffect(() => {
        if (user) {

            console.log('chal gya [user]',user);
            getAllMainTabData();
        }
      }, [user]);
    // useEffect(() => {
    //     // setLoading(true);
    //     // setToken();
    //     // setUser();
    //     // const ioClient = socketClient('http://192.168.1.108:3000');
    //     // setSocket(ioClient);
    //     // let token='jkjk';
    //     // ioClient.emit('auth', token);

    //     // console.log('your are connented');
    //     // ioClient.on('clients', (allClients) => {
    //     // const user = allClients[allClients.length-1]
    //     // console.log('user : ', user);
    //     // console.log('cleints arr: ', allClients);
    //     // dispatch({
    //     //   type: actions.SET_USER,
    //     //   payload: user
    //     // });
    //     //   dispatch({
    //     //     type: actions.SET_ClIENTS,
    //     //     payload: allClients,
    //     //   });
    //     // });
    //     dispatch({
    //         type: actions.SET_SOCKET,
    //         payload: ioClient
    //     });

    //     ioClient.on('msg', msg => {
    //         console.log('msg received', msg);
    //         console.log('messages array :', messages);
    //         // setMessages(msg);
    //         messages.push(msg);

    //         console.log('message in main route: ', msg);
    //         dispatch({
    //             type: actions.SET_MESSAGES,
    //             payload: messages
    //         });
    //     });
    //     // ioClient.on('disconnect', function () {
    //     //   ioClient.emit('disconnected');
    //     // });

    // }, []);
    return (

        <Tab.Navigator>
            {/* <Tab.Screen name="Login" component={LogIn}/> */}
            <Tab.Screen name="Chat" component={ChatScreen} />
            {UType === 'Doctor' && <Tab.Screen name="Patients" component={PatientScreen} />}
            <Tab.Screen name="Doctors" component={DoctorScreen} />
            <Tab.Screen name="Request" component={RequestScreen} />
        </Tab.Navigator>

    );
};

