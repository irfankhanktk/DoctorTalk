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
      console.log('response in api call ',response);
    return response;
  } catch (err) {
    return { status: null };
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


// export const refreshToken = async (user) => {
//   const deviceId = DeviceInfo.getDeviceId();
//   var details = {
//     username: user.name,
//     password: user.password,
//     grant_type: 'password',
//     Scope: `${user.companyCode},${deviceId},${Platform.OS}`,
//   };

//   var formBody = [];
//   for (var property in details) {
//     var encodedKey = encodeURIComponent(property);
//     var encodedValue = encodeURIComponent(details[property]);
//     formBody.push(encodedKey + '=' + encodedValue);
//   }
//   formBody = formBody.join('&');

//   const resquest = await authService(`${s.auth.login}`, formBody);
//   if (resquest.status === 200) {
//     let obj = {
//       memberId: resquest.data.MemberId,
//       password: user.password,
//       name: resquest.data.userName,
//       companyCode: user.companyCode,
//       access_token: resquest.data.access_token,
//       issued: resquest.data['.issued'],
//       expires: resquest.data['.expires'],
//       expires_in: resquest.data.expires_in,
//       ImagePath: resquest.data.ImagePath,
//     };
//     return obj;
//   }
//   return null;
// };

// export const getData = async (relativeUrl, user) => {
//   const url = getUrl(relativeUrl);

//   const options = {
//     mode: 'no-cors',
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await get(url, options).then((res) => res);
//     return { status: response.status, data: response.data };
//   } catch (err) {
//     if (err.response) {
//       return { status: err.response.status, data: [] };
//     }
//     return { status: 0, data: [] };
//   }
// };

// // export const postData = async (relativeUrl, user, data) => {
// //   const url = getUrl(relativeUrl);
// //   const options = {
// //     headers: {
// //       Authorization: 'Bearer ' + user.token,
// //       'Content-Type': 'application/json',
// //       Accept: 'text/plain'
// //     }
// //   };
// //   const response = await post(url, data, options);

// //   return response;
// // };

// export const postData = async (relativeUrl, user, data) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'post',
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: '*/*',
//     },
//     data,
//   };

//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const postDataJSON = async (relativeUrl, user, data) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'post',
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/json',
//       Accept: '*/*',
//     },
//     data,
//   };

//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const allCheckInService = async (relativeUrl, user) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'get',
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const CheckInHistoryService = async (relativeUrl, user, MemberId, flag, viewFilter) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'get',
//     params: {
//       membersid: MemberId,
//       flag,
//       viewFilter,
//     },
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const getMemberSocialWall = async (relativeUrl, user, MemberId) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'get',
//     params: {
//       MemberID: MemberId,
//     },
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const checkinInitiateService = async (
//   relativeUrl,
//   user,
//   memid,
//   checkinid,
//   flag,
//   initiatedWith,
//   MatrixId,
//   assignAndShareWith
// ) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'get',
//     params: {
//       memid,
//       checkinid,
//       flag,
//       initiatedWith,
//       MatrixId,
//       assignAndShareWith,
//     },
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const getInitiatorService = async (relativeUrl, user, memId) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'get',
//     params: {
//       memId,
//       flag: 'S',
//     },
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const unAssignService = async (relativeUrl, user, membersid, MemberCheckinID, checkinid) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'get',
//     params: {
//       MemberCheckinID,
//       checkinid,
//       membersid,
//     },
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const postFile = async (relativeUrl, user, data) => {
//   const url = getUrl(relativeUrl);
//   const headers = {
//     Authorization: `Bearer ${user.access_token}`,
//   };
//   const response = await fetch(url, {
//     method: 'POST',
//     headers,
//     body: data,
//   })
//     .then((res) => res.json())
//     .then((res) => res)
//     .catch((error) => error);

//   return response;
// };

// export const putData = async (relativeUrl, user, data) => {
//   const url = getUrl(relativeUrl);
//   const config = {
//     method: 'put',
//     url,
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: '*/*',
//     },
//     data,
//   };
//   // const options = {
//   //   mode: 'no-cors',
//   //   headers: {
//   //     Authorization: `Bearer ${user.token}`,
//   //     'Content-Type': 'application/json-patch+json',
//   //     Accept: '*/*',
//   //   }
//   // };

//   try {
//     const response = await axios(config)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };

// export const deleteData = async (relativeUrl, user) => {
//   const url = getUrl(relativeUrl);
//   const options = {

//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/x-www-form-urlencoded',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await axios
//       .delete(url, options)
//       .then((res) => res)
//       .catch((error) => error);
//     return response;
//   } catch (err) {
//     return { status: null };
//   }
// };


// export const deleteSocialFriend = async (relativeUrl, user) => {
//   const url = getUrl(relativeUrl);
//   const options = {
//     headers: {
//       Authorization: `Bearer ${user.access_token}`,
//       'Content-Type': 'application/json',
//       Accept: '*/*',
//     },
//   };
//   try {
//     const response = await get(url, options).then((res) => res);
//     return response;
//   } catch (err) {
//     if (err.response) {
//       return response;
//     }
//     return { status: 0, data: [] };
//   }
// };
