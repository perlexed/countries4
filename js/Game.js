
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Runner from './Runner';
import CountryProvider from './CountryProvider';

class Game extends React.Component {

    constructor() {
        super(...arguments);

        this.state = {
            countriesInput: '',
            inputBlink: null,
        };

        this.countryProvider = new CountryProvider();

        this.runner = new Runner(this.props.store);

        this.onCountrySubmit = this.onCountrySubmit.bind(this);
    }

    onCountrySubmit(event) {
        event.preventDefault();

        if (this.props.runnerStatus === Runner.STATUS_FINISHED) {
            console.log('game is finished');
            return;
        }

        if (this.props.runnerStatus === Runner.STATUS_IDLE) {
            this.runner.start();
        }

        const matchedCountryCode = this.countryProvider.check(this.state.countriesInput);

        this.inputFieldBlink(!!matchedCountryCode);

        if (matchedCountryCode) {
            this.props.onCountryMatch(this.countryProvider.getByCode(matchedCountryCode).name);

            this.setState({
                countriesInput: '',
            });
        }

        // axios.post('/game/api-send-country/', {
        //     _csrf: window.yii.getCsrfToken(),
        //     country: this.state.countriesInput,
        // }, {
        //     responseType: 'json',
        // })
        // .then(response => {
        //     const responseData = response && response.data ? response.data : null;
        // })
        // .catch(error => {
        //     console.log(error);
        // });
    }

    render() {
        const blinkClass = this.state.inputBlink === null ? '' : ' ' + (
            this.state.inputBlink === 'success' ? 'blink-success' : 'blink-error'
        );

        return (
            <div>
                <button className='btn btn-default' onClick={() => {
                    this.runner.start();
                }}>Start runner</button>
                <button className='btn btn-default' onClick={() => {
                    this.runner.stop();
                }}>Stop runner</button>

                <form
                    className='country-form'
                    onSubmit={this.onCountrySubmit}
                >
                    <label>Введите страну</label>
                    <input
                        className={'form-control' + blinkClass}
                        type='text'
                        value={this.state.countriesInput}
                        disabled={this.props.runnerStatus === Runner.STATUS_FINISHED}
                        onChange={event => {
                            this.setState({
                                countriesInput: event.target.value,
                            });
                        }}
                    />
                </form>

                {this.props.runnerStatus === Runner.STATUS_RUNNING && (
                    <div>
                        Осталось времени: {Runner.timeLimit - this.props.elapsedTime}
                    </div>
                )}

                {this.renderMatchedCountries()}
            </div>
        );
    }

    renderMatchedCountries() {
        return (
            <div className='matched-countries-list'>
                {this.props.matchedCountries.map((country, index) => (
                    <div key={index}>{country}</div>
                ))}
            </div>
        );
    }

    inputFieldBlink(isSuccess) {
        this.setState({
            inputBlink: isSuccess ? 'success' : 'error',
        });

        setTimeout(() => {
            this.setState({
                inputBlink: null,
            });
        }, 1000);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        matchedCountries: state.matchedCountries,
        elapsedTime: state.runner.elapsedTime,
        runnerStatus: state.runner.status,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onCountryMatch: countryName => {
            dispatch({
                type: 'ADD_COUNTRY',
                country: countryName,
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);