import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LogIn from '../AuthScreens/LogIn';
import { DrMainTabNavigator } from './DrMainTabNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomDrawerContent } from './DrawerContent';
// import { NavigationContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {
  return (
      <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={MainStack}/>
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
  );
};
const Stack = createStackNavigator();
function MainStack() {
    return (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={DrMainTabNavigator} options={{ title: 'Dr Talk' }}/>
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name='login' component={LogIn}/>
        </Stack.Navigator>
    );
  };