import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text} from "react-native";
import LogIn from "../AuthScreens/LogIn";
import ChatScreen from '../Doctor/Chat'
import PatientScreen from "../Doctor/Patient";
import DoctorScreen from "../Doctor/Doctor";
import RequestScreen from "../Doctor/Request";
import { getData } from "../API/ApiCalls";
import { ApiUrls } from "../API/ApiUrl";
import { useStateValue } from "../Store/StateProvider";
import { actions } from "../Store/Reducer";


const Tab = createMaterialTopTabNavigator();

export function DrMainTabNavigator() {

    const [state, dispatch] = useStateValue();


    const getAllMainTabData=async()=>{
        const res_Friends=await getData(`${ApiUrls.user._getMyFriends}?UPhone=03457266092`);
        console.log('res friends: ',res_Friends);
        if(res_Friends&&res_Friends.data!=='null')
        {
              dispatch({
                  type:actions.SET_All_FRIENDS,
                  payload:res_Friends.data
              });
               alert('dmila');
        }
        else if(res_Friends&&res_Friends.data==='null'){
            alert('nhi mila');
        }
        else{
            alert('something went right');
        }
        const res_Patients=await getData(`${ApiUrls.user._getUnfriendPatients}?UPhone=03457266092`);
        console.log('res patients ----------------------------------: ',res_Patients);
        console.log('res patients ----------------------------------');
        if(res_Patients&&res_Patients.data!=='null')
        {
               alert('pmila');
               dispatch({
                type:actions.SET_All_PATIENTS,
                payload:res_Patients.data
            });
        }  else if(res_Patients&&res_Patients.data==='null'){
           
            dispatch({
                type:actions.SET_All_PATIENTS,
                payload:[]
            });
        }
        else{
            alert('something went right');
        }
        if(res_Friends&&res_Friends.data!=='null')
        {
              dispatch({
                  type:actions.SET_All_FRIENDS,
                  payload:res_Friends.data
              });
               alert('dmila');
        }
        else if(res_Friends&&res_Friends.data==='null'){
            dispatch({
                type:actions.SET_All_FRIENDS,
                payload:[]
            });
        }
        else{
            alert('something went right');
        }

        const res_Doctors=await getData(`${ApiUrls.user._getUnfriendDoctors}?UPhone=03457266092`);
        console.log('res Drs==== : ',res_Doctors);
       
        if(res_Doctors&&res_Doctors.data!=='null')
        {
               alert('pmila');
               dispatch({
                type:actions.SET_All_DOCTORS,
                payload:res_Doctors.data
            });
        }  else if(res_Doctors&&res_Doctors.data==='null'){
            alert('nhi mila');
            dispatch({
                type:actions.SET_All_DOCTORS,
                payload:[]
            });
        }
        else{
            alert('something went right');
        }

        const res_Requests=await getData(`${ApiUrls.user._getMyFriendsFrequests}?UPhone=03457266092`);
        console.log('res res_Requests==== : ',res_Requests);
       
        if(res_Requests&&res_Requests.data!=='null')
        {
               alert('pmila');
               dispatch({
                type:actions.SET_All_REQUESTS,
                payload:res_Requests.data
            });
        }  else if(res_Requests&&res_Requests.data==='null'){
            dispatch({
                type:actions.SET_All_REQUESTS,
                payload:[]
            });
        }
        else{
            alert('something went right');
        }
        // if(!(res_Doctors&&res_Patients))
        // {
        //     alert('chk connections');
        // }

    }
    useEffect(()=>{
        getAllMainTabData();
    },[]);
    return (
        <Tab.Navigator>
            {/* <Tab.Screen name="Login" component={LogIn}/> */}
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Patients" component={PatientScreen} />
            <Tab.Screen name="Doctors" component={DoctorScreen} />
            <Tab.Screen name="Requests" component={RequestScreen} />
        </Tab.Navigator>
    );
};
