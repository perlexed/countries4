
import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { Provider } from 'react-redux';
import { createStore} from 'redux';
import combinedReducers from './reducers/index';

const store = createStore(combinedReducers, {
    matchedCountries: [],
});

ReactDOM.render(<Provider store={store}>
    <Game
        store={store}
    />
</Provider>, document.getElementById('gameContainer'));
