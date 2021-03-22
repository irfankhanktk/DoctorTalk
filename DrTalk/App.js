// import DrawerNavigator from './src/Navigators/DrawerNavigator';
import React from 'react'
import { StateProvider} from './src/Store/StateProvider';
import { initialState } from './src/Store/InitialState'
import { reducer} from './src/Store/Reducer'

// import LogIn from './src/AuthScreens/LogIn';
import RouteNavigator from './src/Navigators/RouteNavigator';

// import LogIn from './src/AuthScreens/LogIn';
const App = () => {


  return (
    <StateProvider reducer={reducer} initialState={initialState}>
      <RouteNavigator/>
    </StateProvider>
  );
};
export default App;
