export const IP='http://192.168.1.102';
export const ApiUrls = {
  baseUrl: `${IP}/DrPatient_API/api/`,
  auth:{
        signIn:'User/IsUser',
        SignUp:'',
  },
User:{
  _addUser:'/User/PostUser',
  _getAllUsers:'/User/GetUsers',
  _updateImage:'UpdateImage',
},
Friend:{
  _getMyFriends:'Friend/GetFriends',
  _getFriendRequests:'Friend/GetFriendRequests',
  _alterRequest:'Friend/AlterRequest',
  _addFriend:'Friend/AddFriend',
  _blockFriend:'Friend/BlockFriend',
  _unBlockFriend:'Friend/UnBlockFriend',
},
Message:{
  _postMessage:'Message/PostMessage',
  _getMessage:'Message/GetMessage',
  _getMessages:'Message/GetMessages',
  _deleteMessages:'Message/DeleteMessages',


  // _PostImageKey:'PostImageKey',
  // _GetAudioString:'GetAudioString',
  // _GetImageString:'GetImageString',
}

}