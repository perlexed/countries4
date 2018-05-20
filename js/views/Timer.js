
import React from 'react';
import PropTypes from 'prop-types';

import Runner from "../components/Runner";
import TimeHelper from "../helpers/TimeHelper";

export default class Timer extends React.Component {

    static propTypes = {
        runnerStatus: PropTypes.string,
        runner: PropTypes.instanceOf(Runner),
        elapsedTime: PropTypes.number,
    };

    render() {
        if (this.props.runnerStatus === Runner.STATUS_IDLE) {
            return null;
        }

        if (this.props.runnerStatus === Runner.STATUS_FINISHED) {
            return (
                <div className='timer-block'>
                    <h4>Время вышло</h4>
                </div>
            );
        }

        const getEnumerableEnding = number => {
            const digit = number.toString()[number.toString().length - 1];

            if (digit === '1') {
                return 'а';
            }

            if (['0', '5', '6', '7', '8', '9'].indexOf(digit) !== -1) {
                return '';
            }

            return 'ы';
        };

        const timeObject = TimeHelper.getFormattedTime(this.props.runner.getTimeLimit() - this.props.elapsedTime);
        const minutesString = timeObject.minutes
            ? ' ' + timeObject.minutes + ' минут' + getEnumerableEnding(timeObject.minutes)
            : '';
        const secondsString = timeObject.seconds + ' секунд' + getEnumerableEnding(timeObject.seconds);

        return (
            <div className='timer'>
                <div className='timer__label'>Осталось времени:</div>
                <div className='timer__numbers'>{minutesString} {secondsString}</div>
            </div>
        );
    }
}