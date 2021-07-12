export const IP='http://192.168.43.47';//172.17.112.1
// export const IP='http://192.168.0.109';//172.17.112.1
export const getImageUrl=()=>`${IP}/DrPatient_API/Images/`;
export const getFileUrl=()=>`${IP}/DrPatient_API/MyFile/`;
export const getGroupFileUrl=()=>`${IP}/DrPatient_API/GroupFile/`;

export const ApiUrls = {
  baseUrl: `${IP}/DrPatient_API/api/`,
  auth:{
        signIn:'User/IsUser',
        SignUp:'',
  },
User:{
  _addUser:'User/PostUser',
  _getAllUsers:'User/GetUsers',
  _updateImage:'User/UpdateImage',
  _updateName:'User/UpdateName',
  _invite:'User/Invite',
  _invitationCode:'User/InvitationCode',
  _postImage:'User/UploadFile',
  _admin:{
    _getRejectedDoctors:'User/GetRejectedDoctors',
    _getApprovedDoctors:'User/GetetApprovedDoctors',
    _getUnApprovedDoctors:'User/GetUnApprovedDoctors',
    _alterDrRequest:'User/AlterDrRequest',
  },
},
Friend:{
  _getMyFriends:'Friend/GetFriends',
  _getFriendRequests:'Friend/GetFriendRequests',
  _alterRequest:'Friend/AlterRequest',
  _alterArchive:'Friend/AlterArchive',
  // _addFriend:'Friend/AddFriend',
  _blockFriend:'Friend/BlockFriend',
  _unBlockFriend:'Friend/UnBlockFriend',
  _sendFriendRequest:'Friend/SendFriendRequest',
  _addFriend:'Friend/AddFriend',
  _removeFriend:'Friend/CancelRequest'
},
Message:{
  _postMessage:'Message/PostMessage',
  _getMessage:'Message/GetMessage',
  _getMessages:'Message/GetMessages',
  _deleteMessages:'Message/DeleteMessages',
  _deleteMessage:'Message/DeleteMessage',
  _postCCD:'Message/PostCCD',
  _getCCD:'Message/GetCCD',
  _uploadFile:'Message/UploadFile',




  // _PostImageKey:'PostImageKey',
  // _GetAudioString:'GetAudioString',
  // _GetImageString:'GetImageString',
},
CCD:{
  _addCCD:'CCD/AddCCD',
  _shareCCD:'CCD/ShareCCD',
  _getCCD:'CCD/GetCCD',
},
Group:{
  _getGroups:'Group/GetGroups',
  _uploadFile:'Group/UploadFile',
  _createGroup:'Group/CreateGroup',
  _getGMessages:'Group/GetGMessages',



}

}