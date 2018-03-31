import axios from "axios/index";

export default class ActionLogger {

    constructor(store) {
        this.store = store;
    }

    logAction(actionType, countryName = null) {
        return axios.post(window.BASEURL + '/game/api-log-action/', {
            _csrf: window.yii.getCsrfToken(),
            gameUid: this.store.getState().runner.gameUid,
            actionType: actionType,
            countryName: countryName,
        }, {
            responseType: 'json',
        });
    }
}