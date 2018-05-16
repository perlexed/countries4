
import React from 'react';
import PropTypes from 'prop-types';

import CountryProvider from '../components/CountryProvider';

export default class MatchedCountries extends React.PureComponent {

    static propTypes = {
        countriesList: PropTypes.array,
    };

    render() {
        if (!this.props.countriesList.length) {
            return null;
        }

        return (
            <div className='matched-countries'>
                <h4>Указанные страны</h4>

                <div className='matched-countries__container'>
                    {this.props.countriesList.map((countryCode, index) => (
                        <div key={index}>{CountryProvider.getNameByCode(countryCode)}</div>
                    ))}
                </div>
            </div>
        );
    }
}