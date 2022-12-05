import { combineReducers } from 'redux'

const initialState = { 
    age:20,
    gender: 'female',
    gdp: 20000,
    health: 0.8,
    happy: 5.4,
    alcohol: 80,
 };
export const reducers = (state = initialState, action) => {
    if(action && action.type){
        return {
            ...state,
            [action.type]: action.payload
        }
    }
    return state
 }

export default reducers;