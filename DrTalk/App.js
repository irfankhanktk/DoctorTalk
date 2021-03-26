// import DrawerNavigator from './src/Navigators/DrawerNavigator';
import React,{useEffect, useState} from 'react'
import { StateProvider} from './src/Store/StateProvider';
import { initialState } from './src/Store/InitialState'
import { reducer} from './src/Store/Reducer'

// import LogIn from './src/AuthScreens/LogIn';
import RouteNavigator from './src/Navigators/RouteNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions } from './src/AuthScreens/Sessions';

// import LogIn from './src/AuthScreens/LogIn';
const App = () => {

  const [initialRoute,setInitialRoute]=useState('Patient');

  const getUserData=async()=>{
    const res =await AsyncStorage.getItem(Sessions.user);
    if(res){
       let user=JSON.parse(res);
      //  console.log('use in async in App : ',user)
       if(user.UType==='Admin')
       {
         setInitialRoute('Admin');
       }else if(user.UType==='Doctor'){
        setInitialRoute('Doctor');
       }
       else{
         setInitialRoute('Patient');
       }
    }

  }
  
  useEffect(()=>{
    getUserData()
  },[]);


  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <RouteNavigator initialRoute={initialRoute}/>
    </StateProvider>
  );
};
export default App;
