import * as actionTypes from "./types";

//action creator for User
export const setUser = user =>{
    return { 
        type: actionTypes.SET_USER,
        payload: {
            currentUser : user
        }
    }
}
export const clearUser = () =>{
    return { 
        type: actionTypes.CLEAR_USER
    }
}

//action creator for Channels

export const setCurrentChannel = channel =>{
    return {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: {
            currentChannel : channel
        }
    }
}