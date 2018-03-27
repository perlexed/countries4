import axios from "axios/index";

class ActionLogger {

    static GAME_START = 'game_start';
    static GAME_STOP = 'game_stop';
    static COUNTRY_SUCCESS_SUBMIT = 'country_success_submit';
    static COUNTRY_FAIL_SUBMIT = 'country_fail_submit';

    constructor(gameUid) {
        this.gameUid = gameUid;
    }

    logAction(actionType, countryName = null) {
        axios.post('/game/api-log-action/', {
            _csrf: window.yii.getCsrfToken(),
            gameUid: this.gameUid,
            actionType: actionType,
            // country: this.state.countriesInput,
        }, {
            responseType: 'json',
        })
        .then(response => {
            console.log('fddfg', response);
            // const responseData = response && response.data ? response.data : null;
        })
        .catch(error => {
            console.log(error);
        });

    }
}