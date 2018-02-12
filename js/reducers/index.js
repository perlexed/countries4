import { combineReducers } from 'redux';

import countries from './countries';
import runner from './runner';

const combinedReducers = combineReducers({
    matchedCountries: countries,
    runner: runner,
});

export default combinedReducers;