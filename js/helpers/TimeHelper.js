
export default class TimeHelper {

    static getFormattedTime(seconds) {
        return {
            minutes: Math.floor(seconds / 60),
            seconds: seconds % 60,
        };
    }

}