
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import browserStorage from 'store';
import compareVersions from 'compare-versions';

import combinedReducers from './reducers/index';
import Game from './Game';
import Runner from './components/Runner';
import ActionLogger from './components/ActionLogger';
import NetworkHelper from "./components/NetworkHelper";
import GameMode from '../enums/GameMode';

const applicationConfig = JSON.parse(window.APPLICATION_CONFIG);
delete window.APPLICATION_CONFIG;

const defaultState = {
    matchedCountries: [],
    runner: {
        status: Runner.STATUS_IDLE,
        elapsedTime: 0,
        gameUid: null,
    },
    history: [],
    gameMode: GameMode.MIN2,
    version: [],
    statistics: [],
    infoPanelSwitch: 'stats',
};

let savedState = browserStorage.get('countriesState') && browserStorage.get('countriesState').length
    ? JSON.parse(browserStorage.get('countriesState'))
    : null;

if (savedState) {
    savedState.history = applicationConfig.history;
}

// Reset state if there is a new version of the application
if (savedState && (
    !savedState.version
    || compareVersions(applicationConfig.version, savedState.version) === 1
)) {
    savedState = null;
}

const sourceStore = Object.assign(savedState || defaultState, {
    history: applicationConfig.history,
    version: applicationConfig.version,
    statistics: applicationConfig.statistics,
});

const store = createStore(combinedReducers, sourceStore);

store.subscribe(() => {
    browserStorage.set('countriesState', JSON.stringify(store.getState()));
});

const networkHelper = new NetworkHelper(applicationConfig.baseUrl);
const actionLogger = new ActionLogger(store, networkHelper);
const runner = new Runner(store, actionLogger, networkHelper);

ReactDOM.render(
    <Provider store={store}>
        <Game
            userUid={applicationConfig.userUid}
            runner={runner}
            actionLogger={actionLogger}
        />
    </Provider>,
    document.getElementById('gameContainer')
);
