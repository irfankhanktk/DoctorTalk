export const actions = {
    SET_USER: 'set_user',
    SET_TOKEN: 'set_token',
    SET_All_PATIENTS: 'set_all_patients',
    SET_All_DOCTORS: 'set_all_doctors',
    SET_All_REQUESTS: 'set_all_requests',
    SET_All_FRIENDS: 'set_all_friends',
    SET_MSG: 'set_msg',
    SET_SOCKET: 'set_socket',
    SET_ClIENTS: 'set_clients',
    SET_MESSAGES: 'set_messages',
    SET_AUDIO: 'set_audio'

};

export const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case actions.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case actions.SET_AUDIO:
            return {
                ...state,
                audio: action.payload,
            };
        case actions.SET_All_PATIENTS:
            return {
                ...state,
                allPatients: action.payload,
            };
        case actions.SET_All_REQUESTS:
            return {
                ...state,
                allRequests: action.payload,
            };
        case actions.SET_All_DOCTORS:
            return {
                ...state,
                allDoctors: action.payload,
            };
        case actions.SET_All_FRIENDS:
            return {
                ...state,
                allFriends: action.payload,
            };
        case actions.SET_TOKEN:
            return {
                ...state,
                token: action.payload,
            };
        case actions.SET_Msg:
            return {
                ...state,
                msg: action.payload,
            };
        case actions.SET_SOCKET:
            return {
                ...state,
                socket: action.payload,
            };
        case actions.SET_ClIENTS:
            return {
                ...state,
                clients: action.payload,
            };
        case actions.SET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
            };
        default:
            return state;
    }
};
