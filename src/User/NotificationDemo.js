import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import PushNotification from "react-native-push-notification";
const NotificationDemo = () => {
    const manageNotification=()=>{
        console.log('heloo');
        PushNotification.localNotification({
            channelId: "channel-id", 
            title:'title',
            message:'i am message',
        });
        PushNotification.localNotificationSchedule({
            channelId: "channel-id", 
            title:'title is here',
            message:'i am message after 20 sec',
            date:new Date(Date.now()+20*1000),
            allowWhileIdle:true,
        });
    }
    const createChannel=()=>{
        PushNotification.createChannel(
            {
              channelId: "channel-id", // (required)
              channelName: "Khan channel", // (required)
            //   channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            //   playSound: false, // (optional) default: true
            //   soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            //   importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
    }
 useEffect(()=>{
  createChannel();
 },[])
    return (
        <View>
            <Button onPress={()=>manageNotification()} title="click for notification"/>
            <Text>Hello</Text>
        </View>
    );
};
export default NotificationDemo;