
import React from 'react';
import PropTypes from 'prop-types';

import GameMode from '../enums/GameMode';
import CountryProvider from './components/CountryProvider';

export default class Statistics extends React.Component {

    static propTypes = {
        statistics: PropTypes.shape({
            avgCountriesCount: PropTypes.shape({
                min2: PropTypes.number,
                min10: PropTypes.number,
            }),
            popularCountries: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                percentage: PropTypes.number,
            })),
        }),
        countryProvider: PropTypes.instanceOf(CountryProvider),
    };

    render() {
        return (
            <div>
                <div>
                    <h5>В среднем указывают стран за игру</h5>
                    <ul className='list-group'>
                        <li className='list-group-item'>
                            <span className='badge'>{this.props.statistics.avgCountriesCount[GameMode.MIN2]}</span>
                            2 минуты
                        </li>
                        <li className='list-group-item'>
                            <span className='badge'>{this.props.statistics.avgCountriesCount[GameMode.MIN10]}</span>
                            10 минут
                        </li>
                    </ul>
                </div>

                <h5>Самые популярные страны</h5>
                <ul className='list-group'>
                    {this.props.statistics.popularCountries.map((countryData, index) => (
                        <li key={index} className='list-group-item'>
                            <span className='badge'>{countryData.percentage}%</span>
                            {this.props.countryProvider.getPreparedByCode(countryData.code).shortName}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}