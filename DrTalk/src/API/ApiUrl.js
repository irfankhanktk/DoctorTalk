// export const IP='http://192.168.18.21';//172.17.112.1
export const IP='http://192.168.0.103';//172.17.112.1
export const getImageUrl=()=>`${IP}/DrPatient_API/Images/`;
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
  _invite:'User/Invite',
  _invitationCode:'User/InvitationCode',
  _postImage:'User/UploadFile',
  _admin:{
    _getRejectedDoctors:'User/GetRejectedDoctors',
    _getApprovedDoctors:'User/GetetApprovedDoctors',
    _getUnApprovedDoctors:'User/GetUnApprovedDoctors',
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
  _addFriend:'Friend/AddFriend'
},
Message:{
  _postMessage:'Message/PostMessage',
  _getMessage:'Message/GetMessage',
  _getMessages:'Message/GetMessages',
  _deleteMessages:'Message/DeleteMessages',
  _deleteMessage:'Message/DeleteMessage',
  _postCCD:'Message/PostCCD',
  _getCCD:'Message/GetCCD',



  // _PostImageKey:'PostImageKey',
  // _GetAudioString:'GetAudioString',
  // _GetImageString:'GetImageString',
},
CCD:{
  _addCCD:'CCD/AddCCD',
  _shareCCD:'CCD/ShareCCD',
}

}