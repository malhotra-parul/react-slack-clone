import * as actionTypes from "./types";

//action creator
export const setUser = user =>{
    return { 
        type: actionTypes.SET_USER,
        payload: {
            currentUser : user
        }
    }
}