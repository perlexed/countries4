
import React from 'react';
import PropTypes from 'prop-types';

import Statistics from './Statistics';
import History from './History';

export default class InfoBlock extends React.Component {

    static propTypes = {
        infoPanelSwitch: PropTypes.oneOf(['stats', 'history']),
        statistics: PropTypes.object,
        toggleInfoPanel: PropTypes.func,
        history: PropTypes.object,
    };

    render() {
        const isHistoryPresent = this.props.history && Object.keys(this.props.history).length > 0;
        const showStatistics = this.props.infoPanelSwitch === 'stats';

        return (
            <div className='col-md-5 stats-block'>
                <div className='nav nav-tabs'>
                    <li
                        role='presentation'
                        className={showStatistics ? 'active' : ''}
                    >
                        <a
                            href='#'
                            onClick={e => {
                                e.preventDefault();
                                this.props.toggleInfoPanel('stats');
                            }}
                        >Статистика</a>
                    </li>
                    {isHistoryPresent && (
                        <li
                            role='presentation'
                            className={!showStatistics ? 'active' : ''}
                        >
                            <a
                                href='#'
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.toggleInfoPanel('history');
                                }}
                            >История игр</a>
                        </li>
                    )}
                </div>
                {showStatistics ? (
                    <Statistics
                        statistics={this.props.statistics}
                    />
                ) : (
                    <History history={this.props.history}/>
                )}
            </div>
        );
    }

}