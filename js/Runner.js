
const STATUS_IDLE = 'idle';
const STATUS_RUNNING = 'running';
const STATUS_FINISHED = 'finished';

class Runner {

    static STATUS_IDLE = STATUS_IDLE;
    static STATUS_RUNNING = STATUS_RUNNING;
    static STATUS_FINISHED = STATUS_FINISHED;

    static tickInterval = 1;
    static timeLimit = 30;

    constructor(store) {

        this.store = store;
        this.runnerInterval = null;
        this.elapsedTime = null;
        this._setStatus(Runner.STATUS_IDLE);

        this.onTick = this.onTick.bind(this);
    }

    start() {
        if (this.status !== Runner.STATUS_IDLE) {
            return;
        }

        this.runnerInterval = setInterval(this.onTick, Runner.tickInterval * 1000);

        this._setStatus(Runner.STATUS_RUNNING);
    }

    stop() {
        if (this.status !== Runner.STATUS_RUNNING) {
            return;
        }

        clearInterval(this.runnerInterval);
        this.runnerInterval = null;

        this._setStatus(Runner.STATUS_FINISHED);
    }

    onTick() {
        console.log('tick');
        this.elapsedTime += Runner.tickInterval;

        this.store.dispatch({
            type: 'SET_ELAPSED_TIME',
            time: this.elapsedTime,
        });

        if (this.elapsedTime === Runner.timeLimit) {
            console.log('stopping on time limit');
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