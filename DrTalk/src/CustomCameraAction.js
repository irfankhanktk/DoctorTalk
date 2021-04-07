import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
export const selectCamera=async()=>{
    launchCamera({
        includeBase64: true
    }, (response) => {
        // setUri(response.uri);
       return response;
    });
};

export const selectGallery =async() => {
    launchImageLibrary({
        includeBase64: true
    }, (response) => {
        return response;
    });
}