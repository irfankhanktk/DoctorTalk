export const actions = {
    SET_USER: 'set_user',
    SET_AllPatients: 'set_all_patients',
    SET_AllDoctors: 'set_all_doctors',
    SET_TOKEN: 'set_token',
    SET_Msg: 'set_msg',
    SET_Socket: 'set_socket',
    SET_ClIENTS: 'set_clients',
    SET_MESSAGES: 'set_messages'
};

export const reducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case actions.SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case actions.SET_AllPatients:
            return {
                ...state,
                allPatients: action.payload,
            };
        case actions.SET_AllDoctors:
            return {
                ...state,
                allDoctors: action.payload,
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
        case actions.SET_Socket:
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
