import * as React from 'react';
import { StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';

const CustomHeader = ({navigation,screen}) => {
  const _goBack = () => console.log('Went back');

  const _handleSearch = () => console.log('Searching');

  const _handleMore = () => console.log('Shown more');

  return (
    <>
    <Appbar.Header style={{backgroundColor:'#0081fe',}}>
      {screen==='Profile'&&<Appbar.BackAction onPress={()=>navigation.navigate('Home')} />}
      {screen&&<Appbar.Content title={screen}/>}
      <Appbar.Action icon="format-list-bulleted" onPress={()=>navigation.toggleDrawer()} />
      <Appbar.Content title="DrTalk"/>
      {/* <Appbar.Action icon="magnify" onPress={_handleSearch} /> */}
    
    </Appbar.Header>
    </>
  );
};

export default CustomHeader;