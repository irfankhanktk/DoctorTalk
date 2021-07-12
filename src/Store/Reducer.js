export const actions = {
    SET_USER: 'set_user',
    SET_TOKEN: 'set_token',
    SET_All_USERS: 'set_all_users',
    SET_All_DOCTORS: 'set_all_doctors',
    SET_All_PATIENTS: 'set_all_patients',
    SET_All_REQUESTS: 'set_all_requests',
    SET_All_FRIENDS: 'set_all_friends',
    SET_MSG: 'set_msg',
    SET_SOCKET: 'set_socket',
    SET_ClIENTS: 'set_clients',
    SET_MESSAGES: 'set_messages',
    SET_AUDIO: 'set_audio',
    SET_ONLINE: 'set_online',
    SET_APPROVED_DR: 'set_approved_dr',
    SET_REJECTED_DR: 'set_rejected_dr',
    SET_ADMIN_REQUESTS: 'set_admin_requests',
    SET_Groups: 'set_groups',
    SET_Group_Messages: 'set_group_messages',


};

export const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case actions.SET_All_PATIENTS:
            return {
                ...state,
                patients: action.payload,
            };
        case actions.SET_ONLINE:
            return {
                ...state,
                online: action.payload,
            };
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
        case actions.SET_All_DOCTORS:
            return {
                ...state,
                doctors: action.payload,
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
        case actions.SET_ADMIN_REQUESTS:
            return {
                ...state,
                admin_requests: action.payload,
            };
        case actions.SET_APPROVED_DR:
            return {
                ...state,
                approved_dr: action.payload,
            };
        case actions.SET_REJECTED_DR:
            return {
                ...state,
                rejected_dr: action.payload,
            };
        case actions.SET_Groups:
            return {
                ...state,
                groups: action.payload,
            };
        case actions.SET_Group_Messages:
            return {
                ...state,
                group_messages: action.payload,
            };
        default:
            return state;
    }
};
