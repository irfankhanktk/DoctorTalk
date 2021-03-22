import React from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { useStateValue } from '../Store/StateProvider';
const image = require('E:/React_Native/DrTalk/src/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const ChatScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { myFriends, token } = state;
    // const [allPatients,setAllPatients]=useState([]);

    return (
        <View>
            <FlatList
                data={myFriends}
                keyExtractor={({ item, index }) => index + ''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        <Text style={{ left: 20 }}>{item.Name}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'lightgrey'}} />
                )}
            />
        </View>
    );
};
export default ChatScreen;
