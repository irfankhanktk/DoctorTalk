// import DrawerNavigator from './src/Navigators/DrawerNavigator';
import React,{useEffect, useState} from 'react'
import { StateProvider} from './src/Store/StateProvider';
import { initialState } from './src/Store/InitialState'
import { reducer} from './src/Store/Reducer'

// import LogIn from './src/AuthScreens/LogIn';
import RouteNavigator from './src/Navigators/RouteNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions } from './src/AuthScreens/Sessions';
import Calls from './src/Call';

// import LogIn from './src/AuthScreens/LogIn';
const App = () => {

  const [initialRoute,setInitialRoute]=useState('Login');

  const getUserData=async()=>{
    const res =await AsyncStorage.getItem(Sessions.user);
    if(res){
       let user=JSON.parse(res);
       console.log('user in async strg in App : ',user)
       if(user.UType==='Admin')
       {
         console.log('admin : ');
         setInitialRoute('Admin');
       }else if(user.UType==='Doctor'){
        console.log('Doctor : ');
        setInitialRoute('Doctor');
       }
       else{
        console.log('Patient : ');
         setInitialRoute('Patient');
       }
    }

  }
  
  useEffect(async()=>{
    await getUserData()
  },[]);


  return (
    // <StateProvider reducer={reducer} initialState={initialState}>
    //   {console.log('initial route : in above rnavigation ',initialRoute)}
    //   <RouteNavigator initialRoute={initialRoute}/>
    // </StateProvider>
    <Calls/>
  );
};
export default App;
