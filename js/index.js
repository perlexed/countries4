
import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { Provider } from 'react-redux';
import { createStore} from 'redux';
import combinedReducers from './reducers/index';
import storeManager from 'store';
import Runner from './Runner';

const defaultState = {
    matchedCountries: [],
    runner: {
        status: Runner.STATUS_IDLE,
        elapsedTime: 0,
        gameUid: null,
    }
};

const savedState = storeManager.get('countriesState') && storeManager.get('countriesState').length
    ? JSON.parse(storeManager.get('countriesState'))
    : null;

const store = createStore(combinedReducers, savedState || defaultState);

store.subscribe(() => {
    storeManager.set('countriesState', JSON.stringify(store.getState()));
});

ReactDOM.render(
    <Provider store={store}>
        <Game
            // @todo figure out why Provider doesn't provide props.store to the Game
            store={store}
            userUid = {window.USER_UID}
        />
    </Provider>,
    document.getElementById('gameContainer')
);
