
import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { Provider } from 'react-redux';
import { createStore} from 'redux';
import combinedReducers from './reducers/index';
import storeManager from 'store';
import Runner from './Runner';
import ActionLogger from './ActionLogger';

const defaultState = {
    matchedCountries: [],
    runner: {
        status: Runner.STATUS_IDLE,
        elapsedTime: 0,
        gameUid: null,
    },
    history: window.HISTORY || [],
};

const savedState = storeManager.get('countriesState') && storeManager.get('countriesState').length
    ? JSON.parse(storeManager.get('countriesState'))
    : null;

// @todo sort out 'window.*' config constants and remove them
if (savedState) {
    savedState.history = window.HISTORY || [];
}

const store = createStore(combinedReducers, savedState || defaultState);

store.subscribe(() => {
    storeManager.set('countriesState', JSON.stringify(store.getState()));
});


const actionLogger = new ActionLogger(store);
const runner = new Runner(store, actionLogger);

ReactDOM.render(
    <Provider store={store}>
        <Game
            // @todo figure out why Provider doesn't provide props.store to the Game
            store={store}
            userUid = {window.USER_UID}
            runner={runner}
            actionLogger={actionLogger}
        />
    </Provider>,
    document.getElementById('gameContainer')
);
