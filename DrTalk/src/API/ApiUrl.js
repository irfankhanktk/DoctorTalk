export const ApiUrls = {
  baseUrl: 'http://192.168.0.104/TestApi/api/std/',
  auth: {
    // refreshToken: '',
    getUserIfExist: 'GetUserIfExist',
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
user:{
  _getMyFriends:'GetMyFriends',
  _getUnfriendPatients:'GetUnfriendPatients',
  _getUnfriendDoctors:'GetUnfriendDoctors',
  _getMyFriendsFrequests:'GetMyFriendsFrequests',
  _updateImage:'UpdateImage',
},
message:{
  _PostAudioKey:'PostAudioKey',
  _PostImageKey:'PostImageKey',
  _GetAudioString:'GetAudioString',
  _GetImageString:'GetImageString',
}

}