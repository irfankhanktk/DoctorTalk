import React, { useEffect } from 'react';
import { useState } from 'react';
import base64 from 'react-native-base64'
import { Text, View, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, FlatList, MaskedViewComponent } from 'react-native';
// import PermissionsAndroid from 'react-native-permissions';
import RNFS from "react-native-fs";
import * as Progress from 'react-native-progress';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useStateValue } from './Store/StateProvider';
import { actions } from './Store/Reducer';
import { postData, sendMessageToServer } from './API/ApiCalls';
import { ApiUrls } from './API/ApiUrl';

const audioRecorderPlayer = new AudioRecorderPlayer();
const Recorder = ({ route }) => {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [progressValue, setProgressValue] = useState(0);

  const [duration, setDuration] = useState(0);
  const [playTime, setPlayTime] = useState(0);

  const [currentPositionSec, setCurrentPositionSec] = useState();

  const [startIcon, setStartIcon] = useState(false);
  const [voiceList, setVoiceList] = useState([]);
  const [base64Audio, setBase64Audio] = useState(null);
  const [state, dispatch] = useStateValue();
  const { user, messages,socket } = state;
  audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

  async function sendAudioMessage(uri) {
    // get a list of files and directories in the main bundle
    const base64String = await RNFS.readFile(uri, "base64");
    
    const resp = await postData(ApiUrls.message._PostAudioKey, {Audio1:base64String});
    if (resp.data !== 'null') {
      console.log('response : ', resp.data);
      console.log('time: ',Date.now());
       const msgInfo = {
        Message_to: route.params.Friend_phone,
        Message_from: user.UPhone,
        Message_type: 'audio',
        Message_content:resp.data,
        Message_time:Date.now(),
        Is_download:false,
        isSeen:false,

      };
      sendMessageToServer(socket,msgInfo);
      console.log('msg info with key for audio: ',msgInfo);
      msgInfo.Message_content=base64String;
      messages.push(msgInfo);
      dispatch({
        type:actions.SET_MESSAGES,
        payload:messages
      })
     

    }
  }


  useEffect(() => {
    // getUriToBase64('file:///sdcard/0.4983614824020304.mp3');
  }, [])
  const onStartRecord = async () => {
    await onSetStartIcon();
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
      android: `${RNFS.DocumentDirectoryPath}${Math.random()}.mp3`, // should give extra dir name in android. Won't grant permission to the first level of dir.
    });
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    //   const result = await audioRecorderPlayer.startRecord(path);
    const result = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener((e) => {

      setRecordSecs(`${e.current_position}`);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      return;
    });
  };

  const onSetStartIcon = async () => {
    setStartIcon(!startIcon);
  }

  const onStopRecord = async () => {

    await onSetStartIcon();
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log('onStop record result : ', result);
    if(result&&result.toString().slice(-3)==='mp3'){
      console.log('ye to thk ha');
      sendAudioMessage(result);
    }
   

  };

  const onStartPlay = async (item) => {
    // handlePlayPause(item);

    if (base64Audio) {
      console.log('base64 here :', base64Audio.slice(0, 10));
    }
    if (!base64Audio) {

      return
    }
    // setIsPlay(!isPlay);
    console.log('onStartPlay');
    const path = Platform.select({
      ios: 'hello.m4a',
      // android: `sdcard/${item.name}`, // should give extra dir name in android. Won't grant permission to the first level of dir.
      android: `data:audio/mp3;base64,${base64Audio}`, // should give extra dir name in android. Won't grant permission to the first level of dir.
    });

    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        setIsPlay(true);
        console.log('finished', msg);
        const res = audioRecorderPlayer.stopPlayer();
        console.log('onStopPlay response :   ', res);
      }
      console.log('current_position:   ', e.current_position);
      console.log('duration:   ', e.duration);
      // setCurrentPositionSec(e.current_position);
      // setCurrentDurationSec(e.duration);
      // setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      // setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      //  console.log('prog', audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      // setProgressValue(e.current_position / e.duration);

      return;
    });
  };






  return (
    <View style={styles.container}>
      {startIcon ? <TouchableOpacity onPress={() => onStopRecord()}>
        <FontAwesome name={'microphone'} size={25} color={'blue'} />
      </TouchableOpacity>
        : <TouchableOpacity onPress={() => onStartRecord()}>
          <FontAwesome name={'microphone'} size={25} color={'black'} />
        </TouchableOpacity>
      }


    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Recorder;


