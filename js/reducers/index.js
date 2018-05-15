import { combineReducers } from 'redux';

import runner from './runner';

const combinedReducers = combineReducers({
    matchedCountries: (state = {}, action) => {
        switch (action.type) {
            case 'ADD_COUNTRY':
                return state.indexOf(action.countryCode) === -1
                    ? [action.countryCode].concat(...state)
                    : state;
            case 'RESET_COUNTRIES':
                return [];
            default:
                return state;
        }
    },

    runner: runner,

    history: (state = [], action) => {
        switch (action.type) {
            case 'UPDATE_HISTORY':
                return action.history;
            default:
                return state;
        }
    },

    gameMode: (state = null, action) => {
        switch (action.type) {
            case 'SET_GAME_MODE':
                return action.gameMode;
            default:
                return state;
        }
    },

    // @todo refactor this
    version: (state = '') => {
        return state;
    },

    // @todo refactor this
    statistics: (state = {}) => {
        return state;
    },

    infoPanelSwitch: (state = 'stats', action) => {
        switch (action.type) {
            case 'TOGGLE_INFO_PANEL':
                return action.infoPanelName;
            default:
                return state;
        }
    },
});

export default combinedReducers;