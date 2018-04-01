
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore} from 'redux';
import storeManager from 'store';

import combinedReducers from './reducers/index';
import Game from './Game';
import Runner from './components/Runner';
import ActionLogger from './components/ActionLogger';
import CountryProvider from "./components/CountryProvider";
import NetworkHelper from "./components/NetworkHelper";

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

const networkHelper = new NetworkHelper(window.BASEURL);
const actionLogger = new ActionLogger(store, networkHelper);
const runner = new Runner(store, actionLogger, networkHelper);
const countryProvider = new CountryProvider(window.COUNTRIES_LIST);

ReactDOM.render(
    <Provider store={store}>
        <Game
            userUid={window.USER_UID}
            runner={runner}
            actionLogger={actionLogger}
            countryProvider={countryProvider}
        />
    </Provider>,
    document.getElementById('gameContainer')
);
