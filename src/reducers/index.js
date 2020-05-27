//reducers folder
import { combineReducers } from "redux";
import * as actionTypes from "../actions/types";

//first reducer is going to be a user reducer for modifyng state related to user

const initialUserState = {
    currentUser: null,
    isLoading: true
}

const user_reducer = (state = initialUserState, action)=>{
    switch(action.type){
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        default: 
            return state;
    }
}

const rootReducer = combineReducers({
    user: user_reducer
});

export default rootReducer;