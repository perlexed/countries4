
const STATUS_IDLE = 'idle';
const STATUS_RUNNING = 'running';
const STATUS_FINISHED = 'finished';

class Runner {

    static STATUS_IDLE = STATUS_IDLE;
    static STATUS_RUNNING = STATUS_RUNNING;
    static STATUS_FINISHED = STATUS_FINISHED;

    static tickInterval = 1;
    static timeLimit = 120;

    constructor(store, status, elapsedTime) {

        this.store = store;
        this.runnerInterval = null;

        this.elapsedTime = elapsedTime;
        this.status = status;

        this.onTick = this.onTick.bind(this);

        if (status === Runner.STATUS_RUNNING) {
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

        this._setStatus(Runner.STATUS_RUNNING);
    }

    stop() {
        if (!this.isRunning()) {
            return;
        }

        clearInterval(this.runnerInterval);
        this.runnerInterval = null;

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
            type: 'SET_ELAPSED_TIME',
            time: this.elapsedTime,
        });

        if (this.elapsedTime === Runner.timeLimit) {
            this.stop();
        }
    }

    isRunning() {
        return this.status === Runner.STATUS_RUNNING;
    }

    isFinished() {
        return this.status === Runner.STATUS_FINISHED;
    }

    isIdle() {
        return this.status === Runner.STATUS_IDLE;
    }

    _setStatus(status) {
        this.status = status;
        this.store.dispatch({
            type: 'SET_STATUS',
            status,
        });
    }
}

export default Runner;