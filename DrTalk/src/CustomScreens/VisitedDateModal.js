import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Color from '../assets/Color/Color';
const VisitedDatePicker = ({ visible, onClose, uploadFile, fileName, saveFile,onChangeDate,date }) => {
    return (
        <Modal
            propagateSwipe//to enable scrollview in child components
            isVisible={visible}
            onBackdropPress={() => onClose()}
            onSwipeComplete={() => onClose()}
            swipeDirection="left"
            style={{ margin: 0 }}
        >
            <View style={{ position: 'absolute', bottom: 0, height: '30%', width: '100%', backgroundColor: '#f1f1f1', padding: 30 }}>
                <Text style={{ width: 200, marginVertical: 10, }}>Pick CCD File:*</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons onPress={() => uploadFile()} name={'file-document'} color={'#1a73e8'} size={25} />
                    <View style={{ borderWidth: 1, height: 25, width: '90%' }}>
                        <Text>{fileName}</Text>
                    </View>
                </View>

                <Text style={{ width: 200, marginVertical: 10 }}>Enter Visited Date:*</Text>
                <View style={{ flexDirection: 'row',justifyContent:'space-between' }}>
                    <DatePicker
                        style={{ width: 150, }}
                        date={date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            // ... You can check the source to find the other keys.
                        }}
                    onDateChange={(date) =>onChangeDate(date)}
                    />
                    <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center', backgroundColor: Color.btnPrimary }} onPress={() => saveFile()}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
};
export default VisitedDatePicker;