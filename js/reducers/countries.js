

export default (state = {}, action) => {
    switch (action.type) {
        case 'ADD_COUNTRY':
            return state.indexOf(action.countryCode) === -1
                ? [...state].concat(action.countryCode)
                : state;
        case 'RESET_COUNTRIES':
            return [];
        default:
            return state;
    }
};