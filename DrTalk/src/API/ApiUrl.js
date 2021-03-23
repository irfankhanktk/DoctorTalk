export const ApiUrls = {
  //  baseUrl: 'https://tms.bepms.com', // local url
  baseUrl: 'http://192.168.1.108/TestApi/api/std/', // local url

  auth: {
    // refreshToken: '',
    getUserIfExist: 'GetUserIfExist',
    // getPermissions: '/api/Members/GetPermissions',
    // login: '/token', //LOCAL
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
}

}