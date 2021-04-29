import React from 'react';
import { View, Text } from 'react-native';
import { ScreenStackHeaderRightView } from 'react-native-screens';
import Slider from 'react-native-slider'
import { useState } from 'react/cjs/react.development';
const MySlider = () => {
    const [h,seth]=useState('50%');
   const  SetHeight=(v)=>{
seth(v*100+'%');
    }
    return (
        <View style={{marginTop:50}}>
            <View style={{transform:[{rotate: "-90deg"}]}}>
            <Slider
         
                minimumValue={0}
                value={0.5}
                onValueChange={(v) =>SetHeight(v)} />
            {/* <View style={{ height:h, width: '90%', backgroundColor: 'green' }}>
                <Text>Hello</Text>
            </View> */}
            </View>
        </View>
    );
};
export default MySlider;