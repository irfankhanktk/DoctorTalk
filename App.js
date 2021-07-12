import React, { useEffect, useState } from 'react'
import { StateProvider } from './src/Store/StateProvider';
import { initialState } from './src/Store/InitialState'
import { reducer } from './src/Store/Reducer'
import RouteNavigator from './src/Navigators/RouteNavigator';
import UploadImgTest from './src/User/UploadImgTest';
import NotificationDemo from './src/User/NotificationDemo';

// import UploadImgTest from './src/User/UploadImgTest';



const App = () => {


  return (
    //  <MySlider/>
    <StateProvider reducer={reducer} initialState={initialState}>
      <RouteNavigator />
    </StateProvider>
    // <UploadImgTest/>
    // <NotificationDemo/>
  );
};
export default App;
