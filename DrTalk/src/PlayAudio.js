import React, { useEffect } from 'react';
import { useState } from 'react';
import base64 from 'react-native-base64'
import { Text, View, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid, FlatList } from 'react-native';
// import PermissionsAndroid from 'react-native-permissions';
import RNFS from "react-native-fs";
import * as Progress from 'react-native-progress';
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const audioRecorderPlayer = new AudioRecorderPlayer();
const PlayAudio = ({item}) => {
    const [recordSecs, setRecordSecs] = useState(0);
    const [recordTime, setRecordTime] = useState(0);
    const [currentDurationSec, setCurrentDurationSec] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [isPlay, setIsPlay] = useState(true);
    const [duration, setDuration] = useState(0);
    const [playTime, setPlayTime] = useState(0);

    const [currentPositionSec, setCurrentPositionSec] = useState();

    const [startIcon, setStartIcon] = useState(false);
    // const [voiceList, setVoiceList] = useState([]);
    audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
    // async function getUriToBase64(uri) {
    //     // get a list of files and directories in the main bundle
    //     RNFS.readDir('file:///sdcard') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //         .then((result) => {

    //             const temp = result.filter(item => {
    //                 return item.name.slice(-3) === 'mp4';
    //             });
    //             setVoiceList(temp);
    //             console.log(temp);
    //         })
    // }
    // useEffect(() => {
    //     getUriToBase64('file:///sdcard/hello.mp4');
    // }, [])
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
    // const handlePlayPause = (item) => {
    //     const newData = voiceList.map(ele => {
    //         if (ele.name === item.name) {
    //             return {
    //                 ...ele,
    //                 selected: true,
    //             };
    //         }
    //         return {
    //             ...ele,
    //             selected: false,
    //         };
    //     });
    //     setVoiceList(newData);
    // }
    const onStartPlay = async (item) => {
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
        // handlePlayPause(item);

        setIsPlay(!isPlay);
        console.log('onStartPlay',item.Message_Content);
        const path = Platform.select({
            ios: 'hello.m4a',
             android:item.Message_Content, // should give extra dir name in android. Won't grant permission to the first level of dir.
           
            // android: `data:audio/mp3;base64,${item}`, // should give extra dir name in android. Won't grant permission to the first level of dir.
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
            setCurrentPositionSec(e.current_position);
            setCurrentDurationSec(e.duration);
            setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
            console.log('prog', audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
            setProgressValue(e.current_position / e.duration);

            return;
        });
    };

    const onPausePlay = async (item) => {
        // handlePlayPause(item);
        setIsPlay(!isPlay);
        const res = await audioRecorderPlayer.pausePlayer();
        console.log('res onPausePlay', res);
    };

    // const onStopPlay = async () => {
    //   const res = audioRecorderPlayer.stopPlayer();
    //   console.log('onStopPlay response :   ', res);
    //   audioRecorderPlayer.removePlayBackListener();
    // };









    return (
    <View style={{width:'40%',justifyContent: 'center',alignItems: 'center', height: 50, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'gray'}}>
        {isPlay?
            <TouchableOpacity onPress={() => onStartPlay(item)}>
                <FontAwesome name='play' size={15} />
            </TouchableOpacity>
            :<TouchableOpacity onPress={() => onPausePlay(item)}>
                <FontAwesome name='pause' size={15} />
            </TouchableOpacity>
        }
        <View style={{ justifyContent: 'center',}}>
            <Progress.Bar progress={isPlay?0:progressValue} width={100} />
        </View>
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
export default PlayAudio;