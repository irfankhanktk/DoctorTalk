export const ApiUrls = {
  baseUrl: 'http://192.168.1.103/DrPatient_API/api/',
  auth:{
        signIn:'User/IsUser',
        SignUp:'',
  },
  doctor:{
    _getUnApprovedDoctors:'GetUnApprovedDoctor',
    _getApprovedDoctors:'GetApprovedDoctor', 
    _getRejectedDoctors:'GetRejectedDoctor',
    _rejectDoctor:'GetDoctorReject',
    _approveDoctor:'GetDoctorApprove',
    _addDoctor:'PostAddDoctor',
  },
patient:{
  _getAllPatient:'GetAllPatients',
  _invitation:{
    _invitePatient:'GetPateintInvited',
    _addPatient:'PostAddPateint',
  }
},
User:{
  _addUser:'/User/PostUser',
  _getUsersBYRole:'/User/GetUsersBYRole',
  // _getUnfriendDoctors:'GetUnfriendDoctors',
  // _getMyFriendsFrequests:'GetMyFriendsFrequests',
  _updateImage:'UpdateImage',
},
Friend:{
  _getMyFriends:'Friends/GetFriends',
  _getFriendRequests:'Friends/GetFriendRequests',
  _alterRequest:'Friends/AlterRequest',
},
message:{
  _PostAudioKey:'PostAudioKey',
  _PostImageKey:'PostImageKey',
  _GetAudioString:'GetAudioString',
  _GetImageString:'GetImageString',
}

}