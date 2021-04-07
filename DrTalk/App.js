import React, { useEffect, useState } from 'react'
import { StateProvider } from './src/Store/StateProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { initialState } from './src/Store/InitialState'
import { reducer } from './src/Store/Reducer'
import RouteNavigator from './src/Navigators/RouteNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sessions } from './src/AuthScreens/Sessions';
import PlayAudio from './src/PlayAudio';
import Recorder from './src/Recorder';
import { MyApp } from './src/Doctor/RNDatePicker';
import { StatusBar } from 'react-native';
import ReadMyFile from './src/Doctor/ReadMyFile';


const App = () => {

  const [initialRoute, setInitialRoute] = useState('Login');

  const getUserData = async () => {
    const res = await AsyncStorage.getItem(Sessions.user);
    if (res) {
      let user = JSON.parse(res);
      console.log('user in async strg in App : ', user);
      if (user.UType === 'Admin') {
        console.log('admin : ');
        setInitialRoute('Admin');
      } else if (user.UType === 'Doctor') {
        console.log('Doctor : ');
        setInitialRoute('Doctor');
      }
      else {
        console.log('Patient : ');
        setInitialRoute('Patient');
      }
    }

  }

  useEffect(async () => {
    // await getUserData()
  }, []);

  return (
    // <ReadMyFile/>
    <SafeAreaProvider>
       <StatusBar
        animated={true}
        backgroundColor="#0081fe"
       />
      <StateProvider reducer={reducer} initialState={initialState}>
        <RouteNavigator initialRoute={initialRoute} />
      </StateProvider>
    </SafeAreaProvider>
  );
};
export default App;
