import React from 'react';
// import { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
// import { SwipeableFlatList } from 'react-native-swipeable-flat-list';
// import { getData } from '../API/ApiCalls';
import { ApiUrls } from '../API/ApiUrl';
import { useStateValue } from '../Store/StateProvider';
const image = require('E:/React_Native/DoctorTalk/DrTalk/src/images/logo.jpg');
// import Contacts from 'react-native-contacts'
const PatientScreen = ({ navigation }) => {
    const [state, dispatch] = useStateValue();
    const { allPatients, token } = state;
    // const [allPatients,setAllPatients]=useState([]);
// console.log('patient screen',allPatients);
    return (
        <View>
            <FlatList
                data={allPatients}
                keyExtractor={(item,index) =>index+''}
                itemBackgroundColor={'#fff'}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ width: '100%', height: 80, flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ left: 10, height: 50, width: 50, borderRadius: 50 }} source={image} />
                        <Text style={{ left: 20 }}>{item.Un_name}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: 'lightgrey'}} />
                )}
            />
        </View>
    );
};
export default PatientScreen;
