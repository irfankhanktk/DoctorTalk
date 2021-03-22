import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';


const CustomActivityIndicator = ({ visible }) => (
  <Modal animationType="fade" transparent={true} isVisible={visible}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{  fontSize: 15 }}>Please wait...</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: '#e7e7e7',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export { CustomActivityIndicator };
