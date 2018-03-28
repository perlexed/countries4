import axios from "axios/index";

export default class ActionLogger {

    static GAME_START = 'game_start';
    static GAME_STOP = 'game_stop';
    static COUNTRY_SUCCESS_SUBMIT = 'country_success_submit';
    static COUNTRY_FAIL_SUBMIT = 'country_fail_submit';

    constructor(store) {
        this.store = store;
    }

    logAction(actionType, countryName = null) {
        axios.post('/game/api-log-action/', {
            _csrf: window.yii.getCsrfToken(),
            gameUid: this.store.getState().runner.gameUid,
            actionType: actionType,
            countryName: countryName,
        }, {
            responseType: 'json',
        });
    }
}