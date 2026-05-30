import { createContext, useReducer } from "react";

export const FlightLogsContext = createContext();

export const flightLogsReducer = (state,action) =>{
    switch(action.type){
        case 'SET_FLIGHTLOGS':
            return {
                flightLogs: action.payload
            }
        case 'CREATE_FLIGHTLOG':
            return{
                flightLogs: [action.payload, ...state.flightLogs]
            }
            case 'DELETE_FLIGHTLOG':
                return{
                    flightLogs: state.flightLogs.filter((each) => each._id !== action.payload._id)
                }
            case 'UPDATE_FLIGHTLOG':
                return {
                flightLogs: state.flightLogs.map((log) => 
                // If the ID matches, replace it with the newly edited log. Otherwise, keep the old log.
                log._id === action.payload._id ? action.payload : log
                )
            }
        default:
            return state;
    }
}

export const FlightLogsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(flightLogsReducer, { 
        flightLogs: null 
    });
    console.log('AuthContext state', state)

    return (
        <FlightLogsContext.Provider value={{...state, dispatch }}>
            {children}
        </FlightLogsContext.Provider>
    );
}
