
import React from 'react';
import PropTypes from 'prop-types';

import TimeHelper from './helpers/TimeHelper';

export default class History extends React.Component {

    static propTypes = {
        history: PropTypes.object,
    };

    render() {
        const historyData = Object.keys(this.props.history).map(gameUid => {
            const gameData = this.props.history[gameUid];

            return {
                date: gameData.startDate,
                countriesMatched: gameData.countriesMatched,
                timeElapsed: TimeHelper.getHHMMTime(TimeHelper.getFormattedTime(gameData.gameLength)),
            };
        });

        return (
            <div>
                <h4>My games history</h4>

                <table className='table'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Countries matched</th>
                            <th>Time elapsed</th>
                        </tr>
                    </thead>

                    <tbody>
                        {historyData.map((historySample, index) => (
                            <tr key={index}>
                                <td>{historySample.date}</td>
                                <td>{historySample.countriesMatched}</td>
                                <td>{historySample.timeElapsed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}