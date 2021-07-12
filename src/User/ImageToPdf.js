import React, { useState } from 'react'
import RNImageToPdf from 'react-native-image-to-pdf';
import { Button, Dimensions, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const { width, height } = Dimensions.get('window');
const ImageToPdf =() => {
    const [images,setImages]=useState([]);
    const pickFiles = async() => {
        // // Pick a single file
        // try {
        //     const res = await DocumentPicker.pick({
        //         type: [DocumentPicker.types.images],
        //     });
        //     console.log(
        //         res.uri,
        //         res.type, // mime type
        //         res.name,
        //         res.size
        //     );
        // } catch (err) {
        //     if (DocumentPicker.isCancel(err)) {
        //         // User cancelled the picker, exit any dialogs or menus and move on
        //     } else {
        //         throw err;
        //     }
        // }


        // Pick multiple files
        try {
            const results = await DocumentPicker.pickMultiple({
                type: [DocumentPicker.types.images],
            });
            let temp=[];
            for (const res of results) {
                console.log(
                    res.uri,
                    res.type, // mime type
                    res.name,
                    res.size
                );
                temp.push(res.uri);
            }
            setImages(temp);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    const convertToPDF = async() => {
        try {
            const options = {
                imagePaths: images,
                name: 'MyPDF.pdf',
                maxSize: { // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round(width / height * 900),
                },
                quality: .7, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);
           
            console.log(pdf.filePath);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View>
            <Button title="pick images" onPress={() =>pickFiles()} />
            <Button title="Convert to pdf " onPress={() =>convertToPDF()} />
        </View>
    );
}
export default ImageToPdf;