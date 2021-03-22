import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text} from "react-native";
import LogIn from "../AuthScreens/LogIn";
import ChatScreen from '../Doctor/Chat'
import PatientScreen from "../Doctor/Patient";
const Tab = createMaterialTopTabNavigator();
// const ChatScreen = () => {
//     return (
//         <View>
//             <Text>ChatScreen</Text>
//         </View>
//     );
// }
// const PatientScreen = () => {
//     return (
//         <View>
//             <Text>PatientScreen</Text>
//         </View>
//     );
// }
export function DrMainTabNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Login" component={LogIn}/>
            <Tab.Screen name="Chat" component={PatientScreen} />
            <Tab.Screen name="Patients" component={PatientScreen} />
        </Tab.Navigator>
    );
};
