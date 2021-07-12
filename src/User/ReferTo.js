import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Color from '../assets/Color/Color';
const image = require('../assets/images/logo.jpg');
import Modal from 'react-native-modal'
import { useStateValue } from '../Store/StateProvider';
import CustomItem from '../CustomScreens/CustomItem';
import { getData, postData } from '../API/ApiCalls';
import { ApiUrls, getImageUrl } from '../API/ApiUrl';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');


const ReferTo = (props) => {
    const { navigation, route } = props;
    const { params } = route;
    const [state, dispatch] = useStateValue();
    const { doctors, user,socket } = state;
    const [visible, setVisible] = useState(false);
    const [referToInfo, setReferToInfo] = useState({ Name: 'Select doctor', Phone: '' });
    const [isImport, setIsImport] = useState(false);
    const [DATA, SETDATA] = useState([]);
    const [stay,setStay]=useState(false);
    const sharePatientRecord = async (groupIfo) => {
        let temp = [...DATA];
        let ids = [];
        temp.forEach(ele => {
            if (ele.checked) {
                ids.push(ele.CCD_ID);
            }
        });
        console.log(ids.join());
        const res = await postData(`${ApiUrls.CCD._shareCCD}`,
            {
                Patient_ID: params.Phone,
                ReferFrom_ID: user.Phone,
                ReferTo_ID: stay===true?groupIfo?.G_ID:referToInfo.Phone,
                AllowedFields: ids.join()
            });
        console.log('res: ', res);
        if (res.status === 200) {
            alert('Referred Successfully');
        }
        else {
            alert('Something went wrong');

            throw new Error('Something went wrong ');
        }
    }

    const onChangeCheckBox = (value, index, item) => {
        item.checked = value;
        let temp = [...DATA]
        temp[index] = item;
        SETDATA(temp);
    }

    const select = async () => {

        db.transaction(function (tx) {
            tx.executeSql(
                'select * from CCD WHERE Patient_ID=?',
                [params.Phone],
                (tx, results) => {
                    let temp = [];
                    console.log(' results.rows.length', results.rows.length);
                    for (let index = 0; index < results.rows.length; index++) {
                        let item = results.rows.item(index);
                        if (item?.CCD_Title?.toLowerCase().indexOf('allergies') > -1) {
                            temp[0] = item;
                        }
                        else if (item?.CCD_Title?.toLowerCase().indexOf('immuni') > -1) {
                            temp[1] = item;
                        }
                        else if (item?.CCD_Title?.toLowerCase().indexOf('procedures') > -1) {
                            temp[2] = item;
                        }
                        else if (item?.CCD_Title?.toLowerCase().indexOf('medication') > -1) {
                            temp[3] = item;
                        }
                    }
                    SETDATA(temp);
                    if (temp.length > 0) {
                        setIsImport(true);
                        // setIsCCD(true)

                    }

                },
                (tx, error) => {
                    console.log('error:', error);
                }
            );
        });
    }
    const createGroup=async()=>{
        if (referToInfo.Phone.length <= 0) {
            alert('Please Select Doctor');
            return;
        }
        const group={
            G_Name:referToInfo.Name+','+params?.Name,
            G_MemberIDs:referToInfo.Phone+','+params?.Phone+','+user.Phone,
            G_Created_By:user.Phone,
        }
        const resp = await postData(`${ApiUrls.Group._createGroup}`,group);
        console.log('response: ', resp);
        if (resp.status === 200&&resp?.data==='Already exist') {
            alert('already exist successfully');
            // if(DATA.filter(item=>item.checked).length>0){
            //     sharePatientRecord();
            // }else{
            //     console.log("Referred successfully");
            // }
        } else if (resp.status === 200)  {
            alert('Successfully created');
            if(DATA.filter(item=>item.checked).length>0){
                sharePatientRecord(resp?.data);
            }else{
                console.log("Referred successfully");
            }
            socket.emit('emitCreatedGroup', resp?.data);
        }

    }
    const addFriend = async () => {

        if (referToInfo.Phone.length <= 0) {
            alert('Please Select Doctor');
            return;
        }

        const resp = await postData(`${ApiUrls.Friend._addFriend}?From_ID=${referToInfo.Phone}&To_ID=${params.Phone}`);
        console.log('response: ', resp);
        if (resp.status === 200) {
            if(DATA.filter(item=>item.checked).length>0){
                sharePatientRecord();
            }else{
                console.log("Referred successfully");
            }
        } else {
            alert('Network error');
        }
    }
    useEffect(() => {
        select();
    }, [])
    console.log('DATA:', DATA);
    return (
        <View style={styles.container}>
            <View style={styles.footer}>
                <FlatList
                    ListHeaderComponent={
                        <>
                            <View style={styles.header}>
                                {params.Image ? <Image source={{ uri: `${getImageUrl()}${params.Image}` }} style={styles.imgStyle} /> :
                                    <Image source={image} style={styles.imgStyle} />}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                                <Text style={{ width: '50%', fontWeight: 'bold' }}>Patient Name : </Text>
                                <Text style={{ width: '50%' }}>{params.Name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                                <Text style={{ width: '50%', fontWeight: 'bold' }}>Patient Phone : </Text>
                                <Text style={{ width: '50%' }}>{params.Phone}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, height: 35, alignItems: 'center' }}>
                                <Text style={{ width: '50%', fontWeight: 'bold' }}>Refer To : </Text>
                                <TouchableOpacity style={{ backgroundColor: Color.milky, width: '50%', height: 30, justifyContent: 'center', alignItems: 'center' }} onPress={() => setVisible(f => !f)}>
                                    <Text>{referToInfo.Name}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                disabled={false}
                                value={stay}
                                onValueChange={(value) => setStay(value)}
                            />
                            <Text>Do you wanna Stay in thread</Text>
                        </View>
                            <Text style={{ fontWeight: 'bold' }}>{'\n'}Share Fields With Doctor:{'\n'} </Text>
                        </>
                    }
                    data={DATA}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                disabled={false}
                                value={item.checked}
                                onValueChange={(value) => onChangeCheckBox(value, index, item)}
                            />
                            <Text>{item?.CCD_Title?.slice(4, item?.CCD_Title?.indexOf('</h1>'))}</Text>
                        </View>
                    )}
                    ListFooterComponent={
                        <TouchableOpacity disabled={referToInfo.Phone <= 0} onPress={() =>{stay? createGroup():addFriend()}} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: referToInfo.Phone <= 0 ? 'gray' : Color.btnPrimary, marginVertical: 20, height: 30, borderRadius: 10 }}>
                            <Text>Refer</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
            <Modal
                propagateSwipe//to enable scrollview in child components
                isVisible={visible}
                onBackdropPress={() => setVisible(f => !f)}
                onSwipeComplete={() => setVisible(f => !f)}
                swipeDirection='up'
                style={{ margin: 0 }}
            >
                <View style={{ alignSelf: 'center', height: '60%', width: '80%', backgroundColor: Color.white, padding: 10, borderRadius: 20 }}>
                    <ScrollView>
                        {
                            doctors?.filter(ele=>ele.Role==='Doctor')?.map(item =>
                                <CustomItem item={item} onPress={() => {
                                    setReferToInfo({ Name: item.Name, Phone: item.Phone });
                                    setVisible(f => !f);
                                }} longPress={() => { }} />)
                        }
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};
export default ReferTo;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    footer: {
        flex: 3,
        // backgroundColor: '#bee6fd',
        padding: 30,
    },
    imgStyle: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
});