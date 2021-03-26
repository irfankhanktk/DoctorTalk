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
  try {
    const response = await axios(config)
      .then((res) => res)
      .catch((error) => {
        console.log(error)});
    return response;
  } catch (err) {
    return err;
  }
};

export const postData = async (relativeUrl,data) => {
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
  try {
    const response = await axios(config)
      .then((res) => res)
      .catch((error) => error);
    return response;
  } catch (err) {
    return { status: null };
  }
};
