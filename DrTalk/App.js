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
import { StatusBar } from 'react-native';
import TestDB from './src/API/TestDB';



const App = () => {


  return (
  //  <TestDB/>
      <StateProvider reducer={reducer} initialState={initialState}>
        <RouteNavigator/>
      </StateProvider>
  );
};
export default App;
