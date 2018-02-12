

export default (state = {}, action) => {
    switch (action.type) {
        case 'ADD_COUNTRY':
            return [...state].indexOf(action.country) === -1
                ? [...state].concat(action.country)
                : [...state];
        default:
            return state;
    }
};