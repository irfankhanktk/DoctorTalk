import React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Platform,PermissionsAndroid} from 'react-native';
// import PermissionsAndroid from 'react-native-permissions';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
  } from 'react-native-audio-recorder-player';
const Calls = () => {
    const [recordSecs,setRecordSecs]=useState(0);
    const [recordTime,setRecordTime]=useState(0);
    const [currentDurationSec,setCurrentDurationSec]=useState(0);
   
    const [duration, setDuration]=useState(0);
    const [playTime,setPlayTime]=useState(0);
    
    const [currentPositionSec,setCurrentPositionSec]=useState();


    const audioRecorderPlayer = new AudioRecorderPlayer();
    audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

   const onStartRecord = async () => {
    if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Permissions for write access',
              message: 'Give permission to your storage to write a file',
              buttonPositive: 'ok',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the storage');
          } else {
            console.log('permission denied');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }
        if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                  title: 'Permissions for write access',
                  message: 'Give permission to your storage to write a file',
                  buttonPositive: 'ok',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  console.log('aya  hhahhahhha');
              } else {
                console.log('permission denied');
                return;
              }
            } catch (err) {
              console.warn(err);
              return;
            }
          }
          const path = Platform.select({
            ios: 'hello.m4a',
            android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
          });
          const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
          };
        //   const result = await audioRecorderPlayer.startRecord(path);
         const result = await audioRecorderPlayer.startRecorder(path,audioSet);
        audioRecorderPlayer.addRecordBackListener((e) => {
            console.log('listning');
                setRecordSecs(`${e.current_position}`);
                setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            return;
        });
        console.log("start res: ",result);
    };
   const onStopRecord = async () => {
    //    alert('hwa');
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecordSecs(0);
        console.log('onStop record result : ',result);
    };

   const onStartPlay = async () => {
        console.log('onStartPlay');
        const path = Platform.select({
            ios: 'hello.m4a',
            android: 'sdcard/hello.mp4', // should give extra dir name in android. Won't grant permission to the first level of dir.
          });
        const msg = await audioRecorderPlayer.startPlayer(path);
        audioRecorderPlayer.setVolume(1.0);
        console.log(msg);
        audioRecorderPlayer.addPlayBackListener((e) => {
          if (e.current_position === e.duration) {
            console.log('finished');
            const res=audioRecorderPlayer.stopPlayer();
            console.log('onStopPlay response :   ',res);
          }
            setCurrentPositionSec(e.current_position);
            setCurrentDurationSec(e.duration);
            setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
           
            return;
        });
    };

  const  onPausePlay = async () => {
        const res=await audioRecorderPlayer.pausePlayer();
        console.log('res onPausePlay',res);
    };

   const onStopPlay = async () => {
    const res=audioRecorderPlayer.stopPlayer();
    console.log('onStopPlay response :   ',res);
    audioRecorderPlayer.removePlayBackListener();
    };









    return (
        <View style={styles.container}>
            <TouchableOpacity style={{backgroundColor:'black',padding:10,margin:10,alignItems:'center'}} onPress={()=>onStartRecord()}>
                <Text style={{color:'white'}}>start Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'black',padding:10,margin:10,alignItems:'center'}} onPress={()=>onStopRecord()}>
                <Text style={{color:'white'}}>stop Recording</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'black',padding:10,margin:10,alignItems:'center'}} onPress={()=>onStartPlay()}>
                <Text style={{color:'white',}}>play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'black',padding:10,margin:10,alignItems:'center'}} onPress={()=>onStopPlay()}>
                <Text style={{color:'white',}}>Stop play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor:'black',padding:10,margin:10,alignItems:'center'}} onPress={()=>onPausePlay()}>
                <Text style={{color:'white',}}>Pause play</Text>
            </TouchableOpacity>
            <Text style={{margin:30}}>Time{recordTime}:{recordSecs}</Text>
            <Text>Duration: {duration}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    },
});
export default Calls;