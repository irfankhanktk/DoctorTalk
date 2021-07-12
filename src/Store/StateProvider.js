import React, { createContext, useContext, useReducer} from 'react';
// import PropTypes from 'prop-types';
import { initialState } from './InitialState';
export const StateContext = createContext(initialState);
export const StateProvider = ({ reducer, initialState, children }) =>(
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);
// StateProvider.propTypes = {
//     reducer: PropTypes.func.isRequired,
//     initialState: PropTypes.object.isRequired,
//     children: PropTypes.node,
// };
export const useStateValue = () => useContext(StateContext);
