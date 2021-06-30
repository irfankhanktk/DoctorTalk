import * as React from 'react';
import { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LogIn from '../AuthScreens/LogIn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions as s } from '../AuthScreens/Sessions';
import { useStateValue } from '../Store/StateProvider';
import { actions } from '../Store/Reducer';
import socketClient from "socket.io-client";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from "react-native-vector-icons/Feather";
import { CustomDrawerContent } from './DrawerContent';
import EditProfile from './EditProfile';

import PatientMainDrawerNavigator from './PatientMainDrawerNavigator';
import DrMainDrawerNavigator from './DrMainDrawerNavigator';
import Admin from '../Admin/Admin';
import ApprovedDoctors from '../Admin/ApprovedDr';
import RejectedDoctors from '../Admin/RejectedDr';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomActivityIndicator from '../CustomScreens/CustomActivityIndicator';

const Drawer = createDrawerNavigator();

function RouteNavigator({ initialRoute }) {
  const [state, dispatch] = useStateValue();
  const { token } = state;
  // const [text, setText] = useState('');
  const [socket, setSocket] = useState('');
  const [isloading, setIsloading] = useState(true);



  const getData = async () => {
    const res = await AsyncStorage.getItem(s.user);

    if (res) {
      let userData = JSON.parse(res);
      const ioClient = socketClient('http://192.168.0.101:3000');
      setSocket(ioClient);
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
    setIsloading(false);
  };

  React.useEffect(() => {
   
    try {
      getData();
    } catch (error) {
      
    }
    
    

  }, []);

  if(isloading)
  {
    return <CustomActivityIndicator isloading={isloading}/>
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ gestureEnabled: false }} initialRouteName={initialRoute} drawerContent={(props) => <CustomDrawerContent {...props} />}>
        {token ?
          <>
            {token.Role === 'Admin' ?
            <Drawer.Screen name='Admin' component={AdminMainDrawerNavigator}/>
              // <Drawer.Screen name="Patient" component={PatientMainDrawerNavigator} />
              // :token.Role === 'Admin' ?<Drawer.Screen name='Admin' component={AdminMainDrawerNavigator}/>
              :<Drawer.Screen name='Doctor' component={DrMainDrawerNavigator}/>
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


const AdminMainDrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={AdminMainTabNavigator}/>
      <Drawer.Screen name="EditProfile" component={EditProfile} options={{
        drawerIcon:({focused,size,color})=>(
          <FontAwesome name='edit' size={size} color={color}/>
        )
      }}/>
    </Drawer.Navigator>
  );
};
const Tab =createBottomTabNavigator();
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