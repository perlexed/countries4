
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

const applicationConfig = JSON.parse(window.APPLICATION_CONFIG);
delete window.APPLICATION_CONFIG;

const defaultState = {
    matchedCountries: [],
    runner: {
        status: Runner.STATUS_IDLE,
        elapsedTime: 0,
        gameUid: null,
    },
    history: applicationConfig.history,
};

const savedState = storeManager.get('countriesState') && storeManager.get('countriesState').length
    ? JSON.parse(storeManager.get('countriesState'))
    : null;

if (savedState) {
    savedState.history = applicationConfig.history;
}

const store = createStore(combinedReducers, savedState || defaultState);

store.subscribe(() => {
    storeManager.set('countriesState', JSON.stringify(store.getState()));
});

const networkHelper = new NetworkHelper(applicationConfig.baseUrl);
const actionLogger = new ActionLogger(store, networkHelper);
const runner = new Runner(store, actionLogger, networkHelper);
const countryProvider = new CountryProvider();

ReactDOM.render(
    <Provider store={store}>
        <Game
            userUid={applicationConfig.userUid}
            runner={runner}
            actionLogger={actionLogger}
            countryProvider={countryProvider}
        />
    </Provider>,
    document.getElementById('gameContainer')
);
