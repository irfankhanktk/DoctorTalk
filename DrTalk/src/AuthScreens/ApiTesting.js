import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios'
const ApiTesting = () => {

    const [arr, setArr] = useState();
    const [mbl, setMbl] = useState('');
    const [name, setName] = useState('');

    const getDataFromApi = async () => {

        const url = 'https://192.168.1.104:44381/api/std/GetMyUser?uphone=03439309357';
        fetch('http://192.168.1.110/TestApi//api/std/GetDoctors?')
            .then((response) => response.json())
            .then((res) => {
                setArr(res);
                console.log(res);
            })
            .catch((error) => console.error(error))
    };

    const postData = () => {
        fetch('http://192.168.1.110/TestApi//api/std/PostAddDoctor', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                DPhone: mbl,
                DName: name,
            })
        }).then((response) =>{ response.json();
           console.log('response',response);
           if(response.status===200)
           {
               alert('saved successfully');
           }
        })
        .catch((error) => console.error(error))
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <FlatList
                    data={arr}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: 'gray', marginVertical: 10 }}>
                            <Text>phone number :   {item.DPhone}</Text>
                            <Text>Name :   {item.DName}</Text>
                        </View>

                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>

            <View style={styles.container}>

                <TextInput placeholder='Name here' style={styles.txtInput} onChangeText={(t) => setName(t)} />
                <TextInput placeholder='Contact here' style={styles.txtInput} onChangeText={(t) => setMbl(t)} />

                <TouchableOpacity onPress={() => getDataFromApi()} style={styles.btn}>
                    <Text>Get data from api</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => postData()} style={styles.btn}>
                    <Text>Post data To api</Text>
                </TouchableOpacity>

            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    txtInput: {
        borderWidth: 1, margin: 20, borderRadius: 10
    },
    btn: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center', margin: 10
    }


});

export default ApiTesting;
