
import ActionType from '../enums/ActionType';
import axios from "axios/index";

const STATUS_IDLE = 'idle';
const STATUS_RUNNING = 'running';
const STATUS_FINISHED = 'finished';

class Runner {

    static STATUS_IDLE = STATUS_IDLE;
    static STATUS_RUNNING = STATUS_RUNNING;
    static STATUS_FINISHED = STATUS_FINISHED;

    static tickInterval = 1;
    static timeLimit = 120;

    constructor(store, actionLogger) {
        const runnerState = store.getState().runner;

        this.store = store;
        this.actionLogger = actionLogger;
        this.runnerInterval = null;

        this.elapsedTime = runnerState.elapsedTime;
        this.status = runnerState.status;

        this.onTick = this.onTick.bind(this);

        if (this.status === Runner.STATUS_RUNNING) {
            this.status = Runner.STATUS_RUNNING;
            this.runnerInterval = setInterval(this.onTick, Runner.tickInterval * 1000);
        }
    }

    start() {
        if (this.isRunning()) {
            return;
        }

        this.runnerInterval = setInterval(this.onTick, Runner.tickInterval * 1000);

        this.store.dispatch({
            type: 'SET_ELAPSED_TIME',
            time: this.elapsedTime,
        });

        this.store.dispatch({
            type: 'SET_GAME_UID',
            gameUid: Runner._getUuid(),
        });

        this.actionLogger.logAction(ActionType.GAME_START);

        this._setStatus(Runner.STATUS_RUNNING);
    }

    stop() {
        if (!this.isRunning()) {
            return;
        }

        clearInterval(this.runnerInterval);
        this.runnerInterval = null;

        // Update games history on game stop
        this.actionLogger.logAction(ActionType.GAME_STOP)
            .then(() => {
                axios.post('/game/api-update-history/', {
                    _csrf: window.yii.getCsrfToken(),
                }, {
                    responseType: 'json',
                }).then(historyResponse => {
                    if (!historyResponse || !("data" in historyResponse)) {
                        return;
                    }

                    this.store.dispatch({
                        type: 'UPDATE_HISTORY',
                        history: historyResponse.data,
                    });
                });
            });

        this._setStatus(Runner.STATUS_FINISHED);
    }

    reset() {
        this.elapsedTime = 0;

        clearInterval(this.runnerInterval);
        this.runnerInterval = null;

        this._setStatus(Runner.STATUS_IDLE);
    }

    onTick() {
        this.elapsedTime += Runner.tickInterval;

        this.store.dispatch({
            type: '`',
            time: this.elapsedTime,
        });

        if (this.elapsedTime === Runner.timeLimit) {
            this.stop();
        }
    }

    isRunning() {
        return this.status === Runner.STATUS_RUNNING;
    }

    _setStatus(status) {
        this.status = status;
        this.store.dispatch({
            type: 'SET_STATUS',
            status,
        });

        if (status === Runner.STATUS_IDLE) {
            this.store.dispatch({
                type: 'SET_GAME_UID',
                gameUid: null,
            });
        }
    }

    static _getUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
    }
}

export default Runner;