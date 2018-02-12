
import { combineReducers } from 'redux'

export default combineReducers({
    elapsedTime: (state = 0, action) => {
        switch (action.type) {
            case 'SET_ELAPSED_TIME':
                return action.time;
            default:
                return state;
        }
    },
    status: (state = null, action) => {
        switch (action.type) {
            case 'SET_STATUS':
                return action.status;
            default:
                return state;
        }
    }
});