
import React from 'react';
import PropTypes from 'prop-types';

import CountryProvider from '../components/CountryProvider';

export default class RestCountries extends React.PureComponent {

    static propTypes = {
        countriesList: PropTypes.array,
        countryProvider: PropTypes.instanceOf(CountryProvider),
    };

    render() {
        const restCountries = this.props.countryProvider.getRestCountries(this.props.countriesList);

        if (!restCountries.length) {
            return null;
        }

        return (
            <div className='rest-countries'>
                <h4>Оставшиеся страны:</h4>
                <div className='rest-countries__container'>
                    {restCountries.map((countryName, id) => (
                        <div key={id}>{countryName}</div>
                    ))}
                </div>
            </div>
        )
    }
}