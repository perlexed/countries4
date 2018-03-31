
export default class TimeHelper {

    /**
     * @param {int} seconds
     * @returns {{minutes: number, seconds: number}}
     */
    static getFormattedTime(seconds) {
        return {
            minutes: Math.floor(seconds / 60),
            seconds: seconds % 60,
        };
    }

    /**
     * @param {{minutes: number, seconds: number}} timeObject
     * @returns {string}
     */
    static getHHMMTime(timeObject) {
        return (timeObject.minutes < 10 ? '0' + timeObject.minutes : timeObject.minutes)
            + ':'
            + (timeObject.seconds < 10 ? '0' + timeObject.seconds : timeObject.seconds);
    }

}