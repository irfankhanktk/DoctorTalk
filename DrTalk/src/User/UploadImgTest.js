// Example to Pick and Upload files in React Native
// https://aboutreact.com/file-uploading-in-react-native/

// Import React
import React, { useEffect, useState } from 'react';
// Import core components
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

// Import Document Picker
import DocumentPicker from 'react-native-document-picker';
import { getData, postData, postFormData } from '../API/ApiCalls';
import { ApiUrls, getImageUrl } from '../API/ApiUrl';

const UploadImgTest = () => {
    const [singleFile, setSingleFile] = useState(null);

    const uploadImage = async () => {
        // Check if any file is selected or not
        if (singleFile != null) {
            // If file selected then create FormData
            const fileToUpload = singleFile;
            const body = new FormData();
            console.log('filetoupload: ',fileToUpload);
            //   data.append('name', 'Image Upload');
            body.append('img', {uri:fileToUpload.uri,name:fileToUpload.name,type:fileToUpload.type});
            // body.append('Phone','03457266093');
            // body.append('Name','iRFAN kHAN');
            // body.append('Role','DOCTOR');
            // body.append('Status','Online');
            console.log('data    =>  ',body);
            const resp=await postFormData(`${ApiUrls.User._postImage}?Phone=03457266093`,body);
            console.log(resp);  
           
        } else {
            alert('Please Select File first');
        }
    };

    const selectFile = async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                // Provide which type of file you want user to pick
                type: [DocumentPicker.types.allFiles],
                // There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            // Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            // Setting the state to show single file attributes
            setSingleFile(res);
        } catch (err) {
            setSingleFile(null);
            // Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                // If user canceled the document selection
                alert('Canceled');
            } else {
                // For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };
    useEffect(()=>{
        console.log(getImageUrl()+'girl.jpeg');
    },[])
    return (
        <View style={styles.mainBody}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 30, textAlign: 'center' }}>
                    React Native File Upload Example
                </Text>
                <Text
                    style={{
                        fontSize: 25,
                        marginTop: 20,
                        marginBottom: 30,
                        textAlign: 'center',
                    }}>
                    www.aboutreact.com
                </Text>
            </View>
            {/*Showing the data of selected Single file*/}
            {singleFile != null ? (
                <Text style={styles.textStyle}>
                    File Name: {singleFile.name ? singleFile.name : ''}
                    {'\n'}
                    Type: {singleFile.type ? singleFile.type : ''}
                    {'\n'}
                    File Size: {singleFile.size ? singleFile.size : ''}
                    {'\n'}
                    URI: {singleFile.uri ? singleFile.uri : ''}
                    {'\n'}
                </Text>
            ) : null}
            <Image source={{uri:getImageUrl()?getImageUrl()+'girl.jpeg':null}} style={{height:300,width:300}}/>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={selectFile}>
                <Text style={styles.buttonTextStyle}>Select File</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={uploadImage}>
                <Text style={styles.buttonTextStyle}>Upload File</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    textStyle: {
        backgroundColor: '#fff',
        fontSize: 15,
        marginTop: 16,
        marginLeft: 35,
        marginRight: 35,
        textAlign: 'center',
    },
});

export default UploadImgTest;