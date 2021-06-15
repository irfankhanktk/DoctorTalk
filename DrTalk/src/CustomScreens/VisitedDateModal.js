import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
const VisitedDatePicker = () => {
    return (
        <Modal
            propagateSwipe//to enable scrollview in child components
            isVisible={isModalVisible}
            onBackdropPress={() => { }}
            onSwipeComplete={() => { }}
            swipeDirection="left"
            style={{ margin: 0 }}
        >
            <View style={{ flex: 1, backgroundColor: 'red', }}>
                <Text>Hello!</Text>
            </View>
        </Modal>
    );
};
export default VisitedDatePicker;