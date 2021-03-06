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
import { insert } from './API/DManager';
import Color from './assets/Color/Color';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase('Khan.db');

const audioRecorderPlayer = new AudioRecorderPlayer();
const Recorder = (props) => {
  const { route } = props;
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
  const { user, messages, socket } = state;
  audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }
  const select = async () => {
    db.transaction(function (tx) {

        tx.executeSql(
            'select * from Message' + route.params.Friend_ID,
            [],
            (tx, results) => {
                const temp = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    temp.push(results.rows.item(i));
                }

      
                let groupData = temp.reduce((acc, item) => {
                    if (!acc[item.Created_Date])
                        acc[item.Created_Date] = [];
                    acc[item.Created_Date].push(item);
                    return acc;
                }, {});

                dispatch({
                    type: actions.SET_MESSAGES,
                    payload: Object.values(groupData)
                });

            },
            (tx, error) => {
                console.log('error:', error);
            }
        );
    });
}
  async function sendAudioMessage(uri) {
    const base64String = await RNFS.readFile(uri, "base64");
    const msgInfo = {
      Friend_ID: route.params.Friend_ID,
      From_ID: user.Phone,
      To_ID: route.params.Phone,
      Message_Type: 'audio',
      Message_Content: base64String,
      Is_Download: 0,
      Created_Date:(new Date()).toLocaleDateString(),
      Created_Time:formatAMPM(new Date),
      Is_Seen: 0,
    };

    insert('Message' + route.params.Friend_ID, 'From_ID,To_ID,Message_Content,Message_Type,Is_Seen,Is_Download, Created_Date, Created_Time', [user.Phone, route.params.Phone, uri, 'audio', 1, 1,msgInfo.Created_Date, msgInfo.Created_Time], '?,?,?,?,?,?,?,?');
    const resp = await postData(ApiUrls.Message._postMessage, msgInfo);
    if (resp.status === 200) {
      msgInfo.Message_Content = resp.data;
      sendMessageToServer(socket, msgInfo);
      select();
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
    if (result && result.toString().slice(-3) === 'mp3') {
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
    const path = Platform.select({
      ios: 'hello.m4a',
      // android: `sdcard/${item.name}`, // should give extra dir name in android. Won't grant permission to the first level of dir.
      android: `data:audio/mp3;base64,${base64Audio}`, // should give extra dir name in android. Won't grant permission to the first level of dir.
    });

    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        setIsPlay(true);
        const res = audioRecorderPlayer.stopPlayer();
      }
      // console.log('current_position:   ', e.current_position);
      // console.log('duration:   ', e.duration);
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
          <FontAwesome name={'microphone'} size={25} color={'green'} />
        </TouchableOpacity>
          : <TouchableOpacity onPress={() => onStartRecord()}>
            <FontAwesome name={'microphone'} size={25} color={'white'} />
          </TouchableOpacity>
        }
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:Color.primary,
    borderRadius:100,
    height:40,
    alignSelf:'flex-end'
  },
});
export default Recorder;


