import axios, { get } from 'axios';
// import { Platform } from 'react-native';
import { ApiUrls as s } from './ApiUrl';
const getUrl = (rel) => `${s.baseUrl}${rel}`;

export const getData = async (relativeUrl) => {
  const url = getUrl(relativeUrl);
  console.log('url :', url);
  const config = {
    method: 'get',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  
    const response = await axios(config)
      .then((res) => res)
      .catch((error) =>
      {
        return {status:404};
      });
    return response;
};


export const postData = async (relativeUrl,data) => {
  console.log('data::::',data);
  const url = getUrl(relativeUrl);
  console.log('url :', url);
  const config = {
    method: 'post',
    url: url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data:data,
  };
    const response = await axios(config)
      .then((res) => res)
      .catch((error) =>  {
        // console.log(response);
        return {status:500};
      });
    return response;
 
};
export const postFormData = async (relativeUrl,data) => {
  // console.log('data::::',data);
  const url = getUrl(relativeUrl);
  console.log('url :', url);
  const config = {
    method: 'post',
    url: url,
    headers: {
      'Content-Type': 'multipart/form-data; ',
    },
    data:data,
  };
    const response = await axios(config)
      .then((res) => res)
      .catch((error) =>  {
        // console.log(response);
        return {status:500};
      });
    return response;
 
};

export const sendMessageToServer=async(socket,msgInfo)=>{
  socket.emit('chat message', msgInfo);
}
export const allowCCDToPatient=(socket,patient)=>{
  socket.emit('allowCCDToPatient',patient);
}