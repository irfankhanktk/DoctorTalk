import React, { useEffect } from 'react';
import { useState } from 'react';
import base64 from 'react-native-base64'
import { Text, View, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, FlatList } from 'react-native';
// import PermissionsAndroid from 'react-native-permissions';
import RNFS from "react-native-fs";
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const audioRecorderPlayer = new AudioRecorderPlayer();
const Calls = () => {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);

  const [duration, setDuration] = useState(0);
  const [playTime, setPlayTime] = useState(0);

  const [currentPositionSec, setCurrentPositionSec] = useState();

  const [startIcon, setStartIcon] = useState(false);
  const [voiceList, setVoiceList] = useState([]);
  audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  async function getUriToBase64(uri) {
    // get a list of files and directories in the main bundle
    RNFS.readDir('file:///sdcard') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // result.forEach(ele => {
        //   if (ele.name.slice(-3) === 'mp4') {
        //     console.log('GOT RESULT:', ele.name);
        //     // setVoiceList();
        //   }
        // });
        const temp = result.filter(item => {
          return item.name.slice(-3) === 'mp4';
        });
        setVoiceList(temp);
        console.log(temp);


        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((statResult) => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then((contents) => {
        // log the file contents
        console.log(contents);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }
  useEffect(() => {
    getUriToBase64('file:///sdcard/hello.mp4');
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
      android: `sdcard/${Math.random()}.mp4`, // should give extra dir name in android. Won't grant permission to the first level of dir.
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
      console.log('listning');
      console.log(e)
      setRecordSecs(`${e.current_position}`);
      setRecordTime(audioRecorderPlayer.mmss(Math.floor(e.current_position)));
      return;
    });
    console.log("start result =====: ", base64.encode('hi i am khan'));
  };
  const onSetStartIcon = async () => {
    setStartIcon(!startIcon);
  }
  const onStopRecord = async () => {

    await onSetStartIcon();
    //    alert('hwa');
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log('onStop record result : ', result);
    // console.log('on stop base64 ', getUriToBase64(result));
  };

  const onStartPlay = async (file) => {
    console.log('onStartPlay');
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `sdcard/${file}`, // should give extra dir name in android. Won't grant permission to the first level of dir.
    });

    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished', msg);

        const res = audioRecorderPlayer.stopPlayer();
        console.log('onStopPlay response :   ', res);
      }
      setCurrentPositionSec(e.current_position);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

      return;
    });
  };

  const onPausePlay = async () => {
    const res = await audioRecorderPlayer.pausePlayer();
    console.log('res onPausePlay', res);
  };

  const onStopPlay = async () => {
    const res = audioRecorderPlayer.stopPlayer();
    console.log('onStopPlay response :   ', res);
    audioRecorderPlayer.removePlayBackListener();
  };









  return (
    <View style={styles.container}>
      <FlatList
        data={voiceList}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => onStartPlay(item.name)} >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index + ''}
      />
      {startIcon ? <TouchableOpacity onPress={() => onStartRecord()}>
        <FontAwesome name={'microphone'} size={25} color={'blue'} />
      </TouchableOpacity>
        : <TouchableOpacity onPress={() => onStopRecord()}>
          <FontAwesome name={'microphone'} size={25} color={'gray'} />
        </TouchableOpacity>
      }

      <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, margin: 10, alignItems: 'center' }} onPress={() => onStartRecord()}>
        <Text style={{ color: 'white' }}>start Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, margin: 10, alignItems: 'center' }} onPress={() => onStopRecord()}>
        <Text style={{ color: 'white' }}>stop Recording</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, margin: 10, alignItems: 'center' }} onPress={() => onStartPlay()}>
        <Text style={{ color: 'white', }}>play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, margin: 10, alignItems: 'center' }} onPress={() => onStopPlay()}>
        <Text style={{ color: 'white', }}>Stop play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, margin: 10, alignItems: 'center' }} onPress={() => onPausePlay()}>
        <Text style={{ color: 'white', }}>Pause play</Text>
      </TouchableOpacity>
      <Text style={{ margin: 30 }}>Time{recordTime}</Text>
      <Text>Duration: {duration}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
});
export default Calls;