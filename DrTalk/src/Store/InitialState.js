export const initialState = {
    user:{},
    token:null,
    allPatients: [
        {Un_name:'Kinza',Un_phone:'0344'},
        {Un_name:'Imran',Un_phone:'0322'},
        {Un_name:'Siko',Un_phone:'0334'},
        {Un_name:'Dr Arman',Un_phone:'0333'},
    ],
    allDoctors: [
      
        {Un_name:'Dr Arman',Un_phone:'0333'},
        {Un_name:'Dr Jameel',Un_phone:'0444'},
        {Un_name:'Dr Kamal',Un_phone:'0555'}
    ],
    msg:'',
    socket:{},
    clients:[],
    messages:[],
    allFriends:[
        {Name:'Ali',Friend_phone:'0345'},
        {Name:'Irfan',Friend_phone:'0346'},
        {Name:'Khan',Friend_phone:'0333'}
    ],
    allRequests:[
        {Name:'Ali',Phone:'0345'},
        {Name:'Irfan',Phone:'0346'},
        {Name:'Khan',Phone:'0333'}
    ],
};
