
import NetworkHelper from './NetworkHelper';

export default class ActionLogger {

    /**
     * @param store
     * @param {NetworkHelper} networkHelper
     */
    constructor(store, networkHelper) {
        this.store = store;
        this.networkHelper = networkHelper;
    }

    logAction(actionType, countryName = null) {
        return this.networkHelper.send('/game/api-log-action/', {
            gameUid: this.store.getState().runner.gameUid,
            actionType: actionType,
            countryName: countryName,
        });
    }
}